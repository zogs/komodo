(function() {


// create new class
function Chapter(params) {

  this.Container_constructor();

  var defaults = {
  };

  this.params = extend(defaults,params);
  this.dialogs = [];
  this.current = null;

  this.init(params);

}

//extend it
var prototype = createjs.extend(Chapter, createjs.Container);

//add EventDispatcher
createjs.EventDispatcher.initialize(prototype);


//public methods
prototype.init = function(params) {
  //
}

prototype.start = function() {
  Cont_tour.addChild(this);
  this.init();
  this.set();
  this.goTo(0);
}

prototype.goTo = function(n) {

  if(this.current !== null) {
    this.current.close();
  }
  let dialog = this.dialogs[n];
  dialog.open();
  this.current = dialog;
}

prototype.continue = function() {

  this.current.close();

  let idx = this.dialogs.indexOf(this.current);
  if(idx+1 > this.dialogs.length-1) {
    let ev = new createjs.Event('chapter_ended');
    ev.chapter = this.params.name;
    Stage.dispatchEvent(ev);
    return;
  }

  let dialog = this.dialogs[idx+1];
  dialog.open();
  this.current = dialog;

}

prototype.stop = function() {

  this.current.close();
}

prototype.destroy = function() {

  this.removeAllChildren();
  this.dialogs = [];
  Cont_tour.removeChild(this);
}

prototype.addDialog = function(dialog) {

  this.dialogs.push(dialog);
  this.addChild(dialog);
}
//<-- end methods


//assign Block to window's scope & promote overriden container's methods from Wave object, allow them to be call by 'Container_methodName()'
window.Chapter = createjs.promote(Chapter,'Container');

}());