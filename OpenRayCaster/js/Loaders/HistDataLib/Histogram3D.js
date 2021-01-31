//from('!').import('HistAxis.js');

import {HistAxis} from './HistAxis.js';
/**
 * Creates an instance of Histogram
 * 
 * @author Martin Andersson, V.I.C. based on the work of Dr. Hosoya
 * @author Takaaki HOSOYA
 * @constructor
 * @this {Histogram}
 *  
 */

export class Histogram {

    _name = "";
    _size = 0;
    _updateTime = new Date();
    _numElems = 0;
    _numAxes = 0;
    _axes = [];
    _data = [];
    // additional fields
    _min = 0;
    _max = 0;
    _total = 0;
    _average = 0;
    constructor() {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext("2d");
    }

    get detId() {
        return this._detId;
    }
    get name() {
        return this._name;
    }
    get size() {
        return this._size;
    }
    get updateTime() {
        return this._updateTime;
    }
    get numElems() {
        return this._numElems;
    }
    get numAxes() {
        return this._numAxes;
    }
    get axes() {
        return this._axes;
    }
    get max() {
        return this._max;
    }
    get min() {
        return this._min;
    }
    get total() {
        return this._total;
    }
    get average() {
        return this._average;
    }
    get data() {
        return this._data;
    }
    get numBinsX() {
        return this.axis(0)._numBins;
    }
    get numBinsY() {
        return this.axis(1)._numBins;
    }
    get numBinsT() {
        return this.axis(2)._numBins;
    }
    get numBinsXY() {
        return this.axis(0)._numBins * this.axis(1)._numBins;
    }
    get numBinsXT() {
        return this.axis(0)._numBins * this.axis(2)._numBins;
    }
    get numBinsYT() {
        return this.axis(1)._numBins * this.axis(2)._numBins;
    }
    get pixelRatioX() {
        return this._axes[0]._numBins / this._axes[0]._numberOfPixels;
    }
    get pixelRatioY() {
        return this._axes[1]._numBins / this._axes[1]._numberOfPixels;
    }
    get pixelRatioT() {
        return this._axes[2]._numBins / this._axes[2]._numberOfPixels;
    }

    /**
     * Deserialize the histogram from the byte array.
     * @param  buffer  The byte array of the histogram data.
     * @param  offset   The buffer offset 
     */
    deserialize(buffer, offset) {
        var dataView = new DataView(buffer, offset);
//        console.log("hist offset:" + offset);
        this._name = arrayToStr(new Uint8Array(buffer, offset, 128), 128);
        this._detectorId = dataView.getUint32(128, true);
        this._size = dataView.getUint32(132, true);
        this._sizeAxisData = dataView.getUint32(136, true);
        this._updateTime = utimeToDate(dataView.getUint32(140, true));
        this._numElems = dataView.getUint32(144, true);
        this._numAxes = dataView.getUint32(148, true);
        this._axes = new Array(this._numAxes);
        offset += 152;
//        console.log("hist name:" + this._name);
        // load axis information
        for (var a = 0; a < this._numAxes; ++a) {
            console.log("axis:" + a);
            var newAxis = new HistAxis();
            offset = newAxis.deserialize(buffer, offset);
            this._axes[a] = newAxis;
        }
        this._total = 0;
        this._max = 0;
        this._min = 0xffffffff;
        // load histogram data
        var dataArray = new Float64Array(buffer, offset, this._size / 8);
        this._data = new Float64Array(dataArray);
        for (var i = 0; i < this._numElems; ++i) {
            var c = this._data[i];
            this._total += c;
            this._max = Math.max(this._max, c);
            this._min = Math.min(this._min, c);
        }
        this._average = (1.0 * this._total) / this._numElems;
        this._detId = this._detectorId; //this._name.split(" ")[1].slice(1, -1);
        return (offset + this._size);
    }
    /**
     * Get the value of the histogram at the point specified by index;
     * @param  index  The index of the histogram data
     */
    get(index) {
        return this._data[index];
    }
    /**
     * Get a reference to the axis specified by (index);
     * @param  index  The index of the axis.
     */
    axis(index) {
        return this._axes[index];
    }
    /**
     *  OBSOLETE???
     * @param {number} start
     * @param {number} stop
     * @returns {Uint8Array}
     */
    getTYdata(start, stop) {
        alert("!!!");
        var buf = new Uint8Array(this.numBinsYT);
        var i = 0;
        for (var y = 0; y < this.numBinsY; y++) {
            for (var t = 0; t < this.numBinsT; t++) {
                var sum = 0;
                for (var x = start; x < stop; ++x) {
                    sum += this._data[x + (y * this.numBinsX) + (t * this.numBinsXY)];
                }
                buf.set(sum, i);
            }
        }
//        buf.push(sum);
        return buf;
    }
    /**
     * OBSOLETE
     * @param {number} startX
     * @param {number} stopX
     * @param {number} startY
     * @param {number} stopY
     * @returns {Uint8Array}
     */
    getTOFdata(startX, stopX, startY, stopY) {
        alert("!!!");
        var buf = new Uint8Array(this.numBinsT);
        for (var t = 0; t < this.numBinsT - 1; t++) {

            var sum = 0;
            for (var y = startY; y < stopY; y++) {
                for (var x = startX; x < stopX; ++x) {
                    sum += this._data[x + (y * this.numBinsX) + (t * this.numBinsXY)];
                }
            }
//        buf.push(sum);
            buf.set(sum, t);

        }
        return buf;
    }

}


//    rangeMaxX: function(start, stop) {
//        var max = 0;
//        for (var y = 0; y < this.numBinsY; y++) {
//            for (var t = 0; t < this.numBinsT; t++) {
//                var sum = 0;
//                for (var x = 0; x < 128; ++x) {
//                    sum += this._data[x + (y * this.numBinsX) + (t * this.numBinsXY)];
//                }
//                max = Math.max(max, sum);
//            }
//        }
//        console.log("max for range X:" + max);
//        return max;
//    },
//    rangeMaxY: function(start, stop) {
//        var max = 0;
//        for (var x = 0; x < this.numBinsX; x++) {
//            for (var t = 0; t < this.numBinsT; t++) {
//                var sum = 0;
//                for (var y = 0; y < 128; ++y) {
//                    sum += this._data[x + (y * this.numBinsX) + (t * this.numBinsXY)];
//                }
//                max = Math.max(max, sum);
//            }
//        }
//        console.log("max for range Y:" + max);
//        return max;
//    },
//    rangeMaxTOF: function(start, stop) {
//        var max = 0;
//        for (var i = 0; i < this.numBinsXY; ++i) {
//            var sum = 0;
//            for (var t = 0; t < 40; t++) {
//                sum += this._data[i + (t * this.numBinsXY)];
//            }
//            max = Math.max(max, sum);
//        }
//        console.log("max for range TOF:" + max);
//        return max;
//    },



function arrayToStr(uint8array, size) {
    var result = new Array(size);
    for (var i = 0; i < size; ++i) {
        result[i] = String.fromCharCode(uint8array[i]);
    }
    return result.join('');
}


function utimeToDate(unixTime) {
    var date = new Date(unixTime * 1000);
    //date.setTime(date.getTime() + (60*60*1000 * 9));
    date.setTime(date.getTime());
    return dateToStr(date);
}

function dateToStr(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var hrs = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    if (y < 2000) {
        y += 1900;
    }
    if (m < 10) {
        m = "0" + m;
    }
    if (d < 10) {
        d = "0" + d;
    }
    if (hrs < 10) {
        hrs = "0" + hrs;
    }
    if (min < 10) {
        min = "0" + min;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }
    return (y + "/" + m + "/" + d + " " + hrs + ":" + min + ":" + sec);
}

function printMessage(message) {
    console.log(message);
}
