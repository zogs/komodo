const Security = new Chapter({name: 'Security'});

Security.init = function() {

      let bitcoin = new Blockchain({name: 'bitcoin', blockTime: 10, color: 'orange', 'premined': 0});
      bitcoin.x = 0;
      bitcoin.y = 100;
      bitcoin.initMempool();
      Cont_blockchain.addChild(bitcoin);
      Blockchains.push(bitcoin);

      let komodo = new Blockchain({name: 'komodo', color:'#306565', premined: 6, notarizeTo: 'bitcoin', notarizeInterval: 10, notarizeNBlock: 1});
      komodo.x = 0;
      komodo.y = 300;
      komodo.initMempool();
      Cont_blockchain.addChild(komodo);
      Blockchains.push(komodo);
    }

Security.set = function() {

  let title = new Dialog('secu1', [
    new Button('Start', proxy(this.continue, this), {float: 'center'}),
    ], {
  x: STAGEWIDTH/2, y: STAGEHEIGHT/2
  });
  this.addDialog(title);

  let next = new Dialog('secu2', [], {
  x: STAGEWIDTH/2, y: STAGEHEIGHT/2, lifetime: 2000, call: proxy(this.continue, this), arrowTo: {x: 800, y: 700}, arrowFrom: 'bottom'
  });
  this.addDialog(next);

  let end = new Dialog('secu3', [
    new Button('Continue', proxy(this.continue, this), {float: 'center'}),
    ], {
  x: STAGEWIDTH/2, y: STAGEHEIGHT/2, arrowTo: {x: 500, y: 400}, arrowFrom: 'left'
  });
  this.addDialog(end);
}