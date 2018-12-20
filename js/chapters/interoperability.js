const Interoperability = new Chapter({name: 'Interoperability'});

Interoperability.init = function() {

  Timelines = new Timeline({
    width: STAGEWIDTH,
    height: STAGEHEIGHT,
    minuteWidth: MinuteWidth,
    minuteSeconds: MinuteSeconds,
    defaultTime: 7,
  });
  Cont_timeline.addChild(Timelines);

  let komodo = new Blockchain({id: 'kmd', name: 'Komodo', color:'#306565', premined: 6, notarizeTo: 'btc', notaryLabelSize: "big", maxTps: 100 });
  var komodoPlatform = new Platform({y: 250, id: 'komodo', name: 'KOMODO PLATFORM', color: '#306565',backgroundColor: '#306565', chains: [komodo], emitterTPS: 40,});
  Platforms.push(komodoPlatform);

  let bitcoin = new Blockchain({id: 'btc', name: 'Bitcoin', color: '#d38d10', blockTime: 10, 'premined': 0, maxTps: 10});
  Blockchains.push(bitcoin);
  let bitcoinPlatform = new Platform({ y: 100, id: 'bitcoin', name: 'Bitcoin', color: '#d38d10', backgroundColor: null, chains: [bitcoin], emitterTPS: 10});
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
  Timelines.hide();



}

Interoperability.set = function() {

  var that = this;

  // #1
  dialog = new Dialog([
  new Text('Interoperability', '60px Roboto', {color: '#316565'}),
  new Text(' [TO DO] ', 'italic 20px Arial', {paddingTop: 20, paddingBottom: 20}),
  ], [
  new Button('CONTINUE', function() {}, {float: 'center'}),
  ], {
    backgroundColor: '#d6e0e0',
  });
  this.addDialog(dialog);

}