class Emitter extends createjs.Container {

  constructor(params) {

    super();
    var defaults = {
      width: 70,
      height: null,
      color: '#000',
      blockchains: [],
      tps: 2,
    };

    this.params = extend(defaults,params);
    this.init(params);

  }

  init(params) {

    this.redraw();
  }

  redraw() {

    this.removeAllChildren();
    let height = this.params.height || this.params.blockchains.reduce((a,b) => a + b.params.height, 0);
    height -= this.params.blockchains[0].params.height/2;
    this.height = height;
    let hole = new createjs.Shape();
    hole.graphics.beginLinearGradientFill([this.params.color,"rgba(255,255,255,0)"], [0, 1], this.params.width, 0, 0, 0).drawRect(0,0, this.params.width, height);
    hole.alpha = 0.5;
    hole.x = -this.params.width;
    hole.y -= this.params.blockchains[0].params.height/4;
    //this.addChild(hole);
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
    let trans;

    if(blockchain.params.type == 'AC' && blockchain.params.ccc.length > 0) {
        let ccc = blockchain.mempool.getRandomContract();
        trans = new Transaction({ blockchain: blockchain, mempool: blockchain.mempool, type: 'ccc' , ccc: ccc });
    }
    else {
        trans = new Transaction({ blockchain: blockchain, mempool: blockchain.mempool });
    }

    this.emitTransaction(trans, blockchain);

    let ctps = this.params.tps;
    let ctpm = ctps*60;
    let nbtrans = blockchain.params.maxTps * blockchain.params.blockTime * 60 / 10; //10 transcircle per block
    let tpm = ctpm / nbtrans;
    let tps = tpm/60*nbtrans;
    let ms = (MinuteSeconds*1000)/tpm;

    let tw = createjs.Tween.get(this, {override: true, timeScale: TimeScale}).to({}, ms).call(this.emit);
    Tweens.add(tw);
  }

  emitTransaction(trans, blockchain) {

    let pos = this.localToLocal(0,this.height/2, blockchain.mempool);
    let x = pos.x;
    let y = blockchain.mempool.y + ( 25 - Math.random()*50);
    trans.setPosition(x,y);

    if(trans.params.type === 'ccc') {

      blockchain.mempool.addContractTransaction(trans);
      blockchain.mempool.appendTransaction(trans);
      trans.setTarget(trans.params.ccc.x, trans.params.ccc.y);
      trans.setCallback(proxy(blockchain.mempool.arrivalAtContract, blockchain.mempool, [trans]));

    }
    else {

      blockchain.mempool.appendTransaction(trans);
      let target = blockchain.mempool.addTransaction(trans);
      trans.setTarget(target.x, target.y);
      trans.setCallback(proxy(blockchain.mempool.arrivalAtMempool, blockchain.mempool, [trans]));

    }
  }

  setChains(chains) {

    this.params.blockchains = chains;
  }

}