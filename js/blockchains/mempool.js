class Mempool extends createjs.Container {

	constructor(params) {

		super();
		var defaults = {
			width: 140,
			height: 50,
			cols: 6,
			rows: 2,
			padding: 10,
			radius: 10,
			transSize: 10,
			transPadding: 2,
		};

		this.params = extend(defaults,params);
		this.transactions = [];
		this.ccTransactions = [];
		this.positions = [];
		this.ccc =  [];
		this.saturated = false;

		this.params.capacity = this.params.cols * this.params.rows;
		this.params.nbTrans = this.params.blockchain.params.maxTps * this.params.blockchain.params.blockTime * 60 / 10;

		this.cont_debug = new createjs.Container();
		this.cont_momom = new createjs.Container();
		this.cont_block = new createjs.Container();
		this.cont_transaction = new createjs.Container();
		this.addChild(this.cont_momom, this.cont_block, this.cont_debug, this.cont_transaction);

		this.init(params);
	}

	init(params) {

		this.computePosition();

		this.drawMempool();

		createjs.Ticker.addEventListener('tick', proxy(this.tick, this));


	}

	start() {

		//let tw = createjs.Tween.get(this, {loop: true, timeScale: TimeScale}).to({z: 0}, 500).call(this.everyHalfSeconds);
		//Tweens.add(tw, false);

	}

	tick() {

		if(Paused === 1) return;

		this.animateTransactions();
		this.animateCapacity();

	}

	animateTransactions() {

		for(let i=0,ln=this.transactions.length; i<ln; i++) {
			let trans = this.transactions[i];
			if(trans) trans.move();
		}
		for(let i=0,ln=this.ccTransactions.length; i<ln; i++) {
			let trans = this.ccTransactions[i];
			if(trans) trans.move();
		}
	}

	animateCapacity() {

		let total = this.transactions.length;
		let max = this.params.cols * this.params.rows;
		let coef = total/max;
		if(coef > 1) coef = 1;

		// gauge
		if(coef > 0.9) this.gaugeColor.style = "red";
		else this.gaugeColor.style = "#AAA";
		let tw = createjs.Tween.get(this.gauge, {override: true, timeScale: TimeScale}).to({scaleX: coef}, 500);
		Tweens.add(tw);


		//if mempool satured
		if(this.saturated == false && this.transactions.length > (this.params.cols * this.params.rows)) {
			this.saturated = true;
			let t = createjs.Tween.get(this.warning, { timeScale: TimeScale}).to({alpha: 0.2}, 500).to({alpha: 0}, 500).set({saturated: false}, this);
			Tweens.add(t);
		}
	}

	updateTps() {

		let tps = this.transactions.length * this.params.nbTrans / (this.params.blockchain.params.blockTime*60);
		let d = tps*0.10;
		//if(tps > 5) tps += d/2 - Math.random()*d;
		if(tps > this.params.blockchain.params.maxTps) tps = this.params.blockchain.params.maxTps;
		tps = Math.ceil(tps);
		this.tps_text.text = tps + ' tx/s';
		this.params.blockchain.tps = tps;

		this.animateCapacity()

	}


	mined(block) {

	}

	drawMempool() {

		// box
		let pad = this.params.padding;
		let rad = this.params.radius;
		let rect = new createjs.Shape();
		rect.graphics.setStrokeStyle(1).beginStroke('grey').beginFill('#FFF').drawRoundRect(-pad, 0, this.params.width + 2*pad, this.params.height, rad,rad,rad,rad);
		this.cont_block.addChild(rect);

		// gauge
		let gauge = new createjs.Shape();
		this.gaugeColor = gauge.graphics.beginFill('#AAA').command;
		gauge.graphics.drawRect(0, 0, this.params.width + 3*pad, this.params.height);
		gauge.x = -pad;
		gauge.scaleX = 0;
		gauge.alpha = 0.1;
		gauge.mask = rect;
		this.gauge = gauge;
		this.cont_block.addChild(gauge);

		// warning
		let warn = new createjs.Shape();
		warn.graphics.setStrokeStyle(1).beginStroke('grey').beginFill('red').drawRoundRect(-pad, 0, this.params.width + 2*pad, this.params.height, rad,rad,rad,rad);
		warn.alpha = 0;
		this.cont_block.addChild(warn);
		this.warning = warn;

		let asset = queue.getResult('icon_kmd_ac');
		if(this.params.blockchain.params.id == 'btc') asset = queue.getResult('icon_btc');
		if(this.params.blockchain.params.id == 'kmd') asset = queue.getResult('icon_kmd');
		if(this.params.blockchain.params.type == 'SC') asset = queue.getResult('icon_kmd_ac');
		if(this.params.blockchain.params.type == 'AC') asset = queue.getResult('icon_kmd_ac');
		if(this.params.blockchain.params.logo !== null) asset = queue.getResult(this.params.blockchain.params.logo);

		/*
			logo = queue.getResult('cog');
			if(this.params.blockchain.params.ccc == 'dice') logo = queue.getResult('icon_dice');
			if(this.params.blockchain.params.ccc == 'asset') logo = queue.getResult('icon_asset');
			if(this.params.blockchain.params.ccc == 'faucet') logo = queue.getResult('icon_faucet');
			if(this.params.blockchain.params.ccc == 'oracle') logo = queue.getResult('icon_oracle');
			if(this.params.blockchain.params.ccc == 'reward') logo = queue.getResult('icon_reward');
		*/

		//logo
		let bg = new createjs.Shape();
		let logo = new createjs.Bitmap(asset);
		logo.regX = logo.image.width/2;
		logo.regY = logo.image.height/2;
		logo.x = this.params.width + logo.image.width /2 + 6;
		logo.y = this.params.height/2;
		bg.graphics.setStrokeStyle(1).beginStroke('grey').beginFill('#FFF').drawCircle(0, 0, 20);
		bg.x = logo.x;
		bg.y = logo.y;
		this.cont_block.addChild(bg);
		this.cont_block.addChild(logo);

		// ccc icons
		if(this.params.blockchain.params.ccc.length > 0) {
			let cccs = this.params.blockchain.params.ccc;
			for(let i=0; i< cccs.length; i++) {
				let ccc = cccs[i];
				let cc = new CContract({icon: ccc});
				if(ccc == 'dice') {
					cc = new Dice();
				}
				cc.name = ccc;
				let w = cc.icon.image.width/2;
				let h = cc.icon.image.height/2;
				cc.x = logo.x + w*2 + 5 + (w*2+5)*i;
				cc.y = logo.y
				let bkg = new createjs.Shape();
				bkg.graphics.setStrokeStyle(1).beginStroke('grey').beginFill('#FFF').drawCircle(0, 0, 20);
				bkg.x = cc.x;
				bkg.y = cc.y;
				this.cont_block.addChild(bkg);
				this.cont_block.addChild(cc);
				this.ccc.push(cc);
			}
		}
		// TPS
		let tps = new createjs.Text('0 tx/s', '12px Arial', "#666");
		tps.x = logo.x + 30;
		if(this.ccc.length > 0) tps.x = this.ccc[this.ccc.length-1].x + 30;
		tps.y = this.params.height/2 - tps.getMeasuredHeight()/2;
		tps.alpha = 0.5;
		this.tps_text = tps;
		this.cont_block.addChild(tps);


		this.regX = this.params.width/2;
		this.regY = this.params.height/2;

		this.cont_block.x += pad;
		this.cont_transaction.x += pad;
		this.cont_debug.x += pad;

	}

	appendTransaction(trans) {

		this.cont_transaction.addChild(trans);
	}

	addContractTransaction(trans) {

		this.ccTransactions.push(trans);
	}

	removeContractTransaction(trans) {

		this.ccTransactions.splice(this.ccTransactions.indexOf(trans), 1);
	}

	arrivalAtMempool(trans) {

		trans.validate();

		this.updateTps();
	}

	arrivalAtContract(trans) {

		trans.params.ccc.handleTransaction(trans, this);

    let tw = createjs.Tween.get(trans.params.ccc, {override: true, timeScale: TimeScale}).to({ rotation: 360}, 500).set({rotation: 0});
    Tweens.add(tw);
	}

	addTransaction(trans) {

		let position;
		if(this.transactions.length === 0) {
			position = this.getPosition(0);
			this.transactions.push(trans);
		}
		else {
			for(let i=0; i < this.transactions.length; i++) {
				if(trans.params.priority > 0 && trans.params.priority > this.transactions[i].params.priority) {
					position = this.getPosition(i);
					this.transactions.splice(i, 0, trans);
					return position;
				}
			}
			position = this.getPosition(this.transactions.length);
			this.transactions.push(trans);
		}
		return position;

	}

	removeTransactions(transactions) {

		for(let i=0,ln=transactions.length; i<ln; i++) {

			let trans = transactions[i];
			this.cont_transaction.removeChild(trans);
			this.transactions.splice(this.transactions.indexOf(trans),1);
		}
	}

	reorderTransactions() {

		let transactions = this.transactions;
		for(let i=0,ln=transactions.length; i<ln; i++) {
			let trans = transactions[i];
			let newpos = this.getPosition(i);
			if(newpos.hidden === true) trans.hide();
			else trans.show();
			trans.setTarget(newpos.x, newpos.y);
		}
	}


	computePosition() {

		let cols = this.params.cols;
		let lines = this.params.rows;
		let spanX = this.params.width / (cols+1);
		let spanY = this.params.height / (lines+1);
		let x = 0;
		let y = 0;
		let line = 1, col = 1;
		let total = cols*lines;
		let i = 0;

		for(let c=1; c<=cols; ++c) {
			for(let l=1; l<=lines; ++l) {
				x = spanX * c;
				y = spanY * l;

				let pos = new createjs.Shape();
				pos.graphics.setStrokeStyle(1).beginStroke('#DDD').drawCircle(0,0,3);
				pos.x = x;
				pos.y = y;
				pos.position = i;
				this.cont_debug.addChild(pos);

				this.positions.push(pos);

				i++;
			}
		}

	}

	drawMoMoMTo(mempool) {

			let width = 40
			let height = 50;

			//upstream
			let upstream = this.getArrowBand(width, height, this.params.blockchain.params.color);
			upstream.x = 36;
			upstream.y = 25;
			this.momom_up = upstream;
			this.cont_momom.addChild(upstream);

			//downstream
			let downstream = this.getArrowBand(width, height, mempool.params.blockchain.params.color);
			downstream.x = -15 + this.params.width;
			downstream.y = -25 - height;
			downstream.rotation = 180;
			this.momom_down = downstream;
			this.cont_momom.addChild(downstream);

	}

	getArrowBand(width, height, color) {

		let stream = new createjs.Container();
		stream.regX = width/2;
		stream.regY = height/2;
		let bkg = new createjs.Shape();
		bkg.graphics.beginFill(color).drawRect(0,0, width, height);
		bkg.x = 0;
		bkg.y = - height;
		bkg.alpha = 0.4;
		stream.addChild(bkg);
		let band = new createjs.Bitmap(queue.getResult('arrowband'));
		band.x = -40;
		band.y = -height;
		band.scaleX = 3;
		band.scaleY = 1;
		band.alpha = 1;
		stream.band = band;
		let mask = new createjs.Shape();
		mask.graphics.beginFill("red").drawRect(0, 0, width, height);
		mask.x = 0;
		mask.y = - height;
		mask.alpha = 0;
		band.mask = mask;
		stream.addChild(band);


		return stream;
	}

	getRandomContract() {

		return this.ccc[Math.floor(Math.random()*this.ccc.length)];
	}

	getValidTransactions(n) {

		let res = [];
		for(let i=0; i< this.transactions.length; i++) {
			let trans = this.transactions[i];
			if(trans.params.valid === true) {
				res.push(trans);
			}
			if(res.length == n) break;
		}
		return res;
	}

	getRandomContract() {

		return this.ccc[Math.floor(Math.random()*this.ccc.length)];
	}

	getValidTransactions(n) {

		let res = [];
		for(let i=0; i< this.transactions.length; i++) {
			let trans = this.transactions[i];
			if(trans.params.valid === true) {
				res.push(trans);
			}
			if(res.length == n) break;
		}
		return res;
	}

	getTopPosition() {

		return this.positions[0];
	}

	getHiddenPosition() {

		return { x: this.params.width, y: this.params.height/2, hidden: true};
	}

	getPosition(n) {
		let pos = this.positions[n];
		if(pos == undefined) {
			return this.getHiddenPosition();
		}
		return pos;
	}

}