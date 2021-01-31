import {HistogramLoader} from './HistDataLib/HistLoader.js';
import {MissingMath} from '../MissingMath.js';

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

export class HistDataLoader extends HistogramLoader {

    /**
     * @constructor
     * @param {type} volumeData
     * @returns {HistDataLoader}
     */
    constructor(volumeData) {

        super();
        this.onError = function (mess, color) {
            console.error("VolumeData:err:" + mess);
        };
        this.volumeData = volumeData;

        //console.log("HistDataLoader constructor end",this);
    }

    /**
     * load, data loading method, binds onsuccess handler and calls loadFile of 
     * super class HistogramLoader.
     * @param {type} URL
     * @returns {undefined}
     */
    load(URL) {
        this.onSuccess = this.afterDone.bind(this);
        this.loadFile(URL);
    }
    /**
     * afterDone, eventhandler for actions to perform after the histogram file has
     * loaded.
     * @param {type} header
     * @param {type} hists
     * @returns {undefined}
     */
    afterDone(header, hists) {

        console.log("HistDataLoader: loadHistogramSuccess");
        this.Hist3D = this.hists[1];
        var width = MissingMath.nextPow2(this.Hist3D.numBinsX);
        var height = MissingMath.nextPow2(this.Hist3D.numBinsY);
        var depth = MissingMath.nextPow2(this.Hist3D.numBinsT);

        var offset_x = 0;// Math.round((width - this.Hist3D.numBinsX) / 2);
        var offset_y = 0;// Math.round((height - this.Hist3D.numBinsY) / 2);
        var offset_z = 0;// Math.round((depth - this.Hist3D.numBinsT) / 2);
        var gf = MissingMath.greatestFactors(depth);

        this.volumeData.setDimensions(width, height, depth, gf.high, gf.low);
        this.volumeData.maxVal = this.Hist3D.max;
        this.volumeData.minVal = this.Hist3D.min;
        this.volumeData.avgVal = this.Hist3D.total / (this.Hist3D.numBinsX * this.Hist3D.numBinsY * this.Hist3D.numBinsT);
        this.volumeData.sumVal = this.Hist3D.total;
        var mul = this.volumeData.sampleRangeMax / this.volumeData.maxVal;
        console.log("VolumeData Hist3D (max,avg,total)", this.Hist3D.max, this.Hist3D.avg, this.Hist3D.total);
        //this.values['image'].data.set(this.Hist3D._data);


        var i = 0;
        var si, di;
        this.volumeData.values['flipY'] = false;
        for (var z = 0; z < this.Hist3D.numBinsT; z++) {
            for (var y = 0; y < this.Hist3D.numBinsY; y++) {
                for (var x = 0; x < this.Hist3D.numBinsX; x++) {
                    di = this.volumeData.getAddress(offset_x + x, offset_y + y, offset_z + z);
                    si = x + ((this.Hist3D.numBinsY - y) * this.Hist3D.numBinsX) + (z * this.Hist3D.numBinsXY);
                    this.volumeData.values['image']['data'][ di ] = Math.min(Math.round(this.Hist3D._data[si] * mul), this.volumeData.sampleRangeMax);
                    if (z < this.Hist3D.numBinsT - 1) {
                        si = x + ((this.Hist3D.numBinsY - y) * this.Hist3D.numBinsX) + ((z + 1) * this.Hist3D.numBinsXY);
                        this.volumeData.values['image']['data'][ di + 1] = Math.min(Math.round(this.Hist3D._data[si] * mul), this.volumeData.sampleRangeMax);
                    }

                }
            }
        }


        this.volumeData.values['needsUpdate'] = true;
        this.volumeData.onLoadSuccess();
    }

}