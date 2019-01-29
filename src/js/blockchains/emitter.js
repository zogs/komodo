import {extend, proxy} from '../utils';
import {Transaction} from './transaction';
import createjs from 'createjs';

export class Emitter extends createjs.Container {

  constructor(params) {

    super();
    var defaults = {
      width: 70,
      height: null,
      color: '#000',
      blockchains: [],
      tps: 2,
      txWeight: 1,
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
    this.continuousEmit();
  }

  stop() {
    createjs.Tween.removeTweens(this);
  }

  continuousEmit() {

    // emit timer
    let ms = this.continuousTime();

    // emit amount
    let nb = 1;

    // grow emit amount if ms timer is too short
    if(ms < 100) {
      ms = 100;
      let diff = (this.params.tps - 200 ) / 200;
      nb = Math.floor(diff);
      if(nb < 1) nb = 1;
    }

    // emit
    for(let i=1; i<=nb; i++) {
      this.emit();
    }

    this.ms = ms;
    let tw = createjs.Tween.get(this, {override: true, timeScale: window.TimeScale}).to({}, ms).call(this.continuousEmit);
    window.Tweens.add(tw);
  }

  continuousTime() {

    let nbt = this.params.txWeight;
    let tps = this.params.tps / nbt;
    let msb = this.params.blockchains[0].params.blockTime * MinuteSeconds * 1000;
    let ms = msb / tps;

    //console.log(this.params.tps, ms);

    return ms;
  }

  blockchainToEmit() {

    let i = Math.ceil(Math.random()*this.params.blockchains.length-1);
    let chain = this.params.blockchains[i];
    if(chain.params.active === false) return this.blockchainToEmit();
    return chain;
  }

  emit() {

    let blockchain = this.blockchainToEmit();
    let mempool = blockchain.mempool;
    let ccc;
    let type;
    let shape;


    if(blockchain.params.type == 'AC' && blockchain.params.ccc.length > 0) {
      type = 'ccc';
      ccc = mempool.getRandomContract();
    }
    if(blockchain.params.type == 'SC') {
      let kmd = this.params.blockchains.find(b => b.params.id == 'kmd');
      mempool = kmd.mempool;
    }
    if(blockchain.params.privacy === 1) shape = 'z';
    if(blockchain.params.privacy === 0) shape = null;
    if(blockchain.params.privacy === null) shape = (Math.random() < blockchain.params.zRatio)? 'z' : null;

    let trans = new Transaction({ blockchain: blockchain, mempool: mempool, type: type, shape: shape, ccc: ccc });

    if(blockchain.params.visible === true) {
      this.emitWithMotion(trans, blockchain);
    }
    else {
      this.emitOnMempool(trans, blockchain);
    }
  }

  //emit transaction with motion toward mempool
  emitWithMotion(trans, blockchain) {

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

  //print transaction directlt in mempool position
  emitOnMempool(trans, blockchain) {

    blockchain.mempool.appendTransaction(trans);
    let pos = blockchain.mempool.addTransaction(trans);
    trans.setPosition(pos.x, pos.y);
    blockchain.mempool.arrivalAtMempool(trans);
  }

  setChains(chains) {

    this.params.blockchains = chains;
  }

}