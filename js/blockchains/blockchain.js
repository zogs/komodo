class Blockchain extends createjs.Container {

	constructor(params) {

		super();
		var defaults = {
			color: 'red',
			id: 'doge',
			name: 'doge',
			logo: null,
			height: 100,
			blockPadding: 20,
			blockWidth: 100,
			blockHeight: 50,
			blockTime: 1,
			premined: 0,
			notarizeTo: null,
			notarizeInterval: 10,
			notarizeAdvance: 1,
			notarizeNBlock: 1,
			notaryLabelSize: 'small',
			privacy: 0,
			ccc: [],
			maxTps: 200,
			visible: true,
			active: true,
		};
		this.params = extend(defaults,params);
		this.blocks = [];
		this.links = [];
		this.mempool = null;
		this.genblock = null;
		this.blockheight = 0;
		this.tps = 0;

		this.cont_links = new createjs.Container();
		this.cont_block = new createjs.Container();
		this.cont_notary = new createjs.Container();
		this.cont_notary_link = new createjs.Container();
		this.cont_mempool = new createjs.Container();
		this.addChild(this.cont_links, this.cont_notary_link, this.cont_block, this.cont_notary, this.cont_mempool );

		this.tickChildren = false;

		this.init(params);
	}

	init(params) {

		this.initMempool();

		this.genesis();

		this.premineBlocks(this.params.premined);

	}

	start() {

		this.mempool.start();

		this.minuteListener = Stage.on('newminute', this.onNewMinute, this);
	}

	stop() {

		this.mempool.stop();

		if(this.minuteListener) Stage.off('newminute', this.minuteListener);
	}

	onNewMinute(event) {

		if(this.parent === null) return;

			if(event.time % this.params.blockTime === 0) {
				this.mineBlock();
			}

			if(this.params.notarizeTo === 'btc' && (event.time+this.params.notarizeAdvance) % this.params.notarizeInterval === 0) {
					this.notarize();
			}

			if(this.params.notarizeTo === 'kmd' && (event.time+this.params.notarizeAdvance+1) % this.params.notarizeInterval === 0) {
				this.notarize();
			}

			if(this.params.type == 'SC' || this.params.type == 'AC') {
				this.mempool.sendMoMoM();
			}

			this.removeInvisibles();
	}

	genesis() {

		let block = new Block({
			blockchain: this,
			width: this.params.blockWidth,
			height: this.params.blockHeight,
			blockheight: 0,
			genesis: true,
			image: this.params.logo,
		});
		block.x = this.params.blockWidth/2 + this.params.blockPadding/2;
		block.y = 0; //block.params.height;
		block.finalize();
		this.cont_block.addChild(block);
		this.blocks.push(block);
		this.genblock = block;

		this.tps = 0;
		this.mempool.tps = 0;

	}

	premineBlocks(n) {

		for(let i=0; i<n; i++) {
			this.premineBlock();
		}
	}

	premineBlock() {

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

		this.mempool.mined(block);

	}


	mineBlock() {

		this.blockheight++;

		let block = new Block({blockchain: this, blockheight: this.blockheight});
		let timex = Timelines.currentBar.localToLocal(0,0, this).x;
		block.x = timex - this.params.blockWidth/2 - this.params.blockPadding/3;
		block.y = 0;

		let previous = this.blocks[this.blocks.length - 1];
		this.linkBlocks(previous, block, this.params.color);

		let transactions = this.mempool.getValidTransactions(10);
		block.addTransactions(transactions);
		this.mempool.removeTransactions(transactions);
		this.mempool.reorderTransactions();

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
		this.mempool.mined(block);


	}

	notarize() {

		let ev = new createjs.Event('notarization_start');
		ev.blockchain = this.params.id;
		ev.notarizeTo = this.params.notarizeTo;
		Stage.dispatchEvent(ev);

		let dest = this.params.notarizeTo;
		let blockchain = Blockchains.find(b => b.params.id == dest);
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

				trans.setPosition(trans.x, trans.y);
				blockchain.mempool.addTransaction(trans);
				blockchain.mempool.reorderTransactions();
				createjs.Tween.get(trans.image).to({ rotation: -1280, scale: 0, alpha: 0}, 200);
				createjs.Tween.get(trans.shape).to({ alpha: 1}, 200);

				let ev = new createjs.Event('notarization_end');
				ev.blockchain = this.params.id;
				ev.notarizeTo = this.params.notarizeTo;
				Stage.dispatchEvent(ev);



			});
		Tweens.add(tw);

	}

	drawMoMoMMagic() {

		let komodo = Blockchains.find(b => b.params.id == 'kmd');

		if(this.params.type == 'SC' || this.params.type == 'AC') {

			this.mempool.drawMoMoMTo(komodo.mempool);
		}

	}

	drawNotarySecurity(block, transactions) {

		let notary = transactions.filter(t => t.params.type == 'notary');
		let that = this;


		let coords = [];
		notary.map(function(t) {

			// get blocks coords
			let blockchain = block.params.blockchain;
			let x1 = blockchain.x + block.x + t.x - block.params.width/2;
			let y1 = t.y;
			let coor2 = t.params.blockchain.cont_block.localToLocal(t.params.notaryTo.x, t.params.notaryTo.y,  blockchain.cont_notary_link);
			let x2 = coor2.x;
			let y2 = coor2.y;


			//draw link
			let link = new createjs.Shape();
			link.graphics.setStrokeStyle(10).beginStroke(blockchain.params.color)
				.moveTo(x1, y1)
				.lineTo(x2, y2)
				.closePath();
			link.vX = x1;
			link.alpha = 0;
			let mask = new createjs.Shape();
			mask.graphics.beginFill('red').drawRect(x1 + 80, y1, -x2, y2 - blockchain.params.height/2 + 4);
			link.mask = mask;
			blockchain.cont_notary_link.addChild(link);
			let tw = createjs.Tween.get(link, {timeScale: TimeScale}).wait(300).to({alpha: 0.2}, 1000);
			Tweens.add(tw);

			//return early if no label
			if(t.params.blockchain.params.notaryLabelSize == 'none') {
				return;
			}

			// display label
			let image;
			let scale;
			let icon;
			if(blockchain.params.id == 'btc') {
				icon = new createjs.Bitmap(queue.getResult('btc_security'));
			}
			if(blockchain.params.id == 'kmd') {
				icon = new createjs.Bitmap(queue.getResult('kmd_security'));
			}
			scale = 0.6;
			icon.x = coor2.x;
			icon.y = coor2.y - block.params.height;
			icon.regX = icon.image.width/2;
			icon.regY = icon.image.height/2;
			if(t.params.blockchain.params.notaryLabelSize == "big") {
				scale = 1;
				icon.y = coor2.y - block.params.height - 25;
			}

			icon.scaleX = icon.scaleY = 0;
			icon.alpha = 0;
			blockchain.cont_notary_link.addChild(icon);
			let tw2 = createjs.Tween.get(icon, {timeScale: TimeScale}).wait(1000).to({alpha: 1, scaleX: scale, scaleY: scale}, 650, createjs.Ease.bounceOut);
			Tweens.add(tw2);

		});
	}

	initMempool() {

		let mempool = new Mempool({blockchain: this});

		mempool.x = Timelines.params.defaultTime * ( this.params.blockWidth + this.params.blockPadding) + mempool.params.width/2 + 20;
		mempool.y = 0;

		this.cont_mempool.addChild(mempool);
		this.mempool = mempool;
		Mempools.push(this.mempool);

		this.on("tick", proxy(this.linkMempool, this));

	}

	linkMempool() {

		let block = this.blocks[this.blocks.length - 1];

		if(this._linkMempool == undefined) {
			this._linkMempool = new createjs.Shape();
			this.cont_links.addChild(this._linkMempool);
		}

		let coor = this.globalToLocal(Timelines.currentBar.x, 0);
		this.mempool.x = coor.x + this.mempool.params.width/2 + 10;

		let thick = 4;
		this._linkMempool.graphics
				.clear()
				.setStrokeStyle(thick).beginStroke(this.params.color+'AA')
				.moveTo(block.x, 0)
				.lineTo(this.mempool.x, 0)
				.closePath()
				;

	}

	linkBlocks(block1, block2, color) {

		let link = new createjs.Shape();
		let thick = 8;
		let border = 2;
		link.graphics
				.setStrokeStyle(border).beginStroke(color).beginFill(color+'55')
				.moveTo(0, 0)
				.lineTo(block2.x - block1.x , 0)
				.lineTo(block2.x - block1.x, thick)
				.lineTo(0, thick)
				.closePath()
				;
		link.x = block1.x;
		link.y = -thick/2;
		this.cont_links.addChild(link);
		this.links.push(link);

	}

	removeInvisibles() {

		this.removeInvisibleBlock();
		this.removeInvisibleLink();
		this.removeInvisibleNotary();

		//console.log(this.params.name, this.blocks.length, this.cont_block.numChildren, this.cont_links.numChildren, this.cont_notary.numChildren, this.cont_notary_link.numChildren);
	}

	removeInvisibleBlock() {

		if(this.blocks.length >=2) {
			for(let i=0,ln=this.blocks.length; i<ln; i++) {
				let block = this.blocks[i];
				if(block && block.localToGlobal(0,0).x < -300) {
					this.cont_block.removeChild(block);
					this.blocks.splice(i,1);
				}
			}
		}
	}

	removeInvisibleLink() {

		if(this.links.length >=2) {
			for(let i=0,ln=this.links.length; i<ln; i++) {
				let link = this.links[i];
				if(link && link.localToGlobal(0,0).x < -300) {
					this.cont_links.removeChild(link);
					this.links.splice(i,1);
				}
			}
		}
	}

	removeInvisibleNotary() {

		for(let i=0,ln=this.cont_notary.numChildren; i<ln; i++) {
			let notary = this.cont_notary.getChildAt(i);
			if(notary && notary.localToGlobal(0,0).x < -300 ) {
				this.cont_notary.removeChild(notary);
			}
		}
		for(let i=0,ln=this.cont_notary_link.numChildren; i<ln; i++) {
			let link = this.cont_notary_link.getChildAt(i);
			if(link && link.localToGlobal(link.vX,0).x < -300 ) {
				this.cont_notary_link.removeChild(link);
			}
		}
	}

	show() {

		this.cont_block.alpha = 1;
		this.cont_mempool.alpha = 1;
		this.cont_links = 1;
		this.mempool.alpha = 1;
	}

	hide() {

		this.cont_block.alpha = 0;
		this.cont_mempool.alpha = 0;
		this.cont_links.alpha = 0;
		this.mempool.alpha = 0;
	}

	fadeIn(ms = 500) {

		createjs.Tween.get(this.cont_block).to({alpha: 1}, ms);
		createjs.Tween.get(this.cont_mempool).to({alpha: 1}, ms);
		createjs.Tween.get(this.cont_links).wait(ms).to({alpha: 1}, ms/2);

		createjs.Tween.get(this.mempool).to({alpha: 1}, ms);
	}


	fadeOut(ms = 500) {

		createjs.Tween.get(this.cont_links).to({alpha: 0}, ms);
		createjs.Tween.get(this.cont_block).to({alpha: 0}, ms);
		createjs.Tween.get(this.cont_mempool).to({alpha: 0}, ms);

		createjs.Tween.get(this.mempool).to({alpha: 0}, ms);
	}

	getTps() {
		return this.tps;
	}

}