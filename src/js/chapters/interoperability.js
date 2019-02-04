import {extend, proxy} from '../utils';
import {Chapter} from '../chapter';
import {Dialog, Button, Text, Link} from '../dialog';
import {Blockchain} from '../blockchains/blockchain';
import {Platform} from '../blockchains/platform';
import {Transaction} from '../blockchains/transaction';
import createjs from 'createjs';

export const Interoperability = new Chapter({name: 'Interoperability & Independence'});

Interoperability.init = function() {

  window.Timelines.reset();

  let komodo = new Blockchain({id: 'kmd', name: 'Komodo', color:'#306565', premined: 6, notarizeTo: 'btc', notaryLabelSize: "big" });
  let AC1 = new Blockchain({id: 'AC1', name: 'Asset Chain 1', color:'#b97183', type: 'AC', ccc: [], premined: 6, notarizeTo: 'kmd'});
  let AC2 = new Blockchain({id: 'AC2', name: 'Asset Chain 2', color:'#1ca064', type: 'AC', ccc: [], premined: 6, notarizeTo: 'kmd'});
  var komodoPlatform = new Platform({y: 250, id: 'kmd', name: 'KOMODO PLATFORM', color: '#306565',backgroundColor: '#306565', chains: [komodo, AC1, AC2], emitterTPS: 50,});
  window.Platforms.push(komodoPlatform);

  let bitcoin = new Blockchain({id: 'btc', name: 'Bitcoin', color: '#d38d10', blockTime: 10, 'premined': 0, maxTps: 10});
  window.Blockchains.push(bitcoin);
  let bitcoinPlatform = new Platform({ y: 100, id: 'btc', name: 'Bitcoin', color: '#d38d10', backgroundColor: null, chains: [bitcoin], emitterTPS: 10});
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

Interoperability.set = function() {

  var that = this;

  // #1
  let dialog = new Dialog([
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
    new Text('With Komodo platform anyone can create his own blockchain instantly and (for) free!'),
    new Text('Those BTC and ETH compatible blockchains are called Assetchains!', 'bold'),
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
    new Text('Assetchains are precisely configurable and offer wide range of configuration options:'),
    new Text('total supply, premine, block rewards, hashing algorithm, PoS, PoW, etc.  ', 'italic'),
    new Text('You can create a Proof-of-Work chain or a 100% Proof-of-Stake chain'),
    new Text('and actually you could even go with a 50%POW & 50%POS mechanism.'),
    new Text('With Komodo it is even possible to easily integrate Custom Consensus (CC) rules!'),
    ], [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'})
    ], {
      dx: 0, dy: -50,
    });
  this.addDialog(dialog);

  // #4
  dialog = new Dialog([
    new Text("Komodo gives its users and ecosystem developers the choice and doesnt mind extra work.", 'bold'),
    new Text("CC, the crypto conditions, can be imported to a blockchain like a plug & play module! "),
    new Text("You can change the logic of a blockchain on core/consensus level and Komodo has many"),
    new Text("CC modules in work. You want to make a casino blockchain with dice? You want to sell"),
    new Text("data on the blockchain and earn from it? Or lets say you want to play 'Rogue'?"),
    ], [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'})
    ], {
      dx: 0, dy: -50,
    });
  this.addDialog(dialog);

  // #5
  dialog = new Dialog([
    new Text("This Crypto Conditions technology (CC) is similar to a smart contract, but its much more,"),
    new Text("its like when you get your own ETH platform - not just one smartcontract!", 'bold'),
    new Text("And this is not enough. Komodo has made all their technologies fully interoperable!"),
    ], [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'})
    ], {
      dx: 0, dy: -50,
    });
  this.addDialog(dialog);

  // #6
  dialog = new Dialog([
    new Text("Any new Blockchain that was built with Komodo (i heard soon its possible with some clicks!),"),
    new Text("can be built with the Crypto Conditions. Many chains exist already with such custom function. "),
    new Text("Let me show you an example: "),
    ], [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'})
    ], {
      dx: 0, dy: -50,
    });
  this.addDialog(dialog);



  // #7
  dialog = new Dialog([
    new Text("This is the KMDICE, a Komodo generated Blockchain."),
    ], [
    ], {
      dx: 0, dy: 70,
      arrow: {x:0, y:50}, arrowFrom: 'bottom',
      lifetime: 2000, call: proxy(this.continue, this),
      onload: function() {
        let platform = window.Platforms.find(e => e.params.id == 'kmd');
        let KMDICE = new Blockchain({id: 'KMDICE', name: 'KMDICE', color:'#198201', type: 'AC', ccc: ['dice'], premined: 0, notarizeTo: 'kmd', active: false});
        platform.addAssetChain(KMDICE);
      }
    });
  this.addDialog(dialog);

  // #8
  dialog = new Dialog([
    new Text("This chain has a new CC plugin ('smart contract') that lets you roll the dice."),
    new Text("The KMDICE chain has new commands because of the CC plugin (CC_DICE) and so you"),
    new Text("can create transaction which are like a bet - if you win you get rewarded automagic !", 'bold'),
    new Text("Want to give it a try (gamble responsibly!)?"),
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
    new Text("WIN!" , 'bold'),
    new Text("Did you see the gambling transaction going back to the Komodo blockchain via cluster technology?"),
    new Text("This is part of the multichain sync protocol from jl777 and his team!"),
    ], [
    new Button("WANT TO BET AGAIN?", proxy(this.continue, this), {float: 'left', backgroundColor: '#b5c7c7', color: 'white', borderColor: '#b5c7c7', borderWidth: 2 }),
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
    new Text("Ok let's gamble "),
    new Text("(Spoiler: you will most likely win :)", '16px arial'),
    ], [
    new Button("PLACE A BET", function() { Interoperability.bet(); }, {float: 'left'}),
    new Button("CONTINUE", proxy(this.continue, this), {float: 'right', backgroundColor: '#b5c7c7', color: 'white', borderColor: '#b5c7c7', borderWidth: 2 })
    ], {
      dx: 0, dy: 50,
    });
  this.addDialog(dialog);

  // #12
  dialog = new Dialog([
    new Text("Unlike many other 'smart' platform Komodo technology is free and there is no gas! "),
    new Text('The concept and architecture of the Komodoplatform aligns with their vision'),
    new Text("Independently connect all chains in a free and open world", 'bold'),
    new Text(" "),
    new Text("CC technology and Komodoplatform make your chain compatible with the everything!"),
    ], [
     new Button("CONTINUE", proxy(this.continue, this), {float: 'right'})
    ], {
      dx: 0, dy: 0,
      id: 'part2',
      onload: function() {
        let kmdice = window.Blockchains.find(b => b.params.id == 'KMDICE');
        kmdice.params.active = true;
      }
    });
  this.addDialog(dialog);

  dialog = new Dialog([
    new Text("For example, Komodo has outsourced shielded zTransactions"),
    new Text("to their own assetchain: KMDCC"),
    new Text("Their system maintains a 1:1 ratio with the main KMD chain thanks to their MoMoM tech"),
    new Text("every coin in KMDCC equals exactly 1 KMD coin in the KMD mainnet !", 'bold'),
    new Text("Pretty amazing, right ?"),
    new Text(""),
    ], [
     new Button("CONTINUE", proxy(this.continue, this), {float: 'right'})
    ], {
      dx: 0, dy: -30,
      arrow: {x:-30, y:140}, arrowFrom: 'bottom',
      onload: function() {
        let platform = window.Platforms.find(e => e.params.id == 'kmd');
        platform.emitter.params.tps = 300;
        let KMDCC = new Blockchain({id: 'KMDCC', name: 'KMDCC', color:'#204040', type: 'AC', ccc: ['asset'], premined: 10, notarizeTo: 'kmd', active: true, privacy: null, zRatio: 0.8});
        platform.addAssetChain(KMDCC);
        //window.Timelines.scrollY(-KMDCC.params.blockHeight*2);
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
    new Text("Congratulation ! Your chain is now live in the Komodo universe!", 'bold'),
    new Text(" "),
    new Text("But don't worry you don not rely on Komodo. You are totally independant!"),
    new Text("Let's say one Komodo dissapears one day (kidnapped by aliens), then your chain will continue to run normally !"),
    new Text("That's a good argument to use KMD, isn't it ?"),
    ], [
     new Button("CONTINUE", proxy(this.continue, this), {float: 'center'})
    ], {
      dx: 0, dy: 0,
    });
  this.addDialog(dialog);

  // #16
  dialog = new Dialog([
    new Text("There's another very good point for using Komodo platform :"),
    new Text(" "),
    new Text("Your coin is instantly tradable !", 'bold'),
    new Text("No need to wait for costy and slow Exchange listings. Your coin will already be tradable on the next gen. decentralized exchange"),
    new Text("based on an invention called 'SPV Atomic Swaps' that was developed by KMD : BarterDEX"),
    new Text("BarterDEX, is Komodos 3rd generation DEX and natively mobile ready - on Smartphone! "),
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
    new Text("If you are curious for more information, please come join our Discord !"),
    new Link("https://komodoplatform.com/discord","https://komodoplatform.com/discord"),
    new Text("And pls follow us on Twitter"),
    new Link("https://twitter.com/KomodoPlatform","https://twitter.com/KomodoPlatform"),
    new Text("Or search for 'Komodo' on Telegram, Facebook, Youtube, Medium... :)"),
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
    new Button("SECURITY", proxy(window.Tour.goToChapter,window.Tour,['Security']), { float: 'left'}),
    new Button("SCALABILITY", proxy(window.Tour.goToChapter,window.Tour,['Scalability']), { float: 'center', x: -40}),
    new Button("INTEROPERABILITY", proxy(this.replay, this), { float: 'right'}),
    ], {
      dx: 0, dy: 0,
      id: 'chapters'
    });
  this.addDialog(dialog);
}

Interoperability.bet = function() {

  let platform = window.Platforms.find(e => e.params.id == 'kmd');
  let KMDICE = window.Blockchains.find(e => e.params.id == 'KMDICE');
  let trans = new Transaction({'blockchain': KMDICE, 'mempool': KMDICE.mempool, type:'ccc', ccc: KMDICE.mempool.getContract('dice')});
  platform.emitter.emitWithMotion(trans, KMDICE);

}

Interoperability.AssetCreatedCount = 0;

Interoperability.createAC = function() {

  let form = document.querySelector('form');
  let name = form.querySelector('input[name="name"]').value;
  let supply = form.querySelector('input[name="supply"]').value;
  let rewards = form.querySelector('input[name="rewards"]').value;
  let halving = form.querySelector('input[name="halving"]').value;
  let consensus = form.querySelector('select[name="consensus"]').value;
  let logo = form.querySelector('input[name="logo"]:checked').value;
  let privacy = form.querySelector('select[name="privacy"]').value;
  let ccc = [
    form.querySelector('input[name="cc_dice"]:checked'),
    form.querySelector('input[name="cc_asset"]:checked'),
    form.querySelector('input[name="cc_reward"]:checked'),
    form.querySelector('input[name="cc_oracle"]:checked'),
    form.querySelector('input[name="cc_faucet"]:checked'),
    form.querySelector('input[name="cc_cog"]:checked'),
  ].map(c => (c)? c.value : null).filter(v => v !== null);

  //console.log(form, name, supply, rewards, halving, consensus, ccc, privacy);

  let color = '#989898';
  if(logo == 'chameleon') color = '#54ad4d';
  if(logo == 'wolf') color = '#d4c85c';
  if(logo == 'snail') color = '#00a99d';
  if(logo == 'penguin') color = '#7ccfed';
  if(logo == 'unicorn') color = '#f3aaf7';

  let id = name+this.AssetCreatedCount;

  let platform = window.Platforms.find(e => e.params.id == 'kmd');
  let chain = new Blockchain({id: id, name: name, color:color, type: 'AC', ccc: ccc, premined: 0, notarizeTo: 'kmd', logo: 'icon_'+logo, privacy: parseInt(privacy)});
  platform.addAssetChain(chain);

  if(chain && chain.localToGlobal(0,0).y > STAGEHEIGHT - chain.params.blockHeight*2) {
    window.Timelines.scrollY(-chain.params.blockHeight*2);
  }

  this.AssetCreatedCount++;
}
