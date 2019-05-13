import {extend, proxy} from '../utils';
import {Chapter} from '../chapter';
import {Dialog, Button, Text, Link, Image} from '../dialog';
import {Blockchain} from '../blockchains/blockchain';
import {Platform} from '../blockchains/platform';
import {Transaction} from '../blockchains/transaction';
import {RogueCC} from '../blockchains/contract';
import createjs from 'createjs';

export const Interoperability = new Chapter({name: 'Interoperability & Independence'});

Interoperability.init = function() {

  window.Timelines.reset();

  let komodo = new Blockchain({id: 'kmd', name: 'Komodo', color:'#53f1be', premined: 6, notarizeTo: 'btc', notaryLabelSize: "big" });
  let AC1 = new Blockchain({id: 'AC1', name: 'Asset Chain 1', color:'#fd3397', type: 'AC', ccc: [], premined: 6, notarizeTo: 'kmd'});
  let AC2 = new Blockchain({id: 'AC2', name: 'Asset Chain 2', color:'#917efb', type: 'AC', ccc: [], premined: 6, notarizeTo: 'kmd'});
  var komodoPlatform = new Platform({y: 260, id: 'kmd', name: ' ', color: '#53f1be', borderColor: '#53f1be', chains: [komodo, AC1, AC2], emitterTPS: 50,});
  window.Platforms.push(komodoPlatform);

  let bitcoin = new Blockchain({id: 'btc', name: 'Bitcoin', color: '#eb8c18', blockTime: 10, 'premined': 0, maxTps: 10});
  window.Blockchains.push(bitcoin);
  let bitcoinPlatform = new Platform({ y: 110, id: 'btc', name: ' ', color: '#eb8c18', chains: [bitcoin], emitterTPS: 10});
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
  let dialog = new Dialog(`
    <div class="chapter">
      <h1>INTEROPERABILITY</h1>
      <h2>CONNECTING ALL THE CHAINS</h2>
    </div>
  `, [
  new Button('START CHAPTER', proxy(this.continue, this), {float: 'center', borderWidth:3}),
  ], {
  });
  this.addDialog(dialog);

  // #2
  dialog = new Dialog(`
    <p>With <strong>KOMODO</strong> platform anyone can create his own blockchain instantly and (for) free!</p>
    <p>Those BTC and ETH compatible blockchains are called Assetchains!</p>
    `, [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'center'})
    ], {
      y: 350,
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
  dialog = new Dialog(`
    <p>Assetchains are precisely configurable and offer wide range of configuration options:</p>
    <p>total supply, premine, block rewards, hashing algorithm, PoS, PoW, etc.</p>
    <p>You can create a Proof-of-Work chain or a 100% Proof-of-Stake chain</p>
    <p>and actually you could even go with a 50%POW & 50%POS mechanism.</p>
    <p>With Komodo it is even possible to easily integrate Custom Consensus (CC) rules!</p>
    `, [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'})
    ], {
      y: 350,
    });
  this.addDialog(dialog);

  // #4
  dialog = new Dialog(`
    <p>Komodo gives its users and ecosystem developers the choice and doesnt mind extra work.</p>
    <p>CC, the Crypto Conditions, can be imported to a blockchain like a plug & play module!</p>
    <p>You can change the logic of a blockchain on core/consensus level and Komodo has many</p>
    <p>CC modules in work. You want to make a casino blockchain with dice? You want to sell</p>
    <p>data on the blockchain and earn from it? Or lets say you want to play 'Rogue'?</p>
    `, [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'})
    ], {
      y: 350,
    });
  this.addDialog(dialog);

  // #5
  dialog = new Dialog(`
    <p>This Crypto Conditions technology (CC) is similar to a smart contract, but its much more,</p>
    <p>its like when you get your own ETH platform - not just one smartcontract!</p>
    <p>And this is not enough. Komodo has made all their technologies fully interoperable!</p>
    `, [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'})
    ], {
      y: 350,
    });
  this.addDialog(dialog);

  // #6
  dialog = new Dialog(`
    <p>Any new Blockchain that was built with Komodo (i heard soon its possible with some clicks!),</p>
    <p>can be built with the Crypto Conditions. Many chains exist already with such custom function. </p>
    <p>Let me show you an example: </p>
    `, [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'})
    ], {
      y: 350,
    });
  this.addDialog(dialog);



  // #7
  dialog = new Dialog(`
    <p>This is the KMDICE, a Komodo generated Blockchain.</p>
    `, [
    ], {
      y: 470,
      arrow: {x:0, y:50}, arrowFrom: 'bottom',
      lifetime: 2000, call: proxy(this.continue, this),
      onload: function() {
        let platform = window.Platforms.find(e => e.params.id == 'kmd');
        let KMDICE = new Blockchain({id: 'KMDICE', name: 'KMDICE', color:'#05afea', type: 'AC', ccc: ['dice'], premined: 0, notarizeTo: 'kmd', active: false});
        platform.addAssetChain(KMDICE);
      }
    });
  this.addDialog(dialog);

  // #8
  dialog = new Dialog(`
    <p>This chain has a new CC plugin ('smart contract') that lets you roll the dice.</p>
    <p>The KMDICE chain has new commands because of the CC plugin (CC_DICE) and so you</p>
    <p>can create transaction which are like a bet - if you win you get rewarded automagic !</p>
    <p>Want to give it a try (gamble responsibly!)?</p>
    `, [
    new Button("PLACE A BET", function() { Interoperability.bet(); window.slowMo(0.7, 2000); that.continue(); }, {float: 'right'})
    ], {
    });
  this.addDialog(dialog);

  // #9
  dialog = new Dialog(`
    <p>Look here !</p>
    `, [
    ], {
      x: 1000, y: 620,
      arrow: {x:30, y:-50}, arrowFrom: 'top',
      lifetime: 4000, call: proxy(this.continue, this),
    });
  this.addDialog(dialog);

  // #10
  dialog = new Dialog(`
    <p><strong>WIN!</strong></p>
    <p>Did you see the gambling transaction going back to the Komodo blockchain via cluster technology?</p>
    <p>This is part of the multichain sync protocol from jl777 and his team!</p>
    `, [
    new Button("WANT TO BET AGAIN?", proxy(this.continue, this), {float: 'left'}),
    new Button("CONTINUE", function() { Interoperability.goToID('part2'); }, {float: 'right'})
    ], {
      x: 850, y: 450,
      onload: function() {
        window.slowMo(1,1000);
      }
    });
  this.addDialog(dialog);

  // #11
  dialog = new Dialog(`
    <p>Ok let's gamble </p>
    <p><small>(Spoiler: you will most likely win :)</small></p>
    `, [
    new Button("PLACE A BET", function() { Interoperability.bet(); }, {float: 'left'}),
    new Button("CONTINUE", proxy(this.continue, this), {float: 'right'})
    ], {
      y: 450,
    });
  this.addDialog(dialog);

  // #12
  dialog = new Dialog(`
    <p>Unlike many other 'smart' platform Komodo technology is free and there is no gas! </p>
    <p>The concept and architecture of the Komodoplatform aligns with their vision</p>
    <p>Independently connect all chains in a free and open world"</p>
    <p> </p>
    <p>CC technology and Komodoplatform make your chain compatible with the everything!</p>
    `, [
     new Button("CONTINUE", proxy(this.continue, this), {float: 'right'})
    ], {
      id: 'part2',
      onload: function() {
        let kmdice = window.Blockchains.find(b => b.params.id == 'KMDICE');
        kmdice.params.active = true;
      }
    });
  this.addDialog(dialog);

  dialog = new Dialog(`
    <p>For example, Komodo has outsourced shielded zTransactions</p>
    <p>to their own assetchain: KMDCC</p>
    <p>Their system maintains a 1:1 ratio with the main KMD chain thanks to their MoMoM tech</p>
    <p>every coin in KMDCC equals exactly 1 KMD coin in the KMD mainnet !</p>
    <p>Pretty amazing, right ?</p>
    <p></p>
    `, [
     new Button("CONTINUE", proxy(this.continue, this), {float: 'right'})
    ], {
      y: 370,
      arrow: {x:-30, y:140}, arrowFrom: 'bottom',
      onload: function() {
        let platform = window.Platforms.find(e => e.params.id == 'kmd');
        platform.emitter.params.tps = 300;
        let KMDCC = new Blockchain({id: 'KMDCC', name: 'KMDCC', color:'#a9a627', type: 'AC', ccc: ['asset'], premined: 10, notarizeTo: 'kmd', active: true, privacy: null, zRatio: 0.8});
        platform.addAssetChain(KMDCC);
        window.Timelines.scrollY(-KMDCC.params.blockHeight*2);
      }
    });
  this.addDialog(dialog);


  dialog = new Dialog(`
      <p>One last example to show you the power of Crypto Conditions (CC)...</p>
      <p>Let's talk about ROGUE !</p>
      <p><img src="dist/images/icon/rogue.png"></p>
    `,[
      new Button("CONTINUE", proxy(this.continue, this), {float: 'center'}),
    ],{
      y: 350
    });
  this.addDialog(dialog);


  dialog = new Dialog(`
      <p>ROGUE was a dungeon crawling video game developed around 1980. It was pretty popular back then</p>
      <p>and lead the way for ROGUE-like video games !</p>
      <p> </p>
      <p>And now ROGUE is playable on the blockchain with Komodo !</p>
    `, [
      new Button("CONTINUE", proxy(this.continue, this), {float: 'center'}),
    ], {
      x: 760, y: 370,
      arrow: {x:300, y:150}, arrowFrom: 'bottom', arrowCenter: 300,
      onload: function(_this) {
        let platform = window.Platforms.find(e => e.params.id == 'kmd');
        let ROGUE = new Blockchain({id: 'ROGUE', name: 'ROGUE chain', color:'#adadad', type: 'AC', ccc: ['rogue'], premined: 6, notarizeTo: 'kmd'});
        platform.addAssetChain(ROGUE);
        window.Timelines.scrollY(-ROGUE.params.blockHeight*2);
      }
    });
  this.addDialog(dialog);


  dialog = new Dialog(`
      <p>To demonstrate how it work, let's pretend to start a game ! </p>
      <p> </p>
    `, [
      new Button("START A GAME", function() { Interoperability.startRogue(); that.continue(); }, {float: 'center'}),
    ], {
      id: 'start_rogue',
    });
  this.addDialog(dialog);

  dialog = new Dialog(`
      <p>The game is created and broadcasted to the blockchain </p>
      <p>and you can start playing via your game client... </p>
    `, [
      new Button("CONTINUE", function() { that.continue(); }, {float: 'center'}),
    ], {
      x: 900, y: 390,
      arrow: {x:0, y:110}, arrowFrom: 'bottom', arrowCenter: 100,
    });
  this.addDialog(dialog);

  dialog = new Dialog(`
      <p>Then, you valiantly fight numerous trolls and hobgobelins for hours and now you want to quit the game.</p>
      <p> </p>
      <p>Your warrior and his equipments will be save on the blockchain using non-fungible token !</p>
      <p>And combined with the Crypto Conditions (CC) technology, any gold you have collected in-game is transferred into real ROGUE coins,</p>
      <p>connecting the gaming world with the real world of cryptocurrencies !</p>
      <p>(That's pretty amazing if you think about it...)</p>
    `, [
      new Button("QUIT AND SAVE", function() { Interoperability.saveRogue(0, '5'); that.continue(); }, {float: 'center'}),
    ], {
      y: 260,
    });
  this.addDialog(dialog);

  dialog = new Dialog(`
      <p>Your character is now a unique one, written on the blockchain, ready to be</p>
      <p>use again in single training game or multiplayer tournament !</p>
      <p> </p>
      <p>You can also choose to sell him for the higher bid !</p>
      <p>Do as you please, he entirely belongs to you...</p>
    `, [
      new Button("PLAY AGAIN", function() { Interoperability.goToID('start_rogue'); }, {float: 'left'}),
      new Button("SELL HIM", function() { Interoperability.sellRogue(0, '5'); that.continue() }, {float: 'right'}),
    ], {
      y: 260,
    });
  this.addDialog(dialog);


  dialog = new Dialog(`
      <p><strong>Sold !</strong></p>
      <p>Imagine all the possibility its offers !</p>
      <p>From blockchain-based market places of real games characters, or even supply, </p>
      <p>equipments, magic swords... to on-chain characters shared across differents compatibles games, etc... </p>
      <p>Komodo game's ROGUE is the first of its kind, but is a good example of what can be achieve with the power</p>
      <p>of Komodo Crypto Contitions (CC) technology.</p>
    `, [
      new Button("CONTINUE", function() {  Interoperability.continuousRogue(); that.continue() }, {float: 'right'}),
    ], {
      y: 260,
    });
  this.addDialog(dialog);


  // #13
  dialog = new Dialog(`
    <p>Do you remember that anyone can create a blockchain on the Komodo Platform ?</p>
    <p>It's easy and and just required some clicking !</p>
    <p>Would you like to try ?</p>
    `, [
     new Button("YES", proxy(this.continue, this), {float: 'center'}),
    ], {
      y: 370,
    });
  this.addDialog(dialog);

  // #14
  dialog = new Dialog('#dialog-AC', [
     new Button("CREATE", function() { Interoperability.createAC(); Interoperability.continue(); }, {float: 'center'})
    ], {
      y: 300,
    });
  this.addDialog(dialog);

  // #15
  dialog = new Dialog(`
    <p><strong>Congratulation !</strong> Your chain is now live in the Komodo universe!</p>
    <p> </p>
    <p>But don't worry, you do not rely on Komodo Platform. You are totally independant!</p>
    <p>Let's say one Komodo dissapears one day (kidnapped by aliens), then your chain will continue to run normally !</p>
    <p>That's a good argument to use KMD, isn't it ?</p>
    `, [
     new Button("CONTINUE", proxy(this.continue, this), {float: 'center'})
    ], {
    });
  this.addDialog(dialog);

  // #16
  dialog = new Dialog(`
    <p>There's another very good point for using Komodo platform :</p>
    <p> </p>
    <p>Your coin is instantly tradable !</p>
    <p>No need to wait for costy and slow Exchange listings. Your coin will already be tradable on the next gen. decentralized exchange</p>
    <p>based on an invention called 'SPV Atomic Swaps' that was developed by KMD : BarterDEX</p>
    <p>BarterDEX, is Komodos 3rd generation DEX and natively mobile ready - on Smartphone! </p>
    `, [
     new Button("CONTINUE", proxy(this.continue, this), {float: 'center'})
    ], {
    });
  this.addDialog(dialog);

  // #17
  dialog = new Dialog(`
    <p>There is much more to say about Komodo but i'll stop here for now :)</p>
    <p> </p>
    <p>If you are curious for more information, please come join our Discord !</p>
    <p><a href="https://komodoplatform.com/discord">https://komodoplatform.com/discord</a></p>
    <p>And please follow us on Twitter</p>
    <p><a href="https://twitter.com/KomodoPlatform">https://twitter.com/KomodoPlatform</a></p>
    <p>Or search for 'Komodo' on Telegram, Facebook, Youtube, Medium... :)</p>
    <p> </p>
    `, [
     new Button("CREATE MORE CHAIN", proxy(this.continue, this), {float: 'left'}),
     new Button("GO TO CHAPTER", function() { Interoperability.goToID('chapters'); }, { x: 80, float: 'center'}),
     new Button("END", proxy(this.stop, this), {float: 'right'}),
    ], {
      y: 300,
      id: 'part3'
    });
  this.addDialog(dialog);

  // #18
  dialog = new Dialog('#dialog-AC', [
     new Button("CREATE", function() { Interoperability.createAC(); }, {float: 'left'}),
     new Button("CLOSE", function() { Interoperability.goToID('part3'); }, {float: 'right'})
    ], {
      y: 300,
    });
  this.addDialog(dialog);

  dialog = new Dialog(`
      <p>You can replay a chapter if you want.</p>
    `,[
    new Button("SECURITY", proxy(window.Tour.goToChapter,window.Tour,['Security']), { float: 'left'}),
    new Button("SCALABILITY", proxy(window.Tour.goToChapter,window.Tour,['Scalability']), { float: 'center', x: -40}),
    new Button("INTEROPERABILITY", proxy(this.replay, this), { float: 'right'}),
    ], {
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

Interoperability.startRogue = function() {

  let platform = window.Platforms.find(e => e.params.id == 'kmd');
  let rogue = window.Blockchains.find(e => e.params.id == 'ROGUE');
  let rogue_cc = rogue.mempool.getContract('rogue');

  rogue_cc.createGame();

}

Interoperability.saveRogue = function(n, level) {

  let platform = window.Platforms.find(e => e.params.id == 'kmd');
  let rogue = window.Blockchains.find(e => e.params.id == 'ROGUE');
  let rogue_cc = rogue.mempool.getContract('rogue');


  rogue_cc.saveWarrior(n, level);

}

Interoperability.sellRogue = function(n, level) {

  let platform = window.Platforms.find(e => e.params.id == 'kmd');
  let rogue = window.Blockchains.find(e => e.params.id == 'ROGUE');
  let rogue_cc = rogue.mempool.getContract('rogue');

  rogue_cc.sellWarrior(n, level);

}

Interoperability.buyRogue = function(n, level) {

  let platform = window.Platforms.find(e => e.params.id == 'kmd');
  let rogue = window.Blockchains.find(e => e.params.id == 'ROGUE');
  let rogue_cc = rogue.mempool.getContract('rogue');

  rogue_cc.buyWarrior(n, level);

}

Interoperability.continuousRogue = function() {

  let platform = window.Platforms.find(e => e.params.id == 'kmd');
  let rogue = window.Blockchains.find(e => e.params.id == 'ROGUE');
  let rogue_cc = rogue.mempool.getContract('rogue');

  createjs.Tween.get(this).to({}, window.MinuteSeconds*1000*2 + Math.random()*window.MinuteSeconds*1000*2)
    .call(function() {
      let n = Math.floor(Math.random()*rogue_cc.warriors.getNumFrames());
      let l = Math.ceil(Math.random()*10);
      if(Math.random()<0.5) {
        Interoperability.buyRogue(n,l)
      }
      else {
        Interoperability.sellRogue(n,l)
      }
      Interoperability.continuousRogue();
    })
}
