import {extend, proxy} from '../utils';
import {Chapter} from '../chapter';
import {Dialog, Button, Text, Link} from '../dialog';
import {Blockchain} from '../blockchains/blockchain';
import {Platform} from '../blockchains/platform';
import {Transaction} from '../blockchains/transaction';
import createjs from 'createjs';

export const Intro = new Chapter({name: 'Intro'});

Intro.init = function() {

  let komodo = new Blockchain({id: 'kmd', name: 'Komodo', color:'#53f1be', premined: 6});
  var platform = new Platform({y: 250, id: 'kmd', name: ' ', color: '#53f1be', chains: [komodo], emitterTPS: 10 });
  window.Platforms.push(platform);

  platform.hide();
  window.Timelines.hide();

}

Intro.set = function() {

  let that = this;
  let dialog;


  dialog = new Dialog(`
    <div class="chapter">
      <h1>KOMODO</h1>
      <h2>The discovery tour</h2>
    </div>
  `, [
  new Button('CLICK HERE TO START', function() {
        window.Timelines.start();
        window.Timelines.fadeIn(1000);
        that.continue();
  }, {float: 'center', borderWidth:3}),
  ], {
  });
  this.addDialog(dialog);

  dialog = new Dialog('This is the <strong>KOMODO</strong> blockchain.', [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'center'}),
    ], {
      x: 700, y: 360,
      animate: true,
      onload: function() {

        let kmd = window.Platforms.find(p => p.params.id == 'kmd');
        kmd.fadeIn(500);

      },
    });
  this.addDialog(dialog);



  dialog = new Dialog('It has a 1 minute block time and the max. blocksize is 4 MB.',
    [],
    {
      arrowTo: {x:500, y:200}, arrowFrom: 'bottom', animate: true,
      lifetime: 2500, call: proxy(this.continue, this),
      x: 500, y: 150
    });
  this.addDialog(dialog);

  dialog = new Dialog('<strong>KOMODO</strong> is public since October 2016!',
    [],
    {
      lifetime: 2500, call: proxy(this.continue, this),
      x: 900, y: 350,
      arrow: {x:-50, y:-50}, arrowFrom: 'top', arrowCenter: -50, animate: true,
    });
  this.addDialog(dialog);

  dialog = new Dialog(`
    <p>It began as a <strong class="zcash">Zcash</strong> which is a fork of <strong class="btc">Bitcoin</strong>.</p>
    <p>So <strong>KOMODO</strong> inherits all the <strong class="btc">Bitcoin</strong> and <strong class="zcash">Zcash</strong> features plus a dozen of own features</p>
    <p>A custom consensus framework capable of a unique <i>"smartcontract like"</i> experience,</p>
    <p>and a security protocol which recycles <strong class="btc">Bitcoin</strong> hash power for a KMD backup on BTC!</p>
    `, [
      new Button('CONTINUE', proxy(this.continue, this), {float: 'right'}),
      new Button('ADD Z-TRANSACTION', function() {

        let komodo = window.Blockchains.find(b => b.params.id == 'kmd');
        let platform = window.Platforms.find(p => p.params.id == 'kmd');
        let trans = new Transaction({blockchain: komodo, mempool: komodo.mempool, type: null, shape: 'z'});
        platform.emitter.emitWithMotion(trans, komodo);


      }, {float: 'left'}),
    ], {
      y: 450
    });
  this.addDialog(dialog);

  dialog = new Dialog(`
    <p>But <strong>KOMODO is much more</strong> than the aforementioned things. There is much more to see !</p>
    <p>Let's get back to the more important aspect: <strong>SECURITY</strong></p>
    <p></p>
    `, [
      new Button("REPLAY CHAPTER", proxy(this.replay,this), {float: 'left'}),
      new Button('NEXT CHAPTER', proxy(window.Tour.goToChapter,window.Tour,['Security']), {float: 'right'}),
    ], {
    });
  this.addDialog(dialog);
}
