import {extend, proxy} from '../utils';
import {CContract, DiceCC, RogueCC} from './contract.js';
import createjs from 'createjs';

export class Mempool extends createjs.Container {

	constructor(params) {

		super();
		var defaults = {
			width: 140,
			height: 50,
			cols: 6,
			rows: 2,
			padding: 10,
			radius: 0,
			backgroundColor: '#565a66',
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

		this.tickMoMoM = window.Stage.on('tick', this.updateMoMoM, this);

	}

	stop() {

		window.Stage.off('tick', this.tickMoMoM);

	}

	tick() {

		if(window.Paused === 1) return;

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
		//if(coef > 0.9) this.gaugeColor.style = "#ad1e1e"; //red
		//else this.gaugeColor.style = "#474b54";
		let tw = createjs.Tween.get(this.gauge, {override: true, timeScale: window.TimeScale}).to({scaleX: coef}, 500);
		window.Tweens.add(tw);


		//if mempool satured
		if(this.saturated == false && this.transactions.length > (this.params.cols * this.params.rows)) {
			this.saturated = true;
			let t = createjs.Tween.get(this.warning, { timeScale: window.TimeScale}).to({alpha: 0.2}, 500).to({alpha: 0}, 500).set({saturated: false}, this);
			window.Tweens.add(t);
		}

	}

	updateTps() {

		let tps = this.transactions.length * this.params.nbTrans / (this.params.blockchain.params.blockTime*60);
		if(tps > this.params.blockchain.params.maxTps) tps = this.params.blockchain.params.maxTps;
		tps = Math.floor(tps);
		this.tps_text.text = tps + ' tx/s';
		this.params.blockchain.tps = tps;

		this.animateCapacity()

	}


	mined(block) {

	}

	drawMempool() {

		let asset = window.Queue.getResult('icon_kmd_ac');
		if(this.params.blockchain.params.id == 'btc') asset = window.Queue.getResult('icon_btc');
		if(this.params.blockchain.params.id == 'kmd') asset = window.Queue.getResult('icon_kmd');
		if(this.params.blockchain.params.type == 'SC') asset = window.Queue.getResult('icon_kmd_ac');
		if(this.params.blockchain.params.type == 'AC') asset = window.Queue.getResult('icon_kmd_ac');
		if(this.params.blockchain.params.logo !== null) asset = window.Queue.getResult(this.params.blockchain.params.logo);

		//logo
		let logo = new createjs.Bitmap(asset);
		logo.regX = logo.image.width/2;
		logo.regY = logo.image.height/2;
		logo.x = this.params.width + logo.image.width /2;
		logo.y = this.params.height/2 - 2;
		this.cont_block.addChild(logo);

		this.params.width += logo.image.width;

		// ccc icons
		let cccs = this.params.blockchain.params.ccc;
		if(cccs.length > 0) {
			for(let i=0; i< cccs.length; i++) {
				let ccc = cccs[i];
				let cc;
				if(typeof ccc == 'string') {

					cc = new CContract({icon: ccc, name: ccc, mempool: this});
					if(ccc == 'dice') cc = new DiceCC({mempool: this});
					if(ccc == 'rogue') cc = new RogueCC({mempool: this});
					cc.name = ccc;
				}
				if(typeof ccc == 'object' && ccc instanceof CContract) {
					cc = ccc;
				}
				let w = cc.icon.image.width/2;
				let h = cc.icon.image.height/2;
				cc.x = logo.x + w*2 + 5 + (w*2+5)*i;
				cc.y = logo.y
				this.cont_block.addChild(cc);
				this.ccc.push(cc);
			}
		}

		this.params.width += cccs.length * (logo.image.width+5);


		// box
		let pad = this.params.padding;
		let rad = this.params.radius;
		let rect = new createjs.Shape();
		rect.graphics.setStrokeStyle(1).beginStroke('#FFF').beginFill(this.params.backgroundColor).drawRoundRect(-pad, 0, this.params.width + 3*pad, this.params.height, rad,rad,rad,rad);
		this.cont_block.addChildAt(rect,0);

		// gauge
		let gauge = new createjs.Shape();
		this.gaugeColor = gauge.graphics.beginFill('#474b54').command;
		gauge.graphics.drawRect(10, 1, this.params.width + 3*pad-2, this.params.height-2);
		gauge.x = -pad;
		gauge.scaleX = 0;
		gauge.mask = rect;
		this.gauge = gauge;
		this.cont_block.addChildAt(gauge,1);

		// ruband
		let ruband = new createjs.Shape();
		ruband.graphics.beginFill(this.params.blockchain.params.color).drawRect(0,0,10,this.params.height);
		ruband.x = -10;
		this.cont_block.addChildAt(ruband,2);

		// warning
		let warn = new createjs.Shape();
		warn.graphics.setStrokeStyle(1).beginStroke('grey').beginFill('red').drawRoundRect(-pad, 0, this.params.width + 3*pad, this.params.height, rad,rad,rad,rad);
		warn.alpha = 0;
		this.cont_block.addChildAt(warn,3);
		this.warning = warn;

		// TPS
		let tps = new createjs.Text('0 tx/s', 'bold 14px Montserrat', "#FFF");
		tps.x = rect.x + this.params.width + 3*pad;
		tps.y = this.params.height/2 - tps.getMeasuredHeight()/2;
		tps.alpha = 0.8;
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

    let tw = createjs.Tween.get(trans.params.ccc, {override: true, timeScale: window.TimeScale}).to({ rotation: 360}, 500).set({rotation: 0});
    window.Tweens.add(tw);
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
				pos.graphics.setStrokeStyle(0).beginFill('#80838c').drawCircle(0,0,3);
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

			let width = 45
			let height = 50;

			//upstream
			let upstream = this.getArrowBand(width, height, this.params.blockchain.params.color, 'up');
			upstream.x = 36;
			upstream.y = 25;
			this.momom_up = upstream;
			this.cont_momom.addChild(upstream);

			//downstream
			let downstream = this.getArrowBand(width, height, mempool.params.blockchain.params.color, 'down');
			downstream.x = -15 + this.params.width;
			downstream.y = -25 - height;
			downstream.rotation = 180;
			this.momom_down = downstream;
			this.cont_momom.addChild(downstream);

			//moving
			this.momom_move = 0;
	}

	updateMoMoM() {

		if(this.params.blockchain.params.visible === false) return;

		let speed = 0.3;

		if(this.momom_up) {
			this.momom_up.band1.y -= speed;
			this.momom_up.band2.y -= speed;
			this.momom_down.band1.y -= speed;
			this.momom_down.band2.y -= speed;

			if(this.momom_up.band1.y < -this.momom_up.band1.image.height - 50) this.momom_up.band1.y = 22;
			if(this.momom_up.band2.y < -this.momom_up.band1.image.height - 50) this.momom_up.band2.y = 22;
			if(this.momom_down.band1.y < -this.momom_up.band1.image.height - 50) this.momom_down.band1.y = 22;
			if(this.momom_down.band2.y < -this.momom_up.band1.image.height - 50) this.momom_down.band2.y = 22;
		}
	}

	sendMoMoM() {

		if(this.params.blockchain.params.visible === false) return;

		var that = this;
		createjs.Tween.get(this.momom_up.momom).to({y : -60}, MinuteSeconds*1000).call(function() { that.momom_up.momom.y = 10; });
		createjs.Tween.get(this.momom_down.momom).to({y : -60}, MinuteSeconds*1000).call(function() { that.momom_down.momom.y = 10; });
	}

	hideMoMoM() {

		this.momom_up.alpha = 0;
		this.momom_down.alpha = 0;
	}

	showMoMoM() {

		this.momom_up.alpha = 1;
		this.momom_down.alpha = 1;
	}

	getArrowBand(width, height, color, direction) {

		let stream = new createjs.Container();
		stream.regX = width/2;
		stream.regY = height/2;
		let bkg = new createjs.Shape();
		bkg.graphics.beginFill(color).drawRect(0,0, width, height);
		bkg.x = 0;
		bkg.y = - height;
		bkg.alpha = 0.4;
		stream.addChild(bkg);
		let band1 = new createjs.Bitmap(window.Queue.getResult('arrowband'));
		band1.x = -37;
		band1.y = -height;
		band1.scaleX = 3;
		band1.scaleY = 1;
		band1.alpha = 1;
		stream.band1 = band1;
		let band2 = new createjs.Bitmap(window.Queue.getResult('arrowband'));
		band2.x = -37;
		band2.y = band1.image.height - height;
		band2.scaleX = 3;
		band2.scaleY = 1;
		band2.alpha = 1;
		stream.band2 = band2;
		let MoMoM = new createjs.Text('MoM', '14px Montserrat', color);
		MoMoM.regX = MoMoM.getMeasuredWidth()/2;
		MoMoM.regY = MoMoM.getMeasuredHeight()/2;
		MoMoM.x = 25;
		MoMoM.y = 10;
		MoMoM.alpha = 0.4;
		if(direction == 'down') {
			MoMoM.text = 'MoMoM';
			MoMoM.x = 30;
			MoMoM.rotation = 180;
		}
		stream.momom = MoMoM;
		let mask = new createjs.Shape();
		mask.graphics.beginFill("red").drawRect(0, 0, width, height);
		mask.x = 0;
		mask.y = - height;
		mask.alpha = 0;
		band1.mask = mask;
		band2.mask = mask;
		MoMoM.mask = mask;
		stream.addChild(band1);
		stream.addChild(band2);
		stream.addChild(MoMoM);


		return stream;
	}

	getContract(name) {
		return this.ccc.find(c => c.params.name == name);
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