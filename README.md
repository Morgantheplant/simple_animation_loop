# Simple Animation Loop
Simple rAF wrapper to queue animations. This also provides a basic reimplementation of browser timer functions (`setInterval` and `setTimeout`) to prevent timers from affecting animation performance. 

installation:
```
npm install --save simple_animation_loop
```




# Documentation:

<a name="AnimationLoop"></a>

## AnimationLoop
AnimationLoop

**Kind**: global class  

* [AnimationLoop](#AnimationLoop)
    * [new AnimationLoop()](#new_AnimationLoop_new)
    * [.start()](#AnimationLoop+start) ⇒ <code>[AnimationLoop](#AnimationLoop)</code>
    * [.stop()](#AnimationLoop+stop) ⇒ <code>[AnimationLoop](#AnimationLoop)</code>
    * [.addAnimation(animation)](#AnimationLoop+addAnimation) ⇒ <code>function</code>
    * [.removeAnimation(animation)](#AnimationLoop+removeAnimation) ⇒ <code>undefined</code>
    * [.setAnimationTimeout(animation, delay)](#AnimationLoop+setAnimationTimeout) ⇒ <code>function</code>
    * [.setAnimationInterval(animation, delay)](#AnimationLoop+setAnimationInterval) ⇒ <code>function</code>

<a name="new_AnimationLoop_new"></a>

### new AnimationLoop()
The animation loop provides a wrapper for requestAnimationFrame and a
reimplementation of browser timers. It can schedule multiple callbacks
and help maximize performance for in browser animations.

<a name="AnimationLoop+start"></a>

### animationLoop.start() ⇒ <code>[AnimationLoop](#AnimationLoop)</code>
Starts the main animation loop and prevents multiple updates to 
requestAnimationFrame.

**Kind**: instance method of <code>[AnimationLoop](#AnimationLoop)</code>  
**Returns**: <code>[AnimationLoop](#AnimationLoop)</code> - this  
<a name="AnimationLoop+stop"></a>

### animationLoop.stop() ⇒ <code>[AnimationLoop](#AnimationLoop)</code>
Stops the main animation loop by calling cancelAnimationFrame.

**Kind**: instance method of <code>[AnimationLoop](#AnimationLoop)</code>  
**Returns**: <code>[AnimationLoop](#AnimationLoop)</code> - this  
<a name="AnimationLoop+addAnimation"></a>

### animationLoop.addAnimation(animation) ⇒ <code>function</code>
Adds a callback to the update loop and prevents the same callback from being 
added twice.

**Kind**: instance method of <code>[AnimationLoop](#AnimationLoop)</code>  
**Returns**: <code>function</code> - animation - callback passed in  

| Param | Type | Description |
| --- | --- | --- |
| animation | <code>function</code> | callback that will be added to the main update loop. |

<a name="AnimationLoop+removeAnimation"></a>

### animationLoop.removeAnimation(animation) ⇒ <code>undefined</code>
Removes a callback from the current update loop and next scheduled loop.

**Kind**: instance method of <code>[AnimationLoop](#AnimationLoop)</code>  
**Returns**: <code>undefined</code> - undefined  

| Param | Type | Description |
| --- | --- | --- |
| animation | <code>function</code> | callback that will be added to the main update loop. |

<a name="AnimationLoop+setAnimationTimeout"></a>

### animationLoop.setAnimationTimeout(animation, delay) ⇒ <code>function</code>
Mimics browser's setTimeout basic functionality. Prevents browser timer from 
degrading performance of the main update loop. It is recommended to use this over
setTimeout after `.start()` has been called.

**Kind**: instance method of <code>[AnimationLoop](#AnimationLoop)</code>  
**Returns**: <code>function</code> - timeout callback - returned so it can be canceled via `removeAnimation()`  

| Param | Type | Description |
| --- | --- | --- |
| animation | <code>function</code> | A function to be executed after the timer expires. |
| delay | <code>Number</code> | The time, in milliseconds (thousandths of a second), the timer  should wait before the specified function is executed. |

<a name="AnimationLoop+setAnimationInterval"></a>

### animationLoop.setAnimationInterval(animation, delay) ⇒ <code>function</code>
Mimics browser's setInterval basic functionality. Prevents browser timer from 
degrading performance of the main update loop. It is recommended to use this over
setInternal after `.start()` has been called.

**Kind**: instance method of <code>[AnimationLoop](#AnimationLoop)</code>  
**Returns**: <code>function</code> - interval callback - returned so it can be canceled via `removeAnimation()`  

| Param | Type | Description |
| --- | --- | --- |
| animation | <code>function</code> | A function to be executed every `delay` milliseconds. |
| delay | <code>Number</code> | The time, in milliseconds (thousandths of a second), the timer  should delay in between executions of the specified function. |


## examples of usage:

 - [smurf](https://github.com/Morgantheplant/smurf)

<hr />

Please submit any issues via GitHub.

@morgantheplant