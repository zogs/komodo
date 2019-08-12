import {extend, proxy} from '../utils';
import {Chapter} from '../chapter';
import {Dialog, Button, Text, Link} from '../dialog';
import {Blockchain} from '../blockchains/blockchain';
import {Platform} from '../blockchains/platform';
import createjs from 'createjs';


export const Security = new Chapter({name: 'Security'});

Security.init = function() {

  window.Timelines.reset();

  let komodo = new Blockchain({id: 'kmd', name: 'Komodo', color:'#41ead4', premined: 6, notarizeTo: 'not_yet', notaryLabelSize: "big" });
  var platform = new Platform({y: 250, id: 'kmd', name: ' ',color: '#41ead4' ,chains: [komodo],emitterTPS: 35,});
  window.Platforms.push(platform);

  platform.hide();
  window.Timelines.hide();

}


Security.set = function() {

  var that = this;

  // #1
  let dialog = new Dialog(`
    <div class="chapter">
      <h1>SECURITY</h1>
      <h2>Delayed Proof of Work (dPoW)</h2>
    </div>
    `, [
    new Button('START CHAPTER', proxy(this.continue, this), {float: 'center', borderWidth:3}),
    ], {
  });
  this.addDialog(dialog);

  // #2
  dialog = new Dialog('This is the <strong>KOMODO</strong> blockchain.',
    [],
    {
      y: 350, arrow: {x:0, y:-50}, arrowFrom: 'top', animate: true,
      lifetime: 2500, call: proxy(this.continue, this),
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
    <p><strong>KOMODO</strong> is a Proof-of-Work blockchain, with an average blocktime of one minute.</p>
    <p>Every minute or so, a new block is mined by one of the nodes on the global, decentralized network.</p>
    `, [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'}),
    ], {
      arrow: {x:0, y:100}, arrowFrom: 'bottom', animate: true,
      y: 120
    });
  this.addDialog(dialog);

  // #4
  dialog = new Dialog(`
    <p>In order to increase the security of the network, <strong>KOMODO</strong> periodically saves block data to the <strong class="btc">Bitcoin</strong> blockchain.</p>
    <p>This means that an attacker would need to first compromise the <strong class="btc">Bitcoin</strong> network in order to attack the KMD chain!</p>
    <p></p>
    <p>Let's wait for the next notarization to see this in action.</p>
    `, [
    ], {
      y: 400,
      arrow: {x:0, y:-100}, arrowFrom: 'top', animate: true,
      onload: function(_this) {

        let bitcoin = new Blockchain({id: 'btc', name: 'Bitcoin', color: '#eb8c18', blockTime: 10, 'premined': 0, 'maxTps': 10});
        window.Blockchains.push(bitcoin);
        let platform = new Platform({ y: 100, id: 'btc', name: ' ', color: '#eb8c18', chains: [bitcoin], emitterTPS: 10, txWeight:1});
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

        let text = new createjs.Text('', '14px Montserrat', '#FFF');
        text.x = 400;
        text.y = 58;
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
    <p>Did you see it?</p>
    <p></p>
    <p>That was the notarization process!</p>
    `, [
    ], {
      x: 850, y: 330, arrow: {x:0, y:-50}, arrowFrom: 'top', animate: true,
      lifetime: 4000, call: proxy(this.continue, this)
    });
  this.addDialog(dialog);

  // #7
  dialog = new Dialog(`
    <p>By notarizing block data from the KMD chain onto <strong class="btc">Bitcoin</strong>, <strong>KOMODO</strong> takes advantage of the <strong class="btc">Bitcoin</strong> hashrate and security.</p>
    <p>As soon as the notarization is confirmed, it creates an immutable record of <strong>KOMODO</strong> transactions written onto the <strong class="btc">Bitcoin</strong> blockchain.</p>
    <p> </p>
    <p>Therefore, it becomes impossible to re-organize the <strong>KOMODO</strong> blockchain beyond the checkpoint! This prevents 51% attacks.</p>
    `, [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'}),
    ], {
      animate: true,
    });
  this.addDialog(dialog);

  // #8
  dialog = new Dialog(`
    <p>This security mechanism is called <strong>Delayed Proof of Work (dPoW)</strong>.</p>
    <p>In simple words: This technology is a solution for 51% attacks. If you want to attack</p>
    <p><strong>KOMODO</strong> you would have to first attack <strong class="btc">Bitcoin</strong>.</p>
    <p>And that isn't really possible.</p>
    `, [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'}),
    ], {
      animate: true,
    });
  this.addDialog(dialog);

  // #9
  dialog = new Dialog(`
    <p>Wait, that's not all !</p>
    `, [], {
      paddings: [25,50,25,50],
      lifetime: 3000, call: proxy(this.continue, this),
    });
  this.addDialog(dialog);

  // #10
  dialog = new Dialog(`
    <p>Did you know that <strong>KOMODO</strong> can provide <strong class="btc">Bitcoin</strong> level security to other independent blockchains ?</p>
    <p></p>
    <p>Let's look at some examples.</p>
    `, [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'}),
    ], {
      animate : true,
    });
  this.addDialog(dialog);

  // #11
  dialog = new Dialog(`
    <p>These external blockchains have chosen <strong>KOMODO</strong> to add extra security their network:</p>
    <p></p>
    <p><b>GameCredits</b> and <b>Einsteinum</b> are two great examples.</p>
    `, [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'}),
    ], {
      x: 350, y: 220, arrow: {x:-250, y:100}, arrowFrom: 'bottom', arrowCenter: - 250,
      onload: function(_this) {
          let emc2 = new Blockchain({id: 'emc2', name: 'Einsteinum', color: '#00c1f4', premined: 8, notarizeTo: 'kmd', notaryLabelSize: "big", logo: 'icon_einsteinium' })
          let game = new Blockchain({id: 'game', name: 'GameCredits', color: '#89b52c', premined: 8, notarizeTo: 'kmd', notaryLabelSize: "big", logo: 'icon_gamecredits' })
          window.Blockchains.push(emc2);
          window.Blockchains.push(game);

          var einsPlatform = new Platform({y: 400, name: ' ', color: '#00c1f4', chains: [emc2], emitterTPS: 40,});
          var gamePlatform = new Platform({y: 550,name: ' ',color: '#89b52c', chains: [game], emitterTPS: 40});
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
    <p>These blockchains are notarizing onto <strong>KOMODO</strong>.</p>
    <p>They now benefit from the security of both the <strong>KOMODO</strong> and <strong class="btc">Bitcoin</strong> newtworks.</p>
    <p>An attacker would need to attack 3 blockchains instead of just 1. That makes it too costly and difficult for an attack to be worthwhile.</p>
    <p></p>
    <p>As a matter of fact, <b>Einsteinium</b> alreay successfully defended against one known 51% attack since they implemented dPoW</p>
    `, [
    new Button("CONTINUE", proxy(this.continue, this), {float: 'right'})
    ], {
      y: 220
    });
  this.addDialog(dialog);

  // #13
  dialog = new Dialog(`
    <p>If you are interested in adopting the dPoW mechanism to secure your blockchain,</p>
    <p>please contact the <strong>KOMODO</strong> Team on their official Discord:</p>
    <p><a href="https://komodoplatform.com/discord" target="_blank">https://komodoplatform.com/discord</a></p>
    <p></p>
    <p>Next chapter: <strong>SCALABILITY</strong>
    `, [
      new Button("REPLAY CHAPTER", proxy(this.replay, this), { float: 'left'}),
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
