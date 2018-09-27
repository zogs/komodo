(function() {


// create new class
function Timeline(params) {

	this.Container_constructor();

	var defaults = {
		width: 1000,
		height: 1000,
		minuteWidth: 120,
		minuteSeconds: 2,
		minutePause: 500,
		paddingTop: 60,
		paddingBottom: 0,
		defaultTime: 5,
	};

	this.params = extend(defaults,params);
	this.currentBar = null;
	this.time = this.params.defaultTime;
	this.totalTime = 0;
	this.timeInterval = null;
	this.runing = false;

	this.init(params);
}

//extend it
var prototype = createjs.extend(Timeline, createjs.Container);

//add EventDispatcher
createjs.EventDispatcher.initialize(prototype);


//public methods
prototype.init = function(params) {

	this.drawObjects();
	this.initTimeline();
	this.initCurrentTime();

	Stage.on('newminute', function(event) {
		if(event.time >=5) {
			this.slide(- this.params.minuteWidth);
			this.addLine(this.totalTime+1);
		}
	}, this);
}

prototype.initTimeline = function() {

	let nb_columns = this.params.width / this.params.minuteWidth;
	for(let i=1,ln=nb_columns; i<ln; i++) {
		this.addLine(i);
	}
}

prototype.drawObjects = function() {

	let line = new createjs.Shape();
	line.graphics.setStrokeStyle(1).beginStroke('#DDD')
			.moveTo(0, this.params.height - this.params.paddingBottom)
			.lineTo(0, this.params.paddingTop)
			.closePath();
	line.cache(-1, -1, 2, this.params.height);
	this.lineImage = new createjs.Bitmap(line.cacheCanvas);

	let lineBold = new createjs.Shape();
	lineBold.graphics.setStrokeStyle(2).beginStroke('#AAA')
			.moveTo(0, this.params.height - this.params.paddingBottom)
			.lineTo(0, this.params.paddingTop)
			.closePath();
	lineBold.cache(-1, -1, 2, this.params.height);
	this.lineBoldImage = new createjs.Bitmap(lineBold.cacheCanvas);


}

prototype.addLine = function(i) {

	let line = this.lineImage.clone();
	if(i%10 == 0) line = this.lineBoldImage.clone();
	line.x = i*this.params.minuteWidth;
	this.addChild(line);

	let color = (i%10 == 0)? '#AAA' : '#DDD';
	let minute = new createjs.Text(i+' min','20px Arial', color);
		minute.x = i*this.params.minuteWidth - minute.getMeasuredWidth()/2;
		minute.y = this.params.paddingTop - 25;
	minute.cache(0, 0, minute.getMeasuredWidth(), minute.getMeasuredHeight());
	this.addChild(minute);

	this.totalTime = i;
}

prototype.initCurrentTime = function() {

	this.currentBar = new createjs.Shape();
	this.currentBar.graphics.setStrokeStyle(1).beginStroke('red')
		.moveTo(0, this.params.height - this.params.paddingBottom)
		.lineTo(0, 0 + this.params.paddingTop)
		.closePath();
	this.currentBar.cache(-1, -1, 2, this.params.height);

	this.currentBar.x = this.time * this.params.minuteWidth;
	Cont_main.addChild(this.currentBar);
}

prototype.start = function() {

	let tw = createjs.Tween.get(this, {loop: true, timeScale: TimeScale}).to({z: 0}, 1000 * this.params.minuteSeconds).call(this.incrementTime);
	Tweens.add(tw, false);

	let tw2 = createjs.Tween.get(this, { timeScale: TimeScale }).to({x: this.x - this.params.minuteWidth}, 1000 * this.params.minuteSeconds);
	Tweens.add(tw2);

	let tw3 = createjs.Tween.get(Cont_blockchain, { timeScale: TimeScale }).to({x: - this.params.minuteWidth}, 1000 * this.params.minuteSeconds);
	Tweens.add(tw3);

	Emitters.map(e => e.start());

}

prototype.incrementTime = function() {

	this.time += 1;
	var ev = new createjs.Event('newminute');
	ev.time = this.time;
	Stage.dispatchEvent(ev);

	let tw = createjs.Tween.get(Cont_blockchain, { timeScale: TimeScale }).to({x: Cont_blockchain.x - this.params.minuteWidth}, 1000 * this.params.minuteSeconds);
	Tweens.add(tw);

}

prototype.slide = function(x) {

	let tw = createjs.Tween.get(this, { timeScale: TimeScale }).to({x: this.x + x}, 1000 * this.params.minuteSeconds);
	Tweens.add(tw);
}




//<-- end methods


//assign Timeline to window's scope & promote overriden container's methods from Wave object, allow them to be call by 'Container_methodName()'
window.Timeline = createjs.promote(Timeline,'Container');

}());