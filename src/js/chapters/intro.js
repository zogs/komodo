import {extend, proxy} from '../utils';
import {Chapter} from '../chapter';
import {Dialog, Button, Text, Link} from '../dialog';
import {Blockchain} from '../blockchains/blockchain';
import {Platform} from '../blockchains/platform';
import createjs from 'createjs';

export const Intro = new Chapter({name: 'Intro'});

Intro.init = function() {

  window.Timelines.reset();

  let komodo = new Blockchain({id: 'kmd', name: 'Komodo', color:'#306565', premined: 6 });
  var platform = new Platform({y: 250, id: 'kmd', name: ' ', color: '#306565', backgroundColor: null, chains: [komodo], emitterTPS: 10 });
  window.Platforms.push(platform);

  platform.hide();
  window.Timelines.hide();
  window.Timelines.start();

}

Intro.set = function() {

  let that = this;
  let dialog;


  dialog = new Dialog([
    new Text('KOMODO', '90px Roboto', {color: '#316565', textAlign: 'center'}),
    new Text('THE DISCOVERY TOUR', '18px Arial', {paddingTop: 20, paddingBottom: 20, textAlign: 'center'}),
  ], [
  new Button('CLICK HERE TO START', function() {
      that.startWithoutBanner();
  }, {float: 'center'}),
  ], {
     backgroundColor: '#d6e0e0',
  });
  this.addDialog(dialog);

  dialog = new Dialog([
    new Text('This is the KOMODO blockchain.'),
    ], [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'center'}),
    ], {
      x: 700, y: 360,
      animate: true, backgroundColor: '#FFF',
      onload: function() {

        let kmd = window.Platforms.find(p => p.params.id == 'kmd');
        kmd.fadeIn(500);

      },
    });
  this.addDialog(dialog);


  dialog = new Dialog([
    new Text("It has a 1 minute block time and the max. blocksize is 4 MB."),
    ], [
    ], {
      arrowTo: {x:500, y:200}, arrowFrom: 'bottom', animate: true, backgroundColor: '#FFF',
      lifetime: 2500, call: proxy(this.continue, this),
      x: 500, y: 150
    });
  this.addDialog(dialog);

  dialog = new Dialog([
    new Text('Komodo is public since October 2016!'),
    ], [
    ], {
      lifetime: 2500, call: proxy(this.continue, this),
      x: 900, y: 350, backgroundColor: '#FFF',
      arrow: {x:-50, y:-50}, arrowFrom: 'top', arrowCenter: -50, animate: true,
    });
  this.addDialog(dialog);

  dialog = new Dialog([
    new Text('It began as a Zcash Fork which is a fork of Bitcoin.', 'bold'),
    new Text('So Komodo inherits all the Bitcoin and Zcash features plus a dozen of own features'),
    new Text('A custom consensus framework capable of a unique "smartcontract like" experience,'),
    new Text('and a security protocol which recycles Bitcoin hash power for a KMD backup on BTC!  '),
    ], [
      new Button('CONTINUE', proxy(this.continue, this), {float: 'right'}),
      new Button('Add Z-transaction', function() {

        let komodo = window.Blockchains.find(b => b.params.id == 'kmd');
        let platform = window.Platforms.find(p => p.params.id == 'kmd');
        let trans = new Transaction({blockchain: komodo, mempool: komodo.mempool, type: null, shape: 'z'});
        platform.emitter.emitWithMotion(trans, komodo);


      }, {float: 'left', backgroundColor: '#b5c7c7', color: 'white', borderColor: '#b5c7c7', borderWidth: 2 }),
    ], {
      y: 450
    });
  this.addDialog(dialog);

  dialog = new Dialog([
    new Text('But Komodo is much more than the aforementioned things. There is much more to see !', 'bold'),
    new Text("Let's get back to the more important aspect: SECURITY!"),
    new Text(' '),
    ], [
      new Button("REPLAY CHAPTER", proxy(this.replay,this), {float: 'left', backgroundColor: '#b5c7c7', color: 'white', borderColor: '#b5c7c7', borderWidth: 2 }),
      new Button('NEXT CHAPTER', proxy(window.Tour.goToChapter,window.Tour,['Security']), {float: 'right'}),
    ], {
    });
  this.addDialog(dialog);
}


Intro.startAfterBanner = function() {

  window.CurrentBanner.hide();
  createjs.Tween.get(Intro.dialogs[0]).to({alpha: 0}, 500);
  setTimeout(function() { window.Timelines.fadeIn(1000); }, 1000);
  setTimeout(function() { Intro.continue(); }, 1500);
}

Intro.startWithoutBanner = function() {

  window.Timelines.fadeIn(1000);
  Intro.continue();
}
