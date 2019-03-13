# AIJAS
Animation in JAVASCRIPT Android Style

Easily create javscript animation from very few line of code.
Experience animation coding as you do animation in android.

## Installation

```
npm install aijas
```


![Alt text](images/ezgif.com-video-to-gif.gif?raw=true "Title")

## How it works

Well the main logic is the library creates a set of css styles for animations and inseters into the style of div having id AIJAS_style. These style finally make the element animate. All the animation are possible by creating the keyframe based on the animation type you want to achieve. 


#### Step 1: Import AIJAS


Add the AIJAS script

```html
<script src="dist/AIJAS.js" ></script>
```

If you are using npm package import objects as

```js
import { ObjectAnimator, View } from 'aijas'
```


#### Step 2: Set animating element data-style-id

The data-style-id will help to uniquely identify the elements style while animating.

```html
<img src="images/ultraball.png" id="anim-object" data-style-id="ball11"/>
```

#### Step 3 : Set up animation object

The animation object is the one that will animate our element. Lets see the code below
```js
var anim = ObjectAnimator.ofInt(document.getElementById("anim-object"),
                                View.TRANSLATE_X, 100, 400);
                        anim.setDuration(1000);
                        anim.start();
 ```                       
this code will animate our image which has an id anim-object by translating it in x-axis from 100 to 400px from its current location. First an object animator is created by calling ObjectAnimator.ofInt where we pass our target element as parameter.
Then we set the duration of animation and finally we start our animation. 



## Diffrent type of animation supported

#### 1 . Translate

The translate animation is used to do do horizontal and vertical animation

```js
var anim = ObjectAnimator.ofInt(document.getElementById("anim-object"),
                                View.TRANSLATE_X, 100, 400);
                        anim.setDuration(1000);
                        anim.start();
 ``` 
 
 For Y direction animation 
 
 ```js
 var anim = ObjectAnimator.ofInt(document.getElementById("anim-object"),
                                View.TRANSLATE_Y, 100, 400);
                        anim.setDuration(1000);
                        anim.start();
 ```
 
 #### 2 . Rotate 
 
 The rotate animation rotates element base on the angle in degree
 
 ```js
 var anim = ObjectAnimator.ofInt(document.getElementById("anim-object"),
                                View.ROTATE, 100, 400);
                        anim.setDuration(1000);
                        anim.setInterpolar(new AccelerateDecelerateInterpolator());
                        anim.start();
 ```
 
Here you can see something new called Interpolar. We will cover that below

#### 3 . Fade

The fade animation can be done as 

```js
 var anim = ObjectAnimator.ofFloat(document.getElementById("anim-object"),
                                View.ALPHA, 0.1, 1);
                        anim.setDuration(1000);
                        anim.start();
 ```
 
 #### 4. Scale
 
 The scale animation animates the element by changin its size 
 
 ```js
 var anim = ObjectAnimator.ofFloat(document.getElementById("anim-object"),
                                View.SCALE, 0.1, 1);
                        anim.setDuration(1000);
                        anim.setInterpolar(new BounceInterpolator());
                        anim.start();
 ```
 
 #### 5 . Combined animation
 
 With combined animation we can create the animation by using set of animations. This is obtained by the help of animator set object.
 
 ```js
 var tx = ObjectAnimator.ofInt(document.getElementById("anim-object"),
                                View.TRANSLATE_X, 100, 300);
                        tx.setDuration(1000);
                        tx.setInterpolar(new BounceInterpolator());
  var ty = ObjectAnimator.ofInt(document.getElementById("anim-object"),
                                View.TRANSLATE_Y, 10, 300);
                        ty.setDuration(1000);
                        ty.setInterpolar(new BounceInterpolator());
                        var rotate = ObjectAnimator.ofInt(document.getElementById("anim-object"),
                                View.ROTATE, 100, 400);
                        rotate.setDuration(1000);
                        rotate.setInterpolar(new BounceInterpolator());
   var final = new AnimatorSet(); // make a animation set
                        final.playTogether([tx, ty, rotate]); // add animations to the animator set
   final.start(); // finally start animation                     
 ```
 
 ### Setting up animation listener
 
 An animation listener listens for animation events. Its pretty straight forward. It can be used with object animator as well as animator set
 
 ```js
 anim.setAnimationListener({
                            onAnimationStart: function (data_set_id) {
                                console.log("animaitn start main Id : " + data_set_id);
                            },
                            onAnimationRepeat: function (data_set_id) {
                                console.log("animaitn repeat main Id : " + data_set_id);
                            },
                            onAnimationEnd: function (data_set_id) {
                                console.log("animaitn end main Id : " + data_set_id);
                            }
                        });
```
 
 ### Interpolars
 
 Well interpolars defines how your animation behaves. It defines the rate of change of key frame attributes. Some of the custom interpolars are :
 
 1. LinearInterpolar
 2. AccelerateDecelerateInterpolator
 3. CycleInterpolator
 4. AccelerateInterpolator
 5. OvershootInterpolar
 6. BounceInterpolator
 
 You can also create you own interpolar function as  :
 
 ```js
 class AccelerateInterpolator{
    
    constructor(factor=2.0){this.factor=factor;}
    getInterpolar(t){
       return Math.pow(t,2*this.factor);
    }
}
 ```
 
 Here you can see that the getInterpolar function return the accelerate value for time t. The getInterpolar function is called to get the position value with respect to time. You can define the position by your own calculations.
 
Here the simple example of linear interpolar. It does not have any fancy effects

```js
class LinearInterpolar{
    
    constructor(){}
    
    getInterpolar(t){
        return t;
    }
}
 
 ```
 

### Enjoy animating !!


```html
<html>
    <head>
        <title>Animation in JAVASCRIPT Android Style</title>
        <link rel="stylesheet" type="text/css" href="css/main.css">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <div id="AIJAS_style"></div>
        <div class="centerXY content">

            <select class="selector" onchange="loadAnim(this)">

                <option value="0">--Select Animation--</option>
                <option value="1">Translate_X</option>
                <option value="2">Translate_Y</option>
                <option value="3">Rotate</option>
                <option value="4">Fade</option>
                <option value="5">Scale</option>
                <option value="6">Combin Anims</option>

            </select>

            <div class="anim-section">
                <div class="img-holder">
                    <img src="images/ultraball.png" id="anim-object" data-style-id="ball11"/>
                </div>

            </div>

        </div>
        <script src="dist/AIJAS.js" ></script>
        <script type="text/javascript">
                window.onload = function () {
                }
                function loadAnim(elem) {
                    console.log("load " + elem.value);
                    if (elem.value == View.TRANSLATE_X) {
                        var anim = ObjectAnimator.ofInt(document.getElementById("anim-object"),
                                View.TRANSLATE_X, 100, 400);
                        anim.setDuration(1000);
                        anim.start();
                    } else if (elem.value == View.TRANSLATE_Y) {
                        var anim = ObjectAnimator.ofInt(document.getElementById("anim-object"),
                                View.TRANSLATE_Y, 100, 400);
                        anim.setDuration(1000);
                        anim.setInterpolar(new CycleInterpolator(0.5));
                        anim.setRepeatCount(3);
                        anim.setAnimationListener({
                            onAnimationStart: function (data_set_id) {
                                console.log("animaitn start main Id : " + data_set_id);
                            },
                            onAnimationRepeat: function (data_set_id) {
                                console.log("animaitn repeat main Id : " + data_set_id);
                            },
                            onAnimationEnd: function (data_set_id) {
                                console.log("animaitn end main Id : " + data_set_id);
                            }
                        });
                        anim.start();
                    } else if (elem.value == View.ROTATE) {
                        var anim = ObjectAnimator.ofInt(document.getElementById("anim-object"),
                                View.ROTATE, 100, 400);
                        anim.setDuration(1000);
                        anim.setInterpolar(new AccelerateDecelerateInterpolator());
                        anim.start();
                    } else if (elem.value == View.ALPHA) {
                        var anim = ObjectAnimator.ofFloat(document.getElementById("anim-object"),
                                View.ALPHA, 0.1, 1);
                        anim.setDuration(1000);
                        anim.start();
                    } else if (elem.value == View.SCALE) {
                        var anim = ObjectAnimator.ofFloat(document.getElementById("anim-object"),
                                View.SCALE, 0.1, 1);
                        anim.setDuration(1000);
                        anim.setInterpolar(new BounceInterpolator());
                        anim.start();
                    } else {
                        var tx = ObjectAnimator.ofInt(document.getElementById("anim-object"),
                                View.TRANSLATE_X, 100, 300);
                        tx.setDuration(1000);
                        tx.setInterpolar(new BounceInterpolator());
                        var ty = ObjectAnimator.ofInt(document.getElementById("anim-object"),
                                View.TRANSLATE_Y, 10, 300);
                        ty.setDuration(1000);
                        ty.setInterpolar(new BounceInterpolator());
                        var rotate = ObjectAnimator.ofInt(document.getElementById("anim-object"),
                                View.ROTATE, 100, 400);
                        rotate.setDuration(1000);
                        rotate.setInterpolar(new BounceInterpolator());
                        var final = new AnimatorSet();
                        final.playTogether([tx, ty, rotate]);
                        final.setAnimationListener({
                            onAnimationStart: function (data_set_id) {
                                console.log("animaitn start main Id : " + data_set_id);
                            },
                            onAnimationRepeat: function (data_set_id) {
                                console.log("animaitn repeat main Id : " + data_set_id);
                            },
                            onAnimationEnd: function (data_set_id) {
                                console.log("animaitn end main Id : " + data_set_id);
                            }
                        });
                        final.start();
                    }
                }
        </script>
    </body>
</html>
```




SEE index.html for reference
To use in you project download AIJAS.js from /js directory

For android developers
-------------------------
The ValueAnimator cannot be used currently for animation

Enjoy!!
