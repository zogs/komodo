(function() {


// create new class
function Block(params) {

	this.Container_constructor();

	var defaults = {
		width: 100,
		height: 50,
		cols: 5,
		rows: 2
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

//extend it
var prototype = createjs.extend(Block, createjs.Container);

//add EventDispatcher
createjs.EventDispatcher.initialize(prototype);


//public methods
prototype.init = function(params) {

	this.computePosition();

	this.drawBlock();

}

prototype.drawBlock = function() {

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

	var matrix = new createjs.ColorMatrix().adjustHue(180).adjustSaturation(100);
	 rect.filters = [
	     new createjs.ColorMatrixFilter(matrix)
	 ];

	let name = (this.params.blockheight > 0)? 'BLOCK '+ this.params.blockheight : 'GENESIS';
	let text = new createjs.Text(name, '12px Arial', '#AAA');
	text.x = text.getMeasuredWidth()/2;
	text.y = this.params.height + 4;
	this.cont_text.addChild(text);

	this.regX = this.params.width/2;
	this.regY = this.params.height/2;

}

prototype.addTransactions = function(transactions) {

	for(let i=1, ln=transactions.length; i<=ln; i++) {
		let trans = transactions[i-1];
			this.addTransaction(trans);
	}
}

prototype.addTransaction = function(trans) {

	let nb = this.transactions.length+1;

	let pos = this.getNextPosition();
	trans.setPosition(pos.x, pos.y);

	if(trans.params.blockchain == this.params.blockchain) {
		trans.setColor(this.params.blockchain.params.color, 1);
	}

	this.cont_block_trans.addChild(trans);
	this.transactions.push(trans);

}

prototype.getNextPosition = function() {

	let pos = this.positions[this.transactions.length];
	return pos;
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
		pos.graphics.beginFill('#F0F0F0').drawCircle(0,0,4);
		pos.x = x;
		pos.y = y;
		pos.position = i;
		pos.alpha = 0;
		this.cont_debug.addChild(pos);

		this.positions.push(pos);
	}
}

prototype.finalize = function() {
	let pad = 5;
	this.snapToPixel = true;
	this.cache(-pad,-pad,this.params.width+pad*2,this.params.height*1.5+pad*2);
}

prototype.getCachedImage = function() {

	let pad = 5;
	this.cont_block.cache(-5, -5, this.params.width+10, this.params.height+10)
	let cached = new createjs.Bitmap(this.cont_block.cacheCanvas)
	cached.regX = this.params.width/2 + pad;
	cached.regY = this.params.height/2 + pad;
	return cached;
}





//<-- end methods


//assign Block to window's scope & promote overriden container's methods from Wave object, allow them to be call by 'Container_methodName()'
window.Block = createjs.promote(Block,'Container');

}());