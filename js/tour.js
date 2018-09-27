(function() {


// create new class
function Tour(params) {

  this.Container_constructor();

  var defaults = {
  };

  this.params = extend(defaults,params);
  this.chapters = [];
  this.current = null;
  this.init(params);

}

//extend it
var prototype = createjs.extend(Tour, createjs.Container);

//add EventDispatcher
createjs.EventDispatcher.initialize(prototype);


//public methods
prototype.init = function(params) {
  //
}

prototype.start = function() {

  this.current = this.chapters[0];
  this.current.start();

  Stage.addEventListener('chapter_ended', proxy(this.next, this));
}

prototype.addChapter = function(chapter) {

  this.chapters.push(chapter);
}

prototype.goToChapter = function(name) {

  let chapter = this.chapters.find(c => c.params.name == name);
  if(chapter == null) console.error('Chapter "'+name+'" does not exist');

  this.current.stop();
  chapter.start();

  this.current = chapter;
}

prototype.next = function() {

  let chapter = this.chapters[this.chapters.indexOf(this.current)+1];

  if(chapter == null) return this.stop();

  this.current.stop();
  chapter.start();

  this.current = chapter;
}

prototype.stop = function() {

  Stage.dispatchEvent('tour_ended')
}

//<-- end methods


//assign Block to window's scope & promote overriden container's methods from Wave object, allow them to be call by 'Container_methodName()'
window.Tour = createjs.promote(Tour,'Container');

}());