import {extend, proxy} from '../utils';
import {Blockchain} from './blockchain';
import {Emitter} from './emitter';
import createjs from 'createjs';

export class Platform extends createjs.Container {

  constructor(params) {
    super();
    var defaults = {
      y: 0,
      name: '',
      height: null,
      chainHeight: 100,
      color: null,
      backgroundColor: 'rgba(255,255,255,0.1)',
      backgroundAlpha: 1,
      emitterTPS: 1,
      txWeight: 20,
      chains : []
    }
    this.params = extend(defaults,params);
    this.chains = this.params.chains;
    this.cont_background = new createjs.Container();
    this.cont_blockchain = new createjs.Container();
    this.cont_foreground = new createjs.Container();
    this.cont_tpstext = new createjs.Container();
    this.cont_emitter = new createjs.Container();
    this.cont_text = new createjs.Container();

    this.cont_background.y = this.params.y;
    this.cont_blockchain.y = this.params.y;
    this.cont_foreground.y = this.params.y;
    this.cont_tpstext.y = this.params.y;
    this.cont_emitter.y = this.params.y;
    this.cont_text.y = this.params.y;

    window.Timelines.cont_background.addChild(this.cont_background);
    window.Timelines.cont_blockchains.addChild(this.cont_blockchain);
    window.Timelines.cont_foreground.addChild(this.cont_foreground);
    window.Timelines.cont_foreground.addChild(this.cont_tpstext);
    window.Timelines.cont_foreground.addChild(this.cont_text);
    window.Timelines.cont_foreground.addChild(this.cont_emitter);

    this.init();
  }

  init() {

    this.initEmitter();
    this.redraw();

  }

  initEmitter() {

    this.emitter = new Emitter({name: this.params.name, color: this.params.color, height: this.params.height, blockchains: this.params.chains, tps: this.params.emitterTPS, txWeight: this.params.txWeight});
    this.emitter.x = window.STAGEWIDTH;
    this.emitter.y = this.y;
    this.emitter.platform = this;
    this.emitter.setChains(this.chains);
    this.cont_emitter.addChild(this.emitter);
    window.Emitters.push(this.emitter);

  }

  redraw() {

    this.cont_background.removeAllChildren();
    this.cont_blockchain.removeAllChildren();
    this.cont_emitter.removeAllChildren();
    this.cont_text.removeAllChildren();

    // Main background
    if(this.params.backgroundColor) {
      this.drawBackground();
    }


    //Chains
    for(let i=0, ln=this.params.chains.length; i<ln; i++) {

      let chain = this.params.chains[i];
      let y = this.params.chainHeight * i;
      this.drawChain(chain, y);

    }

    // Foreground
    this.drawForeground();


    //Platform title
    if(this.params.name) {
      let title = new createjs.Text(this.params.name, "bold 18px Montserrat", '#FFF');
      title.x = 5;
      title.y = - this.params.chainHeight/2 - title.getMeasuredHeight() - 3;
      this.cont_text.addChild(title);
    }

    // Mempool text
    let text = new createjs.Text('MEMPOOL','bold 14px Montserrat', '#FFF');
    text.y = - this.params.chainHeight/2 + text.getMeasuredHeight()/2;
    text.x = this.params.chains[0].mempool.x - text.getMeasuredWidth()/2 + 10;
    this.cont_text.addChild(text);

    // Mempool frame
    let frame = new createjs.Shape();
    let bounds = text.getBounds();
    let pad = 10;
    frame.graphics.beginStroke(this.params.color).setStrokeStyle(1)
      .moveTo(text.x - pad, text.y + bounds.height)
      .lineTo(text.x - pad, text.y - pad/2)
      .lineTo(text.x + bounds.width + pad, text.y - pad/2)
      .lineTo(text.x + bounds.width + pad, text.y + bounds.height);
    this.cont_text.addChild(frame);

    //redraw emitter
    if(this.emitter) {
      this.drawEmitter();
    }

  }

  drawChain(chain, y) {

      chain.y = y;
      if(chain.params.type == 'SC' || chain.params.type == 'AC') chain.drawMoMoMMagic();
      this.cont_blockchain.addChild(chain);
      window.Blockchains.push(chain);

      let name = new createjs.Text(chain.params.name.toUpperCase(), 'bold 14px Montserrat', '#FFF');
      name.y = chain.y - chain.params.height/2 + 5;
      name.x = 20;
      this.cont_text.addChild(name);

      let frame = new createjs.Shape();
      let bounds = name.getBounds();
      let pad = 10;
      frame.graphics.beginStroke(this.params.color).setStrokeStyle(1)
        .moveTo(name.x - pad, name.y + bounds.height)
        .lineTo(name.x - pad, name.y - pad/2)
        .lineTo(name.x + bounds.width + pad, name.y - pad/2)
        .lineTo(name.x + bounds.width + pad, name.y + bounds.height);
      this.cont_text.addChild(frame);


  }

  start() {
    this.emitter.start();
    this.chains.map(c => c.start());
  }

  stop() {
    this.chains.map(c => c.stop());
  }

  activateAutoScalingChain() {

    window.Stage.on('newminute', proxy(this.checkTotalTps, this));
  }

  checkTotalTps() {

    if(this.totalTps) {
      let maxTps = this.chains.reduce((a,b) => a + b.params.maxTps, 0);

      if(this.totalTps >= maxTps) {
        //console.log('totalTps '+this.totalTps+' > '+maxTps);
        this.addScalingChain();
      }
    }
  }


  drawTotalTps() {

    let total = new createjs.Text('TOTAL','bold 16px Montserrat', '#FFF');
    total.x = window.STAGEWIDTH - 240;
    total.y = this.y - 10;
    this.cont_tpstext.addChild(total);

    let txs = new createjs.Text('tx/s', "bold 30px Montserrat", '#FFF');
    txs.x = window.STAGEWIDTH - 240;
    txs.y = this.y + 7;
    this.cont_tpstext.addChild(txs);


    this.totalTpsTx = new createjs.Text('100', "bold 60px Montserrat", '#FFF');
    this.totalTpsTx.x = window.STAGEWIDTH - 250;
    this.totalTpsTx.y = this.y - 20;
    this.totalTpsTx.textAlign = 'right';
    this.cont_tpstext.addChild(this.totalTpsTx);

    window.Stage.on('tick', proxy(this.updateTotalTps, this));
  }

  updateTotalTps() {

    if(window.Paused === true) return;

    let tps = this.chains.reduce((a,b) => a + b.tps, 0);
    this.totalTps = Math.floor(tps);
    if(this.totalTpsTx) this.totalTpsTx.text = Math.floor(tps);

  }

  drawBackground() {

    this.cont_background.removeAllChildren();
    let height = (this.params.height)? this.params.height : this.params.chainHeight * this.chains.length;
    let bkg = new createjs.Shape();
    bkg.graphics.beginLinearGradientFill([this.params.backgroundColor,"rgba(255,255,255,0)"], [0, 1], 0, 0, window.STAGEWIDTH-100, 0).drawRect(-5, 0, window.STAGEWIDTH + 10, height);
    bkg.y = this.y - this.params.chainHeight/2;
    this.cont_background.addChild(bkg);
  }

  drawForeground() {
    /*
    this.cont_foreground.removeAllChildren();
    let height = this.params.height || this.params.chainHeight * this.chains.length;
    let fore = new createjs.Shape();
    fore.graphics.beginLinearGradientFill(["rgba(255,255,255,0)","#FFF"], [0, 1], 100, 0, 0, 0).drawRect(0, 0, 200, height);
    fore.y = this.y - this.params.chainHeight/2;
    fore.alpha = 0.8;
    fore.cache(0, 0, 200, height);
    this.cont_foreground.addChild(fore);
    */
  }

  drawEmitter() {
    this.emitter.setChains(this.chains);
    this.emitter.redraw();
    this.emitter.y = this.y;
  }

  addChain(chain) {

    this.chains.push(chain);

    let y = (this.chains.length-1) * this.params.chainHeight;
    this.drawChain(chain, y);

    this.drawBackground();
    this.drawForeground();
    this.drawEmitter();

    return chain;
  }

  addScalingChain() {

    let n = this.chains.length;
    let prev = this.chains[this.chains.length-1];
    let bloc = prev.blocks[prev.blocks.length-2];

    if(bloc == undefined) return;

    let chain = new Blockchain({id: 'SC'+n, name: "Scaling Chain "+n, color:'#569b9b', type: 'SC', notarizeTo: 'kmd'});
    chain.x = prev.x + bloc.x + chain.params.blockWidth/2 + chain.params.blockPadding/2 - (chain.params.premined) * (chain.params.blockWidth + chain.params.blockPadding);

    chain = this.addChain(chain);
    chain.start();

    console.log('addScalingChain', (this.chains.length)+' chains ('+this.chains.filter(c => c.params.visible === true).length+' visibles)');

    return chain;
  }


  addAssetChain(chain) {

    let n = this.chains.length+1;
    let prev = this.chains[this.chains.length-1];
    let bloc = prev.blocks[prev.blocks.length-2];
    let kmd = this.chains.find(c => c.params.id == 'kmd');

    if(bloc == undefined) return;

    chain.x = prev.x + bloc.x + chain.params.blockWidth/2 + chain.params.blockPadding/2 - (chain.params.premined) * (chain.params.blockWidth + chain.params.blockPadding);
    chain = this.addChain(chain);
    chain.start();

    console.log('addAssetChain', chain.params.name);

    return chain;
  }


  hide() {

    this.alpha = 0;
    this.emitter.alpha = 0;
    this.chains.map(function(chain) {
      chain.hide();
    });
  }

  show() {

    this.alpha = 1;
    this.emitter.alpha = 1;
    this.chains.map(function(chain) {
      chain.show();
    });
  }

  fadeIn(ms = 500) {

    createjs.Tween.get(this).to({alpha: 1}, ms);
    createjs.Tween.get(this.emitter).to({alpha: 1}, ms);
    this.chains.map(function(chain) {
      chain.fadeIn(ms);
    });
  }

  fadeOut(ms = 500) {

    createjs.Tween.get(this).to({alpha: 0}, ms);
    createjs.Tween.get(this.emitter).to({alpha: 0}, ms);
    this.chains.map(function(chain) {
      chain.fadeOut(ms);
    });
  }

  slideY(y = 0, ms = 500) {

    createjs.Tween.get(this).to({y: y}, ms);
    createjs.Tween.get(this.emitter).to({y: y}, ms);
  }


}