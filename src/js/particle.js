import {extend, map} from './utils';
import Victor from './lib/victor';
import createjs from 'createjs';

export class Particle extends createjs.Container {

  constructor(params) {

    super();
    var defaults = {
      r: 0,
      g: 0,
      b: 0,
      a: 0,
      x: 0,
      y: 0,
      w: 2,
      i: null,
    };

    this.params = extend(defaults,params);
    this.position = new Victor(0,0);
    this.target = new Victor(0,0);
    this.acceleration = new Victor(0,0);
    this.velocity = new Victor(0,0);
    this.baseSpeed = 1;
    this.baseVelocity = new Victor(Math.random()-0.5, Math.random()-0.5);
    this.impulsions = [];
    this.maxForce = 1;
    this.maxSpeed = 50;
    this.alpha = 1;
    this.alphaChange = 0;
    this.init(params);
    this.tickChildren = false;
    this.mouseEnabled = false;
  }

  init(params) {

    this.setPosition(this.params.x, this.params.y);

    this.redraw();
  }

  redraw() {

    if(this.params.i === null) {
      let circle = new createjs.Shape();
      circle.graphics.beginFill('rgba('+this.params.r+','+this.params.g+','+this.params.b+','+this.params.a+')').drawCircle(this.params.x, this.params.y, this.params.w/2);
      circle.regX = this.params.w/2;
      circle.regY = this.params.w/2;
      this.addChild(circle);
    }
    else {
      let img = new createjs.Bitmap(this.params.i.cacheCanvas);
      this.addChild(img);
    }
  }

  cache() {
    this.cache(-this.params.w, -this.params.w, this.params.w*2, this.params.w*2);
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.position = new Victor(x, y);
  }

   setTarget(x,y) {
    this.moving = true;
    this.target = new Victor(x,y);
  }

  isArrived() {
    if(
      this.position.x.toFixed(1) === this.target.x.toFixed(1)
      && this.position.y.toFixed(1) === this.target.y.toFixed(1)
      )
    {
      return this.arrived = true;
    }

    if(this.alpha <= 0) {
      return true;
    }

    return this.arrived = false;
  }

  move() {

    this.behaviors();
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.acceleration.zero();
    this.x = this.position.x.toFixed(2);
    this.y = this.position.y.toFixed(2);
    this.alpha += this.alphaChange;
    return !this.isArrived();
  }

  behaviors() {

    let arrive = this.arrive(this.target);
    this.applyForce(arrive);

    let flee = this.flee(window.Mouse);
    flee.multiplyScalar(5);
    this.applyForce(flee);

    this.applyImpulsions();
    //this.linkParticles();
  }

  applyForce(f) {

    this.acceleration.add(f);
  }

  arrive(target) {

    let desired = target.clone();
    desired.subtract(this.position);
    let mag = desired.magnitude();
    let speed = this.maxSpeed;
    if( mag < 100) {
        speed = map(mag, 0, 100, 0, this.maxSpeed);

    }
    desired.norm().multiplyScalar(speed);
    var steer = desired.clone();
    steer.subtract(this.velocity);
    //steer.limit(this.maxForce, this.maxSpeed);
    return steer;
  }

  flee(target) {

    var desired = target.clone();
    desired.subtract(this.position);
    var mag = desired.magnitude();
    if(mag < 50) {
        desired.multiplyScalar(-1);
        desired.norm().multiplyScalar(this.maxSpeed/10);
        var steer = desired.clone();
        //steer.subtract(this.velocity);
        //steer.limit(this.maxforce, this.maxforce);
        return steer;
    } else {
        return new Victor(0,0);
    }
  }

  addImpulsion(x, y, desc = 0.1) {
    this.impulsions.push([new Victor(x,y), desc]);
  }

  applyImpulsions() {
    if(this.impulsions.length > 0) {
      for(let i=0,ln=this.impulsions.length; i<ln; i++) {
        let f = this.impulsions[i][0];
        this.applyForce(f);
        this.impulsions[i][0].multiplyScalar(this.impulsions[i][1]);
      }
    }
  }

  /**
  addSinusoid(tic, ampl, axe = 'y', splope = 'down') {
    let dist = this.position.clone().subtract(this.target).length();
    this.sinusoid[axe] = Math.sin(tic) * (0.1 * dist);

  }
  */

}