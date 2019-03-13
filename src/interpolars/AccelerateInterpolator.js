class AccelerateInterpolator {

    constructor(factor = 2.0) { this.factor = factor; }
    getInterpolar(t) {
        return Math.pow(t, 2 * this.factor);
    }
}

module.exports = AccelerateInterpolator