const Intro = new Chapter({name: 'Intro'});

Intro.init = function() {


  let komodo = new Blockchain({id: 'kmd', name: 'Komodo', color:'#306565', premined: 6 });
  var platform = new Platform({y: 250, id: 'kmd', name: ' ', color: '#306565', backgroundColor: null, chains: [komodo], emitterTPS: 10 });
  Platforms.push(platform);

  platform.hide();
  Timelines.hide();
  Timelines.start();

}

Intro.set = function() {

  let that = this;
  let dialog;

  // show specific button if animated banner
  if(CurrentBanner) {
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
    new Text('This is the KOMODO blockchain.', '20px Arial'),
    ], [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'center'}),
    ], {
      dx: -50, dy: -40,
      animate: true, backgroundColor: '#FFF',
      onload: function() {

        let kmd = Platforms.find(p => p.params.id == 'kmd');
        kmd.fadeIn(500);

      },
    });
  this.addDialog(dialog);


  dialog = new Dialog([
    new Text("It has a 1 minute block time, and block's size are around 4MB...", '20px Arial'),
    ], [
    ], {
      arrowTo: {x:500, y:200}, arrowFrom: 'bottom', animate: true, backgroundColor: '#FFF',
      lifetime: 4000, call: proxy(this.continue, this),
      dx: -250, dy: -250
    });
  this.addDialog(dialog);

  dialog = new Dialog([
    new Text('And the chain is live since September 2016 !', '20px Arial'),
    ], [
    ], {
      lifetime: 4000, call: proxy(this.continue, this),
      dx: 150, dy: -50, backgroundColor: '#FFF',
      arrow: {x:-50, y:-50}, arrowFrom: 'top', arrowCenter: -50, animate: true,
    });
  this.addDialog(dialog);

  dialog = new Dialog([
    new Text('It begans as a fork of Zcash, a privacy coin.', '20px Arial'),
    new Text('So Komodo inherits all of its features, like the possibility to do anonymous transactions.', '20px Arial'),
    new Text('Also call Z-transactions.', '20px Arial'),
    new Text(' '),
    ], [
      new Button('CONTINUE', proxy(this.continue, this), {float: 'right'}),
      new Button('Add Z-transaction', function() {

        let komodo = Blockchains.find(b => b.params.id == 'kmd');
        let platform = Platforms.find(p => p.params.id == 'kmd');
        let trans = new Transaction({blockchain: komodo, mempool: komodo.mempool, type: null, shape: 'z'});
        platform.emitter.emitWithMotion(trans, komodo);


      }, {float: 'left', backgroundColor: '#b5c7c7', color: 'white', borderColor: '#b5c7c7', borderWidth: 2 }),
    ], {
      dy: 50
    });
  this.addDialog(dialog);

  dialog = new Dialog([
    new Text('But Komodo is not *just* a privacy blockchain. There is much more to see.', '20px Arial'),
    new Text('Lets begin with the more important aspect: SECURITY !', '20px Arial'),
    new Text(' '),
    ], [
      new Button("REPLAY CHAPTER", proxy(this.replay,this), {float: 'left', backgroundColor: '#b5c7c7', color: 'white', borderColor: '#b5c7c7', borderWidth: 2 }),
      new Button('NEXT CHAPTER', proxy(Tour.goToChapter,Tour,['Security']), {float: 'right'}),
    ], {
      dy: 100
    });
  this.addDialog(dialog);
}


Intro.startAfterBanner = function() {

  CurrentBanner.hide();
  createjs.Tween.get(Intro.dialogs[0]).to({alpha: 0}, 500);
  setTimeout(function() { Timelines.fadeIn(1000); }, 1000);
  setTimeout(function() { Intro.continue(); }, 1500);
}

Intro.startWithoutBanner = function() {

  Timelines.fadeIn(1000);
  Intro.continue();
}