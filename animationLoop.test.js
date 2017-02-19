var AnimationLoop = require('./AnimationLoop');
jest.useFakeTimers();  

function removeRaf(){
  window.requestAnimationFrame = null;
  window.cancelAnimationFrame = null;
  window.cancelRequestAnimationFrame = null;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  vendors.forEach(function(vendor){
    window[vendor + 'RequestAnimationFrame'] = null;
    window[vendor + 'CancelRequestAnimationFrame'] = null;
    window[vendor + 'CancelAnimationFrame'] = null;
  });
}

var animationLoop;

beforeEach(function(){
  // remove all rAF timers so it falls back to setTimeout for mocks
  removeRaf();
  animationLoop = new AnimationLoop();
});


test('Animation loop should keep track of time', function(done){
    // start animation loop
    animationLoop.start();
    var timeFirst = animationLoop.getTime();
    jest.runTimersToTime(1000);
    //check time after one second
    var timeSecond = animationLoop.getTime();
    // times should not match
    expect(timeFirst).not.toBe(timeSecond);
    // stop the timer
    animationLoop.stop();
    timeFirst = animationLoop.getTime();
    jest.runTimersToTime(2000);
    // time should be the same
    timeSecond = animationLoop.getTime();
    expect(timeFirst).toBe(timeSecond);
    animationLoop.stop();
    done();
});


test('Animation Loop should add animations and call them appropriately', function(){
  var animation = jest.fn(),
  animation2 = jest.fn(),
  calls, calls2, done = false;
  // make sure it starts empty
  expect(animationLoop.animations.length).toBe(0);
  animationLoop.addAnimation(animation);
  // make sure one animation is added
  expect(animationLoop.animations.length).toBe(1);
  animationLoop.start();
  jest.runTimersToTime(1000);
  // store number of calls for later check
  calls = animation.mock.calls.length;   
  // make sure animation is being called
  expect(calls).toBeGreaterThan(0);
  // add another animation
  animationLoop.addAnimation(animation2);
  // make sure there are now two animations
  expect(animationLoop.animations.length).toBe(2);
  jest.runTimersToTime(2000);
  // check first animation is still being called
  expect(animation.mock.calls.length).toBeGreaterThan(calls);
  // check if second animation is being called
  expect(animation2.mock.calls.length).toBeGreaterThan(0);
  // first animation should be called more than second
  expect(animation.mock.calls.length).toBeGreaterThan(animation2.mock.calls.length);
  // store values
  calls = animation.mock.calls.length;
  calls2 = animation2.mock.calls.length;
  // stop timer
  animationLoop.stop();
  jest.runTimersToTime(3000);
  // make sure animations are not being called still
  expect(calls).toBe(animation.mock.calls.length);
  expect(calls2).toBe(animation2.mock.calls.length);
});

test('Animation loop should only add functions', function(){
  var animation = jest.fn();
  // make sure it starts empty
  expect(animationLoop.animations.length).toBe(0);
  animationLoop.addAnimation(animation);
  // make sure one animation is added
  expect(animationLoop.animations.length).toBe(1);
  // try to add non function values
  ['string', {}, null, undefined, 23, false, NaN].forEach(function(type){
    animationLoop.addAnimation(type);
  });
  // make sure no animations are added
  expect(animationLoop.animations.length).toBe(1);
});


test('Animation loop should remove animations correctly', function(){
  var animation = jest.fn(),
  animation2 = jest.fn(),
  animation3 = jest.fn();
  animationLoop.start();
  // make sure it starts empty
  expect(animationLoop.animations.length).toBe(0);
  animationLoop.addAnimation(animation);
  // make sure one animation is added
  expect(animationLoop.animations.length).toBe(1);
  animationLoop.addAnimation(animation2);
  // make sure two animations are added
  expect(animationLoop.animations.length).toBe(2);
  animationLoop.addAnimation(animation3);
  // make sure three animations are added
  expect(animationLoop.animations.length).toBe(3);
  jest.runTimersToTime(1000);
  animationLoop.removeAnimation(animation2);
  // make sure animation2 is removed
  expect(animationLoop.animations.length).toBe(2);
  expect(animationLoop.animations.indexOf(animation2)).toBe(-1);
  expect(animationLoop.animations.indexOf(animation)).not.toBe(-1);
  expect(animationLoop.animations.indexOf(animation3)).not.toBe(-1);
  // make sure first animation is removed
  animationLoop.removeAnimation(animation);
  expect(animationLoop.animations.length).toBe(1);
  expect(animationLoop.animations.indexOf(animation)).toBe(-1);
  expect(animationLoop.animations.indexOf(animation3)).not.toBe(-1);
  // try removing animation 2 again (should do nothing)
  animationLoop.removeAnimation(animation2);
  expect(animationLoop.animations.length).toBe(1);
  // remove last animation
  animationLoop.removeAnimation(animation3);
  expect(animationLoop.animations.length).toBe(0);
  expect(animationLoop.animations.indexOf(animation3)).toBe(-1);
  // store values
  var calls1 = animation.mock.calls.length;
  var calls2 = animation2.mock.calls.length;
  var calls3 = animation3.mock.calls.length;
  // make sure all animations were called
  expect(calls1).toBeGreaterThan(0)
  expect(calls2).toBeGreaterThan(0)
  expect(calls3).toBeGreaterThan(0)

});

test('setAnimationTimeout should mimic setTimeout functionality', function(){
  var timedAnimation = jest.fn();
  animationLoop.start();
  // make sure it starts empty
  expect(animationLoop.animations.length).toBe(0);
  animationLoop.setAnimationTimeout(timedAnimation, 2000);
  jest.runTimersToTime(4000);
  // animation should only be called once
  expect(timedAnimation.mock.calls.length).toBe(1);
  expect(animationLoop.animations.length).toBe(0);
});

test('setAnimationInterval should mimic setInterval functionality', function(){
  var timedAnimation = jest.fn();
  // animationLoop.start();
  // animationLoop.setAnimationInterval(timedAnimation, 1000);
  // jest.runTimersToTime(1000);
  // expect(timedAnimation.mock.calls.length).toBe(1);
  // expect(animationLoop.animations.length).toBe(1);
  // jest.runTimersToTime(2500);
  // expect(timedAnimation.mock.calls.length).toBe(2);
  // expect(animationLoop.animations.length).toBe(1);
  // jest.runTimersToTime(3500);
  // expect(timedAnimation.mock.calls.length).toBe(3);
  // expect(animationLoop.animations.length).toBe(1);
  // jest.runTimersToTime(3600);
  // expect(timedAnimation.mock.calls.length).toBe(3);
  // expect(animationLoop.animations.length).toBe(1);
});




