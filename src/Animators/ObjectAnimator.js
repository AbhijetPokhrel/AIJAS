
let { ACTIVE_ANIMATION } = require("./Animations"),
    ValueAnimator = require('./ValueAnimator')

/**
 * @class ObjectAnimator
 * @description
 * <pre>
 * 
 * The ObjectAnimator is the boss here
 * The nature of the animation can be defined form the Object animator
 * </pre>
 */
class ObjectAnimator extends ValueAnimator {

    constructor() { super(); }

    /**
     * 
     * @param {Object} elem - The DOM element object to be animated
     * @param {Integer} type - The type of animation like translate x or y, Rotate, fade
     * @param {Number} from - from the relative position
     * @param {Number} to - The the relative position
     */
    static ofInt(elem, type, from, to) {
        var anim = new ObjectAnimator();
        anim.animators = [];//here we add the animators and index of animation
        anim.from = from;
        anim.elem = elem;
        if (ACTIVE_ANIMATION[elem.dataset.styleId] != undefined) {
            if (ACTIVE_ANIMATION[elem.dataset.styleId]["is_active"] != undefined) {
                if (ACTIVE_ANIMATION[elem.dataset.styleId]["is_active"] == true) {
                    throw new ELEM_BUSY_EXCEPTION("Elem has on going animation");
                }
            }
        }


        /*replacing the previous used styles
         * The animation final attribure style starts with --AIJAS__0__-- as comment
         * and ends with --AIJAS__1__-- as comment
         * The value in between these comments are the styles generated from the previois
         * AIJAS animation
        */
        var prev_style = elem.getAttribute("style");

        if (prev_style != undefined) {
            var startKEY = ";/*--AIJAS__0__--*/";
            var endKEY = "/*--AIJAS__1__--*/";
            var start_index = prev_style.indexOf(startKEY);
            var end_index = prev_style.indexOf(endKEY) + endKEY.length;

            console.log("index start-index : " + start_index + " end-index : " + end_index);
            if (start_index != 1 && end_index != -1) {
                var replace = prev_style.substr(start_index, (end_index - start_index));
                prev_style = prev_style.replace(replace, '');
            }
            anim.prev_style = prev_style;
        } else {
            anim.prev_style = '';
        }
        //---------------------------------------//
        anim.to = to;
        anim.prop = type;
        anim.animators.push({ elem: anim, index: 0 });
        return anim;
    }

    static ofFloat(elem, type, from, to) {
        return ObjectAnimator.ofInt(elem, type, from, to);
    }


}


function ELEM_BUSY_EXCEPTION(message) {
    this.message = message;
    this.name = 'ELEM_BUSY_EXCEPTION';
}


module.exports = ObjectAnimator