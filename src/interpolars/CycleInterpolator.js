class CycleInterpolator {

    constructor(cycle = 2.0) { this.cycle = cycle }

    getInterpolar(t) {
        return Math.sin(2 * Math.PI * this.cycle * t);
    }
}


module.exports = CycleInterpolator