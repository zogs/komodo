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

  let komodo = new Blockchain({id: 'kmd', name: 'Komodo', color:'#41ead4', premined: 6, notarizeTo: 'btc', notaryLabelSize: "big" });
  var komodoPlatform = new Platform({y: 260, id: 'kmd', name: ' ', color: '#41ead4', borderColor: '#41ead4', chains: [komodo], emitterTPS: 80,});
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
      <h2>Blockchains Clusters</h2>
    </div>
  `, [
  new Button('START CHAPTER', proxy(this.continue, this), {float: 'center', borderWidth:3}),
  ], {
  });
  this.addDialog(dialog);

  // #2
  dialog = new Dialog("<p>Now let's see how <strong>KOMODO</strong> handles scaling.</p>",
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
    <p>First, let's look at <strong class="btc">Bitcoin</strong>.</p>
    <p>We know that Bitcoin has a maximum capacity of around 10 transactions per second.</p>
    `, [
    ], {
      x: 650, y: 200,
      arrow: {x:0, y:-80}, arrowFrom: 'top',
      lifetime: 3000, call: proxy(this.continue, this),
    });
  this.addDialog(dialog);

  // #4
  dialog = new Dialog("<p>More realistically it's somewhere around 8tx/s...</p>",
    [], {
      lifetime: 4000, call: proxy(this.continue, this),
      x: 1130, y: 170,
      arrow: {x:-50, y:-50}, arrowFrom: 'top', arrowCenter: -50,
    });
  this.addDialog(dialog);

  // #5
  dialog = new Dialog(`
    <p>The <strong>KOMODO</strong> blockchain can natively handle about <b>200 tx/s</b>!</p>
    <p>Let's test this and inspect this claim.</p>
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
    <p><strong>Let's double it!</p>
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
  dialog = new Dialog(`<p>How does <strong>KOMODO</strong>'s tech handle this situation?</p>`,
    [], {
      x: 930, y: 370,
      lifetime: 4000, call: proxy(this.continue, this),
    });
  this.addDialog(dialog);

  // #9
  dialog = new Dialog('<p>By supporting the creation of a second blockchain!</p>',
    [], {
      x: 930, y: 370,
      lifetime: 4000, call: proxy(this.continue, this),
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
    <p>Now the transaction flow is split between two chains! </p>
    <p>But how is this even possible ?</p>
    <p>Let's learn more about now this scaling solution works.</p>
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
    <p>The <strong>KOMODO</strong> ecosystem allows all third-party projects to create a scaling chain at any time.</p>
    <p>Scaling chains validate transactions for the main chain, boosting performance on demand.</p>
    <p>This is made possible through a technology that <strong>KOMODO</strong> developed called <strong>Platform</strong></p>
    <p><strong>Synchronizations</strong>.</p>
    <p>What what does this mean and how does it work?</p>
    `, [
    new Button("CONTINUE", proxy(this.continue,this), {float: 'center'})
    ], {
    });
  this.addDialog(dialog);

  // #13
  dialog = new Dialog(`
    <p>First, a scaling chain sends a <b>summary of all transactions</b> that occurred since the last</p>
    <p>notarization to main chain to which they are attached. In this example, it’s the main KMD chain.</p>
    <p>Simultaneously, the KMD main chain shares data to the scaling chain</p>
    <p>which contains data about of all previous summaries gathered since the last notarization.</p>
    <p>Sounds exciting, right? Let's see it in action!</p>
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
  dialog = new Dialog('<p>The data are being exchanged now!</p>',
    [], {
      x:940, y: 225,
      arrow: {x:0, y:60}, arrowWidth:50, arrowFrom: 'bottom',
      lifetime: 3000, call: proxy(this.continue, this),
    });
  this.addDialog(dialog);

  // #15bis
  dialog = new Dialog(`
    <p>Now, each chain has a record of what happened on the other chain!</p>
    <p>That way, it can <b>validate</b> transactions on any other chain, and with a unique burn protocol,</p>
    <p>the blockchain cluster can maintain <b>constant coin supply</b> across the main chain and all scaling chains.</p>
    `, [
    new Button("CONTINUE", proxy(this.continue,this), {float: 'center'})
    ], {
      x:690, y: 350,
    });
  this.addDialog(dialog);

  // #15
  dialog = new Dialog(`
    <p>There is no theoretical limit to how many scaling chains you can spin up.</p>
    <p>Actually, in May 2018 <strong>KOMODO</strong> successfully conducted a stress test</p>
    <p>where a massive blockchain cluster successfully processed <b>~20,000 transactions</b> per second!</p>
    `, [
    new Button("CONTINUE", proxy(this.continue,this), {float: 'center'})
    ], {
      onload: function() {
        let komodo = window.Platforms.find(e => e.params.id == 'kmd');
        let chain = komodo.addScalingChain();
        Scalability.addTps();
      }
    });
  this.addDialog(dialog);


  // #16
  dialog = new Dialog(`
    <p>Now that we've covered <strong>KOMODO</strong>'s scalability tech,</p>
    <p>let's move on to the next chapter: <strong>INTEROPERABILITY</strong></p>
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
