import {extend, proxy} from '../utils';
import {Transaction} from './transaction';
import {Dialog, Button, Text, Link, Image} from '../dialog';
import Victor from '../lib/victor';
import createjs from 'createjs';

export class CContract extends createjs.Container {

  constructor(params) {

    super();
    var defaults = {
      name: 'default',
      icon: 'cog',
      mempool: null
    };
    this.params = extend(defaults,params);
    this.init();
  }

  init() {

    this.redraw();
  }

  redraw() {

    this.removeAllChildren();
    this.icon = new createjs.Bitmap(window.Queue.getResult('icon_'+this.params.icon));
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

export class DiceCC extends CContract {

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
    let komodo = window.Blockchains.find(b => b.params.id == 'kmd');
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

export class RogueCC extends CContract {

  constructor(params) {
    super();
    var defaults = {
      name: 'rogue',
      icon: 'rogue',
    }
    this.params = extend(defaults, params);
    this.init();

    this.warriors = new createjs.SpriteSheet({
        images: [window.Queue.getResult('sprite_warriors')],
        frames: {width:50, height:50},
    });

  }

  getRandomWarrior() {

    return this.getWarrior(Math.floor(Math.random()* this.warriors.getNumFrames()));
  }

  getWarrior(n) {

    return new createjs.Bitmap(createjs.SpriteSheetUtils.extractFrame(this.warriors, n));
  }

  getWarriorWidth() {
    return this.warriors.getFrameBounds(0).width;
  }

  getWarriorHeight() {
    return this.warriors.getFrameBounds(0).height;
  }

  createGame() {

    // "New game" popup
    let popup = new Dialog([new Text('New game', 'bold 14px Arial', { textAlign: 'center', paddingTop:5, paddingBottom:5})],[],{ x:0, y:10, radius: 15, borderWidth:1, borderColor: '#AFAFAF', paddings: [10,15,10,15], arrowFrom: 'bottom', arrow: {x: 0, y: 36}});
    // broacast "start" transaction
    let trans = new Transaction({'blockchain': this.params.mempool.params.blockchain, 'mempool': this.params.mempool, type:'ccc', ccc: this.params.mempool.getContract('rogue'), popup: popup});

    let platform = window.Platforms.find(p => p.params.id == 'kmd');
    platform.emitter.emitWithMotion(trans, this.params.mempool.params.blockchain);
  }

  saveWarrior(n, level) {

    // Character popup
    let popup = new Dialog([
        new Text('Saved !', 'bold 14px Arial', { color:"#33AA22", textAlign: 'center', paddingTop:5, paddingBottom:5}),
        new Image(this.getWarrior(n), {align: 'center', width: this.getWarriorWidth(), height: this.getWarriorHeight()}),
        new Text('Level '+level, '14px Arial', { textAlign: 'center', paddingTop:5, paddingBottom:5}),
        ],
        [],
        { x:0, y:0, radius: 15, borderWidth:1, borderColor: '#AFAFAF', paddings: [10,15,10,15], arrowFrom: 'bottom', arrow: {x: 0, y: 85}});
    let trans = new Transaction({'blockchain': this.params.mempool.params.blockchain, 'mempool': this.params.mempool, type:'ccc', ccc: this.params.mempool.getContract('rogue'), popup: popup});
    let platform = window.Platforms.find(p => p.params.id == 'kmd');
    platform.emitter.emitWithMotion(trans, this.params.mempool.params.blockchain);
  }

  buyWarrior(n, level) {

    // Character popup
    let popup = new Dialog([
        new Text('Buy !', 'bold 14px Arial', { color:"#33AA22", textAlign: 'center', paddingTop:5, paddingBottom:5}),
        new Image(this.getWarrior(n), {align: 'center', width: this.getWarriorWidth(), height: this.getWarriorHeight()}),
        new Text('Level '+level, '14px Arial', { textAlign: 'center', paddingTop:5, paddingBottom:5}),
        ],
        [],
        { x:0, y:0, radius: 15, borderWidth:1, borderColor: '#AFAFAF', paddings: [10,15,10,15], arrowFrom: 'bottom', arrow: {x: 0, y: 85}});
    let trans = new Transaction({'blockchain': this.params.mempool.params.blockchain, 'mempool': this.params.mempool, type:'ccc', ccc: this.params.mempool.getContract('rogue'), popup: popup});
    let platform = window.Platforms.find(p => p.params.id == 'kmd');
    platform.emitter.emitWithMotion(trans, this.params.mempool.params.blockchain);
  }

  sellWarrior(n, level) {

    // Character popup
    let popup = new Dialog([
        new Text('Sold !', 'bold 14px Arial', { color: '#991111', textAlign: 'center', paddingTop:5, paddingBottom:5}),
        new Image(this.getWarrior(0), {align: 'center', width: this.getWarriorWidth(), height: this.getWarriorHeight()}),
        new Text('Level 5', '14px Arial', { textAlign: 'center', paddingTop:5, paddingBottom:5}),
        ],
        [],
        { x:0, y:0, radius: 15, borderWidth:1, borderColor: '#AFAFAF', paddings: [10,15,10,15], arrowFrom: 'bottom', arrow: {x: 0, y: 85}});
    let trans = new Transaction({'blockchain': this.params.mempool.params.blockchain, 'mempool': this.params.mempool, type:'ccc', ccc: this.params.mempool.getContract('rogue'), popup: popup});
    let platform = window.Platforms.find(p => p.params.id == 'kmd');
    platform.emitter.emitWithMotion(trans, this.params.mempool.params.blockchain);
  }
}
