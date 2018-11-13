const Intro = new Chapter({name: 'Intro'});

Intro.init = function() {


    TimeLine = new Timeline({
      width: STAGEWIDTH,
      height: STAGEHEIGHT,
      minuteWidth: MinuteWidth,
      minuteSeconds: MinuteSeconds,
      defaultTime: 7,
    });
    Cont_timeline.addChild(TimeLine);

    let komodo = new Blockchain({id: 'kmd', name: 'komodo', color:'#306565', premined: 6 });

    var platform = new Platform({
          y: 250,
          name: 'komodo',
          color: '#306565',
          backgroundColor: null,
          chains: [komodo],
          emitterTPS: 2,
      });
      Cont_platform.addChild(platform);
      Platforms.push(platform);

      Cont_platform.alpha = 0;
      Cont_mempool.alpha = 0;
      Cont_timeline.alpha = 0;
      Cont_currenttime.alpha = 0;
      Cont_emitter.alpha = 0;





}

Intro.set = function() {

  let dialog = new Dialog([
  new Text('KOMODO', '60px Roboto', {color: '#316565'}),
  new Text('The discovery tour !', '20px Arial', {paddingTop: 20, paddingBottom: 20}),
  ], [
  new Button('BEGIN', proxy(this.continue, this), {float: 'center'}),
  ], {
  });

  this.addDialog(dialog);

  dialog = new Dialog([
    new Text('This is the KOMODO blockchain.', '20px Arial'),
    ], [
    ], {
      arrow: {x:-80, y:-70}, arrowFrom: 'top', animate: true, backgroundColor: '#FFF',
      lifetime: 2000, call: proxy(this.continue, this), onload: function() {
        createjs.Tween.get(Cont_platform).to({ alpha : 1},500);
        createjs.Tween.get(Cont_mempool).to({ alpha : 1},500);
        createjs.Tween.get(Cont_timeline).to({ alpha : 1},500);
        createjs.Tween.get(Cont_currenttime).to({ alpha : 1},500);
        createjs.Tween.get(Cont_emitter).to({ alpha : 1},500);
        TimeLine.start();
      },
    });
  this.addDialog(dialog);

  dialog = new Dialog([
    new Text('It has a 1 minute block time...', '20px Arial'),
    ], [
    ], {
      arrowTo: {x:500, y:200}, arrowFrom: 'bottom', animate: true, backgroundColor: '#FFF',
      lifetime: 2000, call: proxy(this.continue, this),
      dx: -250, dy: -250
    });
  this.addDialog(dialog);

  dialog = new Dialog([
    new Text('And it is live since September 2016.', '20px Arial'),
    ], [
    ], {
      lifetime: 2000, call: proxy(this.continue, this),
      dx: 350, dy: -50, backgroundColor: '#FFF',
      arrow: {x:-100, y:-50}, arrowFrom: 'top', arrowCenter: -50, animate: true,
    });
  this.addDialog(dialog);

  dialog = new Dialog([
    new Text('It begans as a fork of Zcash.', '20px Arial'),
    new Text('So KOMODO inherits all of its features, like the possibility to do anonymous transactions.', '20px Arial'),
    ], [
      new Button('CONTINUE', proxy(this.continue, this), {float: 'right'}),
      new Button('Add Z-transaction', function() {

        let komodo = Blockchains.find(b => b.params.id == 'kmd');
        let platform = Platforms.find(p => p.params.name == 'komodo');
        let trans = new Transaction({blockchain: komodo, mempool: komodo.mempool, type: 'z'});
        platform.emitter.emitTransaction(trans, komodo);


      }, {float: 'left', backgroundColor: '#b5c7c7', color: 'white', borderColor: '#b5c7c7', borderWidth: 2 }),
    ], {
      dy: 50
    });
  this.addDialog(dialog);

  dialog = new Dialog([
    new Text('But KOMODO is not *just* a privacy blockchain. There is much more to see.', '20px Arial'),
    new Text('Lets begin with the more important aspect: SECURITY !', '20px Arial'),
    ], [
      new Button('NEXT CHAPTER', proxy(this.continue, this), {float: 'center'}),
    ], {
      dy: 100
    });
  this.addDialog(dialog);
}