const Interoperability = new Chapter({name: 'Interoperability'});

Interoperability.init = function() {

  Timelines.reset();

  let komodo = new Blockchain({id: 'kmd', name: 'Komodo', color:'#306565', premined: 6, notarizeTo: 'btc', notaryLabelSize: "big" });
  let AC1 = new Blockchain({id: 'AC1', name: 'Asset Chain 1', color:'#b97183', type: 'AC', ccc: [], premined: 6, notarizeTo: 'kmd'});
  let AC2 = new Blockchain({id: 'AC2', name: 'Asset Chain 2', color:'#1ca064', type: 'AC', ccc: [], premined: 6, notarizeTo: 'kmd'});
  var komodoPlatform = new Platform({y: 250, id: 'kmd', name: 'KOMODO PLATFORM', color: '#306565',backgroundColor: '#306565', chains: [komodo, AC1, AC2], emitterTPS: 50,});
  Platforms.push(komodoPlatform);

  let bitcoin = new Blockchain({id: 'btc', name: 'Bitcoin', color: '#d38d10', blockTime: 10, 'premined': 0, maxTps: 10});
  Blockchains.push(bitcoin);
  let bitcoinPlatform = new Platform({ y: 100, id: 'btc', name: 'Bitcoin', color: '#d38d10', backgroundColor: null, chains: [bitcoin], emitterTPS: 10});
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
  new Text('INTEROPERABILITY', '60px Roboto', {color: '#316565'}),
  new Text(' CONNECTING ALL THE CHAINS ', '20px Arial', {paddingTop: 20, paddingBottom: 20, textAlign: 'center'}),
  ], [
  new Button('START CHAPTER', proxy(this.continue, this), {float: 'center'}),
  ], {
    backgroundColor: '#d6e0e0',
  });
  this.addDialog(dialog);

  // #2
  dialog = new Dialog([
    new Text('With the Komodo platform, everybody can create its own blockchain.'),
    new Text('They are called asset-chains !', 'bold'),
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
    new Text('These asset-chains are highly configurable :'),
    new Text('total supply, premine, block rewards, hashing algorithm... ', 'italic'),
    new Text('You can create a Proof-of-Work chain or an 100% Proof-of-Stake chain'),
    new Text('or even choose a 50%POW / 50%POS mechanism.'),
    ], [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'})
    ], {
      dx: 0, dy: -50,
    });
  this.addDialog(dialog);

  // #4
  dialog = new Dialog([
    new Text("We firmly believe the choice should be yours !", 'bold'),
    new Text("And Komodo is constantly working to bring new customization possibilities,"),
    new Text("to match yours needs and every needs that will come in the future !"),
    ], [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'})
    ], {
      dx: 0, dy: -50,
    });
  this.addDialog(dialog);

  // #5
  dialog = new Dialog([
    new Text("For that purpose, Komodo have developped a smart contract solution,"),
    new Text("called Cross-Chain Smart Contracts.", 'bold'),
    new Text("Let me explain."),
    ], [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'})
    ], {
      dx: 0, dy: -50,
    });
  this.addDialog(dialog);

  // #6
  dialog = new Dialog([
    new Text("Since all chain in the platform can validate other chain transactions,"),
    new Text("this offers the possibility to create automatic executed contracts between multiple chains ! "),
    new Text("Let me show you an example... "),
    ], [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'})
    ], {
      dx: 0, dy: -50,
    });
  this.addDialog(dialog);



  // #7
  dialog = new Dialog([
    new Text("This is the KMDDICE chain."),
    ], [
    ], {
      dx: 0, dy: 70,
      arrow: {x:0, y:50}, arrowFrom: 'bottom',
      lifetime: 2000, call: proxy(this.continue, this),
      onload: function() {
        let platform = Platforms.find(e => e.params.id == 'kmd');
        let KMDDICE = new Blockchain({id: 'KMDDICE', name: 'KMDDICE', color:'#198201', type: 'AC', ccc: ['dice'], premined: 0, notarizeTo: 'kmd', active: false});
        platform.addAssetChain(KMDDICE);
      }
    });
  this.addDialog(dialog);

  // #8
  dialog = new Dialog([
    new Text("It is a chain attached to a smart contract that simulate a dice bet."),
    new Text("If a transaction comes to the smart contract, it is treated as a bet."),
    new Text("If you win, you will be rewarded !", 'bold'),
    new Text("Want to try ?"),
    ], [
    new Button("PLACE A BET", function() { Interoperability.bet(); window.slowMo(0.7, 2000); that.continue(); }, {float: 'right'})
    ], {
      dx: 0, dy: 0,
    });
  this.addDialog(dialog);

  // #9
  dialog = new Dialog([
    new Text("Look here !"),
    ], [
    ], {
      dx: 250, dy: 220,
      arrow: {x:30, y:-50}, arrowFrom: 'top',
      lifetime: 4000, call: proxy(this.continue, this),
    });
  this.addDialog(dialog);

  // #10
  dialog = new Dialog([
    new Text("You win !" , 'bold'),
    new Text("Did you see that transaction going back to the Komodo blockchain?"),
    new Text("That's your payment for the bet. It is automatically created by the smart contract !"),
    ], [
    new Button("WANT TO BET AGAIN ?", proxy(this.continue, this), {float: 'left', backgroundColor: '#b5c7c7', color: 'white', borderColor: '#b5c7c7', borderWidth: 2 }),
    new Button("CONTINUE", function() { Interoperability.goToID('part2'); }, {float: 'right'})
    ], {
      dx: 200, dy: 50,
      onload: function() {
        window.slowMo(1,1000);
      }
    });
  this.addDialog(dialog);

  // #11
  dialog = new Dialog([
    new Text("Ok let's play ! "),
    new Text("(spoiler: you gonna win :)", '16px arial'),
    ], [
    new Button("PLACE A BET", function() { Interoperability.bet(); }, {float: 'left'}),
    new Button("CONTINUE", proxy(this.continue, this), {float: 'right', backgroundColor: '#b5c7c7', color: 'white', borderColor: '#b5c7c7', borderWidth: 2 })
    ], {
      dx: 0, dy: 50,
    });
  this.addDialog(dialog);

  // #12
  dialog = new Dialog([
    new Text("And there's no need for GAS like in the Ethereum platform ! "),
    new Text('With the architecture of Komodo, fees can remains very low.'),
    new Text("Also no problem congesting the network given that each chain is independant !", 'bold'),
    new Text(" "),
    new Text("Indeed, Cross-Chain Smart Contract are very powerfull."),
    ], [
     new Button("CONTINUE", proxy(this.continue, this), {float: 'right'})
    ], {
      dx: 0, dy: 0,
      id: 'part2',
      onload: function() {
        let kmddice = Blockchains.find(b => b.params.id == 'KMDDICE');
        kmddice.params.active = true;
      }
    });
  this.addDialog(dialog);

  dialog = new Dialog([
    new Text("For example, Komodo have delegated the privacy feature inherited from Zcash"),
    new Text("to a dedicated chain: KMDCC"),
    new Text("Maintaining 1:1 ratio with the main KMD chain through the «Asset» crypto-contract,"),
    new Text("every coin on that chain equals exactly 1 KMD coin of the main chain !", 'bold'),
    new Text("Pretty amazing, right ?"),
    new Text(""),
    ], [
     new Button("CONTINUE", proxy(this.continue, this), {float: 'right'})
    ], {
      dx: 0, dy: -30,
      arrow: {x:-30, y:140}, arrowFrom: 'bottom',
      onload: function() {
        let platform = Platforms.find(e => e.params.id == 'kmd');
        platform.emitter.params.tps = 300;
        let KMDCC = new Blockchain({id: 'KMDCC', name: 'KMDCC', color:'#204040', type: 'AC', ccc: ['asset'], premined: 10, notarizeTo: 'kmd', active: true, privacy: null, zRatio: 0.8});
        platform.addAssetChain(KMDCC);
        //Timelines.scrollY(-KMDCC.params.blockHeight*2);
      }
    });
  this.addDialog(dialog);

  // temp
  dialog = new Dialog([
    new Text("[TODO] Maybe we could add here an example of multi-contract interactions ?", 'italic'),
    ], [
     new Button("CONTINUE", proxy(this.continue, this), {float: 'center'}),
    ], {
      dx: 0, dy: 0,
    });
  this.addDialog(dialog);

  // #13
  dialog = new Dialog([
    new Text("Do you want to create your own asset chain ?"),
    ], [
     new Button("YES", proxy(this.continue, this), {float: 'center'}),
    ], {
      dx: 0, dy: -30,
    });
  this.addDialog(dialog);

  // #14
  dialog = new Dialog('dialog-AC', [
     new Button("CREATE", function() { Interoperability.createAC(); Interoperability.continue(); }, {float: 'center'})
    ], {
      dx: 0, dy: -100,
    });
  this.addDialog(dialog);

  // #15
  dialog = new Dialog([
    new Text("Congratulation ! Your chain is now live on the Komodo network !", 'bold'),
    new Text(" "),
    new Text("But don't worry, you are no attach to Komodo. You are totally independant."),
    new Text("Let's say one day Komodo cease to exist (why ? i don't know), then your chain will continue to run normally !"),
    new Text("That's a good point, isn't it ?"),
    ], [
     new Button("CONTINUE", proxy(this.continue, this), {float: 'center'})
    ], {
      dx: 0, dy: 0,
    });
  this.addDialog(dialog);

  // #16
  dialog = new Dialog([
    new Text("There's another good point for using Komodo platform :"),
    new Text(" "),
    new Text("Your coin is directly tradable !", 'bold'),
    new Text("No need to wait for Exchange listing. Your coin will already be tradable on the decentralized exchange"),
    new Text("based on Atomic-Swaps that Komodo have developed : BarterDEX"),
    new Text("Althought the tech is new and still in progress, it can already handle Atomic-Swaps with 95% of coin in existance ! "),
    ], [
     new Button("CONTINUE", proxy(this.continue, this), {float: 'center'})
    ], {
      dx: 0, dy: 0,
    });
  this.addDialog(dialog);

  // #17
  dialog = new Dialog([
    new Text("There is much more to say about Komodo but i'll stop here for now :)"),
    new Text(" "),
    new Text("If you want more information, come join our Discord !"),
    new Link("https://komodoplatform.com/discord","https://komodoplatform.com/discord"),
    new Text("Or follow us on Twitter"),
    new Link("https://twitter.com/KomodoPlatform","https://twitter.com/KomodoPlatform"),
    new Text("Or type 'Komodo' on Telegram, Facebook, Youtube, Medium... :)"),
    new Text(" "),


    ], [
     new Button("CREATE MORE CHAIN", proxy(this.continue, this), {float: 'left', backgroundColor: '#b5c7c7', color: 'white', borderColor: '#b5c7c7', borderWidth: 2  }),
     new Button("GO TO CHAPTER", function() { Interoperability.goToID('chapters'); }, { x: 80, float: 'center', backgroundColor: '#b5c7c7', color: 'white', borderColor: '#b5c7c7', borderWidth: 2 }),
     new Button("END", proxy(this.stop, this), {float: 'right'}),
    ], {
      dx: 0, dy: -100,
      id: 'part3'
    });
  this.addDialog(dialog);

  // #18
  dialog = new Dialog('dialog-AC', [
     new Button("CREATE", function() { Interoperability.createAC(); }, {float: 'left'}),
     new Button("CLOSE", function() { Interoperability.goToID('part3'); }, {float: 'right', backgroundColor: '#b5c7c7', color: 'white', borderColor: '#b5c7c7', borderWidth: 2 })
    ], {
      dx: 0, dy: -100,
    });
  this.addDialog(dialog);

  dialog = new Dialog([
      new Text("You can replay a chapter if you want.")
    ],[
    new Button("SECURITY", proxy(Tour.goToChapter,Tour,['Security']), { float: 'left'}),
    new Button("SCALABILITY", proxy(Tour.goToChapter,Tour,['Scalability']), { float: 'center', x: -40}),
    new Button("INTEROPERABILITY", proxy(this.replay, this), { float: 'right'}),
    ], {
      dx: 0, dy: 0,
      id: 'chapters'
    });
  this.addDialog(dialog);
}

Interoperability.bet = function() {

  let platform = Platforms.find(e => e.params.id == 'kmd');
  let KMDDICE = Blockchains.find(e => e.params.id == 'KMDDICE');
  let trans = new Transaction({'blockchain': KMDDICE, 'mempool': KMDDICE.mempool, type:'ccc', ccc: KMDDICE.mempool.getContract('dice')});
  platform.emitter.emitWithMotion(trans, KMDDICE);

}

Interoperability.AssetCreatedCount = 0;

Interoperability.createAC = function() {

  var form = document.querySelector('form');
  var name = form.querySelector('input[name="name"]').value;
  var supply = form.querySelector('input[name="supply"]').value;
  var rewards = form.querySelector('input[name="rewards"]').value;
  var halving = form.querySelector('input[name="halving"]').value;
  var consensus = form.querySelector('select[name="consensus"]').value;
  var logo = form.querySelector('input[name="logo"]:checked').value;
  var privacy = form.querySelector('select[name="privacy"]').value;
  var ccc = [
    form.querySelector('input[name="cc_dice"]:checked'),
    form.querySelector('input[name="cc_asset"]:checked'),
    form.querySelector('input[name="cc_reward"]:checked'),
    form.querySelector('input[name="cc_oracle"]:checked'),
    form.querySelector('input[name="cc_faucet"]:checked'),
    form.querySelector('input[name="cc_cog"]:checked'),
  ].map(c => (c)? c.value : null).filter(v => v !== null);

  //console.log(form, name, supply, rewards, halving, consensus, ccc, privacy);

  color = '#989898';
  if(logo == 'chameleon') color = '#54ad4d';
  if(logo == 'wolf') color = '#d4c85c';
  if(logo == 'snail') color = '#00a99d';
  if(logo == 'penguin') color = '#7ccfed';
  if(logo == 'unicorn') color = '#f3aaf7';

  let id = name+this.AssetCreatedCount;

  let platform = Platforms.find(e => e.params.id == 'kmd');
  let chain = new Blockchain({id: id, name: name, color:color, type: 'AC', ccc: ccc, premined: 0, notarizeTo: 'kmd', logo: 'icon_'+logo, privacy: parseInt(privacy)});
  platform.addAssetChain(chain);

  if(chain && chain.localToGlobal(0,0).y > STAGEHEIGHT - chain.params.blockHeight*2) {
    Timelines.scrollY(-chain.params.blockHeight*2);
  }

  this.AssetCreatedCount++;
}