class Chapter extends createjs.Container {

  constructor(params) {

    super();
    var defaults = {
    };

    this.params = extend(defaults,params);
    this.dialogs = [];
    this.current = null;

    this.init(params);
  }

  init(params) {

  }

  start() {
    Cont_tour.addChild(this);
    this.init();
    this.set();
    this.goTo(0);
  }

  goTo(n) {

    if(this.current !== null) {
      this.dialogs.map(d => d.close());
    }
    let dialog = this.dialogs[n];
    dialog.open();
    this.current = dialog;
  }

  goToID(id) {

    if(this.current !== null) {
      this.dialogs.map(d => d.close());
    }
    let dialog = this.dialogs.find(d => d.params.id == id);
    dialog.open();
    this.current = dialog;
  }

  continue() {

    this.dialogs.map(d => d.close());

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

  stop() {

    this.dialogs.map(d => d.close());

    this.destroy();
  }

  replay() {

    this.stop();
    this.current = null;
    this.start();
  }

  destroy() {

    this.removeAllChildren();
    this.dialogs = [];
    Cont_tour.removeChild(this);
  }

  addDialog(dialog) {

    this.dialogs.push(dialog);
    this.addChild(dialog);

  }
}
