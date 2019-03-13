class OvershootInterpolator {

    constructor(tension = 2.5) { this.tension = tension; }
    getInterpolar(t) {
        t -= 1.0;
        return t * t * ((this.tension + 1) * t + this.tension) + 1.0;
    }
}


module.exports = OvershootInterpolator