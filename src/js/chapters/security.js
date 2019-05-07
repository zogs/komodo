import {extend, proxy} from '../utils';
import {Chapter} from '../chapter';
import {Dialog, Button, Text, Link} from '../dialog';
import {Blockchain} from '../blockchains/blockchain';
import {Platform} from '../blockchains/platform';
import createjs from 'createjs';


export const Security = new Chapter({name: 'Security'});

Security.init = function() {

  window.Timelines.reset();

  let komodo = new Blockchain({id: 'kmd', name: 'Komodo', color:'#306565', premined: 6, notarizeTo: 'not_yet', notaryLabelSize: "big" });
  var platform = new Platform({y: 250, id: 'kmd', name: ' ',color: '#306565',backgroundColor: null,chains: [komodo],emitterTPS: 35,});
  window.Platforms.push(platform);

  platform.hide();
  window.Timelines.hide();

}


Security.set = function() {

  var that = this;

  // #1
  let dialog = new Dialog([
    new Text('SECURITY', '60px Roboto', {color: '#316565', textAlign: 'center'}),
    new Text('RECYCLING BITCOIN', '18px Arial', {paddingTop: 20, paddingBottom: 20, textAlign: 'center'}),
    ], [
    new Button('START CHAPTER', proxy(this.continue, this), {float: 'center'}),
    ], {
      backgroundColor: '#d6e0e0',
  });
  this.addDialog(dialog);

  // #2
  dialog = new Dialog('So this is the [in]famous Komodo blockchain.',
    [],
    {
      y: 350, arrow: {x:0, y:-50}, arrowFrom: 'top', animate: true,
      lifetime: 2000, call: proxy(this.continue, this),
      onload: function() {
        let komodo = window.Platforms.find(b => b.params.id == 'kmd');
        komodo.hide();
        komodo.fadeIn(500);
        window.Timelines.start();
        window.Timelines.fadeIn(500);
      },
    });
  this.addDialog(dialog);

  // #3
  dialog = new Dialog(`
    <p>It is a Proof-of-Work blockchain, with an average blocktime of one minute.</p>
    <p>So every minute or so, a new block is mined by a pool of miners all around the world.</p>
    `, [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'}),
    ], {
      arrow: {x:0, y:100}, arrowFrom: 'bottom', animate: true,
      y: 120
    });
  this.addDialog(dialog);

  // #4
  dialog = new Dialog(`
    <p>In order to increase the security of the network, Komodo backs up its chain periodically to the Bitcoin blockchain.</p>
    <p>By doing so an attacker would have to first compromise BTC in order to attack the KMD chain!</p>
    <p></p>
    <p>Let's wait for the next notarization to see this in action...</p>
    `, [
    ], {
      arrow: {x:0, y:-100}, arrowFrom: 'top', animate: true,
      onload: function(_this) {

        let bitcoin = new Blockchain({id: 'btc', name: 'Bitcoin', color: '#d38d10', blockTime: 10, 'premined': 0, 'maxTps': 10});
        window.Blockchains.push(bitcoin);
        let platform = new Platform({ y: 100, id: 'btc', name: ' ', color: '#d38d10', backgroundColor: null, chains: [bitcoin], emitterTPS: 10, txWeight:1});
        platform.start();
        window.Platforms.push(platform);

        platform.hide();
        platform.fadeIn(500);

        platform.y = - 100;
        platform.emitter.y = -100;
        platform.slideY(100, 500);

        //enable dPoW
        let komodo = window.Blockchains.find(b => b.params.id == 'kmd');
        komodo.params.notarizeTo = 'btc';

        let text = new createjs.Text('', '20px Arial', '#6b8a8a');
        text.x = 500;
        text.y = 75;
        _this.addChild(text);

        //wait for notarization
        window.Stage.on('newminute', function(ev) {

          let t = komodo.params.notarizeInterval - ev.time%10;
          window.setTimeout(function() {
            text.text = '('+t+'s)';
          }, 100);

          if((ev.time+1)%10 == 0) {
            ev.remove();
          }
        });

        // slow down
        window.Stage.on('notarization_start', Security.slowDown, null, true);
        window.Stage.on('notarization_start', proxy(that.continue, that), null, true);
        //return to normal
        window.Stage.on('notarization_end', Security.slowUp, null, true);
      }
    });
  this.addDialog(dialog);


  // #5
  dialog = new Dialog("Here it is.",
    [],
    {
      x:1050, y: 170, arrow: {x:-150, y:0}, arrowFrom: 'left', arrowWidth:20, animate: true,
      lifetime: 3000, call: proxy(this.continue, this)
    });
  this.addDialog(dialog);

  // #6
  dialog = new Dialog(`
    <p>Did you see this magic?</p>
    <p></p>
    <p>That was the so called notarization process!</p>
    `, [
    ], {
      x: 850, y: 330, arrow: {x:0, y:-50}, arrowFrom: 'top', animate: true,
      lifetime: 3500, call: proxy(this.continue, this)
    });
  this.addDialog(dialog);

  // #7
  dialog = new Dialog(`
    <p>By notarizing the KMD chain into Bitcoin, Komodo takes avantage of the Bitcoin hashrate and security.</p>
    <p>As soon as the notarization is confirmed it equals an immutable record of Komodo transactions</p>
    <p>written onto the Bitcoin blockchain,</p>
    <p> </p>
    <p>Therefore, it becomes impossible to reorg (51% attack) the Komodo blockchain beyond this "checkpoint" !</p>
    `, [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'}),
    ], {
      animate: true,
    });
  this.addDialog(dialog);

  // #8
  dialog = new Dialog(`
    <p>This security mechanism is called Delayed Proof-of-Work (dPOW).</p>
    <p>In simple worlds: This technology is a solution for 51% attacks. If you want to attack</p>
    <p>Komodo you have to first attack Bitcoin</p>
    <p>And good luck with that.</p>
    `, [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'}),
    ], {
      animate: true,
    });
  this.addDialog(dialog);

  // #9
  dialog = new Dialog(`
    Wait, that's not all !
    `, [], {
      lifetime: 1000, call: proxy(this.continue, this),
    });
  this.addDialog(dialog);

  // #10
  dialog = new Dialog(`
    <p>Did you know that Komodo can provide Bitcoin level security to other independant blockchains ?</p>
    <p></p>
    <p>Let's look on some examples.</p>
    `, [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'}),
    ], {
      animate : true,
    });
  this.addDialog(dialog);

  // #11
  dialog = new Dialog(`
    <p>These external blockchains for example have chosen Komodo to secure their network:</p>
    <p></p>
    <p><strong>GameCredits</strong> and <strong>Einsteinum</strong> just to name 2 of many others.</p>
    `, [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'}),
    ], {
      y: 700, arrow: {x:0, y:-90}, arrowFrom: 'top',
      onload: function(_this) {
          let emc2 = new Blockchain({id: 'emc2', name: 'Einsteinum', color: '#32cbd4', premined: 8, notarizeTo: 'kmd', notaryLabelSize: "big", logo: 'icon_einsteinium' })
          let game = new Blockchain({id: 'game', name: 'GameCredits', color: '#8bca2a', premined: 8, notarizeTo: 'kmd', notaryLabelSize: "big", logo: 'icon_gamecredits' })
          window.Blockchains.push(emc2);
          window.Blockchains.push(game);

          var einsPlatform = new Platform({y: 400, name: ' ', color: '#32cbd4', backgroundColor: null, chains: [emc2], emitterTPS: 40,});
          var gamePlatform = new Platform({y: 550,name: ' ',color: '#8bca2a',backgroundColor: null,chains: [game], emitterTPS: 40});
          window.Platforms.push(einsPlatform);
          window.Platforms.push(gamePlatform);

          einsPlatform.start();
          gamePlatform.start();

          einsPlatform.emitter.start();
          gamePlatform.emitter.start();

          einsPlatform.y = 500;
          einsPlatform.emitter.y = 500;
          einsPlatform.slideY(400, 1000);

          gamePlatform.y = 650;
          gamePlatform.emitter.y = 650;
          gamePlatform.slideY(550, 1000);

          let kmd = window.Blockchains.find(b => b.params.id == 'kmd');
          let block = kmd.blocks[kmd.blocks.length-1-8];
          let x = block.x - block.params.width/2;
          emc2.x = x;
          game.x = x;

      }
    });
  this.addDialog(dialog);

  // #12
  dialog = new Dialog(`
    <p>These blockchains are notarizing onto Komodo.</p>
    <p>They now benefit from the Komodo and Bitcoin level security.</p>
    <p>An attacker would need to attack 3 blockchains instead of just 1, that should be pretty hard, don't you think?</p>
    <p></p>
    <p>As a matter of fact, Einsteinium alreay resisted one (known) 51% attack since they implemented dPoW </p>
    `, [
    new Button("CONTINUE", proxy(this.continue, this), {float: 'right'})
    ], {
      y: 680,
    });
  this.addDialog(dialog);

  // #13
  dialog = new Dialog(`
    <p>If you are interested in the dPoW mechanism for securing your blockchain,</p>
    <p>Please read this detailed article and contact the Komodo Team :</p>
    <p>https://blog.komodoplatform.com/delayed-proof-of-work-explained","https://blog.komodoplatform.com/delayed-proof-of-work-explained-9a74250dbb86</p>
    <p></p>
    <p>You can contact the Komodo Team on their official Discord !</p>
    <p><a href="https://komodoplatform.com/discord" target="_blank">https://komodoplatform.com/discord</a></p>
    <p></p>
    `, [
      new Button("REPLAY CHAPTER", proxy(this.replay, this), { float: 'left', backgroundColor: '#b5c7c7', color: 'white', borderColor: '#b5c7c7', borderWidth: 2 }),
      new Button("NEXT CHAPTER", proxy(window.Tour.goToChapter,window.Tour,['Scalability']), { float: 'right'}),
    ], {
    });
  this.addDialog(dialog);

}

Security.slowDown = function() {
  window.slowMo(0.4, 1000);
}

Security.slowUp = function() {
  window.slowMo(1, 1000);
}
