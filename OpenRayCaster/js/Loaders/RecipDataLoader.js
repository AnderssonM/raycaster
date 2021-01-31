
import {GeneralDataLoader} from "./GeneralDataLoader.js";
import {MissingMath} from "../MissingMath.js";
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
export class RecipDataLoader extends GeneralDataLoader {
    /**
     * @constructor
     * @param {type} volumeData
     * @returns {RecipDataLoader}
     */
    constructor(volumeData) {
        console.log("RecipDataLoader constructor");
        super();
        this.onError = function (mess, color) {
            console.error("VolumeData:err:" + mess);
        };
        this.volumeData = volumeData;
    }

    load = function (URL) {
        this.loadURL(URL);
    }

    done = function (responseData) {

        console.log("VolumeData: loadRecDataSuccess", responseData);
//    this.Hist3D = this.histLoader.hists[1];
        var header = new DataView(responseData, 0, 60);
        var src_width = header.getUint32(48, true);
        var src_height = header.getUint32(52, true);
        var src_depth = header.getUint32(56, true);

        var width = MissingMath.nextPow2(src_width);
        var height = MissingMath.nextPow2(src_height);
        var depth = MissingMath.nextPow2(src_depth);

        var offset_x = Math.round((width - src_width) / 2);
        var offset_y = Math.round((height - src_height) / 2);
        var offset_z = Math.round((depth - src_depth) / 2);

        console.log("VolumeData: dimensions (x,y,z)", src_width, src_height, src_depth);
        console.log("VolumeData: offset (x,y,z)", offset_x, offset_y, offset_z);
        var gf = MissingMath.greatestFactors(depth);

        this.volumeData.setDimensions(width, height, depth, gf.high, gf.low)
        this.volumeData.scalex = header.getFloat64(24, true);
        this.volumeData.scaley = header.getFloat64(32, true);
        this.volumeData.scalez = header.getFloat64(40, true);

        var scale_max = Math.max(Math.max(this.volumeData.scalex, this.volumeData.scaley), this.volumeData.scalez);

        this.volumeData.scalex /= scale_max;
        this.volumeData.scaley /= scale_max;
        this.volumeData.scalez /= scale_max;

        console.log("VolumeData: scale (x,y,z)", this.volumeData.scalex, this.volumeData.scaley, this.volumeData.scalez);
        // var src = new Uint8Array(bf.slice(60));
        var src = new DataView(responseData, 60);
        // var data = new Uint8Array(128 * 128 * 256);
        var i = 0;
        var si, sb;
        this.volumeData.maxVal = Number.NEGATIVE_INFINITY;
        this.volumeData.minVal = Number.POSITIVE_INFINITY;
        this.volumeData.avgVal = 0;
        this.volumeData.sumVal = 0;
        var val;

        for (var i = 0; i < src_width * src_height * src_depth; i++) {
            val = parseInt(src.getFloat64(i * 8, true));
            this.volumeData.maxVal = Math.max(this.volumeData.maxVal, val);
            this.volumeData.minVal = Math.min(this.volumeData.minVal, val);
            this.volumeData.sumVal += val;
        }
        this.volumeData.avgVal = this.volumeData.sumVal / (src_depth * src_width * src_height);
        this.volumeData.values['flipY'] = false;
        console.log("min,avg,max,sum", this.volumeData.minVal, this.volumeData.avgVal, this.volumeData.maxVal, this.volumeData.sumVal);
        var mul = this.volumeData.sampleRangeMax / this.volumeData.maxVal;
        for (var x = 0; x < src_width; x++) {
            for (var y = 0; y < src_height; y++) {
                for (var z = 0; z < src_depth; z++) {
                    si = this.volumeData.getAddress(offset_x + x, offset_y + y, offset_z + z) * 2;

                    val = Math.floor((src.getFloat64(sb, true) * mul));
                    this.volumeData.values['image']['data'][ si ] = val;
                    if (z < src_depth - 1) {
                        sb = (1 + z + y * src_depth + x * src_height * src_depth) * 8;
                        val = Math.floor((src.getFloat64(sb, true) * mul));
                    }

                    this.volumeData.values['image']['data'][ si + 1 ] = val;
                    i++;
                }
            }
        }


        this.volumeData.values['needsUpdate'] = true;
        this.volumeData.onLoadSuccess();
    }
}