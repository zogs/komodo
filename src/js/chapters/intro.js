import {extend, proxy} from '../utils';
import {Chapter} from '../chapter';
import {Dialog, Button, Text, Link} from '../dialog';
import {Blockchain} from '../blockchains/blockchain';
import {Platform} from '../blockchains/platform';
import {Transaction} from '../blockchains/transaction';
import createjs from 'createjs';

export const Intro = new Chapter({name: 'Intro'});

Intro.init = function() {

  let komodo = new Blockchain({id: 'kmd', name: 'Komodo', color:'#41ead4', premined: 6});
  var platform = new Platform({y: 250, id: 'kmd', name: ' ', color: '#41ead4', chains: [komodo], emitterTPS: 10 });
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
      <h2>The Discovery Tour</h2>
    </div>
  `, [
  new Button('CLICK TO START', function() {
        window.Timelines.start();
        window.Timelines.fadeIn(1000);
        that.continue();
  }, {float: 'left', borderWidth:3}),
  new Button('or choose chapter', function() {
        console.log('choose chapter');
        Intro.goToID('chapters');
  }, {float: 'right', borderWidth:0, font: '12px Montserrat', borderColor: 'rgba(0,0,0,0.01)', backgroundColor: 'rgba(0,0,0,0.01)'}
  )], { width: 350 });
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



  dialog = new Dialog('It has a 1 minute block time and the max block size is 4 MB.',
    [],
    {
      arrowTo: {x:500, y:200}, arrowFrom: 'bottom', animate: true,
      lifetime: 3000, call: proxy(this.continue, this),
      x: 500, y: 150
    });
  this.addDialog(dialog);

  dialog = new Dialog('<strong>KOMODO</strong> has been public since October 2016.',
    [],
    {
      lifetime: 3000, call: proxy(this.continue, this),
      x: 900, y: 350,
      arrow: {x:-50, y:-50}, arrowFrom: 'top', arrowCenter: -50, animate: true,
    });
  this.addDialog(dialog);

  dialog = new Dialog(`
    <p>It began as a fork of <strong class="btc">Bitcoin</strong>.</p>
    <p>So <strong>KOMODO</strong> inherits all the <strong class="btc">Bitcoin</strong> features. But <strong>KOMODO</strong> added many features of its own.</p>
    <p>For instance, <strong>KOMODO</strong> <strong>Antara framework</strong> supports blockchain-based games, contracts,</p>
    <p>apps, and the dPoW security mechanism provides Bitcoin-level security.</p>
    `, [
      new Button('CONTINUE', proxy(this.continue, this), {float: 'right'}),
      new Button('ADD TRANSACTION', function() {

        let komodo = window.Blockchains.find(b => b.params.id == 'kmd');
        let platform = window.Platforms.find(p => p.params.id == 'kmd');
        let trans = new Transaction({blockchain: komodo, mempool: komodo.mempool, type: null});
        platform.emitter.emitWithMotion(trans, komodo);


      }, {float: 'left'}),
    ], {
      y: 450
    });
  this.addDialog(dialog);

  dialog = new Dialog(`
    <p>But <strong>KOMODO</strong> is much more than the aforementioned things. There is much more to see!</p>
    <p>Let's start with the most important aspect: <strong>SECURITY</strong></p>
    <p></p>
    `, [
      new Button("REPLAY CHAPTER", proxy(this.replay,this), {float: 'left'}),
      new Button('NEXT CHAPTER', proxy(window.Tour.goToChapter,window.Tour,['Security']), {float: 'right'}),
    ], {
    });
  this.addDialog(dialog);

  dialog = new Dialog(`
      <p>Choose your chapter.</p>
    `,[
    new Button("INTRO", proxy(window.Tour.goToChapter,window.Tour,['Intro']), { float: 'left'}),
    new Button("SECURITY", proxy(window.Tour.goToChapter,window.Tour,['Security']), { float: 'left', x: 130,}),
    new Button("SCALABILITY", proxy(window.Tour.goToChapter,window.Tour,['Scalability']), { float: 'center', x: 30}),
    new Button("INTEROPERABILITY", proxy(window.Tour.goToChapter,window.Tour,['Interoperability']), { float: 'right'}),
    ], {
      id: 'chapters'
    });
  this.addDialog(dialog);
}
