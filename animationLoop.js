var rAF_Polyfills = require('./rAFPolyfill');
var rAF = rAF_Polyfills.requestAnimationFrame;
var cAF = rAF_Polyfills.cancelAnimationFrame;

/**
 * The animation loop provides a wrapper for requestAnimationFrame and a
 * reimplementation of browser timers. It can schedule multiple callbacks
 * and help maximize performance for in browser animations.
 * 
 * @class AnimationLoop
 * @constructor
 */
function AnimationLoop(){
  this.animations = [];
  this._animations = [];
  this.isRunning = false;
  this.startTime = 0;
  this._time = 0;
}

/**
 * Internal main callback method that is passed to requestAnimationFrame 
 * and handles calling all scheduled animations. Copies animations array 
 * before calling animation callbacks so items can be safely removed midway 
 * through a loop cycle. 
 * 
 * @method
 * @private
 *
 * @param {Number} time - time high resolution timstamp 
 *
 * @returns {undefined} undefined
*/
AnimationLoop.prototype._updateLoop = function _updateLoop(time){ 
  this._time = time;
  // make a copy so animations can be removed during loop
  this._animations = this.animations.slice();
  while(this._animations.length){
    // pop animations off and call each animation passin in time
    this._animations.pop()(time);
  }
  //store reference so we can cancel it later
  this._rAF = rAF(this.updateLoop);
}

/**
 * Starts the main animation loop and prevents multiple updates to 
 * requestAnimationFrame.
 * 
 * @method 
 *
 * @returns {AnimationLoop} this
*/
AnimationLoop.prototype.start = function start(){
  if(!this.isRunning){
    this.isRunning = true;
    this.updateLoop = this._updateLoop.bind(this);
    rAF(this.updateLoop);
  }
  return this;
};

/**
 * Stops the main animation loop by calling cancelAnimationFrame. 
 * 
 * @method 
 *
 * @returns {AnimationLoop} this
*/
AnimationLoop.prototype.stop = function stop(){
  if(this.isRunning){
    cAF(this._rAF);
  }
  return this;
};

/**
 * Adds a callback to the update loop and prevents the same callback from being 
 * added twice. 
 * 
 * @method 
 *
 * @param {Function} animation - callback that will be added to the main update loop.  
 *
 * @returns {Function} callback passed in
*/
AnimationLoop.prototype.addAnimation = function addAnimation(animation){
  if (typeof animation === "function" && this.animations.indexOf(animation) === -1) {
    this.animations.push(animation);
  }
  return animation;
};

/**
 * Removes a callback from the current update loop and next scheduled loop. 
 * 
 * @method 
 *
 * @param {Function} animation - callback that will be added to the main update loop.  
 *
 * @returns {undefined} undefined
*/
AnimationLoop.prototype.removeAnimation = function removeAnimation(animation) {
  var index = this.animations.indexOf(animation);
  if (index !== -1) {
    this.animations.splice(index, 1);
  }
  index = this._animations.indexOf(animation);
  // remove animation if midway through loop
  if(index !== -1){
    this._animations.splice(index, 1);
  }
};

/**
 * Mimics browser's setTimeout basic functionality. Prevents browser timer from 
 * degrading performance of the main update loop. It is recommended to use this over
 * setTimeout after `.start()` has been called. 
 * 
 * @method 
 *
 * @param {Function} animation - A function to be executed after the timer expires. 
 * @param {Number} delay - The time, in milliseconds (thousandths of a second), the timer 
 * should wait before the specified function is executed. 
 *
 * @returns {Function} timeout callback returned so it can be canceled via `removeAnimation()`
*/
AnimationLoop.prototype.setAnimationTimeout = function setAnimationTimeout(animation, delay){
  var startTime = this._time;
  var animLoop = this;
  return this.addAnimation(function timeoutAnimation(time){
    if(time - startTime >= delay){
      animation();
      animLoop.removeAnimation(timeoutAnimation);
    }
  });
}

/**
 * Mimics browser's setInterval basic functionality. Prevents browser timer from 
 * degrading performance of the main update loop. It is recommended to use this over
 * setInternal after `.start()` has been called. 
 * 
 * @method 
 *
 * @param {Function} animation - A function to be executed every `delay` milliseconds. 
 * @param {Number} delay - The time, in milliseconds (thousandths of a second), the timer 
 * should delay in between executions of the specified function.
 *
 * @returns {Function} interval callback returned so it can be canceled via `removeAnimation()`
*/
AnimationLoop.prototype.setAnimationInterval = function setAnimationInterval(animation, interval){
  var startTime = this._time;
  var animLoop = this;
  return this.addAnimation(function intervalAnimation(time){
    if(time - startTime >= interval){
      animation();
      startTime = time;
    }
  });
}

/*
* Get the current [high resolution timestamp](https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp).
*
* @method
*
* @returns {Number} high resolution timestamp
*/

AnimationLoop.prototype.getTime = function(){
  return this._time
}

module.exports = AnimationLoop;
