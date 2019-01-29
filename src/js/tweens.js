import {proxy} from './utils';

export class TweensManager {

  constructor() {
    this._tweens = [];
  }

  add(tween, autoremove = true) {

    if(autoremove) {
      //tween.call(this.remove.apply(this, [tween]));
      tween.call(proxy(Tweens.remove, Tweens, [tween]));
    }

    this._tweens.push(tween);
  }

  remove(tween) {

    this._tweens.splice(this._tweens.indexOf(tween), 1);
  }

  replace(tween, newtween) {

    this._tweens[this._tweens.indexOf(tween)] = newtween;
  }

  all() {

    return this._tweens;
  }

  setTimeScale(scale) {

    this._tweens.map(t => t.timeScale = scale);
  }
}
