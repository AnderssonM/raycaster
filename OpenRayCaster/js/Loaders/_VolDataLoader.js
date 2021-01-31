import {GeneralDataLoader} from './GeneralDataLoader.js';
import {MissingMath} from '../MissingMath.js';
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

export class VolDataLoader extends GeneralDataLoader{
    /**
     * @constructor
     * @param {type} volumeData
     * @returns {VolDataLoader}
     */
    constructor(volumeData) {
        console.log("VolDataLoader constructor");
        super();
        this.onError = function (mess, color) {
            console.error("VolumeData:err:" + mess);
        }
        this.volumeData = volumeData;
    }

    load(URL) {
        this.loadURL(URL);
    }

    done(responseData) {

        console.log("VolDataLoader: data loaded", responseData);

        var header = new DataView(responseData, 0, 7 * 4);
        var src_width = header.getInt32(0);
        var src_height = header.getInt32(1 * 4);
        var src_depth = header.getInt32(2 * 4);
//        console.log(MissingMath)
        var width = MissingMath.nextPow2(src_width);
        var height = MissingMath.nextPow2(src_height);
        var depth = MissingMath.nextPow2(src_depth);

        var offset_x = Math.round((width - src_width) / 2);
        var offset_y = Math.round((height - src_height) / 2);
        var offset_z = Math.round((depth - src_depth) / 2);

        console.log("VolumeData: dimensions (x,y,z)", src_width, src_height, src_depth);
        console.log("VolumeData: offset (x,y,z)", offset_x, offset_y, offset_z);
        var gf = MissingMath.greatestFactors(depth);

        this.volumeData.setDimensions(width, height, depth, gf.high, gf.low);
        this.volumeData.scalex = header.getFloat32(4 * 4);
        this.volumeData.scaley = header.getFloat32(5 * 4);
        this.volumeData.scalez = header.getFloat32(6 * 4);
        var src = new Uint8Array(responseData.slice(7 * 4));

        var scale_max = Math.max(Math.max(this.volumeData.scalex, this.volumeData.scaley), this.volumeData.scalez);

        this.volumeData.scalex /= scale_max;
        this.volumeData.scaley /= scale_max;
        this.volumeData.scalez /= scale_max;
        this.volumeData.maxVal = Number.NEGATIVE_INFINITY;
        this.volumeData.minVal = Number.POSITIVE_INFINITY;
        this.volumeData.avgVal = 0;
        this.volumeData.sumVal = 0;
        var val;

        for (var i = 0; i < src_width * src_height * src_depth; i++) {
            val = src[ i ];
            this.volumeData.maxVal = Math.max(this.volumeData.maxVal, val);
            this.volumeData.minVal = Math.min(this.volumeData.minVal, val);
            this.volumeData.sumVal += val;
        }
        this.volumeData.avgVal = this.volumeData.sumVal / (src_depth * src_width * src_height);
        var mul = this.volumeData.sampleRangeMax / this.volumeData.maxVal;
        console.log("VolumeData: scale (x,y,z)", this.volumeData.scalex, this.volumeData.scaley, this.volumeData.scalez);
        console.log("VolumeData: (min,max,avg)", this.volumeData.minVal, this.volumeData.maxVal, this.volumeData.avgVal);

        // var data = new Uint8Array(128 * 128 * 256);
        var si = 0;
        var di;
        this.volumeData.values['flipY'] = false;
        for (var x = 0; x < src_width; x++) {
            for (var y = 0; y < src_height; y++) {
                for (var z = 0; z < src_depth; z++) {
                    di = this.volumeData.getAddress(offset_x + x, offset_y + y, offset_z + z);
                    this.volumeData.values['image']['data'][ di ] = Math.floor(src[ si ] * mul);
                    this.volumeData.values['image']['data'][ di + 1] = Math.floor(src[ si + 1 ] * mul);
                    si++;
                }
            }
        }


        this.volumeData.values['needsUpdate'] = true;
        this.volumeData.onLoadSuccess();
    }

}