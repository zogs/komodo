
// define usefull const
var Stage;
var Blockchains = [];
var Emitters = [];
var Timeline;
var Tweens = new Tweens();
var TransactionPool = new TransactionPool();
var Paused = 0;
var TimeScale = 1;
var ZoomScale = 1;
var SlowMotion = false;
var Cont_main;
var Cont_timeline;
var Cont_blockchain;
var Cont_mempool;


// define global usefull constant
// (NB: use positive numeric for perf reason)
const LEFT = 1;
const CENTER = 0;
const RIGHT = 2;

window.loaded = function() {

	Stage = new createjs.Stage('canvas');
	Stage.enableMouseOver(10);
	Stage.snapToPixelEnabled = true;

	queue = new createjs.LoadQueue();
	queue.addEventListener('complete',assetsLoaded);

	queue.loadManifest([
		{id:'bitcoinlogo',src:'assets/img/Bitcoin-icon.png'},
		{id:'komodologo',src:'assets/img/Komodo-icon.png'},
		{id:'komodoASlogo',src:'assets/img/Komodo-icon.png'},
		{id:'kmddPOWed',src:'assets/img/KMDdPOW.png'},
		{id:'btcdPOWed',src:'assets/img/BTCdPOW.png'},
		{id:'arrowband',src:'assets/img/arrowband.png'},
		{id:'icon_btc',src:'assets/img/icon/btc.png'},
		{id:'icon_kmd',src:'assets/img/icon/kmd.png'},
		{id:'icon_cog',src:'assets/img/icon/cog.png'},
		{id:'icon_dice',src:'assets/img/icon/dice.png'},
		{id:'icon_asset',src:'assets/img/icon/asset.png'},
		{id:'icon_faucet',src:'assets/img/icon/faucet.png'},
		{id:'icon_kmd_ac',src:'assets/img/icon/kmd_ac.png'},
		{id:'icon_oracle',src:'assets/img/icon/oracle.png'},
		{id:'icon_reward',src:'assets/img/icon/reward.png'},
	]);

}

window.assetsLoaded = function() {

	//Globals
	STAGEWIDTH = Stage.canvas.width;
	STAGEHEIGHT = Stage.canvas.height;
	ORIGINWIDTH = Stage.canvas.width;
	ORIGINHEIGHT = Stage.canvas.height;
	RATIO = STAGEWIDTH / STAGEHEIGHT;

	//init onEnterFrame
	createjs.Ticker.timingMode = createjs.Ticker.TIMEOUT;
	createjs.Ticker.addEventListener('tick',tick);

	//init Mouse move
	//stage.addEventListener('stagemousemove',onMouseMove);

	 //keyboard handlers
	window.onkeyup = keyUpHandler;
	window.onkeydown = keyDownHandler;

	//call the init stage function
	window.initStage();

	//resize event
	window.onresize = browserResize;
	window.resizeCanvas();

}


window.tick = function() {

	//console.log(createjs.Tween._tweens.length);
	Stage.update();
}

window.addAssetChain = function() {

	let n = Blockchains.length+1;

	let prev = Blockchains[Blockchains.length-1];
	let bloc = prev.blocks[prev.blocks.length-2];

	let AS = new Blockchain({name: 'AS'+n, color:'green', notarizeTo: 'komodo', notarizeInterval: 1, notarizeNBlock: 1});
	AS.x = prev.x + bloc.x + AS.params.blockWidth/2 + AS.params.blockPadding/2;
	AS.y = 100 + n*100;
	AS.initMempool();
	AS.mempool.start();
	Cont_blockchain.addChild(AS);
	Blockchains.push(AS);

}

window.addScalingChain = function() {

	let n = Blockchains.length+1;
	let prev = Blockchains[Blockchains.length-1];
	let bloc = prev.blocks[prev.blocks.length-2];
	let blocX = (typeof bloc !== 'undefined')? bloc.x : 0;

	let SC = new Blockchain({name: 'SC'+n, color:'#569b9b', notarizeTo: 'komodo', notarizeInterval: 1, notarizeNBlock: 1});
	SC.x = prev.x + blocX + SC.params.blockWidth/2 + SC.params.blockPadding/2;
	SC.y = prev.y + 100;
	SC.initMempool();
	Cont_blockchain.addChild(SC);

	Blockchains.push(SC);
	Emitters.find(e => e.params.name == 'komodo').addChain(SC);

}



window.keyDownHandler = function(e)
{
   switch(e.key)
   {
    case ' ':  window.pause(); break;
    case 's':  Timeline.start(); break;
    case 'w':  slowMo(0.5,1000); break;
    case 'z':  zoom(1.6,700); break;
    case 'a':  dezoom(700); break;
    case 'b':  window.addAssetChain(); break;
    case 'c':  window.addScalingChain(); break;
    case '+':  window.increaseTps(); break;
    case '-':  window.decreaseTps(); break;
    default: console.log('Key "'+e.key+'" have no handler.');
   }
}

window.keyUpHandler = function(e)
{

}

window.onMouseMove= function(e) {

	MOUSE_X = e.stageX;
	MOUSE_Y = e.stageY;

	var pt = new createjs.Point(MOUSE_X,MOUSE_Y);
	MOUSE_POINTS.unshift(pt);
	MOUSE_POINTS = MOUSE_POINTS.slice(0,300);
}

window.getMousePoint = function(n) {

	if(MOUSE_POINTS.length < n) return MOUSE_POINTS[MOUSE_POINTS.length];
	return MOUSE_POINTS[n];
}

window.getMouseVector = function(n) {

	return new Victor(getMousePoint(n).x - getMousePoint(n+1).x, getMousePoint(n).y - getMousePoint(n+1).y );
}

window.increaseTps = function() {

	let emit = Emitters.find(e => e.params.name == 'komodo');
	emit.params.tps = Math.ceil(emit.params.tps*2);
	console.log(emit.params.name + ' - Tps: '+emit.params.tps+' tx/s total');

}
window.decreaseTps = function() {

	let emit = Emitters.find(e => e.params.name == 'komodo');
	emit.params.tps = Math.ceil(emit.params.tps/2);
	console.log(emit.params.name + ' - Tps: '+emit.params.tps+' tx/s total');
}

window.slowMo = function(scale,time) {

	if(SlowMotion === false) {
		SlowMotion = true;
		const tween = createjs.Tween.get(window).to({TimeScale: scale}, time);
		tween.addEventListener('change', window.updateTimeScale);
	}
	else {
		SlowMotion = false;
		const tween = createjs.Tween.get(window).to({TimeScale: 1}, time);
		tween.addEventListener('change', window.updateTimeScale);

	}
}
window.updateTimeScale = function() {

	Tweens.setTimeScale(TimeScale);
}

window.zoom = function(scale, time = 2000) {

		if(ZoomScale !==1) return window.dezoom();

    Cont_main.regX = STAGEWIDTH/2;
    Cont_main.regY = STAGEHEIGHT/2;
    Cont_main.x = STAGEWIDTH/2;
    Cont_main.y = STAGEHEIGHT/2;
    const tw = createjs.Tween.get(window, {override: true}).to({ZoomScale: scale}, time);
    tw.addEventListener('change', window.updateZoom);
}

window.updateZoom = function() {
	Cont_main.scaleX = Cont_main.scaleY = window.ZoomScale;
}

window.dezoom = function(time = 1000) {

	const tw = createjs.Tween.get(window, {override: true}).to({ZoomScale: 1}, time);
	tw.addEventListener('change', window.updateZoom);
}


window.pause = function() {
	if(Paused === 1) {
		Paused = 0;
		createjs.Ticker.paused = false;
		console.log('PAUSE DESACTIVATED');
	}
	else {
		Paused = 1;
		createjs.Ticker.paused = true;
		console.log('PAUSE ACTIVATED !');
	}

}

window.browserResize = function() {
	if(window.browserResizeTimeout) window.clearTimeout(window.browserResizeTimeout);
	window.browserResizeTimeout = window.setTimeout(window.browserResizeEnded,500);
}

window.browserResizeEnded = function() {

	window.resizeCanvas();
}

window.resizeCanvas = function() {

	var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

	var currentHeight = Stage.canvas.height;
	var currentWidth = Stage.canvas.width;
	if(windowHeight < Stage.canvas.height) {
		currentHeight = windowHeight;
		currentWidth = currentHeight * RATIO;
	}
	if(windowWidth < Stage.canvas.width) {
		currentWidth = windowWidth;
		currentHeight = currentWidth / RATIO;
	}

	document.getElementById('canvas').style.width = currentWidth+'px';
	document.getElementById('canvas').style.height = currentHeight+'px';

	document.getElementById('canvas-container').style.width = currentWidth+'px';
	document.getElementById('canvas-container').style.height = currentHeight+'px';
	//scroll to top
	window.setTimeout(function() { //rowsers don't fire if there is not short delay
		window.scrollTo(0,1);
    }, 1);

	var event = new createjs.Event('canvas_resized');
	event.originWidth = ORIGINWIDTH;
	event.originHeight = ORIGINHEIGHT;
	event.newWidth = currentWidth;
	event.newHeight = currentHeight;
	Stage.dispatchEvent(event);

}