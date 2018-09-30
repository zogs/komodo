(function() {


// create new class
function Mempool(params) {

	this.Container_constructor();

	var defaults = {
		width: 140,
		height: 50,
		cols: 8,
		rows: 3,
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

	this.cont_debug = new createjs.Container();
	this.cont_momom = new createjs.Container();
	this.cont_block = new createjs.Container();
	this.cont_transaction = new createjs.Container();
	this.addChild(this.cont_momom, this.cont_block, this.cont_debug, this.cont_transaction);

	this.init(params);
}

//extend it
var prototype = createjs.extend(Mempool, createjs.Container);

//add EventDispatcher
createjs.EventDispatcher.initialize(prototype);


//public methods
prototype.init = function(params) {

	this.computePosition();

	this.drawMempool();

	createjs.Ticker.addEventListener('tick', proxy(this.tick, this));

}

prototype.tick = function() {

	if(Paused === 1) return;

	this.animateTransactions();
	this.animateCapacity();

}

prototype.animateTransactions = function() {

	for(let i=0,ln=this.transactions.length; i<ln; i++) {
		let trans = this.transactions[i];
		if(trans) trans.move();
	}
	for(let i=0,ln=this.ccTransactions.length; i<ln; i++) {
		let trans = this.ccTransactions[i];
		if(trans) trans.move();
	}
}

prototype.animateCapacity = function() {

	let total = this.transactions.length;
	let max = this.params.cols * this.params.rows;
	let coef = total/max;
	if(coef > 1) coef = 1;

	// gauge
	if(coef > 0.7) this.gaugeColor.style = "red";
	else this.gaugeColor.style = "#AAA";
	let tw = createjs.Tween.get(this.gauge, {override: true, timeScale: TimeScale}).to({scaleX: coef}, 500);
	Tweens.add(tw);

	// tps
	let tps = coef * this.params.blockchain.params.maxTps;
	this.tps.text = Math.ceil(tps) + ' tx/s';

	//if mempool satured
	if(this.saturated == false && this.transactions.length > (this.params.cols * this.params.rows)) {
		this.saturated = true;
		let t = createjs.Tween.get(this.warning, { timeScale: TimeScale}).to({alpha: 0.2}, 500).to({alpha: 0}, 500).set({saturated: false}, this);
		Tweens.add(t);
	}
}

prototype.drawMempool = function() {

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

	// TPS
	let tps = new createjs.Text('0 tx/s', '12px Arial', "#666");
	tps.x = this.params.width + 10;
	tps.y = this.params.height + 4;
	tps.alpha = 0.5;
	this.tps = tps;
	this.cont_block.addChild(tps);


	// text
	let text = new createjs.Text('MEMPOOL','12px Arial', '#AAA');
	text.y = this.params.height + 4;
	text.x = this.params.width/2 - text.getMeasuredWidth()/2;
	this.cont_block.addChild(text);

	let asset = queue.getResult('icon_kmd_ac');
	if(this.params.blockchain.params.name == 'bitcoin') asset = queue.getResult('icon_btc');
	if(this.params.blockchain.params.name == 'komodo') asset = queue.getResult('icon_kmd');
	if(this.params.blockchain.params.type == 'SC') asset = queue.getResult('icon_kmd_ac');
	if(this.params.blockchain.params.type == 'AC') asset = queue.getResult('icon_kmd_ac');

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
			let icon = new createjs.Bitmap(queue.getResult('icon_'+ccc));
			icon.name = ccc;
			let w = icon.image.width/2;
			let h = icon.image.height/2;
			icon.regX = icon.image.width/2;
			icon.regY = icon.image.height/2;
			icon.x = logo.x + w*2 + 5 + (w*2+5)*i;
			icon.y = logo.y
			let bkg = new createjs.Shape();
			bkg.graphics.setStrokeStyle(1).beginStroke('grey').beginFill('#FFF').drawCircle(0, 0, 20);
			bkg.x = icon.x;
			bkg.y = icon.y;
			this.cont_block.addChild(bkg);
			this.cont_block.addChild(icon);
			this.ccc.push(icon);
		}
	}

	this.regX = this.params.width/2;
	this.regY = this.params.height/2;

	this.cont_block.x += pad;
	this.cont_transaction.x += pad;
	this.cont_debug.x += pad;

}

prototype.appendTransaction = function(trans) {

	this.cont_transaction.addChild(trans);
}

prototype.addContractTransaction = function(trans) {

	this.ccTransactions.push(trans);
}

prototype.removeContractTransaction = function(trans) {

	this.ccTransactions.splice(this.ccTransactions.indexOf(trans), 1);
}

prototype.addTransaction = function(trans) {

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

prototype.removeTransactions = function(transactions) {

	for(let i=0,ln=transactions.length; i<ln; i++) {

		let trans = transactions[i];
		this.cont_transaction.removeChild(trans);
		this.transactions.splice(this.transactions.indexOf(trans),1);
	}
}

prototype.reorderTransactions = function() {

	let transactions = this.transactions;
	for(let i=0,ln=transactions.length; i<ln; i++) {
		let trans = transactions[i];
		let newpos = this.getPosition(i);
		if(newpos.hidden === true) trans.hide();
		else trans.show();
		trans.setTarget(newpos.x, newpos.y);
	}
}

prototype.computePosition = function() {

	let cols = this.params.cols;
	let lines = this.params.rows;
	let spanX = this.params.width / (cols+1);
	let spanY = this.params.height / (lines+1);
	let x = 0;
	let y = 0;
	let line = 1, col = 1;
	let total = cols*lines;

	for(let i=1; i<=total; i++) {
		x = spanX * col;
		y = spanY * line;
		col++;
		if(i >= line*cols) {
			col = 1;
			line++;
		}

		let pos = new createjs.Shape();
		pos.graphics.setStrokeStyle(1).beginStroke('#DDD').drawCircle(0,0,3);
		pos.x = x;
		pos.y = y;
		pos.position = i;
		this.cont_debug.addChild(pos);

		this.positions.push(pos);
	}
}

prototype.drawMoMoMTo = function(mempool) {

		let width = 30
		let height = 50;

		//upstream
		let upstream = this.getArrowBand(width, height, this.params.blockchain.params.color);
		upstream.x = 26;
		upstream.y = 25;
		this.cont_momom.addChild(upstream);

		//downstream
		let downstream = this.getArrowBand(width, height, mempool.params.blockchain.params.color);
		downstream.x = this.params.width;
		downstream.y = -25 - height;
		downstream.rotation = 180;
		this.cont_momom.addChild(downstream);


}

prototype.getArrowBand = function(width, height, color) {

		let stream = new createjs.Container();
		stream.regX = width/2;
		stream.regY = height/2;
		let bkg = new createjs.Shape();
		bkg.graphics.beginFill(color).drawRect(0,0, width, height);
		bkg.x = 0;
		bkg.y = - height;
		bkg.alpha = 0.3;
		stream.addChild(bkg);
		let band = new createjs.Bitmap(queue.getResult('arrowband'));
		band.x = -22;
		band.y = -height;
		band.scaleX = 1.5;
		band.alpha = 0.1;
		let mask = new createjs.Shape();
		mask.graphics.beginFill("red").drawRect(0, 0, width, height);
		mask.x = 0;
		mask.y = - height;
		mask.alpha = 0;
		band.mask = mask;
		stream.addChild(band);
		let tw = createjs.Tween.get(band, {loop: true, timeScale: TimeScale}).to({ y: - band.image.height }, 5000);
		Tweens.add(tw, false);

		return stream;
}

prototype.getRandomContract = function() {

	return this.ccc[Math.floor(Math.random()*this.ccc.length)];
}

prototype.getValidTransactions = function(n) {

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

prototype.getTopPosition = function() {

	return this.positions[0];
}

prototype.getHiddenPosition = function() {

	return { x: this.params.width, y: this.params.height/2, hidden: true};
}

prototype.getPosition = function(n) {
	let pos = this.positions[n];
	if(pos == undefined) {
		return this.getHiddenPosition();
	}
	return pos;
}

//<-- end methods


//assign Block to window's scope & promote overriden container's methods from Wave object, allow them to be call by 'Container_methodName()'
window.Mempool = createjs.promote(Mempool,'Container');

}());