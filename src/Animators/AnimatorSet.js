

/**
 * @class AnimatorSet
 * @description
 * <pre>
 * 
 *  Animator set helps to generate sets of animatios
 *  Its is specially useful when we need to play combination of animations
 * 
 * </pre>
 * 
 */

let ValueAnimator = require('./ValueAnimator')

class AnimatorSet extends ValueAnimator {

    constructor() { super(); }

    /**
     * 
     * @param {Array} anims - Array of animators to be played
     */
    playTogether(anims) {
        var index = this.animators.length;
        this.log("AnimatorSet", "anim index: " + index);
        for (var i = 0; i < anims.length; i++) {
            this.animators.push({ elem: anims[i], index: index });
        }
    }

}

module.exports = AnimatorSet
