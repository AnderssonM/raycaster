//from("../OpenRayCaster/js/").import("OpenVolumeData.js");
//from("../AdvancedRayCaster/js/Loaders").import("RecipDataLoader.js");
//from("../AdvancedRayCaster/js/Loaders").import("HistDataLoader.js");

import {OpenVolumeData} from './OpenVolumeData.js';
import {RecipDataLoader,HistDataLoader} from './Loaders/DataLoaders.js';

export class AdvancedVolumeData extends OpenVolumeData {
    /**
     * VolumeData, volume data class
     * @author Martin Andersson, V.I.C, 2015. All rights reserved
     * @constructor
     * @argument {object} uniforms obsolete uniforms
     * 
     */
    constructor() {
        super();
//        OpenVolumeData.call(this);
    }

    /**
     * setPointValue, sets a voxel value (val) for the address
     * @this {VolumeData}
     * @argument {Number} address address to set
     * @argument {Number} val value to set
     **/
    setPointValue(px, py, pz, val) {

        var siA = this.getAddress(px, py, pz);
        var siB = this.getAddress(px, py, pz + 1);
//    console.log(px,py,pz,si,val);
        this.values['image']['data'][siA] = val;
        this.values['image']['data'][siB] = val;
        // this.values['flipY'] = false;
        this.values['needsUpdate'] = true;
        // this.onLoadSuccess();
    }
    setPointWithMagnitude(px, py, pz, val, magnitude, fading) {
        var rdist = 0.0;
        for (x = px - magnitude; x < px + magnitude; x++) {

            if (x > 0 && x < this.width) {
                for (y = py - magnitude; y < py + magnitude; y++) {

                    if (y > 0 && y < this.height) {
                        for (z = pz - magnitude; z < pz + magnitude; z++) {
                            if (z > 0 && z < this.depth) {
                                var dist = Math.sqrt(Math.pow(Math.abs(px - x), 2) + Math.pow(Math.abs(py - y), 2) + Math.pow(Math.abs(pz - z), 2));
                                if (dist < magnitude) {
                                    if (fading) {
                                        rdist = dist / magnitude;
                                    }
                                    var si = this.getAddress(x, y, z);
                                    this.values['image']['data'][si] += val - (rdist * val);
                                }

                            }
                        }
                    }
                }
            }
        }

    }
    /**
     * getValue, gets the voxel value (val) for the address
     * @this {VolumeData}
     * @argument {Number} address address to set
     * @returns {Number} the value of the address
     **/
    getValue(address) {
        return this.values['image']['data'][address];
    }

    NormCoordToRealCoord(coord) {
        var x = Math.round(coord.x * this.width);
        var y = Math.round(coord.y * this.height);
        var z = Math.round(coord.z * this.depth);
        return {x: x, y: y, z: z};
    }

    /**
     * getRayData, gets the range of voxel values from xyz1 to xyz2
     * @returns {Object}
     */
    getRayData(rFront, rBack) {


        var xSteps = Math.abs(rFront.x - rBack.x);
        var ySteps = Math.abs(rFront.y - rBack.y);
        var zSteps = Math.abs(rFront.z - rBack.z);

        var numSteps = Math.max(xSteps, ySteps);
        numSteps = Math.max(numSteps, zSteps);

        numSteps = Math.ceil(numSteps);
        var xDelta = (rBack.x - rFront.x) / numSteps;
        var yDelta = (rBack.y - rFront.y) / numSteps;
        var zDelta = (rBack.z - rFront.z) / numSteps;
        var sum = 0;
        var min = Number.POSITIVE_INFINITY;
        var max = Number.NEGATIVE_INFINITY;
//     this.setValue(this.getAddress(x1, y1, z1),128);
//     this.setValue(this.getAddress(x2, y2, z2),255);
        var values = Array(numSteps);
        for (var step = 0; step < numSteps + 1; step++) {
//
            var px = rFront.x + parseInt(step * xDelta);
            var py = rFront.y + parseInt(step * yDelta);
            var pz = rFront.z + parseInt(step * zDelta);
//        this.setValue(this.getAddress(px, py, pz), 255);
            var val = this.getValue(this.getAddress(px, py, pz));
////        console.log(px, py, pz,val);
            if (val) {
                min = Math.min(min, val);
                max = Math.max(max, val);
                sum += val;
            }
            values.push(val);
        }
        if (min === Number.POSITIVE_INFINITY) {
            min = 0;
        }
        if (max === Number.NEGATIVE_INFINITY) {
            max = 0;
        }
        var avg;
        if (numSteps === 0) {
            avg = "0.00";
        } else {
            avg = Math.round(sum / numSteps * 10) / 10;
        }
        return {values: values, min: min, max: max, sum: sum, avg: avg};
    }

}