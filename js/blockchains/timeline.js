class Timeline extends createjs.Container {

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
		};

		this.params = extend(defaults,params);
		this.currentBar = null;
		this.time = this.params.defaultTime;
		this.lines = [];
		this.totalTime = 0;
		this.timeInterval = null;
		this.runing = false;

		this.cont_background = new createjs.Container();
		this.cont_lines = new createjs.Container();
		this.cont_blockchains = new createjs.Container();
		this.cont_sliding = new createjs.Container();
		this.cont_foreground = new createjs.Container();

		this.cont_sliding.addChild(this.cont_lines, this.cont_blockchains);
		this.addChild(this.cont_background, this.cont_sliding, this.cont_foreground);

		this.init(params);
	}

	init(params) {

		this.drawLines();
		this.initTimeline();
		this.initCurrentTime();

		Stage.on('newminute', function(event) {
			if(event.time >=5) {
				this.addLine(this.totalTime+1);
				this.removeLines();
			}
		}, this);
	}

	initTimeline() {

		let nb_columns = this.params.width / this.params.minuteWidth + 1;
		for(let i=1,ln=nb_columns; i<ln; i++) {
			this.addLine(i);
		}
	}

	drawLines() {

		let line = new createjs.Shape();
		line.graphics.setStrokeStyle(1).beginStroke('#DDD')
				.moveTo(0, this.params.height - this.params.paddingBottom)
				.lineTo(0, this.params.paddingTop)
				.closePath();
		line.cache(-1, -1, 2, this.params.height);
		this.lineImage = new createjs.Bitmap(line.cacheCanvas);

		let lineBold = new createjs.Shape();
		lineBold.graphics.setStrokeStyle(1).beginStroke('#AAA')
				.moveTo(0, this.params.height - this.params.paddingBottom)
				.lineTo(0, this.params.paddingTop)
				.closePath();
		lineBold.cache(-1, -1, 2, this.params.height);
		this.lineBoldImage = new createjs.Bitmap(lineBold.cacheCanvas);


	}

	addLine(i) {

		let line = this.lineImage.clone();
		if(i%10 == 0) line = this.lineBoldImage.clone();
		line.x = i*this.params.minuteWidth;
		this.cont_lines.addChild(line);
		this.lines.push(line);

		let color = (i%10 == 0)? '#AAA' : '#DDD';
		let minute = new createjs.Text(i+' min','13px Arial', color);
			minute.x = i*this.params.minuteWidth - minute.getMeasuredWidth() - 2;
			minute.y = this.params.paddingTop + 5;
		minute.cache(0, 0, minute.getMeasuredWidth(), minute.getMeasuredHeight());
		this.cont_lines.addChild(minute);
		this.lines.push(minute);

		this.totalTime = i;
	}

	removeLines() {

		for(let i=0,ln=this.lines.length-3; i<=ln; i++) {
			let line = this.lines[i];
			let pos = line.localToGlobal(0,0);
			if(pos.x < 100) {
				this.removeChild(line);
				this.lines.splice(i, 1);
			}
		}
	}

	initCurrentTime() {

		this.currentBar = new createjs.Shape();
		this.currentBar.graphics.setStrokeStyle(1).beginStroke('#ff6c6c')
			.moveTo(0, this.params.height - this.params.paddingBottom)
			.lineTo(0, 0 + this.params.paddingTop)
			.closePath();
		this.currentBar.cache(-1, -1, 2, this.params.height);

		this.currentBar.x = this.time * this.params.minuteWidth;
		Cont_currenttime.addChild(this.currentBar);
	}

	start() {

		let tw = createjs.Tween.get(this.cont_sliding, { timeScale: TimeScale }).to({x: this.cont_sliding.x - this.params.minuteWidth}, 1000 * this.params.minuteSeconds)
							.call(proxy(this.incrementTime, this));
		Tweens.add(tw);

		Emitters.map(e => e.start());
		Platforms.map(p => p.start());

		Blockchains.map(function(chain) {


			chain.mempool.start();
			if(chain.mempool.momom_up) {
				let band = chain.mempool.momom_up.band;
				let tw = createjs.Tween.get(band, {loop: true, timeScale: TimeScale}).to({ y: - band.image.height * band.scaleY }, this.params.minuteSeconds/2*1000);
				Tweens.add(tw, false);
			}
			if(chain.mempool.momom_down) {
				let band = chain.mempool.momom_down.band;
				let tw = createjs.Tween.get(band, {loop: true, timeScale: TimeScale}).to({ y: - band.image.height * band.scaleY }, this.params.minuteSeconds/2*1000);
				Tweens.add(tw, false);
			}
		}, this);

	}

	incrementTime() {

		this.time += 1;
		var ev = new createjs.Event('newminute');
		ev.time = this.time;
		Stage.dispatchEvent(ev);

		let tw = createjs.Tween.get(this.cont_sliding, { timeScale: TimeScale }).to({x: this.cont_sliding.x - this.params.minuteWidth}, 1000 * this.params.minuteSeconds)
							.call(proxy(this.incrementTime, this));
		Tweens.add(tw);

	}

}