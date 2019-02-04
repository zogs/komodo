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

  let komodo = new Blockchain({id: 'kmd', name: 'Komodo', color:'#306565', premined: 6, notarizeTo: 'btc', notaryLabelSize: "big" });
  var komodoPlatform = new Platform({y: 250, id: 'kmd', name: 'KOMODO PLATFORM', color: '#306565',backgroundColor: '#306565', chains: [komodo], emitterTPS: 80,});
  window.Platforms.push(komodoPlatform);

  let bitcoin = new Blockchain({id: 'btc', name: 'Bitcoin', color: '#d38d10', blockTime: 10, 'premined': 0, maxTps: 10});
  let bitcoinPlatform = new Platform({ y: 100, id: 'btc', name: ' ', color: '#d38d10', backgroundColor: null, chains: [bitcoin], emitterTPS: 10, txWeight:1});
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
  let dialog = new Dialog([
  new Text('SCALABILITY', '60px Roboto', {color: '#316565', textAlign: 'center'}),
  new Text('ONE CHAIN IS NOT ENOUGH', '18px Arial', {paddingTop: 20, paddingBottom: 20, textAlign: 'center'}),
  ], [
  new Button('START CHAPTER', proxy(this.continue, this), {float: 'center'}),
  ], {
    backgroundColor: '#d6e0e0',
  });
  this.addDialog(dialog);

  // #2
  dialog = new Dialog([
    new Text('Ok. Lets check out how Komodo handles scaling...'),
    ], [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'center'})
    ], {
      dx: 0, dy: -50,
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
  dialog = new Dialog([
    new Text('First, lets look at Bitcoin,'),
    new Text('we know that Bitcoin has a maximum capacity of around 10 transactions per second.'),
    ], [
    ], {
      dx: -100, dy: -200,
      arrow: {x:0, y:-80}, arrowFrom: 'top',
      lifetime: 3000, call: proxy(this.continue, this),
    });
  this.addDialog(dialog);

  // #4
  dialog = new Dialog([
    new Text('More realistically its somewhere around 8tx/s...'),
    ], [
    ], {
      lifetime: 3000, call: proxy(this.continue, this),
      dx: 350, dy: -220,
      arrow: {x:-50, y:-50}, arrowFrom: 'top', arrowCenter: -50,
    });
  this.addDialog(dialog);

  // #5
  dialog = new Dialog([
    new Text('The Komodo blockchain can natively handle about 200 tx/s !'),
    new Text("Let's test this and inspect their claim!", '20px Arial'),
    ], [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'center'}),
    ], {
      dx: 180, dy: 20,
      arrow: {x:0, y:-110}, arrowFrom: 'top'
    });
  this.addDialog(dialog);

  // #6
  dialog = new Dialog([
    new Text('Right now, we are sending around 100tx/s...'),
    new Text("Let's double that - let's spam them!", '20px Arial'),
    ], [
    new Button('DOUBLE', proxy(this.continue, this), {float: 'center'}),
    ], {
      x: 1300, dy: 10,
      arrow: {x:0, y:-100}, arrowFrom: 'top',
      onload: function(_this) {

        let platform = window.Platforms.find(e => e.params.id == 'kmd');
        platform.drawTotalTps();
      }
    });
  this.addDialog(dialog);

    // #7
  dialog = new Dialog([
    new Text('See how rapidly we filled the mempool?'),
    ], [

    ], {
      dx: 180, dy: -30,
      arrow: {x:0, y:-50}, arrowFrom: 'top',
      lifetime: 2000, call: proxy(this.continue, this),
      onload: function(_this) {

        let komodo = window.Platforms.find(e => e.params.id == 'kmd');
        komodo.emitter.params.tps = 200;

      }
    });
  this.addDialog(dialog);

  // #8
  dialog = new Dialog([
    new Text('How are the folks from Komodo gonna handle this?'),
    ], [
    ], {
      dx: 180, dy: -30,
      lifetime: 2000, call: proxy(this.continue, this),
    });
  this.addDialog(dialog);

  // #9
  dialog = new Dialog([
    new Text('Well, they just pop up another chain!'),
    ], [
    ], {
      dx: 180, dy: -30,
      lifetime: 1500, call: proxy(this.continue, this),
    });
  this.addDialog(dialog);

  // #10
  dialog = new Dialog([
    new Text('...'),
    ], [
    ], {
      dx: 0, dy: 1000,
      lifetime: 5000, call: proxy(this.continue, this),
      onload: function() {
        let komodo = window.Platforms.find(e => e.params.id == 'kmd');
        let chain = komodo.addScalingChain(false);
      }
    });
  this.addDialog(dialog);

  // #11
  dialog = new Dialog([
    new Text('Can you see it? Now the transaction flow is split between two chains! '),
    new Text('But how is this even possible ?'),
    new Text('There is no magic, but let me explain you magic behind it.'),
    new Text(' '),
    ], [
    new Button("CONTINUE", proxy(this.continue,this), {float: 'center'})
    ], {
      dx: 180, dy: 130,
      arrow: {x:0, y:-120}, arrowFrom: 'top',
    });
  this.addDialog(dialog);

  // #12
  dialog = new Dialog([
    new Text('The Komodo ecosystem can spin up a scaling chain at any time which is able to', 'bold'),
    new Text('validate and confirm transactions from the main chain (or other sidechains).', 'bold'),
    new Text('This is possible through a technology that Komodo has invented/developed: the'),
    new Text('Merkleroot of Merkleroots of Merkleroots (a.k.a MoMoM).'),
    new Text('combined with a special consensus mechanism : the KMD Burn Protocol.'),
    new Text("What what does this mean and how does it work?"),
    ], [
    new Button("CONTINUE", proxy(this.continue,this), {float: 'center'})
    ], {
      dx:0, dy: 0,
    });
  this.addDialog(dialog);

  // #13
  dialog = new Dialog([
    new Text('During the notarization process, the side chains send to KMD mainchain a summary of all transactions (MoM) that occured since'),
    new Text('the last notarization. Simultaneously, the KMD main chain shares a summary to all the sidechains'),
    new Text('which contains a summary of all previous transactions gathered from the last notarization (MoMoM).'),
    new Text("Sounds genius & exciting? Let's see that in action!")
    ], [
    new Button("CONTINUE", proxy(this.continue,this), {float: 'center'})
    ], {
      dx:0, dy: 0,
    });
  this.addDialog(dialog);

  //
  dialog = new Dialog([
    new Text("Waiting for the next notarization...           ", 'italic 20px Arial', '#AAA'),
    ], [
    ], {
      dx:0, dy: 0,
      onload: function(_this) {

        let komodo = window.Blockchains.find(b => b.params.id == 'kmd');

        let line = _this.content[0];
        let text = new createjs.Text('', 'italic 20px Arial', '#6b8a8a');
        text.x = line.x + line.getBounds().x + 320;
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
        window.Stage.on('notarization_start', function() { window.slowMo(0.2, 500);}, null, true);
        window.Stage.on('notarization_end', function() { window.slowMo(1, 500);}, null, true);
      }
    });
  this.addDialog(dialog);

  // #14
  dialog = new Dialog([
    new Text('MoMoM/Mom are being exchanged now !'),
    ], [
    ], {
      dx:420, dy: -100,
      arrow: {x:-170, y:0}, arrowWidth:20, arrowFrom: 'left',
      lifetime: 3000, call: proxy(this.continue, this),
    });
  this.addDialog(dialog);

  // #15bis
  dialog = new Dialog([
    new Text('Now, each chain has a records of what appended on other chains!'),
    new Text('That way, it can validate transactions from any other chain, and with the'),
    new Text('Burn protocol, this "cluster of blockchains" can maintain a constant level of coin across the whole ecosystem!', 'bold'),
    ], [
    new Button("CONTINUE", proxy(this.continue,this), {float: 'center'})
    ], {
      dx:-60, dy: -50,
    });
  this.addDialog(dialog);

  // #15
  dialog = new Dialog([
    new Text("There is no theorical limit to how many chains KMD or you can spin up."),
    new Text("Actually, during May 2018 Komodo has successfully conducted a stress test"),
    new Text("where KMD successfully processed ~20000 transactions per second!", 'bold'),
    new Text("And this year, Komodo is preparing for a 1 million TX/s stresstest."),
    new Text(" "),
    ], [
    new Button("CONTINUE", proxy(this.continue,this), {float: 'center'})
    ], {
      dx:0, dy: 0,
    });
  this.addDialog(dialog);


  // #16
  dialog = new Dialog([
    new Text("Now after covering the scalability tech of KMD,                      "),
    new Text("Let's go to the next chapter: INTEROPERABILITY !"),
    new Text(" "),
    ], [
    new Button("ADD TRANSACTIONS", proxy(this.continue,this), { float: 'left', backgroundColor: '#b5c7c7', color: 'white', borderColor: '#b5c7c7', borderWidth: 2 }),
    new Button("REPLAY CHAPTER", proxy(this.replay,this), {float: 'center', x: 20, backgroundColor: '#b5c7c7', color: 'white', borderColor: '#b5c7c7', borderWidth: 2 }),
    new Button("NEXT CHAPTER", proxy(window.Tour.goToChapter,window.Tour,['Interoperability']), {float: 'right'}),
    ], {
      dx:0, dy: 0,
      id: 'end'
    });
  this.addDialog(dialog)


  // #17
  dialog = new Dialog([
    new Text("Yeah, let's have fun !"),
    new Text(" "),
    ], [
    new Button("ADD TRANSACTION", function() { Scalability.addTps(); }, {float: 'left', backgroundColor: '#b5c7c7', color: 'white', borderColor: '#b5c7c7', borderWidth: 2}),
    new Button("ADD CHAIN", function() { Scalability.addChain(); }, {float: 'center', x: 60, backgroundColor: '#b5c7c7', color: 'white', borderColor: '#b5c7c7', borderWidth: 2}),
    new Button("STOP", function() { Scalability.goToID('end'); }, {float: 'right'}),
    ], {
      dx:0, dy: -300,
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
