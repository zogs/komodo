const Scalability = new Chapter({name: 'Scalability'});

Scalability.init = function() {


}

Scalability.set = function() {

  let title = new Dialog([
  new Text('Scalability', '60px Roboto'),
  new Text('How there is no limit scale', '20px Arial'),
  ], [
  new Button('Begin', proxy(this.continue, this), {float: 'left', x:50}),
  new Button('Continue', proxy(this.continue, this), {float: 'right'}),
  ], {
  x : STAGEWIDTH/2,
  y : STAGEHEIGHT/2,
  });

  this.addDialog(title);

  let next = new Dialog([
    new Text('Lets view how scaling works...', '20px Arial'),
    ], [
    new Button('Stop', proxy(this.stop, this), {float: 'center'}),
    ], {
    x: STAGEWIDTH/2,
    y: STAGEHEIGHT/2,

    });
  this.addDialog(next);
}