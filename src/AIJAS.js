

let { View, ACTIVE_ANIMATION } = require("./Animators/Animations")

let
    ValueAnimator = require('./Animators/ValueAnimator'),
    ObjectAnimator = require('./Animators/ObjectAnimator'),
    AnimatorSet = require('./Animators/AnimatorSet')

let
    BounceInterpolator = require('./interpolars/BounceInterpolator'),
    AccelerateDecelerateInterpolator = require('./interpolars/AccelerateDecelerateInterpolator'),
    AccelerateInterpolator = require('./interpolars/AccelerateInterpolator'),
    CycleInterpolator = require('./interpolars/CycleInterpolator'),
    LinearInterpolator = require('./interpolars/LinearInterpolator'),
    OvershootInterpolator = require('./interpolars/OvershootInterpolator')



let styleElem = document.getElementById("AIJAS_style")

if (styleElem == null) {
    // there is no style holder we need to make one
    document.getElementsByTagName("body")[0].innerHTML += `
    <div id="AIJAS_style">
        <!--
        Note :: This div is added by aijas
        -->
    </div>`
}


module.exports = {
    View, ACTIVE_ANIMATION,
    ValueAnimator,
    ObjectAnimator,
    // exprot interpolators as well
    BounceInterpolator,
    AccelerateDecelerateInterpolator,
    AccelerateInterpolator,
    CycleInterpolator,
    LinearInterpolator,
    OvershootInterpolator,
    // interpolators section ends
    AnimatorSet,
}