import {Timeline} from './blockchains/timeline';
import {Platform} from './blockchains/platform';
import {Blockchain} from './blockchains/blockchain';
import {Chapter} from './chapter';
import {Tour} from './tour';
import {Intro} from './chapters/intro';
import {Security} from './chapters/security';
import {Scalability} from './chapters/scalability';
import {Interoperability} from './chapters/interoperability';
import {TweensManager} from './tweens';
import Victor from './lib/victor';
import createjs from 'createjs';

// define usefull const
window.Stage;
window.Queue;
window.Blockchains = [];
window.Platforms = [];
window.Emitters = [];
window.Particles = [];
window.Mempools = [];
window.Timelines;
window.Tweens = new TweensManager();
window.Paused = 0;
window.Mouse = new Victor(0,0);
window.MouseActive = false;
window.CurrentWidthRatio = 1;
window.CurrentHeightRatio = 1;
window.TimeScale = 1;
window.ZoomScale = 1;
window.SlowMotion = false;
window.CurrentBanner = null;
window.CanvasContainer = document.getElementById('canvas-container');
window.ColorAsset = ['#f3de8a', '#eb9486', '#7e7f9a', '#97a7b3'];
window.MinuteWidth = 120;
window.MinuteSeconds = 2;
window.Env = null;
window.debug = false;
window.Tour = null;
window.STAGEWIDTH;
window.STAGEHEIGHT;
window.ORIGINWIDTH;
window.ORIGINHEIGHT;
window.RATIO;
window.Cont_main;
window.Cont_background;
window.Cont_timeline;
window.Cont_platform;
window.Cont_blockchain;
window.Cont_mempool;
window.Cont_emitter;
window.Cont_currenttime;
window.Cont_tour;

window.loaded = function(env) {

	window.Stage = new createjs.Stage('canvas');
	window.Stage.enableMouseOver(10);
	window.Stage.snapToPixelEnabled = true;

	window.Queue = new createjs.LoadQueue();
	window.Queue.addEventListener('complete',function() { assetsLoaded(env) });
	window.Queue.loadManifest([
		{id:'KMDdiscoverytour',src:'dist/images/KMD_Discovery_Tour_Logo.svg', type: createjs.LoadQueue.IMAGE},
		{id:'btc_security',src:'dist/images/BTC_security.png'},
		{id:'kmd_security',src:'dist/images/KMD_security.png'},
    {id:'bitcoinlogo',src:'dist/images/Bitcoin-icon.png'},
		{id:'komodologo',src:'dist/images/Komodo-icon.png'},
		{id:'komodoASlogo',src:'dist/images/Komodo-icon.png'},
		{id:'kmddPOWed',src:'dist/images/KMDdPOW.png'},
		{id:'btcdPOWed',src:'dist/images/BTCdPOW.png'},
		{id:'arrowband',src:'dist/images/arrowband.png'},
		{id:'icon_btc',src:'dist/images/icon/btc.png'},
		{id:'icon_kmd',src:'dist/images/icon/kmd.png'},
		{id:'icon_cog',src:'dist/images/icon/cog.png'},
    {id:'icon_dice',src:'dist/images/icon/dice.png'},
		{id:'icon_rogue',src:'dist/images/icon/rogue.png'},
		{id:'icon_asset',src:'dist/images/icon/asset.png'},
		{id:'icon_faucet',src:'dist/images/icon/faucet.png'},
		{id:'icon_kmd_ac',src:'dist/images/icon/kmd_ac.png'},
		{id:'icon_oracle',src:'dist/images/icon/oracle.png'},
    {id:'icon_reward',src:'dist/images/icon/reward.png'},
    {id:'icon_gamecredits',src:'dist/images/icon/game.png'},
    {id:'icon_einsteinium',src:'dist/images/icon/emc2.png'},
    {id:'icon_chameleon',src:'dist/images/icon/chameleon.png'},
    {id:'icon_penguin',src:'dist/images/icon/penguin.png'},
    {id:'icon_snail',src:'dist/images/icon/snail.png'},
    {id:'icon_unicorn',src:'dist/images/icon/unicorn.png'},
    {id:'icon_wolf',src:'dist/images/icon/wolf.png'},
		{id:'sprite_warriors',src:'dist/images/warriors.png'},
	]);



}
window.assetsLoaded = function(env) {

	//Globals
	window.STAGEWIDTH = window.Stage.canvas.width;
	window.STAGEHEIGHT = window.Stage.canvas.height;
	window.ORIGINWIDTH = window.Stage.canvas.width;
	window.ORIGINHEIGHT = window.Stage.canvas.height;
	window.RATIO = window.STAGEWIDTH / window.STAGEHEIGHT;

	//Stage containers
	window.Cont_main = new createjs.Container();
  Stage.addChild(window.Cont_main);

  window.Cont_background = new createjs.Container();
  window.Cont_main.addChild(window.Cont_background);

  window.Cont_timeline = new createjs.Container();
  window.Cont_main.addChild(window.Cont_timeline);

  window.Cont_platform = new createjs.Container();
  window.Cont_main.addChild(window.Cont_platform);

  window.Cont_blockchain = new createjs.Container();
  window.Cont_main.addChild(window.Cont_blockchain);

  window.Cont_mempool = new createjs.Container();
  window.Cont_main.addChild(window.Cont_mempool);

  window.Cont_emitter = new createjs.Container();
  window.Cont_main.addChild(window.Cont_emitter);

  window.Cont_currenttime = new createjs.Container();
  window.Cont_main.addChild(window.Cont_currenttime);

  window.Cont_tour = new createjs.Container();
  window.Stage.addChild(window.Cont_tour);

	//init onEnterFrame
	//createjs.Ticker.timingMode = createjs.Ticker.TIMEOUT;
  //createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
  createjs.Ticker.framerate = 30;
	createjs.Ticker.addEventListener('tick',function(e) { window.tick(e); });

	//init Mouse move
	//stage.addEventListener('stagemousemove',onMouseMove);

	 //keyboard handlers
	window.onkeyup = keyUpHandler;
	window.onkeydown = keyDownHandler;

	//resize event
	window.onresize = browserResize;
	window.resizeCanvas();

  //window event
  window.addEventListener('blur', window.onWindowPassive);
  window.addEventListener('focus', window.onWindowActive);

  //mouse event
  document.querySelector('canvas#canvas').addEventListener('mouseover', ()=>{ window.MouseActive = true });
  document.querySelector('canvas#canvas').addEventListener('mouseout', ()=>{ window.MouseActive = false });
  document.querySelector('canvas#canvas').addEventListener('mousemove', (e)=>{ window.Mouse.x = e.offsetX / window.CurrentWidthRatio; window.Mouse.y = e.offsetY / window.CurrentHeightRatio;});

  //init stage
  if(env == 'test') window.initTest();
  else window.initTour();
}


window.initTest = function(env) {

    window.Env = 'test';

    window.Timelines = new Timeline({
      width: window.STAGEWIDTH,
      height: window.STAGEHEIGHT,
      minuteWidth: window.MinuteWidth,
      minuteSeconds: window.MinuteSeconds,
      defaultTime: 7,
    });
    window.Cont_timeline.addChild(window.Timelines);

    let komodo = new Blockchain({id: 'kmd', name: 'KMD Chain', color:'#53f1be', premined: 6, notarizeTo: 'btc', notaryLabelSize: "big", notarizeInterval:10});
    let SC1 = new Blockchain({id: 'SC1', name: 'Scaling Chain', color:'#54ad4d', type: 'SC', premined: 6, notarizeTo: 'kmd'});
    let AC1 = new Blockchain({id: 'AC1', name: 'Asset Chain 1', color:'#198201', type: 'AC', ccc: ['dice','reward','asset'], premined: 6, notarizeTo: 'kmd', privacy: 1});
    let AC2 = new Blockchain({id: 'AC2', name: 'Asset Chain 2', color:'#d49100', type: 'AC', ccc: ['oracle','faucet','cog'], premined: 6, notarizeTo: 'kmd', logo: 'icon_wolf'});
    let ROGUE = new Blockchain({id: 'ROGUE', name: 'ROGUE chain', color:'#449146', type: 'AC', ccc: ['rogue'], premined: 6, notarizeTo: 'kmd'});


    var komodoPlatform = new Platform({y: 260, id: 'kmd', name: ' ',color: '#53f1be', borderColor: '#53f1be', chains: [komodo], emitterTPS: 50});
    komodoPlatform.addChain(SC1);
    komodoPlatform.addChain(AC1);
    komodoPlatform.addChain(AC2);
    komodoPlatform.addChain(ROGUE);
    window.Platforms.push(komodoPlatform);
    komodoPlatform.drawTotalTps();


    let bitcoin = new Blockchain({id: 'btc', name: 'BTC Chain', color: '#eb8c18', blockTime: 10, 'premined': 0, maxTps: 10});
    var bitcoinPlatform = new Platform({y: 110, id:'bitcoin', name: ' ',color: '#eb8c18', chains: [bitcoin],height: 120, emitterTPS: 8, txWeight: 1});
    window.Platforms.push(bitcoinPlatform);


    komodoPlatform.activateAutoScalingChain();

}

window.initTour = function() {


    // init Timeline
    window.Timelines = new Timeline({
      width: window.STAGEWIDTH,
      height: window.STAGEHEIGHT,
      minuteWidth: window.MinuteWidth,
      minuteSeconds: window.MinuteSeconds,
      defaultTime: 7,
    });
    window.Timelines.hide();
    window.Cont_timeline.addChild(window.Timelines);


    // init Tour
    window.Tour = new Tour();
    // Intro chapter
    window.Tour.addChapter(Intro);
    // First chapter : SECURITY
    window.Tour.addChapter(Security);
    // Second chapter : SCALABILITY
    window.Tour.addChapter(Scalability);
    // Third chapter
    window.Tour.addChapter(Interoperability);

    // start the Tour
    window.Tour.start();

}

window.resetGlobals = function() {

  window.Blockchains = [];
  window.Platforms = [];
  window.Emitters = [];
  window.Particles = [];
  window.Mempools = [];
}

window.clearStage = function() {

  window.Cont_background.removeAllChildren();
  window.Cont_timeline.removeAllChildren();
  window.Cont_platform.removeAllChildren();
  window.Cont_blockchain.removeAllChildren();
  window.Cont_mempool.removeAllChildren();
  window.Cont_emitter.removeAllChildren();
  window.Cont_currenttime.removeAllChildren();

  window.Stage.removeAllEventListeners();
  createjs.Tween.removeAllTweens();
}


window.tick = function(e) {

  if(window.isActive === false) return;
	window.Stage.update(e);

  document.getElementById('fps').textContent = createjs.Ticker.getMeasuredFPS().toFixed(0);
}

window.onWindowActive = function(e) {
  if(window.Paused == true) window.pause();
}

window.onWindowPassive = function(e) {
  if(window.Paused == false) window.pause();
}

window.keyDownHandler = function(e)
{
  if(window.Env != 'test') return;

   switch(e.key)
   {
    case ' ':  window.pause(); break;
    case 's':  window.Timelines.start(); break;
    case 'w':  slowMo(0.5,1000); break;
    case 'z':  zoom(1.6,700); break;
    case 'a':  dezoom(700); break;
    case 'b':  window.addAssetChain(); break;
    case 'c':  window.addScalingChain(); break;
    case 'g':  window.showBanner(); break;
    case 'h':  window.hideBanner(); break;
    case '+':  window.increaseTps(); break;
    case '-':  window.decreaseTps(); break;
    default: console.log('Key "'+e.key+'" have no handler.');
   }
}

window.showBanner = function() {
  if(window.CurrentBanner) window.CurrentBanner.show();
}

window.hideBanner = function() {
  if(window.CurrentBanner) window.CurrentBanner.hide();
}

window.addAssetChain = function() {

	let platform = window.Platforms.find(p => p.params.id == 'kmd');
  let color = window.ColorAsset[Math.ceil(Math.random()*(window.ColorAsset.length-1))];
	let chain = new Blockchain({id: 'AS'+ platform.chains.length, name:"Asset Chain "+ platform.chains.length, color: color, type: 'AC', notarizeTo: 'kmd', premined: 0});
	platform.addAssetChain(chain);

  if(chain && chain.localToGlobal(0,0).y > STAGEHEIGHT - chain.params.blockHeight*2) {
    window.Timelines.scrollY(-chain.params.blockHeight*2);
  }

  return chain;

}

window.addScalingChain = function() {

	let platform = window.Platforms.find(p => p.params.id == 'kmd');
	let chain = platform.addScalingChain();

  if(chain && chain.localToGlobal(0,0).y > STAGEHEIGHT - chain.params.blockHeight*2) {
    window.Timelines.scrollY(-chain.params.blockHeight*2);
  }

  return chain;

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

window.increaseTps = function(n = 100) {

	let platform = window.Platforms.find(e => e.params.id == 'kmd');
	platform.emitter.params.tps = Math.ceil(platform.emitter.params.tps+n);
	setTimeout(function() { console.log(platform.emitter.params.name + ' - Tps: '+platform.emitter.params.tps+' tx/s total ('+platform.emitter.ms+' ms)') }, 500);

}
window.decreaseTps = function(n = 100) {

	let platform = window.Platforms.find(e => e.params.id == 'kmd');
	platform.emitter.params.tps = Math.ceil(platform.emitter.params.tps-n);
	setTimeout(function() { console.log(platform.emitter.params.name + ' - Tps: '+platform.emitter.params.tps+' tx/s total ('+platform.emitter.ms+' ms)') }, 500);
}

window.slowMo = function(scale,time) {

	if(window.SlowMotion === false) {
		SlowMotion = true;
		const tween = createjs.Tween.get(window).to({TimeScale: scale}, time);
		tween.addEventListener('change', window.updateTimeScale);
	}
	else {
		window.SlowMotion = false;
		const tween = createjs.Tween.get(window).to({TimeScale: 1}, time);
		tween.addEventListener('change', window.updateTimeScale);

	}
}
window.updateTimeScale = function() {

	window.Tweens.setTimeScale(window.TimeScale);
}

window.zoom = function(scale, time = 2000) {

		if(window.ZoomScale !==1) return window.dezoom();

    window.Cont_main.regX = STAGEWIDTH/2;
    window.Cont_main.regY = STAGEHEIGHT/2;
    window.Cont_main.x = STAGEWIDTH/2;
    window.Cont_main.y = STAGEHEIGHT/2;
    const tw = createjs.Tween.get(window, {override: true}).to({ZoomScale: scale}, time);
    tw.addEventListener('change', window.updateZoom);
}

window.updateZoom = function() {
	window.Cont_main.scaleX = window.Cont_main.scaleY = window.ZoomScale;
}

window.dezoom = function(time = 1000) {

	const tw = createjs.Tween.get(window, {override: true}).to({ZoomScale: 1}, time);
	tw.addEventListener('change', window.updateZoom);
}


window.pause = function() {
	if(window.Paused === 1) {
		window.Paused = 0;
		createjs.Ticker.paused = false;
    window.Platforms.map(p => p.start());
    console.log('PAUSE DESACTIVATED');
  }
  else {
    window.Paused = 1;
    createjs.Ticker.paused = true;
    window.Platforms.map(p => p.stop());
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

  if(window.debug) {
    console.log('Main.js: window.resizeCanvas()');
  }

	var containerWidth = window.CanvasContainer.offsetWidth;
	var containerHeight = window.CanvasContainer.offsetHeight;

  document.getElementById('canvas').style.width = containerWidth+'px';
  document.getElementById('canvas').style.height = containerHeight+'px';
  document.getElementById('backcanvas').style.width = containerWidth+'px';
	document.getElementById('backcanvas').style.height = containerHeight+'px';

  document.getElementById('canvas').width = containerWidth;
  document.getElementById('canvas').height = containerHeight;
  document.getElementById('backcanvas').width = containerWidth;
  document.getElementById('backcanvas').height = containerHeight;

  window.STAGEHEIGHT = containerHeight;
  window.STAGEWIDTH = containerWidth;

	//scroll to top
	window.setTimeout(function() { //browsers don't fire if there is not short delay
		window.scrollTo(0,1);
    }, 1);

	var event = new createjs.Event('canvas_resized');
	event.originWidth = ORIGINWIDTH;
	event.originHeight = ORIGINHEIGHT;
	event.newWidth = containerWidth;
	event.newHeight = containerHeight;
	window.Stage.dispatchEvent(event);

}