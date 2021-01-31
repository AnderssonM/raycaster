import {GeneralDataLoader} from './GeneralDataLoader.js';
import {MissingMath} from '../MissingMath.js';


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

export class PointDataLoader extends GeneralDataLoader{
    /**
     * @constructor
     * @param {type} volumeData
     * @returns {PointDataLoader}
     */
    constructor(volumeData) {
        console.log("PointDataLoader constructor");
        super();
        this.onError = function (mess, color) {
            console.error("VolumeData:err:" + mess);
        };
        this.volumeData = volumeData;
        this.responseType = 'text';
    }

    load(URL) {
        this.loadURL(URL);
    }

    done(responseData) {

        var points = JSON.parse(responseData)['points'];

        this.volumeData.maxVal = Number.NEGATIVE_INFINITY;
        this.volumeData.minVal = Number.POSITIVE_INFINITY;
        this.volumeData.avgVal = 0;
        this.volumeData.sumVal = 0;

        var min_x = 0, max_x = 0;
        var min_y = 0, max_y = 0;
        var min_z = 0, max_z = 0;
        var x, y, z, v, si;
        for (var id in points) {
            // console.log("point",id);
            max_x = Math.max(max_x, points[id][0]);
            max_y = Math.max(max_y, points[id][1]);
            max_z = Math.max(max_z, points[id][2]);
            min_x = Math.min(min_x, points[id][0]);
            min_y = Math.min(min_y, points[id][1]);
            min_z = Math.min(min_z, points[id][2]);
            v = parseFloat(points[id][3]);
            this.volumeData.maxVal = Math.max(this.volumeData.maxVal, v);
            this.volumeData.minVal = Math.min(this.volumeData.minVal, v);
            this.volumeData.sumVal += v;
        }
        var offset_x = 0;
        var offset_y = 0;
        var offset_z = 0;

        if (min_x < 0) {
            offset_x = Math.floor(-min_x);
        }
        if (min_y < 0) {
            offset_y = Math.floor(-min_y);
        }
        if (min_z < 0) {
            offset_z = Math.floor(-min_z);
        }

        var rng_x = Math.ceil(max_x - min_x);
        var rng_y = Math.ceil(max_y - min_y);
        var rng_z = Math.ceil(max_z - min_z);

        console.log("offset", offset_x, offset_y, offset_z)
        var gf = MissingMath.greatestFactors(Math.ceil(max_z - min_z));
        this.volumeData.setDimensions(rng_x, rng_y, rng_z, gf.low, gf.high);

        if (rng_x > rng_y && rng_x > rng_z) {
            this.volumeData.scalex = 1.0;
            this.volumeData.scaley = rng_y / rng_x;
            this.volumeData.scalez = rng_z / rng_x;
        }
        if (rng_y > rng_x && rng_y > rng_z) {
            this.volumeData.scaley = 1.0;
            this.volumeData.scalex = rng_x / rng_y;
            this.volumeData.scalez = rng_z / rng_y;
        }
        if (rng_z > rng_y && rng_z > rng_x) {
            this.volumeData.scalez = 1.0;
            this.volumeData.scaley = rng_y / rng_z;
            this.volumeData.scalex = rng_x / rng_z;
        }

        for (var id in points) {
            x = Math.floor(points[id][0]);
            y = Math.floor(points[id][1]);
            z = Math.floor(points[id][2]);
            v = Math.floor(points[id][3]);
            this.volumeData.setPointValue(x + offset_x, y + offset_y, z + offset_z, v);
        }
        this.volumeData.avgVal = this.volumeData.sumVal / points.length;
        this.volumeData.values['needsUpdate'] = true;
        this.volumeData.onLoadSuccess();
    }

}