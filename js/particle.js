class Particle extends createjs.Container {

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
    this.moveRandomly = false;
    this.maxForce = 4;
    this.maxSpeed = 50;
    this.alphaChange = 0;
    this.init(params);
    this.constrainByEdges = false;
    this.tickChildren = false;
    this.mouseEnabled = false;
    this.arrived = false;
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
      let img = new createjs.Bitmap(this.params.i);
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
      this.position.x.toFixed(4) === this.target.x.toFixed(4)
      && this.position.y.toFixed(4) === this.target.y.toFixed(4)
      )
    {
      this.arrived = true;
      return true;
    }
    this.arrived = false;
    return false;
  }

  move() {

    this.isArrived();

    this.behaviors();
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.acceleration.zero();
    if(TimeScale < 1) this.velocity.multiplyScalar(TimeScale/2);
    this.x = this.position.x.toFixed(4);
    this.y = this.position.y.toFixed(4);
    this.alpha += this.alphaChange;
  }

  behaviors() {

    if(this.moveRandomly) {
      this.applyForce(this.baseVelocity.multiplyScalar(this.baseSpeed));
    }
    else {
      let arrive = this.arrive(this.target);
      this.applyForce(arrive);
    }

    if(this.constrainByEdges) {
      this.applyBounces();
    }


    this.applyImpulsions();

    //this.linkParticles();
  }

  linkParticles() {

    for(let i=0,ln=Particles.length; i<ln; ++i) {
      let p = Particles[i];

      this.drawLink(this, p);

    }
  }

  drawLink(p1, p2) {

    let dx = p1.x - p2.x,
        dy = p1.y - p2.y,
        dist = Math.sqrt(dx*dx + dy*dy);

    if(dist < 10 && dist > 5) {

      var opacity = 1 - (dist / (1/1)) / 10;

      if(opacity > 0) {

        let line = new createjs.Shape();
        line.graphics.setStrokeStyle(1).beginStroke('grey').moveTo(p1.x, p1.y).lineTo(p2.x, p2.y);
        line.opacity = opacity;

        this.parent.addChild(line);
      }

    }
  }

  applyBounces() {

    if(this.position.x + this.params.w > STAGEWIDTH) this.velocity.invertX();
    else if(this.position.x - this.params.w < 0) this.velocity.invertX();
    if(this.position.y + this.params.w > STAGEHEIGHT) this.velocity.invertY();
    else if(this.position.y - this.params.w < 0) this.velocity.invertY();
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



}