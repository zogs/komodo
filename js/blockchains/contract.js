class CContract extends createjs.Container {

  constructor(params) {

    super();
    var defaults = {
      name: 'default',
      icon: 'cog',
    };
    this.params = extend(defaults,params);
    this.init();
  }

  init() {

    this.redraw();
  }

  redraw() {

    this.removeAllChildren();
    this.icon = new createjs.Bitmap(queue.getResult('icon_'+this.params.icon));
    this.icon.regX = this.icon.image.width/2;
    this.icon.regY = this.icon.image.height/2;
    this.addChild(this.icon);

  }

  handleTransaction(trans, mempool) {

    mempool.removeContractTransaction(trans);

    let target = mempool.addTransaction(trans);
    trans.setTarget(target.x, target.y);
    setTimeout(function() {trans.setCallback(proxy(mempool.arrivalAtMempool, mempool, [trans]))},1); //wow... here we have to call setTimeout because we cant change setCallback() inside an execution of callback()
  }
}

class Dice extends CContract {

  constructor(params) {
    super();
    var defaults = {
      name: 'dice',
      icon: 'dice',
    }
    this.params = extend(defaults, params);
    this.init();
  }

  handleTransaction(trans, mempool) {

    mempool.removeContractTransaction(trans);
    let target = mempool.addTransaction(trans);
    trans.setTarget(target.x, target.y);
    setTimeout(function() {trans.setCallback(trans.validate)},1);

    //send new KMD trans
    let komodo = Blockchains.find(b => b.params.id == 'kmd');
    let kmd = new Transaction({blockchain: komodo, mempool: komodo.mempool });

    let pos = mempool.localToLocal(trans.x, trans.y, komodo.mempool)
    kmd.setPosition(pos.x, pos.y);

    let targ = komodo.mempool.addTransaction(kmd);
    kmd.setTarget(targ.x, targ.y);

    komodo.mempool.appendTransaction(kmd);

    kmd.setCallback(kmd.validate);
    kmd.addImpulsion(new Victor(120, 0), 0.5);
  }
}

