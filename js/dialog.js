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
      backgroundColor: '#FFF',
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

    // HTML element
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

    // TEXT elements
    if(typeof this.content == 'object') {
      for(let i=0; i<this.content.length; i++) {
        let text = this.content[i];
        W = (text.width > W)? text.width : W;
      }
      if(this.params.width) W = this.params.width;
      for(let i=0; i<this.content.length; i++) {
        let text = this.content[i];
        text.y = H;
        H += text.height;
        text.params.width = W; // set all text the same width
        text.redraw(); // redraw allow us to align text (left, right, center)
      }
    }

    if(this.params.width !== null) W = this.params.width;

    // BUTTON elements
    let totalw = 0;
    for(let i=0,ln=this.buttons.length; i<ln; i++) {
      let button = this.buttons[i];
      let w = button.width;
      let h = button.height;
      H += (i==0)? h/2 : 0;
      button.y = H + button.params.y;
      button.dialogBox = this;
      H += (i==this.buttons.length-1)? h*2/3 : 0;
      totalw += w + 20;
    }
    if(totalw > W) W = totalw;

    // box size
    this.width = W;
    this.height = H;

    // draw background
    let bg = new createjs.Shape();
    let pad = this.params.paddings;
    bg.graphics.setStrokeStyle(this.params.borderWidth).beginStroke(this.params.borderColor).beginFill(this.params.backgroundColor).drawRoundRectComplex(0-pad[3], 0-pad[0], W + pad[1]*2, H + pad[2]*2 , this.params.radius, this.params.radius, this.params.radius, this.params.radius);
    this.addChild(bg);

    // draw arrow
    if(this.params.arrowTo !== null && typeof this.params.arrowTo == 'object' && this.params.arrowTo.x !== undefined && this.params.arrowTo.y !== undefined) {
      let to = this.globalToLocal(this.params.arrowTo.x, this.params.arrowTo.y);
      this.drawArrow(to);
    }

    if(this.params.arrow !== null && typeof this.params.arrow == 'object' && this.params.arrow.x !== undefined && this.params.arrow.y !== undefined) {
      let to = this.globalToLocal(this.x + this.params.arrow.x, this.y + this.params.arrow.y);
      this.drawArrow(to);
    }

    // Add TEXT elements
    if(typeof this.content == 'object') {
      for(let i=0; i<this.content.length; i++) {
        let text = this.content[i];
        this.addChild(text);
      }
    }

    // Add HTML element
    if(typeof this.content == 'string') {

      this.addChild(content);
    }

    // Add BUTTON elements
    for(let i=0; i<this.buttons.length; i++) {
      let button = this.buttons[i];
      if(button.params.float == 'center') button.x = this.width /2;
      if(button.params.float == 'left') button.x = 0 + button.width/2;
      if(button.params.float == 'right') button.x = this.width  - button.width/2;
      button.x += button.params.x;
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
      var defaults = {
        text: text,
        font: (font === null)? '20px Arial' : font,
        width: null,
        height: null,
        color: '#31656580',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        textAlign: 'left',
      };

      this.params = extend(defaults,params);


      this.init();
    }

    init() {

      this.drawText();
    }

    redraw() {

      this.removeAllChildren();
      this.drawText();
    }

    drawText() {

      if(this.params.text.length == 0) {
        this.params.paddingTop = 0, this.params.paddingBottom = 0, this.params.paddingLeft = 0, this.params.paddingRight = 0;
      }

      let text = new createjs.Text(this.params.text, this.params.font, this.params.color);

      //calcul width
      let w = 0;
      if(this.params.text.length > 0) w = text.getMeasuredWidth();
      if(this.params.width) w = this.params.width;
      
      //calcul height
      let h = 0;
      if(this.params.text.length > 0) h = text.getMeasuredHeight();
      if(this.params.height) h = this.params.height;
      
      // add padding
      let W = w + this.params.paddingLeft + this.params.paddingRight;
      let H = h + this.params.paddingTop + this.params.paddingBottom;

      this.width = W;
      this.height = H;

      // align text horizonaly
      if(this.params.textAlign == 'left') {
        text.textAlign = 'left';
      }
      if(this.params.textAlign == 'right') {
        text.textAlign = 'right';
        text.x = this.width - this.params.paddingRight*2;
      }
      if(this.params.textAlign == 'center') {
        text.textAlign = 'center';
        text.x = this.width /2 - this.params.paddingLeft;
      }

      //align text vertically (to do)
      text.y = this.params.paddingTop;

      this.addChild(text);
      this.text = text;

      //let mid = new createjs.Shape();
      //mid.graphics.beginFill('red').drawCircle(0,0,3);
      //this.addChild(mid);
    }

  }

  class Link extends Text {

   constructor(text = 'http://perdu.com', link = null, font = null, params = {}) {

      params.color = params.color ? params.color : '#1a0dab';
      params.link = link ? link : text;

      super(text, font, params);

      this.cursor = 'pointer';
      this.addEventListener('click', proxy(this.openLink, this));

    }

    openLink(e) {

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      window.open(this.params.link, '_self');

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
      bg.regY = h/2;

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
