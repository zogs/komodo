import {extend, proxy} from '../utils';
import createjs from 'createjs';

export class Timeline extends createjs.Container {

	constructor(params) {

		super();
		var defaults = {
			width: 1000,
			height: 1000,
			minuteWidth: 120,
			minuteSeconds: 2,
			minutePause: 500,
			paddingTop: 0,
			paddingBottom: 0,
			defaultTime: 5,
			backgroundColor: '#326463',
			color: '#53f1be',
		};

		this.params = extend(defaults,params);
		this.currentBar = null;
		this.time = this.params.defaultTime;
		this.totalTime = 0;
		this.timeInterval = null;
		this.runing = false;

		this.cont_background = new createjs.Container();
		this.cont_lines = new createjs.Container();
		this.cont_blockchains = new createjs.Container();
		this.cont_sliding = new createjs.Container();
		this.cont_foreground = new createjs.Container();
		this.cont_timesbar = new createjs.Container();
		this.cont_mempool = new createjs.Container();
		this.cont_links = new createjs.Container();

		this.cont_sliding.addChild(this.cont_lines, this.cont_blockchains);

		this.addChild(this.cont_background, this.cont_links, this.cont_sliding, this.cont_mempool, this.cont_foreground, this.cont_timesbar);




		this.init(params);
	}

	init(params) {

		this.drawLines();
		this.initTimeline();
		this.initCurrentTime();

		this.newMinuteListener = window.Stage.on('newminute', function(event) {
				this.addLine(this.totalTime+1);
				this.removeLines();

		}, this);

		let logo = new createjs.Bitmap(window.Queue.getResult('KMDdiscoverytour'));
		logo.regX = logo.image.width;
		logo.regY = 0;
		logo.x = window.DefaultWidth;
		logo.y = -20;
		this.cont_foreground.addChild(logo);

	}

	reset() {
		this.stop();
		this.clear();
		window.Stage.off('newminute', this.newMinuteListener);
		this.cont_sliding.x = 0;
		this.cont_timesbar.x = 0;
		this.cont_blockchains.y = 0;
		this.removeCurrentBar();
		this.cont_lines.removeAllChildren();
		this.cont_links.removeAllChildren();
		this.cont_mempool.removeAllChildren();
		this.time = this.params.defaultTime;
		this.totalTime = 0;
		window.Blockchains = [];
	  window.Platforms = [];
	  window.Emitters = [];
	  window.Particles = [];
	  window.Mempools = [];
		this.init();
	}

	initTimeline() {

		let nb_columns = window.DefaultWidth / (window.DefaultMinuteWidth)  + 2;
		for(let i=1,ln=nb_columns; i<ln; i++) {
			this.addLine(i);
		}
	}

	drawLines() {

		let line = new createjs.Shape();
		line.graphics.setStrokeStyle(0.5).beginStroke('#AAA')
				.moveTo(0, this.params.height*10 - this.params.paddingBottom)
				.lineTo(0, this.params.paddingTop)
		line.cache(-1, -1, 2, this.params.height*10);
		this.lineImage = new createjs.Bitmap(line.cacheCanvas);

		let lineBold = new createjs.Shape();
		lineBold.graphics.setStrokeStyle(0.5).beginStroke(this.params.color)
				.moveTo(0, this.params.height*10 - this.params.paddingBottom)
				.lineTo(0, this.params.paddingTop)
		lineBold.cache(-1, -1, 2, this.params.height*10);
		this.lineBoldImage = new createjs.Bitmap(lineBold.cacheCanvas);

	}

	addLine(i) {

		let line = this.lineImage.clone();
		if(i%10 == 0) line = this.lineBoldImage.clone();
		line.x = i*this.params.minuteWidth;
		line.y = 40;
		this.cont_lines.addChild(line);

		let bg = new createjs.Shape();
		bg.graphics.beginFill(this.params.backgroundColor).setStrokeStyle(0).drawRect(0,0,this.params.minuteWidth, 40);
		bg.x = (i-1)*this.params.minuteWidth;
		this.cont_timesbar.addChild(bg);

		let font = (i%10 == 0)? 'bold 12px Montserrat' : '12px Montserrat';
		let minute = new createjs.Text(i+' min', font, this.params.color);
			minute.x = i*this.params.minuteWidth - minute.getMeasuredWidth() - 2;
			minute.y = this.params.paddingTop + 15;
		minute.cache(0, 0, minute.getMeasuredWidth(), minute.getMeasuredHeight());
		this.cont_timesbar.addChild(minute);

		this.totalTime = i;
	}

	removeLines() {

		let ln = this.cont_lines.length-1;
		for(let i=0; i<=ln; i++) {
			let line = this.cont_lines[i];
			let pos = line.localToGlobal(0,0);
			if(pos.x < 100) {
				this.removeChild(line);
				this.lines.splice(i, 1);
			}
		}
		ln = this.cont_timesbar.length-1;
		for(let i=0; i<=ln; i++) {
			let obj = this.cont_timesbar[i];
			let pos = obj.localToGlobal(0,0);
			if(pos.x < 100) {
				this.removeChild(obj);
			}
		}
	}

	initCurrentTime() {

		this.currentBar = new createjs.Shape();
		this.currentBar.graphics.setStrokeStyle(1).beginStroke('#ff6c6c')
			.moveTo(0, this.params.height*10 - this.params.paddingBottom)
			.lineTo(0, 0 + this.params.paddingTop)
			.closePath();
		this.currentBar.cache(-1, -1, 2, this.params.height*10);

		this.currentBar.x = this.params.defaultTime * this.params.minuteWidth;
		window.Cont_currenttime.addChild(this.currentBar);
	}

	removeCurrentBar() {
		window.Cont_currenttime.removeAllChildren();
		this.currentBar = null;
	}

	start() {

		let tw = createjs.Tween.get(this.cont_sliding, { timeScale: window.TimeScale }).to({x: this.cont_sliding.x - this.params.minuteWidth}, 1000 * this.params.minuteSeconds)
							.call(proxy(this.incrementTime, this));
		window.Tweens.add(tw);
		this.slideTween = tw;

		let tw2 = createjs.Tween.get(this.cont_timesbar, { timeScale: window.TimeScale }).to({x: this.cont_timesbar.x - this.params.minuteWidth}, 1000 * this.params.minuteSeconds)
		window.Tweens.add(tw2);

		window.Emitters.map(e => e.start());
		window.Platforms.map(p => p.start());

		return this;
	}

	stop() {
		createjs.Tween.removeTweens(this.cont_sliding);
		createjs.Tween.removeTweens(this.cont_background);
		createjs.Tween.removeTweens(this.cont_foreground);
		createjs.Tween.removeTweens(this.cont_timesbar);
		createjs.Tween.removeTweens(this.currentBar);
		window.Emitters.map(e => e.stop());
		window.Platforms.map(p => p.stop());
		return this;
	}

	clear() {
		this.stop();
		this.cont_background.removeAllChildren();
		this.cont_blockchains.removeAllChildren();
		this.cont_foreground.removeAllChildren();
		this.cont_timesbar.removeAllChildren();
		return this;
	}

	incrementTime() {

		this.time += 1;
		var ev = new createjs.Event('newminute');
		ev.time = this.time;
		window.Stage.dispatchEvent(ev);

		let tw = createjs.Tween.get(this.cont_sliding, { timeScale: window.TimeScale }).to({x: this.cont_sliding.x - this.params.minuteWidth}, 1000 * this.params.minuteSeconds)
							.call(proxy(this.incrementTime, this));
		window.Tweens.add(tw);
		this.slideTween = tw;

		let tw2 = createjs.Tween.get(this.cont_timesbar, { timeScale: window.TimeScale }).to({x: this.cont_timesbar.x - this.params.minuteWidth}, 1000 * this.params.minuteSeconds)
		window.Tweens.add(tw2);

	}

	scrollY(y) {

		let time = 777;
		createjs.Tween.get(this.cont_blockchains).to({y: this.cont_blockchains.y + y}, time).call(proxy(this.scrollEnd, this));
		createjs.Tween.get(this.cont_mempool).to({y: this.cont_mempool.y + y}, time);
		createjs.Tween.get(this.cont_links).to({y: this.cont_links.y + y}, time);

		window.Platforms.map(p => {
			createjs.Tween.get(p.cont_background).to({y: p.cont_background.y + y}, time);
			createjs.Tween.get(p.cont_text).to({y: p.cont_background.y + y}, time);
		});

	}

	scrollEnd() {

		window.Platforms.map(p => p.chains.map(c => {
			let pos = c.localToGlobal(0,0);
      if(pos.y < 0 || pos.y > STAGEHEIGHT) c.params.visible = false;
		}));
	}

	hide() {
		this.alpha = 0;
		this.currentBar.alpha = 0;
		return this;
	}

	fadeIn(ms = 500) {
		createjs.Tween.get(this).to({alpha: 1}, ms);
		createjs.Tween.get(this.currentBar).to({alpha: 1}, ms);
		return this;
	}

	fadeOut(ms = 500) {
		createjs.Tween.get(this).to({alpha: 0}, ms);
		createjs.Tween.get(this.currentBar).to({alpha: 0}, ms);
		return this;
	}

}