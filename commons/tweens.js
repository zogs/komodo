Tweens = function() {

  this._tweens = [];

}

Tweens.prototype.add = function(tween, autoremove = true) {

  if(autoremove) tween.call(proxy(Tweens.remove, Tweens, [tween]));

  this._tweens.push(tween);
}

Tweens.prototype.remove = function(tween) {

  this._tweens.splice(this._tweens.indexOf(tween), 1);
}

Tweens.prototype.replace = function(tween, newtween) {

  this._tweens[this._tweens.indexOf(tween)] = newtween;
}

Tweens.prototype.all = function() {

  return this._tweens;
}

Tweens.prototype.setTimeScale = function(scale) {

  this._tweens.map(t => t.timeScale = scale);
}