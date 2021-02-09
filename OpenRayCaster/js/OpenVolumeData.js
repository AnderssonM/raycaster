//from(js_root, "Loaders").import("NativeImageLoader.js", ".js", "VolDataLoader.js", "PointDataLoader.js");
//from(js_root).import("MissingMath.js");

import {THREE} from '../lib.js/three.js';
import {MissingMath} from './MissingMath.js';
import * as DL from './Loaders/DataLoaders.js';

export class OpenVolumeData {

    /**
     * OpenVolumeData, volume data class
     * @author Martin Andersson, V.I.C, 2015. All rights reserved
     * @constructor
     * 
     */
    constructor() {
        this.cols = 1;
        this.rows = 128;
        this.depth = 128;
        this.width = 128;
        this.height = 128;
        this.sampleRangeMax = 255;
        this.maxVal = Number.NEGATIVE_INFINITY;
        this.minVal = Number.POSITIVE_INFINITY;
        this.avgVal = 0;
        this.resetScale = true;
        this.index = new THREE.DataTexture(null, 8, 128, THREE.RGBAFormat, THREE.FloatType);
        this.values = new THREE.DataTexture(null, 128, 128 * 128, THREE.LuminanceAlphaFormat);
        this.bytecount = 2;// For LuminanceAlphaFormat
        this.values['magFilter'] = this.values['minFilter'] = THREE.NearestFilter;
        this.values['wrapT'] = this.values['wrapS'] = THREE.ClampToEdgeWrapping;
        this.values['anisotrophy'] = 16;
        this.setDimensions(128, 128, 128, 1, 128);
    }
    /**
     * onLoadSuccess, callback for notification of successful data load.
     * @callback VolumeData~onLoadSuccess 
     */
    onLoadSuccess() {
    }
    /**
     * updateUniforms, Obsolete callback for requesting uniform updates.
     * @obsolte
     * @callback VolumeData~updateUniforms 
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
     * @this {VolumeData}
     * 
     */
    setDimensions(x, y, z, cols, rows) {
        console.log("VolumeData: Setting dimensions", x, y, z, cols, rows);
        this.cols = cols;
        this.rows = rows;
        this.depth = z;
        this.width = x;
        this.height = y;
        if (this.resetScale === true) {
            this.scalex = 1;
            this.scaley = 1;
            this.scalez = 1;
        }

        this.updateIndex(cols, rows);
        this.values['image'].width = x * cols;
        this.values['image'].height = y * rows;
        this.values['image'].data = new Uint8Array(x * y * z * this.bytecount);
        this.values['needsUpdate'] = true;
    }
    clone(ovd) {
        this.maxVal = ovd.maxVal;
        this.minVal = ovd.minVal;
        this.avgVal = ovd.avgVal;
        this.sumVal = ovd.sumVal;

        this.cols = ovd.cols;
        this.rows = ovd.rows;

        this.scalex = ovd.scalex;
        this.scaley = ovd.scaley;
        this.scalez = ovd.scalez;

        this.updateIndex(this.cols, this.rows);
        this.values.image.width = ovd.values.image.width;
        this.values.image.height = ovd.values.image.height;
        this.values['image']['data'] = ovd.values.image.data;
        this.values['needsUpdate'] = true;

        this.scalex = ovd.scalex;
        this.scaley = ovd.scaley;
        this.scalez = ovd.scalez;

        this.values['flipY'] = true;



    }

    /**
     * loadData, method for loading volume data. 
     * The loadData method will use one of the available loader classes to load
     * volumetric data. The type of loader class to use is decided by the extension
     * type.  Currently, [vol,rec,hst and pcl] have specialized loaders, while files
     * with other extensions will load using the browsers native image format.
     * @param {type} URL
     * @returns {undefined}
     */
    loadData(URL) {
        console.log("OpenVolumeData.loadData: URL", URL);
        var parts = URL.split('.');
        var ext = parts[parts.length - 1];
//        try {
            switch (ext) {
                case 'vol':
                    this.loader = new DL.VolDataLoader(this);
                    break;
                case 'json':
                    this.loader = new DL.NRRDataLoader(this);
                    break;
                case 'rec':
                    this.loader = new DL.RecipDataLoader(this);
                    break;
                case 'hst':
                    this.loader = new DL.HistDataLoader(this);
                    break;
                case 'pcl':
                    this.loader = new DL.PointDataLoader(this);
                    break;
                case 'pcd':
                    this.loader = new DL.PointDataLoader(this);
                    break;
                default:
                    this.loader = new DL.NativeImageLoader(this);
                    break;
            }
//        } 
//        catch (e) {
//            console.error("Loader for file type ." + ext + " not available in this version");
//            return;
//        }
        this.loader.onSuccess = this.onLoadSuccess.bind(this);
        this.loader.load(URL);
    }

    /**
     * getAddress, gets the address (array index) of the coordinate set
     * @this {VolumeData}
     * @argument {Number} x coordinate to look up
     * @argument {Number} y coordinate to look up
     * @argument {Number} z coordinate to look up
     * 
     * @returns{int} address
     **/
    getAddress(x, y, z) {
        var row = this.rows - Math.floor(z / this.cols);
        var col = z % this.cols;
        var totalWidth = this.width * this.cols;
        var rowSize = totalWidth * this.height;
        var xoffset = col * this.width + x;
        var yoffset = (row - 1) * rowSize + (y * totalWidth);
        if (this.values['flipY']) {
            yoffset = (this.rows - row) * rowSize + ((this.height - (y + 1)) * totalWidth);
        }

//  console.log("row, col", row,col);
        return  (yoffset + xoffset) * this.bytecount;
    }

    get2dCoord(x, y, z) {
        var row = this.rows - Math.floor(z / this.cols) - 1;
        var col = z % this.cols;
        var totalWidth = this.width * this.cols;
        var rowSize = totalWidth * this.height;
        var xoffset = col * this.width + x;
        var yoffset = row * this.height + y
        if (this.values['flipY']) {
            yoffset = (this.rows - row) + ((this.height - y));
        }

//  console.log("row, col", row,col);
        return  {x: xoffset, y: yoffset};
    }

    /**
     * setValue, sets a voxel value (val) for the address
     * @this {VolumeData}
     * @argument {Number} address address to set
     * @argument {Number} val value to set
     **/
    setValue = function (address, val) {
        this.values['image']['data'][address] = val;
        // this.values['flipY'] = false;
        this.values['needsUpdate'] = true;
        // this.onLoadSuccess();
    }

    /**
     * Set a data slize
     * @param {Number} z_slice
     * @param {Array} imgd
     * @param {NNumber} stride
     * @returns {undefined}
     */
    setSlice(z_slice, imgd, stride) {
        var src_scan_address = 0;
        var val = 0;
        var dst_scan_address = 0;
        var dst_imgdata = this.values['image']['data'];
//    console.log("setSlice",z_slice,this.getAddress(0, this.height - 1, z_slice) );
        //Write slice to channel zero at current slice location
        for (var y = this.height - 1; y >= 0; y--) {
            dst_scan_address = this.getAddress(0, y, z_slice);
            for (var x = 0; x < this.width; x++) {
                val = imgd[src_scan_address];
                dst_imgdata[ dst_scan_address] = val;
                this.sumVal += val;
                this.minVal = Math.min(this.minVal, val);
                this.maxVal = Math.max(this.maxVal, val);
                src_scan_address += stride;
                dst_scan_address += 2;
            }
        }

        //Write a copy to channel one at slice -1 location.
        //The shader will use this copy for z interpolation.
        if (z_slice > 0) {
            src_scan_address = 0;
            for (var y = this.height - 1; y >= 0; y--) {
                dst_scan_address = this.getAddress(0, y, z_slice - 1);
                for (var x = 0; x < this.width; x++) {
                    val = imgd[src_scan_address];
                    dst_imgdata[ dst_scan_address + 1] = val;
                    src_scan_address += stride;
                    dst_scan_address += 2;
                }
            }
        }
        this.avgVal = this.sumVal / (this.width * this.height * this.width);
    }

    dumpToCanvas2D() {
        var canvas = document.createElement("canvas");
        canvas.height = this.height * this.rows;
        canvas.width = this.width * this.cols;
        canvas.style.border = "1px solid red";
        var ctx = canvas.getContext("2d");
        var id = ctx.getImageData(0, 0, canvas.width, canvas.height);
//    id.data.set(this.values.image.data);
        var ii = 0;
        for (var i = 0; i < this.rows * this.cols * this.width * this.height * 2; i += 2) {
            id.data[ii] = this.values.image.data[i];
            id.data[ii + 1] = this.values.image.data[i + 1];
            id.data[ii + 3] = 255;
            ii += 4;
        }
        ctx.putImageData(id, 0, 0);
        document.body.appendChild(canvas);

    }

    /**
     * updateIndexObsolete, updates the z-slize index 
     * @obsolete , kept for reference.
     * @private
     * @argument {Number} cols number of columns in image
     * @argument {Number} rows number of rows in image
     **/
    updateIndexObsolete(cols, rows) {
        console.log("VolumeData:updating index cols:rows", cols, rows);
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

    /**
     * updateIndex, updates the z-slize index 
     * @private
     * @argument {Number} cols number of columns in image
     * @argument {Number} rows number of rows in image
     **/
    updateIndex(cols, rows) {
        console.log("VolumeData:updating index cols:rows", cols, rows);
        var d = new Float32Array(8 * 4 * cols * rows);
        var i = 0;
        var nextIdx;
        var idx;
        for (var r = 0; r < 8; r++) {
            for (var idx = 0; idx < rows * cols; idx++) {

                d[i * 4 + 0] = (idx % cols) / cols;
                d[i * 4 + 1] = (rows - Math.floor(idx / cols) - 1) / rows;
                nextIdx = idx + 1;
                d[i * 4 + 2] = (nextIdx % cols) / cols;
                d[i * 4 + 3] = (rows - Math.floor(nextIdx / cols) - 1) / rows;
                i++;
            }
        }

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