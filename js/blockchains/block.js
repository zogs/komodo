class Block extends createjs.Container {

	constructor(params) {

		super();
		var defaults = {
			width: 100,
			height: 50,
			cols: 5,
			rows: 2,
			image: null,
			genesis: false,
		};

		this.params = extend(defaults,params);
		this.transactions = [];
		this.positions = [];

		this.cont_debug = new createjs.Container();
		this.cont_block = new createjs.Container();
		this.cont_text = new createjs.Container();

		this.cont_block_bkg = new createjs.Container();
		this.cont_block_trans = new createjs.Container();
		this.cont_block.addChild(this.cont_block_bkg, this.cont_block_trans);

		this.addChild(this.cont_block, this.cont_debug, this.cont_text);

		this.tickChildren = false;
		this.mouseEnabled = false;

		this.init(params);
	}

	init(params) {

		this.computePosition();

		this.drawBlock();

	}

	drawBlock() {

		let bkg = new createjs.Shape();
		bkg.graphics.setStrokeStyle(0)
				.beginFill(this.params.blockchain.params.color)
				.drawRect(-5,-5, this.params.width+5, this.params.height+5);
		bkg.alpha = 0.2;
		this.cont_block_bkg.addChild(bkg);

		let rect = new createjs.Shape();
		rect.graphics.setStrokeStyle(2)
				.beginStroke(this.params.blockchain.params.color)
				.beginFill('#FFF')
				.drawRect(0,0, this.params.width, this.params.height);
		this.cont_block_bkg.addChild(rect);

		if(this.params.image) {
			let asset = queue.getResult(this.params.image);
			let img = new createjs.Bitmap(asset);
			img.regX = img.image.width/2;
			img.regY = img.image.height/2;
			img.x = this.params.width/2;
			img.y = this.params.height/2;
			this.cont_block_trans.addChild(img);
		}

		if(this.params.genesis && !this.params.image) {
			let title = new createjs.Text(this.params.blockchain.params.id.toUpperCase(), 'bold 18px Arial', this.params.blockchain.params.color);
			title.regX = title.getMeasuredWidth()/2;
			title.regY = title.getMeasuredHeight()/2;
			title.x = this.params.width/2;
			title.y = this.params.height/2;
			this.cont_block_trans.addChild(title);
		}

		var matrix = new createjs.ColorMatrix().adjustHue(180).adjustSaturation(100);
		 rect.filters = [
		     new createjs.ColorMatrixFilter(matrix)
		 ];

		let name = (this.params.blockheight > 0)? 'BLOCK '+ this.params.blockheight : 'GENESIS';
		let text = new createjs.Text(name, '12px Arial', '#AAA');
		text.x = text.getMeasuredWidth()/2;
		text.y = this.params.height + 4;
		//this.cont_text.addChild(text);

		this.regX = this.params.width/2;
		this.regY = this.params.height/2;

	}

	addTransactions(transactions) {

		for(let i=1, ln=transactions.length; i<=ln; i++) {
			let trans = transactions[i-1];
				this.addTransaction(trans);
		}
	}

	addTransaction(trans) {

		let nb = this.transactions.length+1;

		let pos = this.getNextPosition();
		trans.setPosition(pos.x, pos.y);

		if(trans.params.blockchain == this.params.blockchain) {
			trans.setColor(this.params.blockchain.params.color, 1);
		}

		this.cont_block_trans.addChild(trans);
		this.transactions.push(trans);

	}

	getNextPosition() {

		let pos = this.positions[this.transactions.length];
		return pos;
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

		for(let i=1; i<=total; i++) {
			x = spanX * col;
			y = spanY * line;
			col++;
			if(i >= line*cols) {
				col = 1;
				line++;
			}

			let pos = new createjs.Shape();
			pos.graphics.beginFill('#F0F0F0').drawCircle(0,0,4);
			pos.x = x;
			pos.y = y;
			pos.position = i;
			pos.alpha = 0;
			this.cont_debug.addChild(pos);

			this.positions.push(pos);
		}
	}

	finalize() {
		let pad = 5;
		this.snapToPixel = true;
		this.cache(-pad,-pad,this.params.width+pad*2,this.params.height*1.5+pad*2);
	}

	getCachedImage() {

		let pad = 5;
		this.cont_block.cache(-5, -5, this.params.width+10, this.params.height+10)
		let cached = new createjs.Bitmap(this.cont_block.cacheCanvas)
		cached.regX = this.params.width/2 + pad;
		cached.regY = this.params.height/2 + pad;
		return cached;
	}

}