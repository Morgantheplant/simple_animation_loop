jasmine.getEnv().defaultTimeoutInterval = 10000;
var AnimationLoop = require('./AnimationLoop');

test('Animation loop', function(done){
  var animationLoop = new AnimationLoop();
    // start animation loop
    animationLoop.start();
    var timeFirst = animationLoop.getTime();
    setTimeout(function(){
      //check time after two seconds
      var timeSecond = animationLoop.getTime();
      // times should not match
      expect(timeFirst).not.toBe(timeSecond);
      // stop the timer
      animationLoop.stop();
      timeFirst = animationLoop.getTime();
    }, 1000);

    setTimeout(function(){
        // time should be the same
      timeSecond = animationLoop.getTime();
      expect(timeFirst).toBe(timeSecond);
      done();
    },3000)
});


