const Security = new Chapter({name: 'Security'});

Security.init = function() {

  Timelines = new Timeline({
    width: STAGEWIDTH,
    height: STAGEHEIGHT,
    minuteWidth: MinuteWidth,
    minuteSeconds: MinuteSeconds,
    defaultTime: 7,
  });
  Cont_timeline.addChild(Timelines);

  let komodo = new Blockchain({id: 'kmd', name: 'Komodo', color:'#306565', premined: 6, notarizeTo: 'not_yet', notaryLabelSize: "big" });
  var platform = new Platform({y: 250, id: 'kmd', name: ' ',color: '#306565',backgroundColor: null,chains: [komodo],emitterTPS: 35,});
  Platforms.push(platform);

  platform.hide();
  Timelines.hide();


  console.log(Stage.numChildren);

}


Security.set = function() {

  var that = this;

  // #1
  let dial = new Dialog([
    new Text('SECURITY', '60px Roboto', {color: '#316565', textAlign: 'center'}),
    new Text('RECYCLING BITCOIN', '18px Arial', {paddingTop: 20, paddingBottom: 20, textAlign: 'center'}),
    ], [
    new Button('START CHAPTER', proxy(this.continue, this), {float: 'center'}),
    ], {
      backgroundColor: '#d6e0e0',
  });
  this.addDialog(dial);

  // #2
  dialog = new Dialog([
    new Text('So there is the Komodo blockchain.', '20px Arial'),
    ], [
    ], {
      dy: -50, arrow: {x:0, y:-50}, arrowFrom: 'top', animate: true,
      lifetime: 2000, call: proxy(this.continue, this), onload: function() {
        let komodo = Platforms.find(b => b.params.id == 'kmd');
        komodo.hide();
        komodo.fadeIn(500);
        Timelines.start();
        Timelines.fadeIn(500);
      },
    });
  this.addDialog(dialog);

  // #3
  dialog = new Dialog([
    new Text('It is a Proof-of-Work blockchain, with a average blocktime of one minute.'),
    new Text("So every minute or so, a new block is mined by a pool of miners all around the world."),
    ], [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'}),
    ], {
      arrow: {x:0, y:100}, arrowFrom: 'bottom', animate: true,
      dx: 0, dy: -280
    });
  this.addDialog(dialog);

  // #4
  dialog = new Dialog([
    new Text("In order to increase the security of his network, Komodo notarize his status periodically to the Bitcoin blockchain."),
    new Text("That way, every 10 minutes, Komodo reuse the Bitcoin security !"),
    new Text(""),
    new Text("Let's wait for the next notarization..."),
    ], [
    ], {
      arrow: {x:0, y:-100}, arrowFrom: 'top', animate: true,
      dx: 0, dy: 0,
      onload: function(_this) {

        let bitcoin = new Blockchain({id: 'btc', name: 'Bitcoin', color: '#d38d10', blockTime: 10, 'premined': 0, 'maxTps': 10});
        Blockchains.push(bitcoin);
        let platform = new Platform({ y: 100, id: 'btc', name: ' ', color: '#d38d10', backgroundColor: null, chains: [bitcoin], emitterTPS: 10, txWeight:1});
        platform.start();
        Platforms.push(platform);

        platform.hide();
        platform.fadeIn(500);

        platform.y = - 100;
        platform.emitter.y = -100;
        platform.slideY(100, 500);

        //enable dPoW
        let komodo = Blockchains.find(b => b.params.id == 'kmd');
        komodo.params.notarizeTo = 'btc';

        let line = _this.content[3];
        let text = new createjs.Text('', '20px Arial', '#31656580');
        text.x = line.x + line.getBounds().x + 360;
        text.y = line.y + 5;
        _this.addChild(text);

        //wait for notarization
        Stage.on('newminute', function(ev) {

          let t = komodo.params.notarizeInterval - ev.time%10;
          window.setTimeout(function() {
            text.text = '('+t+'s)';
          }, 100);

          if((ev.time+1)%10 == 0) {
            ev.remove();
          }
        });

        // slow down
        Stage.on('notarization_start', Security.slowDown, null, true);
        Stage.on('notarization_start', proxy(that.continue, that), null, true);
        //return to normal
        Stage.on('notarization_end', Security.slowUp, null, true);
      }
    });
  this.addDialog(dialog);


  // #5
  dialog = new Dialog([
    new Text("Here it is.")
    ], [
    ], {
      x:1050, y: 170, arrow: {x:-150, y:0}, arrowFrom: 'left', arrowWidth:20, animate: true,
      lifetime: 3000, call: proxy(this.continue, this)
    });
  this.addDialog(dialog);

  // #6
  dialog = new Dialog([
    new Text("Did you see that ?"),
    new Text(""),
    new Text("That was the notarization process !"),
    ], [
    ], {
      dx: 100, dy: -60, arrow: {x:0, y:-50}, arrowFrom: 'top', animate: true,
      lifetime: 3500, call: proxy(this.continue, this)
    });
  this.addDialog(dialog);

  // #7
  dialog = new Dialog([
    new Text('By notarizing its status inside a Bitcoin block, Komodo takes avantage of the Bitcoin hashrate.'),
    new Text('As soon as the Bitcoin block is mined, there is now an immutable record of Komodo transactions written on the Bitcoin blockchain,'),
    new Text(' '),
    new Text('Therefore, it becomes impossible to reorged the Komodo blockchain before this checkpoint !'),
    ], [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'}),
    ], {
      animate: true,
    });
  this.addDialog(dialog);

  // #8
  dialog = new Dialog([
    new Text('This mechanism is called Delayed Proof-of-Work (dPOW). '),
    new Text('This means that for a 51% attack, you needs to gain the majority of Komodo hashrate'),
    new Text('Plus the majority of the Bitcoin hashrate !'),
    new Text(' '),
    new Text('And good luck with that !'),
    ], [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'}),
    ], {
      animate: true,
    });
  this.addDialog(dialog);

  // #9
  dialog = new Dialog([
    new Text("Wait, that's not all !")
    ], [], {
      lifetime: 1000, call: proxy(this.continue, this),
    });
  this.addDialog(dialog);

  // #10
  dialog = new Dialog([
    new Text("Do you know that Komodo can provide Bitcoin level security to others independant blockchain ?"),
    new Text(""),
    new Text("Let's see an example."),
    ], [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'}),
    ], {
      animate : true,
    });
  this.addDialog(dialog);

  // #11
  dialog = new Dialog([
    new Text("These 2 independant blockchains have chosen Komodo to secure their network :"),
    new Text(""),
    new Text("GameCredits and Einsteinum."),
    ], [
    new Button('CONTINUE', proxy(this.continue, this), {float: 'right'}),
    ], {
      dx: 0, dy: 300, arrow: {x:0, y:-90}, arrowFrom: 'top',
      onload: function(_this) {
          let emc2 = new Blockchain({id: 'emc2', name: 'Einsteinum', color: '#32cbd4', premined: 8, notarizeTo: 'kmd', notaryLabelSize: "big", logo: 'icon_einsteinium' })
          let game = new Blockchain({id: 'game', name: 'GameCredits', color: '#8bca2a', premined: 8, notarizeTo: 'kmd', notaryLabelSize: "big", logo: 'icon_gamecredits' })
          Blockchains.push(emc2);
          Blockchains.push(game);

          var einsPlatform = new Platform({y: 400, name: ' ', color: '#32cbd4', backgroundColor: null, chains: [emc2], emitterTPS: 40,});
          var gamePlatform = new Platform({y: 550,name: ' ',color: '#8bca2a',backgroundColor: null,chains: [game], emitterTPS: 40});
          Platforms.push(einsPlatform);
          Platforms.push(gamePlatform);

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

          let kmd = Blockchains.find(b => b.params.id == 'kmd');
          let block = kmd.blocks[kmd.blocks.length-1-8];
          let x = block.x - block.params.width/2;
          emc2.x = x;
          game.x = x;

      }
    });
  this.addDialog(dialog);

  // #12
  dialog = new Dialog([
    new Text("These blockchain are notarizing themselves to Komodo. "),
    new Text("They now beneficit from the Bitcoin hashrate + the Komodo hashrate."),
    new Text("Now attackers needs to attack 3 blockchains instead of 1, that should be pretty hard, don't you think ?"),
    new Text(""),
    new Text("As a matter of fact, Einsteinium already resist at least one 51% attack since they implements dPoW !")
    ], [
    new Button("CONTINUE", proxy(this.continue, this), {float: 'right'})
    ], {
      dy: 280,
    });
  this.addDialog(dialog);

  // #13
  dialog = new Dialog([
    new Text("If you are interested in the dPoW mechanism for securing your blockchain,"),
    new Text("You can read this detailed article :"),
    new Link("https://blog.komodoplatform.com/delayed-proof-of-work-explained","https://blog.komodoplatform.com/delayed-proof-of-work-explained-9a74250dbb86"),
    new Text(" "),
    new Text("Or you can contact the Komodo team on the official Discord !"),
    new Text(" "),
    ], [
      new Button("REPLAY CHAPTER", proxy(this.replay, this), { float: 'left', backgroundColor: '#b5c7c7', color: 'white', borderColor: '#b5c7c7', borderWidth: 2 }),
      new Button("NEXT CHAPTER", proxy(Tour.goToChapter,Tour,['Scalability']), { float: 'right'}),
    ], {
      dy: 0,
    });
  this.addDialog(dialog);

}

Security.slowDown = function() {
  window.slowMo(0.4, 1000);
}

Security.slowUp = function() {
  window.slowMo(1, 1000);
}