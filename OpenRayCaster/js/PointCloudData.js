//from("../OpenRayCaster/js/Loaders/").import("GeneralDataLoader.js");
//from("../OpenRayCaster/js").import("MissingMath.js");

import {GeneralDataLoader} from './Loaders/GeneralDataLoader.js';
import {MissingMath} from './MissingMath.js';

export class PointCloudData {

    /**
     * PointCloudData, volume data class
     * @author Martin Andersson, V.I.C, 2015. All rights reserved
     * @constructor
     * @argument {object} uniforms obsolete uniforms
     * 
     */
    constructor() {
        this.cols = 1;
        this.rows = 128;
        this.depth = 128;
        this.width = 128;
        this.height = 128;
        this.sampleRangeMax = 255;
        this.maxVal = 256;
        this.minVal = 0;
        this.avgVal = 128;
        this.resetScale = true;
        // this.index = new THREE.DataTexture(null, 8, 128, THREE.RGBAFormat, THREE.FloatType);
        this.values = new THREE.DataTexture(null, 128, 128 * 128, THREE.RGBAFormat);
        this.values['magFilter'] = this.values['minFilter'] = THREE.NearestFilter;
        this.values['wrapT'] = this.values['wrapS'] = THREE.ClampToEdgeWrapping;
        //  this.values['anisotrophy'] = 16;
        //this.setDimensions(128, 128, 128, 1, 128);
    }
    /**
     * onLoadSuccess, callback for notification of successful data load.
     * @callback PointCloudData~onLoadSuccess 
     */
    onLoadSuccess() {
    }
    /**
     * updateUniforms, Obsolete callback for requesting uniform updates.
     * @obsolte
     * @callback PointCloudData~updateUniforms 
     */
    updateUniforms() {
    }
    /**
     * setDimensions Sets the volume data dimensions, and calls updateIndex to 
     * update the index texture
     * @argument {Number} x dimension x
     * @argument {Number} y dimension y
     * @argument {Number} z dimension z
     * @argument {Number} cols dimension cols
     * @argument {Number} rows dimension rows
     * @this {PointCloudData}
     * 
     */
    setSize(size) {
        console.log("PointCloudData: Setting size", size);
        var gf = MissingMath.greatestFactors(MissingMath.nextPow2(size));
        this.dimx = (gf.high);
        this.dimy = (gf.low);
        this.depth = 128;
        this.height = 128;
        this.width = 128;
        this.maxVal = 255;
//    if (this.resetScale === true) {
        this.scalex = 1;
        this.scaley = 1;
        this.scalez = 1;
//    }

//    this.updateIndex(cols, rows);
        this.values['image'].width = this.dimx;
        this.values['image'].height = this.dimy;
        this.values['image'].data = new Uint8Array(this.dimx * this.dimy * 4);
        this.values['needsUpdate'] = true;
    }

    /**
     * loadVolData, loads volume data, using the GerneralDataLoader
     * @param {String} file, the data url to load
     * @returns {undefined}
     */
    loadVolData(file) {
        console.log("PointCloudData: loadVolData", file);
        this.histLoader = this.loader = new GeneralDataLoader(null, null);
        this.histLoader.done = this.loadVolDataSuccess.bind(this);
        this.histLoader.onError = function (mess, color) {
            console.error("PointCloudData:err:" + mess);
        };
        this.histLoader.loadURL(file);
    }
    /**
     * loadVolDataSuccess, eventhandler for volume data loader.
     * @private
     * @param {ArrayBuffer} bf the binary response data
     * @returns {undefined}
     */
    loadVolDataSuccess(bf) {

    }
    loadTestData(bf) {
        console.log("PointCloudData: loadVolDataSuccess", bf);
//    this.Hist3D = this.histLoader.hists[1];


        this.setSize(64 * 64);
        var seed = Date.now()
        for (var idx = 0; idx < (64 * 64); idx++) {
//        var entry = loadedData[idx];
//        console.log(idx,entry);
            this.values['image']['data'][idx * 4 + 0] = Math.floor(Math.random(seed) * 255);  //(entry[0]/100 )*255;
            this.values['image']['data'][idx * 4 + 1] = Math.floor(Math.random(seed) * 255);
            this.values['image']['data'][idx * 4 + 2] = Math.floor(Math.random(seed) * 255);
            this.values['image']['data'][idx * 4 + 3] = [idx * 4 + 0];
        }
        console.log(this.values.image.data);
        this.values['needsUpdate'] = true;
        this.onLoadSuccess();
    }
    animate() {
        var seed = Date.now()
        if (this.drewLast) {
            this.drewLast = false;
            for (var idx = 0; idx < (64 * 64); idx++) {
                this.values['image']['data'][idx * 4 + 0] += Math.floor(Math.random(seed) * 4) - 2;  //(entry[0]/100 )*255;
                this.values['image']['data'][idx * 4 + 1] += Math.floor(Math.random(seed) * 4) - 2;
                this.values['image']['data'][idx * 4 + 2] += Math.floor(Math.random(seed) * 4) - 2;
//        this.values['image']['data'][idx * 4 + 3] = Math.floor(Math.random(seed)*255);  
            }
        } else {
            this.values['needsUpdate'] = true;
            this.onLoadSuccess();
            this.drewLast = true;
        }
        requestAnimationFrame(this.animate.bind(this));
    }
    /**
     * getAddress, gets the address (array index) of the coordinate set
     * @this {PointCloudData}
     * @argument {Number} x coordinate to look up
     * @argument {Number} y coordinate to look up
     * @argument {Number} z coordinate to look up
     * 
     * @returns{int} address
     **/
    getAddress(x, y, z) {
        var row = this.rows - Math.floor(z / this.cols) - 1;
        var col = z % this.cols;
        var totalWidth = this.width * this.cols;
        var rowSize = totalWidth * this.height;
        var xoffset = col * this.width + x;
        var yoffset = row * rowSize + (y * totalWidth);
//    console.log("row, col", row,col);
        return yoffset + xoffset;
    }
    /**
     * setValue, sets a voxel value (val) for the address
     * @this {PointCloudData}
     * @argument {Number} address address to set
     * @argument {Number} val value to set
     **/
    setValue(address, val) {
        this.values['image']['data'][address] = val;
        this.values['flipY'] = false;
        this.values['needsUpdate'] = true;
        this.onLoadSuccess();
    }
    /**
     * updateIndex, updates the z-slize index 
     * @private
     * @argument {Number} cols number of columns in image
     * @argument {Number} rows number of rows in image
     **/
    updateIndex(cols, rows) {
        console.log("PointCloudData:updating index cols:rows", cols, rows);
        var d = new Float32Array(8 * 4 * cols * rows);
        var i = 0;
        for (var r = 0; r < 8; r++) {
            d[0 ] = 0;
            d[1 ] = (rows - 1) / rows;
            for (var row = 0; row < rows; row++) {
                for (var col = 0; col < cols; col++) {
                    d[i * 4 + 2] = col / cols;
                    d[i * 4 + 3] = (rows - row - 1) / rows;
                    i++;  //This looks weird, but don't change it unless you know what you're doing
                    d[i * 4    ] = col / cols;
                    d[i * 4 + 1] = (rows - row - 1) / rows;
                }
            }
            d[i * 4 + 2] = col / cols;
            d[i * 4 + 3] = (rows - row - 1) / rows;
        }
        //console.log("index,", d);

        this.index['image']['height'] = 8;
        this.index['image']['width'] = cols * rows;
        this.index['image']['data'] = d;
        this.index['wrapT'] = THREE.ClampToEdgeWrapping;
        this.index['wrapS'] = THREE.ClampToEdgeWrapping;
        this.index['magFilter'] = THREE.NearestFilter;
        this.index['minFilter'] = THREE.NearestFilter;
        this.index['generateMipmaps'] = false;
        this.index['needsUpdate'] = true;
    }
}