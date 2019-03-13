class AccelerateDecelerateInterpolator {

    constructor() { }

    getInterpolar(t) {
        return (Math.cos((t + 1) * Math.PI) / 2.0) + 0.5;
    }
}

module.exports = AccelerateDecelerateInterpolator