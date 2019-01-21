// create new class
class Transaction extends createjs.Container {

  constructor(params) {
    super();
    var defaults = {
      radius: 4,
      alpha: 1,
      valid: false,
      type: null,
      shape: null,
      priority: 0,
      image: null,
      imageX: 0,
      imageY: 0,
      notaryTo: null,
      ccc : null,
    };

    this.params = extend(defaults,params);
    this.posX = 0;
    this.posY = 0;
    this.callback = null;
    this.target = null;
    this.position = null;
    this.velocity = new Victor(0,0);
    this.acceleration = new Victor(0,0);
    this.maxSpeed = 40;
    this.maxForce = 4;
    this.moving = false;
    this.impulsions = [];
    this.appearance = (this.params.shape)? this.params.shape : this.params.type;

    this.init(params);
    this.tickChildren = false;
    this.mouseEnabled = false;

  }

  //public methods
  init(params) {

    this.drawTransaction();

  }

  setPosition(x,y) {

    this.x = x;
    this.y = y;
    this.position = new Victor(x,y);
  }

  setTarget(x,y) {

    this.moving = true;
    this.target = new Victor(x,y);
  }

  setCallback(c) {

    this.callback = c;
  }

  move( ) {

    if(this.moving === false) return;

    this.behaviors();
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.acceleration.zero();
    if(TimeScale < 1) this.velocity.multiplyScalar(TimeScale/2);

    this.x = this.position.x;
    this.y = this.position.y;

    if(this.position.distanceSq(this.target) < 0.01) {
      this.moving = false;
      if(this.callback !== null) {
        this.callback();
        this.callback = null;
      }
    }
  }

  behaviors() {

    let arrive = this.arrive(this.target);
    this.applyForce(arrive);

    this.applyImpulsions();
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


  addImpulsion(imp, desc) {
    this.impulsions.push([imp, desc]);
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

 drawTransaction() {

    let shape;

    if(this.appearance == null) {

      shape = Transaction.getNormalShape(this.params.blockchain, this.params.radius);
      shape.regX = this.params.radius/2+2;
      shape.regY = this.params.radius/2+2;
      this.addChild(shape);
    }

    if(this.appearance == 'notary') {

      shape = Transaction.getNotaryShape(this.params.blockchain, this.params.radius);
      shape.regX = this.params.radius*2;
      shape.regY = this.params.radius*2;
      this.addChild(shape);
    }

    if(this.appearance == 'ccc') {

      shape = Transaction.getCCShape(this.params.blockchain, this.params.radius);
      shape.regX = this.params.radius*3;
      shape.regY = this.params.radius/2 +2;
      this.addChild(shape);
    }

    if(this.appearance == 'z') {

      shape = Transaction.getZShape(this.params.blockchain, this.params.radius);
      shape.regX = this.params.radius*2+2;
      shape.regY = this.params.radius*2+2;
      this.addChild(shape);
    }

    if(this.params.image !== null) {

      this.image = this.params.image;
      this.image.x = this.params.imageX;
      this.image.y = this.params.imageY;
      this.image.regX = this.params.image.image.width/2;
      this.image.regY = this.params.image.image.height/2;
      this.image.rotation = 0;
      this.addChild(this.image);
    }

    this.shape = shape;
    this.alpha = this.params.alpha;

  }

  setColor(color, alpha = 1) {

    this.removeAllChildren();
    this.drawTransaction(color);
    this.alpha = alpha;
  }

  validate() {

    this.params.valid = true;
  }

  hide() {

    this.visible = false;
  }

  show() {

    this.visible = true;
  }

  static getNormalShape(blockchain, radius) {

    let name = blockchain.params.id;

    if(this.shapeCircle[name] !== undefined) {
      return this.shapeCircle[name].clone();
    }

    let shape = new createjs.Shape();
    shape.graphics.setStrokeStyle(0).beginFill(blockchain.params.color).drawCircle(0,0, radius);
    shape.cache(-radius, -radius, radius*2, radius*2);

    this.shapeCircle[name] = new createjs.Bitmap(shape.cacheCanvas);

    return this.shapeCircle[name].clone();

  }

  static getNotaryShape(blockchain, radius) {

    let name = blockchain.params.name;

    if(this.shapeNotary[name] !== undefined) {
      return this.shapeNotary[name].clone();
    }

    let shape = new createjs.Shape();
    shape.graphics.setStrokeStyle(2).beginStroke(blockchain.params.color).drawRect(-radius*2, -radius*2, radius*2, radius*2);
    shape.cache(-radius*3, -radius*3, radius*5, radius*5);
    shape.regY = 10;

    this.shapeNotary[name] = new createjs.Bitmap(shape.cacheCanvas);

    return this.shapeNotary[name].clone();

  }


  static getCCShape(blockchain, radius) {

    let name = blockchain.params.name;

    if(this.shapeContract[name] !== undefined) {
      return this.shapeContract[name].clone();
    }

    let shape = new createjs.Shape();
    shape.graphics.setStrokeStyle(1).beginStroke(blockchain.params.color).beginFill(blockchain.params.color)
            .moveTo(0, 0).lineTo(radius*2, 0).lineTo(radius, -radius*2).closePath();
    shape.cache(-radius*2, -radius*2, radius*4, radius*4);

    this.shapeContract[name] = new createjs.Bitmap(shape.cacheCanvas);

    return this.shapeContract[name].clone();

  }

  static getZShape(blockchain, radius) {

    if(this.shapeContract['z'] !== undefined) {
      return this.shapeContract['z'].clone();
    }

    radius += radius*1/5;

    let shape = new createjs.Shape();
    shape.graphics.setStrokeStyle(2).beginStroke(blockchain.params.color)
      .moveTo(-radius/2 - radius*1/5, -radius/2).lineTo(radius/2, -radius/2).lineTo(-radius/2, radius/2).lineTo(radius/2 + radius*1/5, radius/2);
    shape.cache(-radius*2, -radius*2, radius*4, radius*4);

    this.shapeContract['z'] = new createjs.Bitmap(shape.cacheCanvas);
    return this.shapeContract['z'].clone();

  }
}

// static properties
Transaction.shapeCircle = [];
Transaction.shapeNotary = [];
Transaction.shapeContract = [];