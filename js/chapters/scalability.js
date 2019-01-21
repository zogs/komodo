const Scalability = new Chapter({name: 'Scalability'});

Scalability.init = function() {

  Timelines = new Timeline({
    width: STAGEWIDTH,
    height: STAGEHEIGHT,
    minuteWidth: MinuteWidth,
    minuteSeconds: MinuteSeconds,
    defaultTime: 7,
  });
  Cont_timeline.addChild(Timelines);

  let komodo = new Blockchain({id: 'kmd', name: 'Komodo', color:'#306565', premined: 6, notarizeTo: 'btc', notaryLabelSize: "big" });
  var komodoPlatform = new Platform({y: 250, id: 'kmd', name: 'KOMODO PLATFORM', color: '#306565',backgroundColor: '#306565', chains: [komodo], emitterTPS: 80,});
  Platforms.push(komodoPlatform);

  let bitcoin = new Blockchain({id: 'btc', name: 'Bitcoin', color: '#d38d10', blockTime: 10, 'premined': 0, maxTps: 10});
  Blockchains.push(bitcoin);
  let bitcoinPlatform = new Platform({ y: 100, id: 'btc', name: ' ', color: '#d38d10', backgroundColor: null, chains: [bitcoin], emitterTPS: 10, txWeight:1});
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

Scalability.set = function() {

  var that = this;

  // #1
  dialog = new Dialog([
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
    new Text('Ok. Lets view how scaling works at the Komodo Platform'),
    ], [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'center'})
    ], {
      dx: 0, dy: -50,
      onload: function(_this) {
        let komodo = Platforms.find(b => b.params.id == 'kmd');
        komodo.fadeIn(500);
        let bitcoin = Platforms.find(b => b.params.id == 'btc');
        bitcoin.fadeIn(500);
        Timelines.fadeIn(500);
        Timelines.start();
      }
    });
  this.addDialog(dialog);

  // #3
  dialog = new Dialog([
    new Text('First, looking at Bitcoin,'),
    new Text('we know that Bitcoin have a maximum capacity of 10 transactions per second.'),
    new Text(' '),
    ], [
    ], {
      dx: -100, dy: -200,
      arrow: {x:0, y:-90}, arrowFrom: 'top',
      lifetime: 3000, call: proxy(this.continue, this),
    });
  this.addDialog(dialog);

  // #4
  dialog = new Dialog([
    new Text('More realistically mostly around 8tx/s...'),
    ], [
    ], {
      lifetime: 3000, call: proxy(this.continue, this),
      dx: 350, dy: -220,
      arrow: {x:-50, y:-50}, arrowFrom: 'top', arrowCenter: -50,
    });
  this.addDialog(dialog);

  // #5
  dialog = new Dialog([
    new Text('The Komodo blockchain can handle nearly 200 tx/s !'),
    new Text("Let's try out !", '20px Arial'),
    ], [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'center'}),
    ], {
      dx: 180, dy: 20,
      arrow: {x:0, y:-110}, arrowFrom: 'top'
    });
  this.addDialog(dialog);

  // #6
  dialog = new Dialog([
    new Text('Right now, we are around 100tx/s...'),
    new Text("Let's double that !", '20px Arial'),
    ], [
    new Button('DOUBLE', proxy(this.continue, this), {float: 'center'}),
    ], {
      x: 1300, dy: 10,
      arrow: {x:0, y:-100}, arrowFrom: 'top',
      onload: function(_this) {

        let platform = Platforms.find(e => e.params.id == 'kmd');
        platform.drawTotalTps();
      }
    });
  this.addDialog(dialog);

    // #7
  dialog = new Dialog([
    new Text('See how the mempool get rapidly satured ?'),
    ], [

    ], {
      dx: 180, dy: -30,
      arrow: {x:0, y:-50}, arrowFrom: 'top',
      lifetime: 2000, call: proxy(this.continue, this),
      onload: function(_this) {

        let komodo = Platforms.find(e => e.params.id == 'kmd');
        komodo.emitter.params.tps = 200;

      }
    });
  this.addDialog(dialog);

  // #8
  dialog = new Dialog([
    new Text('How to handle that ...?'),
    ], [
    ], {
      dx: 180, dy: -30,
      lifetime: 2000, call: proxy(this.continue, this),
    });
  this.addDialog(dialog);

  // #9
  dialog = new Dialog([
    new Text('Well, just pop another chain !'),
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
        let komodo = Platforms.find(e => e.params.id == 'kmd');
        let chain = komodo.addScalingChain(false);
      }
    });
  this.addDialog(dialog);

  // #11
  dialog = new Dialog([
    new Text('See ? Now the transactions flow is split between two chain ! '),
    new Text('How is this possible ?'),
    new Text('There is no magic, let me explain.'),
    new Text(' '),
    ], [
    new Button("CONTINUE", proxy(this.continue,this), {float: 'center'})
    ], {
      dx: 180, dy: 150,
      arrow: {x:0, y:-120}, arrowFrom: 'top',
    });
  this.addDialog(dialog);

  // #12
  dialog = new Dialog([
    new Text('The Komodo ecosystem can spawn at any time a scaling chain that can validate'),
    new Text('and confirm transaction from the main chain.'),
    new Text('It is possible through a technology that Komodo have cleverly used:'),
    new Text('the Merkleroot of Merkleroot of Merkleroot (MoMoM),'),
    new Text('associated with a special mechanism : the Burn protocol.'),
    new Text(' '),
    new Text("Exactly what is happening ?"),
    ], [
    new Button("CONTINUE", proxy(this.continue,this), {float: 'center'})
    ], {
      dx:0, dy: 0,
    });
  this.addDialog(dialog);

  // #13
  dialog = new Dialog([
    new Text('At each block, the side chain sends to the main chain a summary of all transaction (MoM) that have appends, '),
    new Text('At the same time, the main chain shares a summary of all previous transaction of all chains (MoMoM), '),
    new Text('That way, each chain can validate a transaction from another chain, and with the use of '),
    new Text('the Burn protocol, can maintain a constant level of coin across the whole ecosystem. '),
    new Text(' '),
    ], [
    new Button("CONTINUE", proxy(this.continue,this), {float: 'center'})
    ], {
      dx:0, dy: 0,
    });
  this.addDialog(dialog);

  // #14
  dialog = new Dialog([
    new Text('You can see it there !'),
    ], [
    ], {
      dx:-60, dy: -100,
      arrow: {x:170, y:0}, arrowWidth:20, arrowFrom: 'right',
      lifetime: 4000, call: proxy(this.continue, this),
    });
  this.addDialog(dialog);


  // #15
  dialog = new Dialog([
    new Text("Actually, there is no theoric limit to this mecanism !"),
    new Text("Thousands of chain can be spawn !"),
    new Text(" "),
    new Text("Earlier this year, Komodo has successfully tested a 16000 tx/s stress test"),
    new Text("And now Komodo is preparing a 1 million tx/s test for 2019 !!"),
    new Text(" "),
    ], [
    new Button("CONTINUE", proxy(this.continue,this), {float: 'center'})
    ], {
      dx:0, dy: 0,
    });
  this.addDialog(dialog);


  // #16
  dialog = new Dialog([
    new Text("Now that we have cover the scalability mecanism,                      "),
    new Text("Let's go to the next chapter: INTEROPERABILITY !"),
    new Text(" "),
    ], [
    new Button("ADD TRANSACTIONS", proxy(this.continue,this), { float: 'left', backgroundColor: '#b5c7c7', color: 'white', borderColor: '#b5c7c7', borderWidth: 2 }),
    new Button("REPLAY CHAPTER", proxy(this.replay,this), {float: 'center', x: 20, backgroundColor: '#b5c7c7', color: 'white', borderColor: '#b5c7c7', borderWidth: 2 }),
    new Button("NEXT CHAPTER", proxy(Tour.goToChapter,Tour,['Interoperability']), {float: 'right'}),
    ], {
      dx:0, dy: 0,
    });
  this.addDialog(dialog)


  // #17
  dialog = new Dialog([
    new Text("Yeah, let's have fun !"),
    new Text(" "),
    ], [
    new Button("ADD TRANSACTION", function() { Scalability.addTps(); }, {float: 'left', backgroundColor: '#b5c7c7', color: 'white', borderColor: '#b5c7c7', borderWidth: 2}),
    new Button("ADD CHAIN", function() { Scalability.addChain(); }, {float: 'center', x: 60, backgroundColor: '#b5c7c7', color: 'white', borderColor: '#b5c7c7', borderWidth: 2}),
    new Button("STOP", function() { Scalability.goTo(15); }, {float: 'right'}),
    ], {
      dx:0, dy: -300,
    });
  this.addDialog(dialog);

}


Scalability.addTps = function() {
  let komodo = Platforms.find(e => e.params.id == 'kmd');
  komodo.emitter.params.tps += 100;
}

Scalability.addChain = function() {
  let komodo = Platforms.find(e => e.params.id == 'kmd');
  let chain = komodo.addScalingChain();

  if(chain && chain.localToGlobal(0,0).y > STAGEHEIGHT - chain.params.blockHeight*2) {
    Timelines.scrollY(-chain.params.blockHeight*2);
  }

}
