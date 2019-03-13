let { View, ACTIVE_ANIMATION } = require("./Animations")

let LinearInterpolator = require('../interpolars/LinearInterpolator')

/**
 * @class ValueAnimator
 * 
 * @description
 * <pre>
 * 
 * Currently full feature of ValueAnimator is not developed
 * Important to note that evert animation are defined by animators
 * The valu animator hold diffrent function that are used in defining an animation
 * 
 * </pre>
 */

/*
 * STRUCTURE of tracking the elems animations
 * {"elem_id":{MAPS of translates}}
 * 
 * STRUCTURE of tracking the maps of translation
 * {"percentage":{
 *                  translate:{x:val,y:val},
 *                  rotate:val deg,
 *                  opacity:val from 0 to 1
 *               }}
 */

class ValueAnimator {


    constructor() {
        this.animators = [];
        this.IS_ANIM_SET = false;
        this.interpolar = new LinearInterpolator();
        this.iteration = 1;
    }


    /**
     * 
     * @param {Number} ms - Set the duration of animation
     */
    setDuration(ms) {
        this.duration = ms;
    }

    /**
     * 
     * @param {Object} intrplr - Interpolator object
     * @description
     * Set the interpolator object
     */
    setInterpolar(intrplr) {
        this.interpolar = intrplr;
    }

    /**
     * 
     * @param {Number} count - animation repeat number
     * @description
     * Set the number of times for animation to repeat
     */
    setRepeatCount(count) {
        this.iteration = count;
    }

    /**
     * 
     * @param {Object} listener - Listerner of animation state
     * @description
     * Sets the animation listener
     */
    setAnimationListener(listener) {
        this.anim_listener = listener;
    }

    /**
     * @description
     * Start the animation
     */
    start() {

        this.generateKeyFramesForMultipleAnims();
        this.generateKeyFrames();
        for (var anim_id in this.animations) {
            this.animations[anim_id]['elem'].name = this.animations[anim_id]['anim_name'];
            this.animations[anim_id]['elem'].final_attr = this.animations[anim_id]['final_attr'];
            this.initialize(this.animations[anim_id]['elem']);
        }

    }

    /*
     * This function will generate appropriate keyfram css animation and 
     * adds them to the DOM
     * This is only used after all the elemensts coorsds ar tracked as frames
     */
    generateKeyFrames() {
        var prop;
        for (var anim_id in this.animations) {

            var anim_name = "AJAIS" + anim_id;
            var anims = '';
            var final_attr = '';

            for (var frame_per in this.animations[anim_id]["anim"]) {
                //                this.log("frame",frame_per);
                prop = this.animations[anim_id]["anim"][frame_per];
                // Adding translatoin
                final_attr = 'transform : translate(';
                final_attr += prop.translate.x + "px";
                final_attr += ",";
                final_attr += prop.translate.y + "px";
                final_attr += ") ";

                //Adding rotation
                final_attr += " rotate(" + prop.rotate + "deg )";

                //Adding scale anims
                final_attr += " scale(" + prop.scale + ") rotateZ(0.001deg);";

                //Adding opacity
                final_attr += " opacity : " + prop.opacity;


                anims += "\n" + frame_per + " { " + final_attr + " } ";
            }

            this.animations[anim_id]["final_attr"] = final_attr;
            this.animations[anim_id]["anim_name"] = anim_name;

            anims = "@-webkit-keyframes " + anim_name + "\n" +
                " {" + anims + "}\n\n" +
                "@keyframes " + anim_name + "\n" +
                " {" + anims + "}\n\n";

            //add the element to the animation
            var style = document.getElementById(anim_id);
            if (style != undefined) {
                style.innerHTML = anims;
            } else {
                document.getElementById("AIJAS_style").innerHTML +=
                    "<style type=\"text/css\" id=\"" + anim_id + "\">" + anims +
                    "</style>";
            }


        }
    }

    /*
     * This function will generate appropriate keyfram css animation and 
     * adds them to the DOM
     * This is  used to track animation coordinates as framses
     */
    generateKeyFramesForMultipleAnims() {
        this.animations = {};
        this.log("anims", "total anims : " + this.animators.length);
        var key_frame_upto = 0;//this variable will get the value between 0 to 1 for keyframs per animation
        var key_frame_from = 0;//this variable will get the value between 0 to 1 for keyframs per animation
        var total_duration = this.getTotalDuration();
        for (var i = 0; i < this.animators.length; i++) {
            key_frame_from += key_frame_upto;
            var anims = this.getAnimator(i);
            for (var i = 0; i < anims.length; i++) {
                key_frame_upto = key_frame_from + (anims[i].duration / total_duration);
                this.generateIndivisualParams(anims[i], key_frame_from, key_frame_upto);
            }
        }
    }

    generateIndivisualParams(elem, key_frame_from, key_frame_upto) {
        var dist = elem.to - elem.from;
        var per = '';
        var id = elem.elem.dataset.styleId;
        var t0 = key_frame_from;

        if (this.animations[id] == undefined) {
            this.animations[id] = {};
            this.animations[id]["elem"] = elem;
            this.animations[id]["anim"] = {};
        }

        while (t0 <= key_frame_upto) {
            per = ((t0 * 100).toFixed(2)) + "%";
            if (this.animations[id]["anim"][per] == undefined) {
                this.animations[id]["anim"][per] = {
                    translate: { x: 0, y: 0, z: 0 },
                    rotate: 0,
                    opacity: 1,
                    scale: 1
                };
            }
            if (elem.prop == View.TRANSLATE_X) {
                this.animations[id]["anim"][per]['translate'].x =
                    (elem.from + dist * elem.interpolar.getInterpolar(t0)).toFixed(0);
            } else if (elem.prop == View.TRANSLATE_Y) {
                this.animations[id]["anim"][per]['translate'].y =
                    (elem.from + dist * elem.interpolar.getInterpolar(t0)).toFixed(0);
            }
            else if (elem.prop == View.ROTATE) {
                this.animations[id]["anim"][per]["rotate"] =
                    (elem.from + dist * elem.interpolar.getInterpolar(t0)).toFixed(0);
            }
            else if (elem.prop == View.ALPHA) {
                this.animations[id]["anim"][per]["opacity"] =
                    (elem.from + dist * elem.interpolar.getInterpolar(t0)).toFixed(3);
            } else if (elem.prop == View.SCALE) {
                this.animations[id]["anim"][per]["scale"] =
                    (elem.from + dist * elem.interpolar.getInterpolar(t0)).toFixed(3);
            }
            t0 += 0.0025;
        }
        //        this.log("animation",JSON.stringify(this.animations[id]["anim"]));

    }

    getAnimator(index) {
        var animators = [];
        for (var i = 0; i < this.animators.length; i++) {
            //            this.log("getAnimator","checking index: "+this.animators[i].index+" supplied :"+index);
            if (this.animators[i].index == index) { animators.push(this.animators[i].elem); }
        }
        //        this.log("getAnimator","total animators  of index: "+index+" = "+animators.length);
        return animators;
    }

    getTotalDuration() {
        var duration = 0;
        var index = -1;
        var prev_duration = 0;
        for (var i = 0; i < this.animators.length; i++) {
            if (this.animators[i].index > index) {
                prev_duration = this.animators[i].elem.duration;
                duration += prev_duration;
            } else if (this.animators[i].index == index) {
                duration += Math.abs(this.animators[i].elem.duration - prev_duration);
                prev_duration = (this.animators[i].elem.duration > prev_duration) ? this.animators[i].elem.duration : prev_duration;
            }
            index = this.animators[i].index;
        }
        //        this.log("getTotalDuration","total: "+duration);
        return duration;
    }

    initialize(elem) {
        this.log("initialize", "final attr : " + elem.final_attr);
        if (ACTIVE_ANIMATION[elem.elem.dataset.styleId] == undefined) {
            ACTIVE_ANIMATION[elem.elem.dataset.styleId] = {};
        }

        if (ACTIVE_ANIMATION[elem.elem.dataset.styleId]["is_active"] == undefined) {
            this.log("initialize", "new animation");
            this.addEventListeners(elem);//adding listernes for animation add only once
            setTimeout(this.setAnimPropertise(elem, this.iteration), 0);
        } else if (ACTIVE_ANIMATION[elem.elem.dataset.styleId]["is_active"] == false) {
            this.log("initialize", "registetring animation");
            setTimeout(this.setAnimPropertise(elem, this.iteration), 0)
        }
        else {
            this.log("initialize", "interrupt animation");
            elem.elem.removeAttribute("style");
            elem.elem.setAttribute("style", elem.prev_style + ";");
            this.refresh(elem.elem);
            elem.final_attr = '';
            setTimeout(this.setAnimPropertise(elem, this.iteration), 1000)
        }



    }

    setAnimPropertise(elem, iteration) {
        this.log("setAnimPropertise", "init new anim prop");
        ACTIVE_ANIMATION[elem.elem.dataset.styleId]["is_active"] = true;
        //NOW SET THE NEW iNSTANCE
        ACTIVE_ANIMATION[elem.elem.dataset.styleId]["instance"] = this;

        elem.elem.style.animationName = elem.name;
        elem.elem.style.WebkitAnimationName = elem.name;

        elem.elem.style.animationDuration = elem.duration + "ms";
        elem.elem.style.WebkitAnimationDuration = elem.duration + "ms";

        elem.elem.style.WebkitAnimationFillMode = "forwards";  // Code for Chrome, Safari, and Opera
        elem.elem.style.animationFillMode = "forwards";

        if (this.iteration > 1) {
            elem.elem.style.WebkitAnimationIterationCount = iteration;  // Code for Chrome, Safari, and Opera
            elem.elem.style.animationIterationCount = iteration;
        } else if (this.iteration == -1) {
            elem.elem.style.WebkitAnimationIterationCount = "infinite";  // Code for Chrome, Safari, and Opera
            elem.elem.style.animationIterationCount = "infinite";
        } else {
            elem.elem.style.WebkitAnimationIterationCount = null;  // Code for Chrome, Safari, and Opera
            elem.elem.style.animationIterationCount = null;
        }

    }

    addEventListeners(elem) {

        elem.elem.addEventListener("webkitAnimationStart", function s() {
            ACTIVE_ANIMATION[elem.elem.dataset.styleId]["instance"]
                .animationStart(elem.elem.dataset.styleId);
        });
        elem.elem.addEventListener("webkitAnimationIteration", function i() {
            ACTIVE_ANIMATION[elem.elem.dataset.styleId]["instance"]
                .animationRepeat(elem.elem.dataset.styleId);

        });
        elem.elem.addEventListener("webkitAnimationEnd", function e() {
            ACTIVE_ANIMATION[elem.elem.dataset.styleId]["instance"]
                .animationEnd(elem.elem.dataset.styleId);

        });

        elem.elem.addEventListener("animationstart", function s(evt) {
            ACTIVE_ANIMATION[elem.elem.dataset.styleId]["instance"]
                .animationStart(elem.elem.dataset.styleId);
        });
        elem.elem.addEventListener("animationiteration", function i() {
            ACTIVE_ANIMATION[elem.elem.dataset.styleId]["instance"]
                .animationRepeat(elem.elem.dataset.styleId);
        });
        elem.elem.addEventListener("animationend", function e(evt) {
            ACTIVE_ANIMATION[elem.elem.dataset.styleId]["instance"]
                .animationEnd(elem.elem.dataset.styleId);
        });
    }

    refresh(elem) {
        elem.style.animationName = null;
        elem.style.WebkitAnimationName = null;

        elem.style.animationDuration = null;
        elem.style.WebkitAnimationDuration = null;

        elem.style.WebkitAnimationFillMode = null;  // Code for Chrome, Safari, and Opera
        elem.style.animationFillMode = null;

        elem.style.WebkitAnimationIterationCount = null;  // Code for Chrome, Safari, and Opera
        elem.style.animationIterationCount = null;

        elem.elemoffsetHeight;
    }

    log(str, content) {
        //        console.log(str+" :: "+content);
    }

    animationStart(id) {
        this.log("animstart", "Start");
        if (this.anim_listener != undefined) {
            this.anim_listener.onAnimationStart(id);
        }
    }
    animationRepeat(id) {
        this.log("animrepeat", "Repeat");
        if (this.anim_listener != undefined) {
            this.anim_listener.onAnimationRepeat(id);
        }
    }
    animationEnd(id) {
        var elem = this.animations[id]['elem'];
        if (ACTIVE_ANIMATION[elem.elem.dataset.styleId]["is_active"] != undefined
            && ACTIVE_ANIMATION[elem.elem.dataset.styleId]["is_active"] == true) {
            this.log("animend", "animation end" + elem.elem.dataset.styleId);
            elem.elem.removeAttribute("style");
            elem.elem.setAttribute("style", elem.prev_style + ";/*--AIJAS__0__--*/" + elem.final_attr + "/*--AIJAS__1__--*/");
            this.log("anim", "finally-- \nfinal:" + elem.final_attr + " \n prev style: " + elem.prev_style);
            ACTIVE_ANIMATION[elem.elem.dataset.styleId]["is_active"] = false;
        } else {
            this.log("animend", "non registered animation end");
        }

        if (this.anim_listener != undefined) {
            this.anim_listener.onAnimationEnd(id);
        }

    }
}



module.exports = ValueAnimator