import {extend, proxy} from '../utils';
import {Chapter} from '../chapter';
import {Dialog, Button, Text, Link} from '../dialog';
import {Blockchain} from '../blockchains/blockchain';
import {Platform} from '../blockchains/platform';
import {Transaction} from '../blockchains/transaction';
import createjs from 'createjs';

export const Scalability = new Chapter({name: 'Scalability'});

Scalability.init = function() {

  window.Timelines.reset();

  let komodo = new Blockchain({id: 'kmd', name: 'Komodo', color:'#53f1be', premined: 6, notarizeTo: 'btc', notaryLabelSize: "big" });
  var komodoPlatform = new Platform({y: 260, id: 'kmd', name: ' ', color: '#53f1be', borderColor: '#53f1be', chains: [komodo], emitterTPS: 80,});
  window.Platforms.push(komodoPlatform);

  let bitcoin = new Blockchain({id: 'btc', name: 'Bitcoin', color: '#eb8c18', blockTime: 10, 'premined': 0, maxTps: 10});
  let bitcoinPlatform = new Platform({ y: 110, id: 'btc', name: ' ', color: '#eb8c18', chains: [bitcoin], emitterTPS: 10, txWeight:1});
  window.Platforms.push(bitcoinPlatform);

  //add some transaction to bitcoin
  for(let i=0; i<=3; i++) {
    let trans = new Transaction({ blockchain: bitcoin, mempool: bitcoin.mempool });
    bitcoin.mempool.appendTransaction(trans);
    let pos = bitcoin.mempool.addTransaction(trans);
    trans.setPosition(pos.x, pos.y);
    trans.validate();
  }

  komodoPlatform.hide();
  bitcoinPlatform.hide();
  window.Timelines.hide();


}

Scalability.set = function() {

  var that = this;

  // #1
  let dialog = new Dialog(`
    <div class="chapter">
      <h1>SCALABILITY</h1>
      <h2>ONE CHAIN IS NOT ENOUGH</h2>
    </div>
  `, [
  new Button('START CHAPTER', proxy(this.continue, this), {float: 'center', borderWidth:3}),
  ], {
  });
  this.addDialog(dialog);

  // #2
  dialog = new Dialog('<p>Ok. Lets check out how <strong>KOMODO</strong> handles scaling...</p>',
    [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'center'})
    ], {
      y: 350,
      onload: function(_this) {
        let komodo = window.Platforms.find(b => b.params.id == 'kmd');
        komodo.fadeIn(500);
        let bitcoin = window.Platforms.find(b => b.params.id == 'btc');
        bitcoin.fadeIn(500);
        window.Timelines.fadeIn(500);
        window.Timelines.start();
      }
    });
  this.addDialog(dialog);

  // #3
  dialog = new Dialog(`
    <p>First, lets look at <strong class="btc">Bitcoin</strong>.</p>
    <p>We know that Bitcoin has a maximum capacity of around 10 transactions per second.</p>
    `, [
    ], {
      x: 650, y: 200,
      arrow: {x:0, y:-80}, arrowFrom: 'top',
      lifetime: 3000, call: proxy(this.continue, this),
    });
  this.addDialog(dialog);

  // #4
  dialog = new Dialog('<p>More realistically its somewhere around 8tx/s...</p>',
    [], {
      lifetime: 3000, call: proxy(this.continue, this),
      x: 1130, y: 170,
      arrow: {x:-50, y:-50}, arrowFrom: 'top', arrowCenter: -50,
    });
  this.addDialog(dialog);

  // #5
  dialog = new Dialog(`
    <p>The <strong>KOMODO</strong> blockchain can natively handle about 200 tx/s !</p>
    <p>Let's test this and inspect their claim!</p>
    `, [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'center'}),
    ], {
      x: 930, y: 420,
      arrow: {x:0, y:-110}, arrowFrom: 'top'
    });
  this.addDialog(dialog);

  // #6
  dialog = new Dialog(`
    <p>Right now, we are sending around 100tx/s...</p>
    <p><strong>Let's double that</strong>- let's spam them!</p>
    `, [
    new Button('DOUBLE', proxy(this.continue, this), {float: 'center'}),
    ], {
      x: 1300, y: 410,
      arrow: {x:0, y:-100}, arrowFrom: 'top',
      onload: function(_this) {

        let platform = window.Platforms.find(e => e.params.id == 'kmd');
        platform.drawTotalTps();
      }
    });
  this.addDialog(dialog);

    // #7
  dialog = new Dialog('<p>See how rapidly we filled the mempool?</p>',
    [], {
      x: 930, y: 350,
      arrow: {x:0, y:-50}, arrowFrom: 'top',
      lifetime: 3000, call: proxy(this.continue, this),
      onload: function(_this) {

        let komodo = window.Platforms.find(e => e.params.id == 'kmd');
        komodo.emitter.params.tps = 200;

      }
    });
  this.addDialog(dialog);

  // #8
  dialog = new Dialog(`<p>How are the folks from <strong>KOMODO</strong> gonna handle this ?</p>`,
    [], {
      x: 930, y: 370,
      lifetime: 3000, call: proxy(this.continue, this),
    });
  this.addDialog(dialog);

  // #9
  dialog = new Dialog('<p>Well, they just pop up another chain!</p>',
    [], {
      x: 930, y: 370,
      lifetime: 3000, call: proxy(this.continue, this),
    });
  this.addDialog(dialog);

  // #10
  dialog = new Dialog([
    new Text('...'),
    ], [
    ], {
      y: -1000,
      lifetime: 5000, call: proxy(this.continue, this),
      onload: function() {
        let komodo = window.Platforms.find(e => e.params.id == 'kmd');
        let chain = komodo.addScalingChain();
      }
    });
  this.addDialog(dialog);

  // #11
  dialog = new Dialog(`
    <p>Can you see it? Now the transaction flow is split between two chains! </p>
    <p>But how is this even possible ?</p>
    <p>There is no magic, but let me explain you magic behind it.</p>
    <p> </p>
    `, [
    new Button("CONTINUE", proxy(this.continue,this), {float: 'center'})
    ], {
      x: 930, y: 500,
      arrow: {x:0, y:-120}, arrowFrom: 'top',
    });
  this.addDialog(dialog);

  // #12
  dialog = new Dialog(`
    <p>The <strong>KOMODO</strong> ecosystem can spin up a scaling chain at any time which is able to</p>
    <p>validate and confirm transactions from the main chain (or other sidechains).</p>
    <p>This is possible through a technology that <strong>KOMODO</strong> has invented/developed: the</p>
    <p><i>Merkleroot of Merkleroots of Merkleroots</i> (a.k.a MoMoM).</p>
    <p>combined with a special consensus mechanism : the KMD <i>Burn Protocol</i>.</p>
    <p>What what does this mean and how does it work ?</p>
    `, [
    new Button("CONTINUE", proxy(this.continue,this), {float: 'center'})
    ], {
    });
  this.addDialog(dialog);

  // #13
  dialog = new Dialog(`
    <p>During the notarization process, the side chains send to KMD mainchain a summary of all transactions (MoM) that occured since</p>
    <p>the last notarization. Simultaneously, the KMD main chain shares a summary to all the sidechains</p>
    <p>which contains a summary of all previous transactions gathered from the last notarization (MoMoM).</p>
    <p>Sounds genius & exciting? Let's see that in action!</p>
    `, [
    new Button("CONTINUE", proxy(this.continue,this), {float: 'center'})
    ], {
    });
  this.addDialog(dialog);

  //
  dialog = new Dialog([
    new Text("Waiting for the next notarization...           ",),
    ], [
    ], {
      x:750, y:350,
      paddings: [25,50,25,50],
      onload: function(_this) {

        let komodo = window.Blockchains.find(b => b.params.id == 'kmd');

        let line = _this.content[0];
        let text = new createjs.Text('', '14px Arial', '#6b8a8a');
        text.x = line.x + line.getBounds().x + 250;
        text.y = line.y + 5;
        _this.addChild(text);

        //wait for notarization
        window.Stage.on('newminute', function(ev) {

          let t = komodo.params.notarizeInterval - (ev.time+2)%10;
          window.setTimeout(function() {
            text.text = '('+t+'s)';
          }, 100);

          if((ev.time+3)%10 == 0) {
            ev.remove();
          }
        });

        window.Stage.on('notarization_start', proxy(that.continue, that), null, true);
        window.Stage.on('notarization_start', function() { window.slowMo(0.4, 100);}, null, true);
        window.Stage.on('notarization_end', function() { window.slowMo(1, 500);}, null, true);
      }
    });
  this.addDialog(dialog);

  // #14
  dialog = new Dialog('<p>MoMoM/Mom are being exchanged now !</p>',
    [], {
      x:940, y: 225,
      arrow: {x:0, y:60}, arrowWidth:50, arrowFrom: 'bottom',
      lifetime: 3000, call: proxy(this.continue, this),
    });
  this.addDialog(dialog);

  // #15bis
  dialog = new Dialog(`
    <p>Now, each chain has a records of what appended on other chains!</p>
    <p>That way, it can validate transactions from any other chain, and with the</p>
    <p>Burn protocol, this "cluster of blockchains" can maintain a constant level of coin across the whole ecosystem!</p>
    `, [
    new Button("CONTINUE", proxy(this.continue,this), {float: 'center'})
    ], {
      x:690, y: 350,
    });
  this.addDialog(dialog);

  // #15
  dialog = new Dialog(`
    <p>There is no theorical limit to how many chains KMD or you can spin up.</p>
    <p>Actually, during May 2018 Komodo has successfully conducted a stress test</p>
    <p>where KMD successfully processed <strong>~20000 transactions per second!</strong></p>
    <p>And this year, Komodo is preparing for a 1 million TX/s stresstest.</p>
    <p> </p>
    `, [
    new Button("CONTINUE", proxy(this.continue,this), {float: 'center'})
    ], {
      onload: function() {
        let komodo = window.Platforms.find(e => e.params.id == 'kmd');
        let chain = komodo.addScalingChain();
      }
    });
  this.addDialog(dialog);


  // #16
  dialog = new Dialog(`
    <p>Now after covering the scalability tech of KMD,</p>
    <p>Let's go to the next chapter: <strong>INTEROPERABILITY</strong></p>
    <p> </p>
    `, [
    new Button("ADD TRANSACTIONS", proxy(this.continue,this), { float: 'left'}),
    new Button("REPLAY CHAPTER", proxy(this.replay,this), {float: 'center', x: 20 }),
    new Button("NEXT CHAPTER", proxy(window.Tour.goToChapter,window.Tour,['Interoperability & Independence']), {float: 'right'}),
    ], {
      id: 'end'
    });
  this.addDialog(dialog)


  // #17
  dialog = new Dialog(`
    <p>Yeah, let's have fun ! </p>
    <p> </p>
    `, [
    new Button("ADD TRANSACTION", function() { Scalability.addTps(); }, {float: 'left'}),
    new Button("ADD CHAIN", function() { Scalability.addChain(); }, {float: 'center', x: 60}),
    new Button("STOP", function() { Scalability.goToID('end'); }, {float: 'right'}),
    ], {
     y: 100,
    });
  this.addDialog(dialog);

}


Scalability.addTps = function() {
  let komodo = window.Platforms.find(e => e.params.id == 'kmd');
  komodo.emitter.params.tps += 100;
}

Scalability.addChain = function() {
  let komodo = window.Platforms.find(e => e.params.id == 'kmd');
  let chain = komodo.addScalingChain();

  if(chain && chain.localToGlobal(0,0).y > STAGEHEIGHT - chain.params.blockHeight*2) {
    window.Timelines.scrollY(-chain.params.blockHeight*2);
  }

}
