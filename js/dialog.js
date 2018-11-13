class Dialog extends createjs.Container {

  constructor(content= [], buttons=[], params) {

    super();
    this.content = content;
    this.buttons = buttons;
    var defaults = {
      x: STAGEWIDTH/2,
      y: STAGEHEIGHT/2,
      dx: 0,
      dy: 0,
      width: null,
      height: null,
      alpha: 0,
      lifetime: 0,
      call: null,
      onload: null,
      radius: 0,
      paddings: [10,10,10,10],
      backgroundColor: '#d6e0e0',
      borderColor: 'grey',
      borderWidth: 1,
      arrowTo: null,
      arrowFrom: 'top',
      arrowWidth: 50,
      arrowCenter: 0,
      animate: false,
      animateSpeed: 500
    };

    this.params = extend(defaults,params);
    this.originParams = this.params;
    this.x = this.params.x;
    this.y = this.params.y;
    this.x += this.params.dx;
    this.y += this.params.dy;
    this.alpha = this.params.alpha;
    this.htmlElement = null;
    this.htmlContent = null;



    Stage.addEventListener('canvas_resized', proxy(this.onResize, this));

    this.init(params);
  }

  open() {

    this.alpha = 1;
    this.mouseEnabled = true;

    if(this.htmlElement) {
      this.htmlElement.style.pointerEvents = 'auto';
    }

    if(this.params.onload) {
      this.params.onload(this);
    }

    if(this.params.lifetime > 0) {
      createjs.Tween.get(this).to({}, this.params.lifetime).call(this.params.call);
    }

    if(this.params.animate) {
      this.y -= 20;
      createjs.Tween.get(this).to({y: this.y + 20}, this.params.animateSpeed);
    }

    this.alpha = 0;
    createjs.Tween.get(this).to({alpha: 1}, this.params.animateSpeed);
  }

  close() {

    this.alpha = 0;
    this.mouseEnabled = false;

    if(this.htmlElement) {
      this.htmlElement.style.pointerEvents = 'none';
    }
  }

  onResize(ev) {

    if(this.htmlContent) {

      /*
      I don't understand why this is not working
      this.htmlContent._props.matrix.appendTransform(100, 100, 0.5, 0.5, 0, 0, 0, 0, 0);
      this.htmlContent._oldProps.matrix = new createjs.Matrix2D();
      this.htmlContent._handleDrawEnd();
      */

      //Apply new transformation to DOMElement when resizing
      //(remember that DOMElement coords is based to its parent)
      let dx = this.x*ev.newWidth/ev.originWidth - this.x;
      let dy = this.y*ev.newHeight/ev.originHeight - this.y;
      let dr = ev.newHeight/ev.originHeight;
      let matrix = new createjs.Matrix2D(dr, 0, 0, dr, dx, dy);
      this.htmlContent.transformMatrix = matrix;

    }
  }

  init() {

    let H = 0;
    let W = 0;

    let content;
    let element;
    if(typeof this.content == 'string') {

      element = document.getElementById(this.content);
      element.style.visibility = 'visible';
      content = new createjs.DOMElement(this.content);
      this.htmlElement = element;
      this.htmlContent = content;
      W = element.offsetWidth;
      H = element.offsetHeight;
    }

    if(typeof this.content == 'object') {
      for(let i=0; i<this.content.length; i++) {
        let text = this.content[i];
        let w = text.width;
        let h = text.height;
        text.y = H;
        H += h;
        W = (w > W)? w : W;
      }
    }

    for(let i=0,ln=this.buttons.length; i<ln; i++) {
      let button = this.buttons[i];
      let w = button.width;
      let h = button.height;
      H += (i==0)? h/2 : 0;
      button.y = H + button.params.y;
      button.dialogBox = this;
      if(button.params.float == 'center') button.x = W/2;
      if(button.params.float == 'left') button.x = 0 + button.width/2;
      if(button.params.float == 'right') button.x = W - button.width/2;
      button.x += button.params.x;
      H += (i==this.buttons.length-1)? h*2/3 : 0;
    }

    this.width = W;
    this.height = H;

    let bg = new createjs.Shape();
    let pad = this.params.paddings;
    bg.graphics.setStrokeStyle(this.params.borderWidth).beginStroke(this.params.borderColor).beginFill(this.params.backgroundColor).drawRoundRectComplex(0-pad[3], 0-pad[0], W + pad[1]*2, H + pad[2]*2 , this.params.radius, this.params.radius, this.params.radius, this.params.radius);
    this.addChild(bg);

    if(this.params.arrowTo !== null && typeof this.params.arrowTo == 'object' && this.params.arrowTo.x !== undefined && this.params.arrowTo.y !== undefined) {
      let to = this.globalToLocal(this.params.arrowTo.x, this.params.arrowTo.y);
      this.drawArrow(to);
    }

    if(this.params.arrow !== null && typeof this.params.arrow == 'object' && this.params.arrow.x !== undefined && this.params.arrow.y !== undefined) {
      let to = this.globalToLocal(this.x + this.params.arrow.x, this.y + this.params.arrow.y);
      this.drawArrow(to);
    }


    if(typeof this.content == 'object') {
      for(let i=0; i<this.content.length; i++) {
        let text = this.content[i];
        this.addChild(text);
      }
    }

    if(typeof this.content == 'string') {

      this.addChild(content);
    }

    for(let i=0; i<this.buttons.length; i++) {
      let button = this.buttons[i];
      this.addChild(button);
    }

    let mid = new createjs.Shape();
    mid.graphics.beginFill('red').drawCircle(0,0,3);
    //this.addChild(mid);

    this.x -= W/2;
    this.y -= H/2;

  }

  drawArrow(to) {

    let arrow = new createjs.Shape();
    arrow.graphics.beginFill(this.params.backgroundColor).setStrokeStyle(this.params.borderWidth).beginStroke(this.params.borderColor);
    if(this.params.arrowFrom == 'top') {
      arrow.graphics
            .moveTo(this.width/2 - this.params.arrowWidth/2 + this.params.arrowCenter, - this.params.paddings[0]+ this.params.borderWidth/2+1)
            .lineTo(to.x + this.width/2, to.y + this.height/2)
            .lineTo(this.width/2 + this.params.arrowWidth/2 + this.params.arrowCenter, - this.params.paddings[0]+ this.params.borderWidth/2+1)
            ;
    }
    if(this.params.arrowFrom == 'left') {
      arrow.graphics
            .moveTo(-this.params.paddings[3]+ this.params.borderWidth/2+1, this.height/2 - this.params.arrowWidth/2 + this.params.arrowCenter)
            .lineTo(to.x + this.width/2, to.y + this.height/2)
            .lineTo(-this.params.paddings[3]+ this.params.borderWidth/2+1, this.height/2 + this.params.arrowWidth/2 + this.params.arrowCenter)
            ;
    }
    if(this.params.arrowFrom == 'right') {
      arrow.graphics
            .moveTo(this.width + this.params.paddings[1]- this.params.borderWidth/2-1, this.height/2 - this.params.arrowWidth/2 + this.params.arrowCenter)
            .lineTo(to.x + this.width/2, to.y + this.height/2)
            .lineTo(this.width + this.params.paddings[1]- this.params.borderWidth/2-1, this.height/2 + this.params.arrowWidth/2 + this.params.arrowCenter)
            ;
    }
    if(this.params.arrowFrom == 'bottom') {
      arrow.graphics
            .moveTo(this.width/2 - this.params.arrowWidth/2 + this.params.arrowCenter, this.height + this.params.paddings[2] -  this.params.borderWidth/2-1 )
            .lineTo(to.x + this.width/2, to.y + this.height/2)
            .lineTo(this.width/2 + this.params.arrowWidth/2 + this.params.arrowCenter, this.height + this.params.paddings[2] -  this.params.borderWidth/2-1 )
            ;
    }

    this.addChild(arrow);

  }

}


  class Text extends createjs.Container {

    constructor(text = 'KOMODO', font = null, params = {}) {

      super();
      this.text = text;
      this.font = (font === null)? '20px Arial' : font;
      var defaults = {
        width: null,
        height: null,
        color: '#31656580',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        textAlign: 'center',
      };

      this.params = extend(defaults,params);
      this.init();
    }

    init() {

      this.drawText();
    }

    drawText() {

      if(this.text.length == 0) {
        this.params.paddingTop = 0, this.params.paddingBottom = 0, this.params.paddingLeft = 0, this.params.paddingRight = 0;
      }

      let text = new createjs.Text(this.text, this.font, this.params.color);
      let w = (this.text.length > 0)? text.getBounds().width : 0;
      let h = (this.text.length > 0)? text.getBounds().height : 0;
      let W = w + this.params.paddingLeft + this.params.paddingRight;
      let H = h + this.params.paddingTop + this.params.paddingBottom;
      text.textAlign = this.params.textAlign;
      text.x = W/2;
      text.y = this.params.paddingTop;

      this.addChild(text);

      this.width = W;
      this.height = H;

      let mid = new createjs.Shape();
      mid.graphics.beginFill('red').drawCircle(0,0,3);
      //this.addChild(mid);
    }

  }


  class Button extends createjs.Container {

    constructor(text = 'KOMODO', callback = null, params) {

      super();
      this.text = text;
      this.callback = (callback === null)? this.nullCallback : callback;
      var defaults = {
        width: null,
        height: null,
        font: '22px Roboto',
        radius: 2,
        paddings: [12, 30, 12, 30],
        color: 'white',
        backgroundColor: "#316565",
        borderWidth: 1,
        borderColor: '#316565',
        float: 'center',
        x: 0,
        y: 0,
      };

      this.params = extend(defaults,params);
      this.init();

    }

    init() {

      this.drawButton();
    }

    drawButton() {

      let text = new createjs.Text(this.text, this.params.font, this.params.color);
      let w = (this.params.width == null)? text.getBounds().width : this.params.width;
      let h = (this.params.height == null)? text.getBounds().height : this.params.height;
      let pad = this.params.paddings;
      text.textAlign = 'center';
      text.regX = 0;
      text.regY = h/2;

      let bg = new createjs.Shape();
      bg.graphics.setStrokeStyle(this.params.borderWidth).beginStroke(this.params.borderColor).beginFill(this.params.backgroundColor).drawRoundRectComplex(0-pad[3], 0-pad[0], w + pad[1]*2, h + pad[2]*2 , this.params.radius, this.params.radius, this.params.radius, this.params.radius);
      bg.regX = w/2;
      bg.regY = h/2 - 2;

      this.addChild(bg);
      this.addChild(text);

      this.addEventListener("click", this.callback);

      this.cursor = "pointer";
      this.width = w + pad[1] + pad[3];
      this.height = h + pad[0] + pad[2];

      let c = new createjs.Shape();
      c.graphics.beginFill('red').drawCircle(0,0,2);
      //this.addChild(c);

    }

    nullCallback() {

      console.error("Button has been clicked but there is no handler");
    }
  }
