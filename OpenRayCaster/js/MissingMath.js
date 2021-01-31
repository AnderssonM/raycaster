/**
 * MissingMath, a name space for missing math functions
 * @author Martin Andersson, V.I.C, 2015. All rights reserved
 * @namespace MissingMath
 * 
 */
export class MissingMath {

    /**
     * greatestFactors, get the two largest possible factors of n
     * i.e 512 -> {high:32,low:16}
     * @param {Int} n
     * @returns {greatestFactors.volumeDataAnonym$0}
     */
    static greatestFactors(n) {
        var a = 1;
        while (n > a * 2 && n / 2 === Math.round(n / 2)) {
            // console.log(n, a);
            n = n / 2;
            a = a * 2;
        }
        return {high: n, low: a};
    }

    /**
     * nearestPow2, get the nearest Power of two for n
     * @param {Number} n
     * @returns {Number}
     */
    static nearestPow2(n) {
        return Math.pow(2, Math.round(Math.log(n) / Math.log(2)));
    }

    /**
     * nextPow2, get the nearest Power of two greater than n
     * @param {Number} n
     * @returns {Number}
     */
    static nextPow2(n) {
        return Math.pow(2, Math.ceil(Math.log(n) / Math.log(2)));
    }

    static sqr(x) {
        return x * x
    }

    static dist2(v, w)
    {
        return sqr(v.x - w.x) + sqr(v.y - w.y)
    }

    static distToSegmentSquared(p, v, w)
    {
        var l2 = dist2(v, w);
        if (l2 == 0)
            return dist2(p, v);
        var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        if (t < 0)
            return dist2(p, v);
        if (t > 1)
            return dist2(p, w);
        return dist2(p, {x: v.x + t * (w.x - v.x),
            y: v.y + t * (w.y - v.y)});
    }
    static distToSegment(p, v, w)
    {
        return Math.sqrt(distToSegmentSquared(p, v, w));
    }

    static increment(p) {
        this.val += p;
        console.log(this);
    }

}