// create new class
class Transaction extends createjs.Container {

  constructor(params) {
    super();
    var defaults = {
      radius: 4,
      alpha: 1,
      valid: false,
      type: null,
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

  setTarget(x,y,c) {

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


  arrivedAtContract() {

    let mempool = this.params.blockchain.mempool;
    mempool.removeContractTransaction(this);

    let target = mempool.addTransaction(this);
    this.setTarget(target.x, target.y);
    let trans = this;
    setTimeout(function() {trans.setCallback(trans.validate)},1); //wow... here we have to call setTimeout because we cant change setCallback() inside an execution of callback()

    let tw = createjs.Tween.get(this.params.ccc, {override: true, timeScale: TimeScale}).to({ rotation: 360}, 500).set({rotation: 0});
    Tweens.add(tw);
  }

 drawTransaction() {

    let shape;

    if(this.params.type == null) {

      shape = Transaction.getNormalShape(this.params.blockchain, this.params.radius);
      shape.regX = this.params.radius/2+2;
      shape.regY = this.params.radius/2+2;
      this.addChild(shape);
    }

    if(this.params.type == 'notary') {

      shape = Transaction.getNotaryShape(this.params.blockchain, this.params.radius);
      shape.regX = this.params.radius*2;
      shape.regY = this.params.radius*2;
      this.addChild(shape);
    }

    if(this.params.type == 'ccc') {

      shape = Transaction.getCCShape(this.params.blockchain, this.params.radius);
      shape.regX = this.params.radius*3;
      shape.regY = this.params.radius/2 +2;
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

    let name = blockchain.params.name;

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
}

// static properties
Transaction.shapeCircle = [];
Transaction.shapeNotary = [];
Transaction.shapeContract = [];