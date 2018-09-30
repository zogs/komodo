class Emitter extends createjs.Container {

  constructor(params) {

    super();
    var defaults = {
      size: 50,
      color: '#000',
      blockchains: [],
      tps: 2,
    };

    this.params = extend(defaults,params);
    this.init(params);

  }

  init(params) {

    let hole = new createjs.Shape();
    hole.graphics.beginLinearGradientFill([this.params.color,"#FFF"], [0, 1], 0, 0, 0, 120).drawCircle(0,0, this.params.size);
    hole.rotation = 90;
    hole.alpha = 0.2;
    this.addChild(hole);
    this.cache(-this.params.size,-this.params.size, this.params.size*2, this.params.size*2);

  }

  start() {

    this.emit();
  }

  blockchainToEmit() {

    let i = Math.ceil(Math.random()*this.params.blockchains.length-1);
    return this.params.blockchains[i];
  }

  emit() {

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

  addChain(chain) {

    chain.emitter = this;
    this.params.blockchains.push(chain);
  }

}