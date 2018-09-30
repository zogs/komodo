(function() {


// create new class
function Transaction(params) {

  this.Container_constructor();

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

//extend it
var prototype = createjs.extend(Transaction, createjs.Container);

//add EventDispatcher
createjs.EventDispatcher.initialize(prototype);


//public methods
prototype.init = function(params) {

  this.drawTransaction();

}

prototype.setPosition = function(x,y) {

  this.x = x;
  this.y = y;
  this.position = new Victor(x,y);
}

prototype.setTarget = function(x,y,c) {

  this.moving = true;
  this.target = new Victor(x,y);
}

prototype.setCallback = function(c) {

  this.callback = c;
}

prototype.move = function( ) {

  if(this.moving === false) return;

  this.behaviors();
  this.position.add(this.velocity);
  this.velocity.add(this.acceleration);
  this.acceleration.zero();
  this.velocity.multiplyScalar(TimeScale/2);

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

prototype.behaviors = function() {

  let arrive = this.arrive(this.target);
  this.applyForce(arrive);
}

prototype.applyForce = function(f) {

  this.acceleration.add(f);
}

prototype.arrive = function(target) {
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


prototype.arrivedAtContract = function() {

  let mempool = this.params.blockchain.mempool;
  mempool.removeContractTransaction(this);

  let target = mempool.addTransaction(this);
  this.setTarget(target.x, target.y);
  let trans = this;
  setTimeout(function() {trans.setCallback(trans.validate)},1); //wow... here we have to call setTimeout because we cant change setCallback() inside an execution of callback()

  let tw = createjs.Tween.get(this.params.ccc, {override: true, timeScale: TimeScale}).to({ rotation: 360}, 500).set({rotation: 0});
  Tweens.add(tw);
}

prototype.drawTransaction = function() {

  let shape;

  if(this.params.type == null) {

    shape = TransactionPool.get(this.params.blockchain);
    shape.regX = this.params.radius/2+2;
    shape.regY = this.params.radius/2+2;
    this.addChild(shape);
  }

  if(this.params.type == 'notary') {

    shape = TransactionPool.getNotary(this.params.blockchain);
    shape.regX = this.params.radius*2;
    shape.regY = this.params.radius*2;
    this.addChild(shape);
  }

  if(this.params.type == 'ccc') {

    shape = TransactionPool.getCC(this.params.blockchain);
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

prototype.setColor = function(color, alpha = 1) {

  this.removeAllChildren();
  this.drawTransaction(color);
  this.alpha = alpha;
}

prototype.validate = function() {

  this.params.valid = true;
}

prototype.hide = function() {

  this.visible = false;
}

prototype.show = function() {

  this.visible = true;
}

//<-- end methods


//assign Transaction to window's scope & promote overriden container's methods from Wave object, allow them to be call by 'Container_methodName()'
window.Transaction = createjs.promote(Transaction,'Container');

}());

(function() {


// create new class
function TransactionPool(params) {

  this.Container_constructor();

  var defaults = {
    radius: 4,
  };

  this.params = extend(defaults,params);
  this.circles = [];
  this.notarys = [];
  this.contracts = [];
}

TransactionPool.prototype.get = function(blockchain) {

  let name = blockchain.params.name;

  if(this.circles[name] !== undefined) {
    return this.circles[name].clone();
  }

  let circle = new createjs.Shape();
  circle.graphics.setStrokeStyle(0).beginFill(blockchain.params.color).drawCircle(0,0, this.params.radius);
  circle.cache(-this.params.radius, -this.params.radius, this.params.radius*2, this.params.radius*2);

  this.circles[name] = new createjs.Bitmap(circle.cacheCanvas);

  return this.circles[name].clone();

}

TransactionPool.prototype.getNotary = function(blockchain) {

  let name = blockchain.params.name;

  if(this.notarys[name] !== undefined) {
    return this.notarys[name].clone();
  }

  let notary = new createjs.Shape();
  notary.graphics.setStrokeStyle(2).beginStroke(blockchain.params.color).drawRect(-this.params.radius*2, -this.params.radius*2, this.params.radius*2, this.params.radius*2);
  notary.cache(-this.params.radius*3, -this.params.radius*3, this.params.radius*5, this.params.radius*5);
  notary.regY = 10;

  this.notarys[name] = new createjs.Bitmap(notary.cacheCanvas);

  return this.notarys[name].clone();

}


TransactionPool.prototype.getCC = function(blockchain) {

  let name = blockchain.params.name;

  if(this.contracts[name] !== undefined) {
    return this.contracts[name].clone();
  }

  let contract = new createjs.Shape();
  contract.graphics.setStrokeStyle(1).beginStroke(blockchain.params.color).beginFill(blockchain.params.color)
          .moveTo(0, 0).lineTo(this.params.radius*2, 0).lineTo(this.params.radius, -this.params.radius*2).closePath();
  contract.cache(-this.params.radius*2, -this.params.radius*2, this.params.radius*4, this.params.radius*4);

  this.contracts[name] = new createjs.Bitmap(contract.cacheCanvas);

  return this.contracts[name].clone();

}



//<-- end methods


//assign Transaction to window's scope & promote overriden container's methods from Wave object, allow them to be call by 'Container_methodName()'
window.TransactionPool = createjs.promote(TransactionPool,'Container');

}());