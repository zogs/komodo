class Banner extends createjs.Container {

  constructor(params) {

    super();
    var defaults = {
      points : null,
      width: null,
      height: null,
      stage: null,
    };

    this.params = extend(defaults,params);
    this.points = [];
    this.circles = [];
    this.particles = [];

    this.init();
  }

  init(params) {

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
    this.params.stage.removeAllChildren();

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

        // random movement
        let impl = 100;
        x = impl - Math.random()*(impl*2);
        y = impl - Math.random()*(impl*2);
        particle.addImpulsion(x, y, 0.1);

        //opacity
        particle.alpha = 1;
        particle.alphaChange = 0;

        point.particle = particle;
        this.params.stage.addChild(particle);
        this.particles.push(particle);
      }
    });

    // enable tick event
    this.particleTickListener = Stage.on("tick", proxy(this.moveParticles, this), Stage);
    // when animation is finished, remove tick event
    this.params.stage.on('in_place', this.showEnded, this, true);
  }

  showEnded() {

    Stage.off('tick', this.particleTickListener);
    this.particleTickListener = null;
  }


  hide() {

    console.log('hideBanner');

    this.points.reverse();
    this.points.forEach((col, index) => {

      for(let i=0, ln=col.length; i<ln; ++i) {

        let point = col[i];

        let x = this.params.width - point.x - STAGEWIDTH/2;
        let y = point.y + (STAGEHEIGHT/2+100 - Math.random()*STAGEHEIGHT);

        setTimeout(function() {
          point.particle.setTarget(x, y);
          point.particle.alphaChange = -0.05;
          //point.particle.addImpulsion(-Math.random()*100, 100 - Math.random()*100*2, 0.2);
        }, Math.random()*(2*index) + Math.random()*10);
      }
    });

    this.points.reverse();

    // enable tick event
    this.particleTickListener = Stage.on("tick", proxy(this.moveParticles, this), Stage);
    // when animation is finished, remove tick event and empty Particles
    this.params.stage.on('in_place', this.hideEnded, this, true);
  }

  hideEnded() {
    console.log('hideEnded');
    this.particles = [];
    Stage.off('tick', this.particleTickListener);
    this.particleTickListener = null;
  }

  moveParticles() {

    let arrived = 0;
    for(let i=0, ln=this.particles.length; i<ln; ++i) {
      let particle = this.particles[i];
        particle.move();
        if(particle.arrived) arrived++;
    }

    if(this.particles.length != 0 && arrived == this.particles.length) {
      this.params.stage.dispatchEvent('in_place');
    }

    this.params.stage.update();
  }

}