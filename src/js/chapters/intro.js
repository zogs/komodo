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

  // show specific button if animated banner
  if(window.CurrentBanner) {
    dialog = new Dialog([
    ], [
    new Button('CLICK TO BEGIN', function() {
      Intro.startAfterBanner();
    }, {float: 'right'}),
    ], {
        dx: 30, dy: 58,
       backgroundColor: null,
    });
  }
  // else show traditionnal button
  else {
    dialog = new Dialog([
      new Text('KOMODO', '90px Roboto', {color: '#316565', textAlign: 'center'}),
      new Text('THE DISCOVERY TOUR', '18px Arial', {paddingTop: 20, paddingBottom: 20, textAlign: 'center'}),
    ], [
    new Button('CLICK TO BEGIN', function() {
        that.startWithoutBanner();
    }, {float: 'center'}),
    ], {
       backgroundColor: '#d6e0e0',
    });
  }
  this.addDialog(dialog);

  dialog = new Dialog([
    new Text('This is the KOMODO blockchain.'),
    ], [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'center'}),
    ], {
      dx: -50, dy: -40,
      animate: true, backgroundColor: '#FFF',
      onload: function() {

        let kmd = window.Platforms.find(p => p.params.id == 'kmd');
        kmd.fadeIn(500);

      },
    });
  this.addDialog(dialog);


  dialog = new Dialog([
    new Text("It has a 1 minute block time, and block's size is around 4MB..."),
    ], [
    ], {
      arrowTo: {x:500, y:200}, arrowFrom: 'bottom', animate: true, backgroundColor: '#FFF',
      lifetime: 2500, call: proxy(this.continue, this),
      dx: -250, dy: -250
    });
  this.addDialog(dialog);

  dialog = new Dialog([
    new Text('And it is live since October 2016 !'),
    ], [
    ], {
      lifetime: 2500, call: proxy(this.continue, this),
      dx: 150, dy: -50, backgroundColor: '#FFF',
      arrow: {x:-50, y:-50}, arrowFrom: 'top', arrowCenter: -50, animate: true,
    });
  this.addDialog(dialog);

  dialog = new Dialog([
    new Text('It begans as a fork of Zcash, which is a fork of Bitcoin.', 'bold'),
    new Text('So Komodo inherits all the Bitcoin and Zcash features, like the possibility to do anonymous transactions.'),
    new Text('Also call Z-transactions.'),
    new Text(' '),
    ], [
      new Button('CONTINUE', proxy(this.continue, this), {float: 'right'}),
      new Button('Add Z-transaction', function() {

        let komodo = window.Blockchains.find(b => b.params.id == 'kmd');
        let platform = window.Platforms.find(p => p.params.id == 'kmd');
        let trans = new Transaction({blockchain: komodo, mempool: komodo.mempool, type: null, shape: 'z'});
        platform.emitter.emitWithMotion(trans, komodo);


      }, {float: 'left', backgroundColor: '#b5c7c7', color: 'white', borderColor: '#b5c7c7', borderWidth: 2 }),
    ], {
      dy: 50
    });
  this.addDialog(dialog);

  dialog = new Dialog([
    new Text('But Komodo is NOT just a privacy blockchain. There is much more to see !', 'bold'),
    new Text("Let's begin with the more important aspect: SECURITY !"),
    new Text(' '),
    ], [
      new Button("REPLAY CHAPTER", proxy(this.replay,this), {float: 'left', backgroundColor: '#b5c7c7', color: 'white', borderColor: '#b5c7c7', borderWidth: 2 }),
      new Button('NEXT CHAPTER', proxy(window.Tour.goToChapter,window.Tour,['Security']), {float: 'right'}),
    ], {
      dy: 0
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