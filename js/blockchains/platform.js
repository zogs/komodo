class Platform extends createjs.Container {

  constructor(params) {
    super();
    var defaults = {
      y: 0,
      name: '',
      height: null,
      chainHeight: 100,
      color: null,
      backgroundColor: null,
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

    Timelines.cont_background.addChild(this.cont_background);
    Timelines.cont_blockchains.addChild(this.cont_blockchain);
    Timelines.cont_foreground.addChild(this.cont_foreground);
    Timelines.cont_foreground.addChild(this.cont_tpstext);
    Timelines.cont_foreground.addChild(this.cont_text);
    Timelines.cont_foreground.addChild(this.cont_emitter);

    this.init();
  }

  init() {

    this.initEmitter();
    this.redraw();

  }

  initEmitter() {

    this.emitter = new Emitter({name: this.params.name, color: this.params.color, height: this.params.height, blockchains: this.params.chains, tps: this.params.emitterTPS, txWeight: this.params.txWeight});
    this.emitter.x = STAGEWIDTH;
    this.emitter.y = this.y;
    this.emitter.platform = this;
    this.emitter.setChains(this.chains);
    Emitters.push(this.emitter);
    this.cont_emitter.addChild(this.emitter);

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
      let title = new createjs.Text(this.params.name, "bold 18px Roboto", this.params.color);
      title.x = 5;
      title.y = - this.params.chainHeight/2 - title.getMeasuredHeight() - 3;
      this.cont_text.addChild(title);
    }

    // Mempool text
    let text = new createjs.Text('MEMPOOL','12px Arial', '#AAA');
    text.y = - this.params.chainHeight/2 + text.getMeasuredHeight()/2;
    text.x = this.params.chains[0].mempool.x - text.getMeasuredWidth()/2 + 10;
    this.cont_text.addChild(text);


    //redraw emitter
    if(this.emitter) {
      this.drawEmitter();
    }

  }

  drawChain(chain, y) {

      chain.y = y;
      if(chain.params.type == 'SC' || chain.params.type == 'AC') chain.drawMoMoMMagic();
      this.cont_blockchain.addChild(chain);
      Blockchains.push(chain);

      let name = new createjs.Text(chain.params.name, 'bold 14px Roboto', this.params.color);
      name.y = chain.y - chain.params.height/2 + 5;
      name.x = 7;
      this.cont_text.addChild(name);

  }

  start() {

    this.emitter.start();
    this.chains.map(c => c.start());

  }

  stop() {

    this.chains.map(c => c.stop());

  }

  activateAutoScalingChain() {

    Stage.on('newminute', proxy(this.checkTotalTps, this));
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

    let total = new createjs.Text('TOTAL','16px Roboto', this.params.color+'44');
    total.x = STAGEWIDTH - 140;
    total.y = this.y - 10;
    this.cont_tpstext.addChild(total);

    let txs = new createjs.Text('tx/s', "30px Roboto", this.params.color+'44');
    txs.x = STAGEWIDTH - 140;
    txs.y = this.y + 7;
    this.cont_tpstext.addChild(txs);


    this.totalTpsTx = new createjs.Text('100', "60px Roboto", this.params.color+'44');
    this.totalTpsTx.x = STAGEWIDTH - 150;
    this.totalTpsTx.y = this.y - 20;
    this.totalTpsTx.textAlign = 'right';
    this.cont_tpstext.addChild(this.totalTpsTx);

    Stage.on('tick', proxy(this.updateTotalTps, this));
  }

  updateTotalTps() {

    if(Paused === true) return;

    let tps = this.chains.reduce((a,b) => a + b.tps, 0);
    this.totalTps = Math.floor(tps);
    if(this.totalTpsTx) this.totalTpsTx.text = Math.floor(tps);

  }

  drawBackground() {

    this.cont_background.removeAllChildren();
    let height = (this.params.height)? this.params.height : this.params.chainHeight * this.chains.length;
    let bkg = new createjs.Shape();
    bkg.graphics.setStrokeStyle(1).beginStroke(this.params.backgroundColor).beginFill(this.params.backgroundColor+'22').drawRect(-5, 0, STAGEWIDTH + 10, height);
    bkg.y = this.y - this.params.chainHeight/2;
    bkg.cache(-10, -5, STAGEWIDTH + 15, height+10)
    this.cont_background.addChild(bkg);
  }

  drawForeground() {
    this.cont_foreground.removeAllChildren();
    let height = this.params.height || this.params.chainHeight * this.chains.length;
    let fore = new createjs.Shape();
    fore.graphics.beginLinearGradientFill(["rgba(255,255,255,0)","#FFF"], [0, 1], 100, 0, 0, 0).drawRect(0, 0, 200, height);
    fore.y = this.y - this.params.chainHeight/2;
    fore.alpha = 0.8;
    fore.cache(0, 0, 200, height);
    this.cont_foreground.addChild(fore);
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

    let n = this.chains.length+1;
    let prev = this.chains[this.chains.length-1];
    let bloc = prev.blocks[prev.blocks.length-2];

    if(bloc == undefined) return;

    let chain = new Blockchain({id: 'SC'+n, name: "Scaling Chain "+n, color:'#569b9b', type: 'SC', notarizeTo: 'kmd'});
    chain.x = prev.x + bloc.x + chain.params.blockWidth/2 + chain.params.blockPadding/2;

    chain = this.addChain(chain);
    chain.start();

    console.log('addScalingChain', (this.chains.length)+' chains ('+this.chains.filter(c => c.params.visible === true).length+' visibles)');

    return chain;
  }


  addAssetChain(chain) {

    let n = this.chains.length+1;
    let prev = this.chains[this.chains.length-1];
    let bloc = prev.blocks[prev.blocks.length-2];

    if(bloc == undefined) return;

    chain.x = prev.x + bloc.x + chain.params.blockWidth/2 + chain.params.blockPadding/2;
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