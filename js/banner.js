class Banner extends createjs.Container {

  constructor(params) {

    super();
    var defaults = {
      points : null,
      width: null,
      height: null,
      subtitle: {
        text: '',
        font: 'bold 30px Arial',
        color: '#606060',
        x: 0, y:0,
        alpha: 0.8,
      }
    };

    this.params = deepExtend(defaults,params);
    this.points = [];
    this.circles = [];
    this.particles = [];
    this.tictac = 0;
    this.autoUpdate = true;
    this.in_place = false;

    this.particle_cont = new createjs.Container();
    this.subtitle_cont = new createjs.Container();
    this.addChild(this.particle_cont, this.subtitle_cont);

    StageGL.addChild(this);
    this.init();

    document.querySelector('canvas#canvas').addEventListener('mousemove', proxy(this.onMouseMove,this));

  }

  init(params) {

    this.initPoints();
    this.initSubtitle();
  }

  initSubtitle() {

    if(this.params.subtitle.text !== '') {

      let text = new createjs.Text(this.params.subtitle.text, this.params.subtitle.font, this.params.subtitle.color);
      text.x = this.params.subtitle.x;
      text.y = this.params.subtitle.y;
      text.cache(0,0,text.getMeasuredWidth(),text.getMeasuredHeight());
      text.alpha = this.params.subtitle.alpha;
      this.subtitle_cont.addChild(text);
      this.subtitle_cont.alpha = 0;
    }
  }

  initPoints() {

    for(let i=0, ln= this.params.points.length; i<ln; ++i) {
        let point = this.params.points[i];

        if(this.points[point.x] === undefined) {
          this.points[point.x] = [point];
        }
        else {
          this.points[point.x].push(point);
        }

        if(this.circles[point.r+''+point.g+''+point.b+''+point.a] === undefined) {
          let circle = new createjs.Shape();
          circle.graphics.beginFill('rgba('+point.r+','+point.g+','+point.b+','+point.a+')').drawCircle(0, 0, point.w/2);
          circle.cache(-point.w,-point.w,point.w*2,point.w*2);
          this.circles[point.r+''+point.g+''+point.b+''+point.a] = circle.cacheCanvas;
        }
    }
  }

  show() {

    console.log('showBanner');

    this.particles = [];

    this.particle_cont.removeAllChildren();
    if(this.particleTickListener) Stage.off('tick', this.particleTickListener);

    this.points.forEach((col, index) => {

      for(let i=0, ln=col.length; i<ln; ++i) {

        let point = col[i];

        let particle = new Particle({
            r: point.r,
            g: point.g,
            b: point.b,
            a: point.a,
            w: point.w,
            i: this.circles[point.r+''+point.g+''+point.b+''+point.a]
            });

        // initial position
        let x = this.params.width - point.x + STAGEWIDTH;
        let y = point.y + STAGEHEIGHT/4;
        particle.setPosition(x, y);

        // target position
        x = point.x + STAGEWIDTH/4;
        y = point.y + STAGEHEIGHT/4;
        particle.setTarget(x, y);

        // random impulsion
        let impl = 100;
        x = impl - Math.random()*(impl*2);
        y = impl - Math.random()*(impl*2);
        particle.addImpulsion(x, y, 0.1);

        //opacity
        particle.alpha = 1;
        particle.alphaChange = 0;

        point.particle = particle;
        this.particle_cont.addChild(particle);
        this.particles.push(particle);
      }
    });


    // enable tick event
    this.tictac = 0;
    this.autoUpdate = true;
    this.particleTickListener = Stage.on("tick", proxy(this.moveParticles, this), Stage);
    // when animation is finished, show subtitle
    StageGL.on('banner_in_place', this.showSubtitle, this, true);

  }

  showEnded() {

    console.log('showEnded');
    Stage.off('tick', this.particleTickListener);
    this.particleTickListener = null;
    this.autoUpdate = false;
  }

  showSubtitle() {

    console.log('showSubtitle');
    this.subtitle_cont.y -= 30;
    createjs.Tween.get(this.subtitle_cont).to({ alpha: 1, y: this.subtitle_cont.y + 30 }, 500)
      .wait(500)
      .call(proxy(this.showEnded, this));
  }

  hideSubtitle() {

    console.log('hideSubtitle');
    createjs.Tween.get(this.subtitle_cont).to({ alpha: 0, y: this.subtitle_cont.y + 30}, 500);
  }

  hide() {

    console.log('hideBanner');

    if(this.particleTickListener) Stage.off('tick', this.particleTickListener);

    this.points.reverse();
    this.points.forEach((col, index) => {
      for(let i=0, ln=col.length; i<ln; ++i) {

        let point = col[i];
        let x = this.params.width - point.x - STAGEWIDTH/2;
        let y = point.y + (STAGEHEIGHT/2+100 - Math.random()*STAGEHEIGHT);

        setTimeout(function() {
          point.particle.setTarget(x, y);
          point.particle.alphaChange = -0.1;
          //point.particle.addImpulsion(-Math.random()*100, 100 - Math.random()*100*2, 0.2);
        }, Math.random()*(2*index) + Math.random()*10);
      }
    });
    this.points.reverse();

    // hide subtitle
    this.hideSubtitle();

    // enable tick event
    this.tictac = 0;
    this.autoUpdate = true;
    this.particleTickListener = Stage.on("tick", proxy(this.moveParticles, this), Stage);
    // when animation is finished, remove tick event and empty Particles
    StageGL.on('banner_in_place', this.hideEnded, this, true);

  }

  hideEnded() {

    console.log('hideEnded');
    this.particles = [];
    Stage.off('tick', this.particleTickListener);
    this.particleTickListener = null;
    this.autoUpdate = false;
    this.disabled = true;
    StageGL.dispatchEvent('banner_terminated');
  }


  moveParticles() {

    if(this.disabled) return;

    let arrived = 0;
    let particle;
    for(let i=0, ln=this.particles.length; i<ln; ++i) {
      particle = this.particles[i];
      particle.move();
      if(particle.arrived) ++arrived;
    }

    if(this.particles.length != 0 && arrived == this.particles.length) {

      if(this.in_place === false) {
        StageGL.dispatchEvent('banner_in_place');
        this.in_place = true;
      }
    }
    else {
      this.in_place = false;
    }

    StageGL.update();
    this.tictac++;
  }

  onMouseMove() {

    if(this.autoUpdate === false) {
      this.moveParticles();
    }
  }

  destroy() {

    this.subtitle_cont.removeAllChildren();
    this.particle_cont.removeAllChildren();
    this.removeAllChildren();
    StageGL.removeAllChildren();
    this.particles = null;
    this.points = null;
  }

}