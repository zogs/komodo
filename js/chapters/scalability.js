const Scalability = new Chapter({name: 'Scalability'});

Scalability.init = function() {

  TimeLine = new Timeline({
    width: STAGEWIDTH,
    height: STAGEHEIGHT,
    minuteWidth: MinuteWidth,
    minuteSeconds: MinuteSeconds,
    defaultTime: 7,
  });
  Cont_timeline.addChild(TimeLine);

  let komodo = new Blockchain({id: 'kmd', name: 'komodo', color:'#306565', premined: 6, notarizeTo: 'not_yet', notaryLabelSize: "big", maxTps: 100 });
  var komodoPlatform = new Platform({y: 250, id: 'komodo', name: 'komodo',color: '#306565',backgroundColor: null,chains: [komodo], emitterTPS: 50,});
  Platforms.push(komodoPlatform);

  let bitcoin = new Blockchain({id: 'btc', name: 'Bitcoin', color: '#d38d10', blockTime: 10, 'premined': 0, maxTps: 10});
  Blockchains.push(bitcoin);
  let bitcoinPlatform = new Platform({ y: 100, name: 'bitcoin', color: '#d38d10', backgroundColor: null, chains: [bitcoin], emitterTPS: 10});
  Platforms.push(bitcoinPlatform);

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

}

Scalability.set = function() {

  // #1
  dialog = new Dialog([
  new Text('Scalability', '60px Roboto', {color: '#316565'}),
  new Text('If its not enougth, just pop a chain', '20px Arial', {paddingTop: 20, paddingBottom: 20}),
  ], [
  new Button('CONTINUE', proxy(this.continue, this), {float: 'center'}),
  ], {
  });
  this.addDialog(dialog);

  // #2
  dialog = new Dialog([
    new Text('Ok. Lets view how scaling works at the Komodo Platform'),
    ], [
    ], {
      dx: 0, dy: -50, lifetime: 2000, call: proxy(this.continue, this), backgroundColor: '#FFF',
      onload: function(_this) {
        let komodo = Platforms.find(b => b.params.name == 'komodo');
        komodo.fadeIn(500);
        komodo.emitter.start();
        let bitcoin = Platforms.find(b => b.params.name == 'bitcoin');
        bitcoin.fadeIn(500);
        bitcoin.emitter.start();
        TimeLine.start();
      }
    });
  this.addDialog(dialog);

  // #3
  dialog = new Dialog([
    new Text('First, looking at Bitcoin, we know that Bitcoin have a maximum capacity of 10 transaction per secound.'),
    ], [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'})
    ], {
      dx: -100, dy: -200, backgroundColor: '#FFF',
      arrow: {x:0, y:-90}, arrowFrom: 'top'
    });
  this.addDialog(dialog);

  // #4
  dialog = new Dialog([
    new Text('More realistically mostly around 8tps...'),
    ], [
    ], {
      lifetime: 3000, call: proxy(this.continue, this),
      dx: 350, dy: -220, backgroundColor: '#FFF',
      arrow: {x:-50, y:-50}, arrowFrom: 'top', arrowCenter: -50,
    });
  this.addDialog(dialog);

  // #5
  dialog = new Dialog([
    new Text('By improving the Bitcoin protocol, and changing the block time,'),
    new Text('The Komodo can handle nearly 100 transaction per seconds !'),
    new Text(' '),
    new Text("Let's try out !", '20px Arial'),
    ], [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'}),
    ], {
      dx: 180, dy: 0, backgroundColor: '#FFF',
      arrow: {x:0, y:-100}, arrowFrom: 'top'
    });
  this.addDialog(dialog);

  // #5
  dialog = new Dialog([
    new Text('By improving the Bitcoin protocol, and changing the block time,'),
    new Text('The Komodo can handle nearly 100 transaction per seconds !'),
    new Text(''),
    new Text("Let's try out !", '20px Arial'),
    ], [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'}),
    ], {
      dx: 180, dy: 0, backgroundColor: '#FFF',
      arrow: {x:0, y:-100}, arrowFrom: 'top',
      onload: function(_this) {

        let emitter = Emitters.find(e => e.name == 'komodo');
        emitter.params.tps = 100;

      }
    });
  this.addDialog(dialog);
}