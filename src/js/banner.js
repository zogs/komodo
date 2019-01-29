import {deepExtend, proxy, colorDiff, rgb2hex} from './utils';
import {Particle} from './particle';
import createjs from 'createjs';

export class Banner extends createjs.Container {

  constructor(params) {

    super();
    var defaults = {
      points : null,
      width: null,
      height: null,
      subtitle: {
        text: '',
        font: 'bold 30px Arial',
        color: '#606060',
        x: 0, y:0,
        alpha: 0.8,
      }
    };

    this.params = deepExtend(defaults,params);
    this.points = [];
    this.cols = [];
    this.colors = [];
    this.colorTreshhold = 50;
    this.circles = [];
    this.particles = [];
    this.tictac = 0;
    this.in_place = false;
    this.particleTickListener = null;

    this.particle_cont = new createjs.Container();
    this.subtitle_cont = new createjs.Container();
    this.addChild(this.particle_cont, this.subtitle_cont);

    window.StageGL.addChild(this);
    this.init();

  }

  init(params) {

    this.initPoints();
    this.initSubtitle();

    // if the window lose focus, just stop the anim
    window.addEventListener('blur', proxy(this.onWindowPassive, this));
    window.addEventListener('focus', proxy(this.onWindowActive, this));

  }

  initSubtitle() {

    if(this.params.subtitle.text !== '') {

      let text = new createjs.Text(this.params.subtitle.text, this.params.subtitle.font, this.params.subtitle.color);
      text.x = this.params.subtitle.x;
      text.y = this.params.subtitle.y;
      text.cache(0,0,text.getMeasuredWidth(),text.getMeasuredHeight());
      text.alpha = this.params.subtitle.alpha;
      this.subtitle_cont.addChild(text);
      this.subtitle_cont.alpha = 0;
    }
  }

  initPoints() {

    for(let i=0, ln= this.params.points.length; i<ln; ++i) {

        let point = this.params.points[i];

        this.points.push(point);

        if(this.cols[point.x] === undefined) {
          this.cols[point.x] = [point];
        }
        else {
          this.cols[point.x].push(point);
        }

        let rgba = 'rgba('+point.r+','+point.g+','+point.b+','+point.a+')';
        let hex = rgb2hex(rgba);
        let circle = new createjs.Shape();
        circle.graphics.beginFill('rgba('+point.r+','+point.g+','+point.b+','+point.a+')').drawCircle(0, 0, point.w/2);
        circle.cache(-point.w,-point.w,point.w*2,point.w*2);
        let color = {
          r: point.r,
          g: point.g,
          b: point.b,
          a: point.a,
          rgba: rgba,
          hex: hex,
          shape: circle
        }

        if(this.colors.length == 0) {
          this.colors.push(color);
        }
        else {
          let found = false;
          for(let i=0,ln=this.colors.length; i<ln; i++) {
            let diff = colorDiff(color, this.colors[i]);
            if(diff <= this.colorTreshhold) {
              color = this.colors[i];
              found = true;
              break;
            }
          }
          if(found === false) this.colors.push(color);
        }

        point.color = color;
    }

    if(window.debug) {
      console.log("Banner: init() with "+(this.points.length-1)+" points and "+(this.colors.length-1)+" colors");
    }

  }

  show() {

    this.particles = [];
    this.particle_cont.removeAllChildren();

    for(let i=0, ln=this.points.length; i<ln; ++i) {

      let point = this.points[i];

      let particle = new Particle({
          r: point.r,
          g: point.g,
          b: point.b,
          a: point.a,
          w: point.w,
          i: point.color.shape
          });

      // initial position
      let x = this.params.width - point.x + window.STAGEWIDTH;
      let y = point.y + window.STAGEHEIGHT/4 + (window.STAGEHEIGHT - Math.random()*window.STAGEHEIGHT*2);
      particle.setPosition(x, y);

      // target position
      x = point.x + window.STAGEWIDTH/4;
      y = point.y + window.STAGEHEIGHT/4;
      particle.setTarget(x, y);

      // random impulsion
      let impl = 100;
      x = impl - Math.random()*(impl*2);
      y = impl - Math.random()*(impl*2);
      particle.addImpulsion(x, y, 0.1);

      point.particle = particle;
      this.particle_cont.addChild(particle);
      this.particles.push(particle);
    }


    // enable tick event
    this.tictac = 0;
    this.autoUpdate = true;
    this.particleTickListener = window.Stage.on("tick", this.moveParticles, this);
    // when animation is finished, show subtitle
    window.StageGL.on('banner_in_place', this.showSubtitle, this, true);

  }

  showEnded() {
  }

  showSubtitle() {
    createjs.Tween.get(this.subtitle_cont).to({ alpha: 1 }, 500)
      .wait(500)
      .call(proxy(this.showEnded, this));
  }

  hideSubtitle() {
    createjs.Tween.get(this.subtitle_cont).to({ alpha: 0}, 500);
  }

  hide() {

    let spread = 1000;

    for(let i=0, ln=this.particles.length; i<ln; ++i) {

        let particle = this.particles[i];
        let x = particle.position.x + (spread - Math.random()*spread*2);
        let y = particle.position.y + (spread - Math.random()*spread*2);

        particle.maxSpeed = 15;
        particle.setTarget(x, y);
        particle.alphaChange = - Math.random()*0.1 - 0.015;
    }

    // hide subtitle
    this.hideSubtitle();

    // enable tick event
    this.tictac = 0;
    this.autoUpdate = true;
    this.particleTickListener = window.Stage.on("tick", this.moveParticles, this);
    // when animation is finished, remove tick event and empty Particles
    window.StageGL.on('banner_in_place', this.hideEnded, this, true);

  }

  hideEnded() {
    this.particles = [];
    window.Stage.off('tick', this.particleTickListener);
    this.particleTickListener = null;
    this.autoUpdate = false;
    this.disabled = true;
    window.StageGL.dispatchEvent('banner_terminated');
  }


  moveParticles(e) {
    if(this.disabled) return;

    let particle, moving, i = 0, arrived = 0, ln = this.particles.length;
    for(i=0; i<ln; ++i) {
      particle = this.particles[i];
      moving = particle.move();
      if(moving === false) ++arrived;
    }

    if(this.particles.length !== 0 && arrived === this.particles.length) {
      if(this.in_place === false) {
        window.StageGL.dispatchEvent('banner_in_place');
        this.in_place = true;
      }
    }
    else {
      this.in_place = false;
    }

    window.StageGL.update(e);
  }

  onWindowActive() {
    this.particleTickListener = window.Stage.on("tick", this.moveParticles, this);
  }

  onWindowPassive() {
    if(this.particleTickListener) window.Stage.off('tick', this.particleTickListener);
  }


  destroy() {

    this.subtitle_cont.removeAllChildren();
    this.particle_cont.removeAllChildren();
    this.removeAllChildren();
    window.StageGL.removeAllChildren();
    this.particles = null;
    this.points = null;
    this.cols = null;
  }

}