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


test('AnimationLoop should add animations and call them appropriately', function(){
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






