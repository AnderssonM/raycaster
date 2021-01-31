//from(js_root, "Loaders").import("NativeImageLoader.js", "GeneralDataLoader.js", "VolDataLoader.js", "PointDataLoader.js");
//from(js_root).import("MissingMath.js");

import { NativeImageLoader } from './Loaders/NativeImageLoader.js'
import { GeneralDataLoader } from './Loaders/GeneralDataLoader.js'
import { VolDataLoader } from './Loaders/VolDataLoader.js'
import { PointDataLoader } from './Loaders/PointDataLoader.js'



/**
 * OpenTreeData, volume data class
 * @author Martin Andersson, V.I.C, 2015. All rights reserved
 * @constructor
 * @argument {object} uniforms obsolete uniforms
 * 
 */

function leaf(x, y, z, val) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.val = val;
}
function node(x_min, x_max, y_min, y_max, z_min, z_max) {
    this.level = 0;
    this.types = {empty: 0, node: 1};
    this.type = this.types.empty;
    this.range = {
	x: {min: x_min, mid: (x_max - x_min) / 2, max: x_max},
	y: {min: y_min, mid: (y_max - y_min) / 2, max: y_max},
	z: {min: z_min, mid: (z_max - z_min) / 2, max: z_max}
    };
    this.nodes = [];
}
node.prototype.setPointValue = function (x, y, z, val) {

    var Lx = 0;
    var Hx = 1;
    var Ly = 0;
    var Hy = 2;
    var Lz = 0;
    var Hz = 4;

    var id = 0;
    id += (x > this.x_mid) ? Hx : Lx;
    id += (y > this.y_mid) ? Hy : Ly;
    id += (z > this.z_mid) ? Hz : Lz;
   
    this.nodes[id] = new leaf(x, y, z, val);


    if (id !== Lx + Ly + Lz) {
	this.nodes[ Lx + Ly + Lz] = new node(this.x_min, this.x_mid, this.y_min, this.y_mid, this.z_min, this.z_mid)
    }
    if (id !== Lx + Ly + Hz) {
	this.nodes[Lx + Ly + Hz] = new node(this.x_min, this.x_mid, this.y_min, this.y_mid, this.z_mid, this.z_max);
    }
    if (id !== Lx + Hy + Lz) {
	this.nodes[Lx + Hy + Lz] = new node(this.x_min, this.x_mid, this.y_mid, this.y_max, this.z_min, this.z_mid);
    }
    if (id !== Lx + Hy + Hz) {
	this.nodes[Lx + Hy + Hz] = new node(this.x_min, this.x_mid, this.y_mid, this.y_max, this.z_mid, this.z_max);
    }
    if (id !== Hx + Ly + Lz) {
	this.nodes[Hx + Ly + Lz] = new node(this.x_mid, this.x_max, this.y_min, this.y_mid, this.z_min, this.z_mid);
    }
    if (id !== Hx + Ly + Hz) {
	this.nodes[Hx + Ly + Hz] = new node(this.x_mid, this.x_max, this.y_min, this.y_mid, this.z_mid, this.z_max);
    }
    if (id !== Hx + Hy + Lz) {
	this.nodes[ Hx + Hy + Lz] = new node(this.x_mid, this.x_max, this.y_mid, this.y_max, this.z_min, this.z_mid);
    }
    if (id !== Hx + Hy + Hz) {
	this.nodes[Hx + Hy + Hz] = new node(this.x_mid, this.x_max, this.y_mid, this.y_max, this.z_mid, this.z_max);
    }
    this.type = this.types.node;
}
function OpenTreeData() {
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
OpenTreeData.prototype.onLoadSuccess = function () {
};
/**
 * updateUniforms, Obsolete callback for requesting uniform updates.
 * @obsolte
 * @callback VolumeData~updateUniforms 
 */
OpenTreeData.prototype.updateUniforms = function () {
};
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
OpenTreeData.prototype.setDimensions = function (x, y, z, cols, rows) {
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
};
OpenTreeData.prototype.clone = function (ovd) {
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



};

/**
 * loadData, method for loading volume data. 
 * The loadData method will use one of the available loader classes to load
 * volumetric data. The type of loader class to use is decided by the extension
 * type.  Currently, [vol,rec,hst and pcl] have specialized loaders, while files
 * with other extensions will load using the browsers native image format.
 * @param {type} URL
 * @returns {undefined}
 */
OpenTreeData.prototype.loadData = function (URL) {
    console.log("OpenTreeData.loadData: URL", URL);
    var parts = URL.split('.');
    var ext = parts[parts.length - 1];
    try {
	switch (ext) {
	    case 'pcl':
		this.loader = new PointDataLoader(this);
		break;
	    case 'pcd':
		this.loader = new PointDataLoader(this);
		break;
	    default:
		this.loader = new NativeImageLoader(this);
		break;
	}
    }
    catch (e) {
	console.error("Loader for file type ." + ext + " not available in this version");
	return;
    }
    this.loader.onSuccess = this.onLoadSuccess.bind(this);
    this.loader.load(URL);
};

/**
 * setValue, sets a voxel value (val) for the address
 * @this {VolumeData}
 * @argument {Number} x
 * @argument {Number} y
 * @argument {Number} z
 * @argument {Number} val value to set
 **/
OpenTreeData.prototype.setPointValue = function (x, y, z, val) {
    var address = this.getAddress(x, y, z);
    this.values['image']['data'][address] = val;
    // this.values['flipY'] = false;
    this.values['needsUpdate'] = true;
    // this.onLoadSuccess();

    this.maxVal = Number.NEGATIVE_INFINITY;
    this.minVal = Number.POSITIVE_INFINITY;
    this.avgVal = 0;
    this.sumVal = 0;

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
	this.maxVal = Math.max(this.maxVal, v);
	this.minVal = Math.min(this.minVal, v);
	this.sumVal += v;
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
    this.setDimensions(rng_x, rng_y, rng_z, gf.low, gf.high);

    if (rng_x > rng_y && rng_x > rng_z) {
	this.scalex = 1.0;
	this.scaley = rng_y / rng_x;
	this.scalez = rng_z / rng_x;
    }
    if (rng_y > rng_x && rng_y > rng_z) {
	this.scaley = 1.0;
	this.scalex = rng_x / rng_y;
	this.scalez = rng_z / rng_y;
    }
    if (rng_z > rng_y && rng_z > rng_x) {
	this.scalez = 1.0;
	this.scaley = rng_y / rng_z;
	this.scalex = rng_x / rng_z;
    }

    for (var id in points) {
	x = Math.floor(points[id][0]);
	y = Math.floor(points[id][1]);
	z = Math.floor(points[id][2]);
	v = Math.floor(points[id][3]);
	this.setPointValue(x + offset_x, y + offset_y, z + offset_z, v);
    }
    this.avgVal = this.sumVal / points.length;
    this.values['needsUpdate'] = true;
    this.onLoadSuccess();
};


OpenTreeData.prototype.dumpToCanvas2D = function () {
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

};
/**
 * updateIndexObsolete, updates the z-slize index 
 * @obsolete , kept for reference.
 * @private
 * @argument {Number} cols number of columns in image
 * @argument {Number} rows number of rows in image
 **/
OpenTreeData.prototype.updateIndexObsolete = function (cols, rows) {
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
};
/**
 * updateIndex, updates the z-slize index 
 * @private
 * @argument {Number} cols number of columns in image
 * @argument {Number} rows number of rows in image
 **/
OpenTreeData.prototype.updateIndex = function (cols, rows) {
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
};
