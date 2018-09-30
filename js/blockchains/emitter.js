(function() {


// create new class
function Emitter(params) {

  this.Container_constructor();

  var defaults = {
    size: 50,
    color: '#000',
    blockchains: [],
    tps: 1,
  };

  this.params = extend(defaults,params);
  this.init(params);
}

//extend it
var prototype = createjs.extend(Emitter, createjs.Container);

//add EventDispatcher
createjs.EventDispatcher.initialize(prototype);


//public methods
prototype.init = function(params) {

  let hole = new createjs.Shape();
  hole.graphics.beginLinearGradientFill([this.params.color,"#FFF"], [0, 1], 0, 0, 0, 120).drawCircle(0,0, this.params.size);
  hole.rotation = 90;
  hole.alpha = 0.2;
  this.addChild(hole);
  this.cache(-this.params.size,-this.params.size, this.params.size*2, this.params.size*2);

}

prototype.start = function() {

  this.emit();
}

prototype.blockchainToEmit = function() {

  let i = Math.ceil(Math.random()*this.params.blockchains.length-1);
  return this.params.blockchains[i];
}

prototype.emit = function() {

  let blockchain = this.blockchainToEmit();
  let pos = this.localToLocal(0,0, blockchain.mempool);
  let x = pos.x;
  let y = pos.y + (Math.random()*this.params.size*2 - this.params.size);
  let trans;

  if(blockchain.params.type == 'AC' && blockchain.params.ccc.length > 0) {
      let ccc = blockchain.mempool.getRandomContract();
      trans = new Transaction({ blockchain: blockchain, mempool: blockchain.mempool, type: 'ccc' , ccc: ccc });
      trans.setPosition(x,y);
      blockchain.mempool.addContractTransaction(trans);
      blockchain.mempool.appendTransaction(trans);
      trans.setTarget(ccc.x, ccc.y);
      trans.setCallback(proxy(trans.arrivedAtContract, trans));
  }
  else {
      trans = new Transaction({ blockchain: blockchain, mempool: blockchain.mempool });
      trans.setPosition(x,y);
      blockchain.mempool.appendTransaction(trans);
      let target = blockchain.mempool.addTransaction(trans);
      trans.setTarget(target.x, target.y);
      trans.setCallback(proxy(trans.validate, trans));
  }



  let tw = createjs.Tween.get(this, {override: true, timeScale: TimeScale}).to({}, 1000/this.params.tps).call(this.emit);
  Tweens.add(tw);
}

prototype.addChain = function(chain) {

  chain.emitter = this;
  this.params.blockchains.push(chain);
}

//<-- end methods


//assign Block to window's scope & promote overriden container's methods from Wave object, allow them to be call by 'Container_methodName()'
window.Emitter = createjs.promote(Emitter,'Container');

}());