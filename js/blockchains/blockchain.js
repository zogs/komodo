(function() {


// create new class
function Blockchain(params) {

	this.Container_constructor();

	var defaults = {
		color: 'red',
		name: 'doge',
		blockPadding: 20,
		blockWidth: 100,
		blockHeight: 50,
		blockTime: 1,
		premined: 0,
		notarizeTo: null,
		notarizeInterval: 10,
		notarizeNBlock: null,
		showBigNotaryLabel: false,
		ccc: [],
		maxTps: 100,
	};
	this.params = extend(defaults,params);
	this.blocks = [];
	this.mempool = null;
	this.genblock = null;
	this.blockheight = 0;

	this.cont_links = new createjs.Container();
	this.cont_block = new createjs.Container();
	this.cont_notary = new createjs.Container();
	this.cont_notary_link = new createjs.Container();
	this.addChild(this.cont_links, this.cont_notary_link, this.cont_block, this.cont_notary );

	this.tickChildren = false;

	this.init(params);
}

//extend it
var prototype = createjs.extend(Blockchain, createjs.Container);

//add EventDispatcher
createjs.EventDispatcher.initialize(prototype);


//public methods
prototype.init = function(params) {

	this.genesis();

	this.premineBlocks(this.params.premined);

	Stage.on('newminute', function(event) {

		if(event.time % this.params.blockTime === 0) {
			this.mineBlock();
		}

		if(this.params.notarizeTo !== null && (event.time+1) % this.params.notarizeInterval === 0) {
			if(Blockchains.find(b => b.params.name == this.params.notarizeTo)) {
				this.notarize();
			}
		}

	},this);


}

prototype.genesis = function() {

	let block = new Block({
		blockchain: this,
		width: this.params.blockWidth,
		height: this.params.blockHeight,
		blockheight: 0,
	});
	block.x = this.params.blockWidth/2 + this.params.blockPadding/2;
	block.y = 0; //block.params.height;
	block.finalize();
	this.cont_block.addChild(block);
	this.blocks.push(block);
	this.genblock = block;

}

prototype.premineBlocks = function(n) {

	for(let i=0; i<n; i++) {
		this.premineBlock();
	}
}

prototype.premineBlock = function() {

	this.blockheight++;

	let block = new Block(({ blockchain: this, blockheight: this.blockheight}));
	let vtime = this.blockheight * this.params.blockTime;
	block.x = this.genblock.x + vtime * (this.params.blockWidth + this.params.blockPadding);
	block.y = 0;

	let previous = this.blocks[this.blocks.length - 1];
	this.linkBlocks(previous, block, this.params.color);

	let transactions = [];
	for(let i=0,ln=Math.ceil(Math.random()*10); i<ln; i++) {
			transactions.push(new Transaction({ blockchain: this, mempool: this.mempool, 'valid': true}));
	}
	block.addTransactions(transactions);
	block.finalize();

	this.cont_block.addChild(block);
	this.blocks.push(block);

}


prototype.mineBlock = function() {

	this.blockheight++;
	let block = new Block({blockchain: this, blockheight: this.blockheight});
	let vtime = this.blockheight * this.params.blockTime;
	block.x = this.genblock.x + vtime * (this.params.blockWidth + this.params.blockPadding);
	block.y = 0;

	let previous = this.blocks[this.blocks.length - 1];
	this.linkBlocks(previous, block, this.params.color);

	let transactions = this.mempool.getValidTransactions(10);
	block.addTransactions(transactions);
	this.mempool.removeTransactions(transactions);

	this.drawNotarySecurity(block, transactions);

	block.finalize();
	this.cont_block.addChild(block);
	this.blocks.push(block);

	block.alpha = 0;
	block.scaleX = 0;
	block.scaleY = 0;

	let tw = createjs.Tween.get(block, {timeScale: TimeScale}).to({alpha:1, scaleX:1, scaleY:1}, 500);
	Tweens.add(tw);

	this.linkMempool();


}

prototype.notarize = function() {

	let dest = this.params.notarizeTo;
	let blockchain = Blockchains.find(b => b.params.name == dest);
	let nb = this.params.notarizeNBlock;
	let that = this;

	let blocks = this.blocks.slice(this.blocks.length - nb);
	let block = blocks[0];

	let copy = block.getCachedImage();
	copy.x = block.x;
	copy.y = block.y;
	copy.scaleX = copy.scaleY = 0.5;
	//this.cont_notary.addChild(copy);

	let last = this.blocks[this.blocks.length-1];
	let trans = new Transaction({blockchain: this, mempool: this.mempool, type: 'notary', priority: 1, 'notaryTo': block, valid: true, 'image': copy, 'imageX': 5, 'imageY': 5});

	let coor = this.cont_block.localToLocal(last.x, last.y, blockchain.mempool.cont_transaction);
	trans.x = coor.x;
	trans.y = coor.y;
	trans.shape.alpha = 0;
	trans.image.alpha = 1;
	blockchain.mempool.cont_transaction.addChild(trans);

	let tw = createjs.Tween.get(trans, {timeScale: TimeScale}).to({x: trans.x + this.params.blockWidth/2, y: trans.y - this.params.blockHeight/2, alpha: 0.5}, 800)
		.call(function() {

			blockchain.mempool.addTransaction(trans);
			trans.moveTo(0, 0, trans.position);
			createjs.Tween.get(trans.image).to({ rotation: -1280, scale: 0, alpha: 0}, 200);
			createjs.Tween.get(trans.shape).to({ alpha: 1}, 200);

			blockchain.mempool.reorderTransactions();
		});
	Tweens.add(tw);

}

prototype.drawMoMoMMagic = function() {

	let komodo = Blockchains.find(b => b.params.name == 'komodo');

	if(this.params.type == 'SC' || this.params.type == 'AC') {

		//this.mempool.drawMoMoMTo(komodo.mempool);
	}

}

prototype.drawNotarySecurity = function(block, transactions) {

	let notary = transactions.filter(t => t.params.type == 'notary');
	let that = this;


	let coords = [];
	notary.map(function(t) {

		let blockchain = block.params.blockchain;
		let x1 = blockchain.x + block.x + t.x - block.params.width/2;
		let y1 = t.y;
		let coor2 = t.params.blockchain.cont_block.localToLocal(t.params.notaryTo.x, t.params.notaryTo.y,  blockchain.cont_notary_link);
		let x2 = coor2.x;
		let y2 = coor2.y;

		let link = new createjs.Shape();
		link.graphics.setStrokeStyle(10).beginStroke(blockchain.params.color)
			.moveTo(x1, y1)
			.lineTo(x2, y2)
			.closePath();
		link.alpha = 0;
		blockchain.cont_notary_link.addChild(link);
		let tw = createjs.Tween.get(link, {timeScale: TimeScale}).wait(300).to({alpha: 0.2}, 1000);
		Tweens.add(tw);

		let image;
		let scale;
		let icon;
		let label;
		if(blockchain.params.name == 'bitcoin') {
			label = new createjs.Text('Bitcoin-level security', 'bold 18px Arial', blockchain.params.color);
			icon = new createjs.Bitmap(queue.getResult('btcdPOWed'));
		}
		if(blockchain.params.name == 'komodo') {
			label = new createjs.Text('BTC+KMD-level security', 'bold 18px Arial', blockchain.params.color);
			icon = new createjs.Bitmap(queue.getResult('kmddPOWed'));
		}

		scale = 0.5;
		icon.x = coor2.x;
		icon.y = coor2.y - block.params.height + 5;
		icon.regX = icon.image.width/2;
		icon.regY = icon.image.height/2;
		if(t.params.blockchain.params.showBigNotaryLabel === true) {
			scale = 1;
			icon.y = coor2.y - block.params.height - 20;
		}


		icon.scaleX = icon.scaleY = 0;
		icon.alpha = 0;
		blockchain.cont_notary_link.addChild(icon);
		let tw2 = createjs.Tween.get(icon, {timeScale: TimeScale}).wait(1000).to({alpha: 1, scaleX: scale, scaleY: scale}, 500, createjs.Ease.bounceOut);
		Tweens.add(tw2);

		if(t.params.blockchain.params.showBigNotaryLabel === true) {
			label.regX = label.getMeasuredWidth()/2;
			label.regY = label.getMeasuredHeight()/2;
			label.x = icon.x;
			label.y = icon.y - icon.image.height/2 - label.getMeasuredHeight();
			label.y -= 10;
			label.alpha = 0;
			blockchain.cont_notary_link.addChild(label);
			let tw3 = createjs.Tween.get(label, {timeScale: TimeScale}).wait(1000).to({alpha: 1, y: label.y + 10}, 600, createjs.Ease.circOut);
			Tweens.add(tw3);
		}




	});
}



prototype.initMempool = function() {

	let mempool = new Mempool({blockchain: this});

	mempool.x = Timeline.params.defaultTime * ( this.params.blockWidth + this.params.blockPadding) + mempool.params.width/2 + 10;
	mempool.y = this.y;

	Cont_mempool.addChild(mempool);
	this.mempool = mempool;

	this.on("tick", proxy(this.linkMempool, this));

}

prototype.linkMempool = function() {

	let block = this.blocks[this.blocks.length - 1];

	if(this._linkMempool == undefined) {
		this._linkMempool = new createjs.Shape();
		this.cont_links.addChild(this._linkMempool);
	}

	let coor = this.globalToLocal(this.mempool.x, this.mempool.y);
	let thick = 4;

	this._linkMempool.graphics
			.clear()
			.setStrokeStyle(thick).beginStroke(this.params.color)
			.moveTo(block.x, 0)
			.lineTo(coor.x, 0)
			.closePath()
			;
	this._linkMempool.cache(block.x, -thick/2, coor.x, thick*2);

}

prototype.linkBlocks = function(block1, block2, color) {

	let link = new createjs.Shape();
	let thick = 4;
	link.graphics
			.setStrokeStyle(thick).beginStroke(color)
			.moveTo(block1.x, 0)
			.lineTo(block2.x, 0)
			.closePath()
			;
	link.cache(block1.x, -thick/2, block2.x, thick*2);
	this.cont_links.addChild(link);

}

//<-- end methods


//assign blockchain to window's scope & promote overriden container's methods from Wave object, allow them to be call by 'Container_methodName()'
window.Blockchain = createjs.promote(Blockchain,'Container');

}());