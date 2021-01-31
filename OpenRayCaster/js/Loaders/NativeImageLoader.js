/**
 * NativeImageLoader,
 *  A class for loading and manipulating image data, using the html canvas
 * @author Martin Andersson, V.I.C, 2015. All rights reserved
 * @constructor
 * @param {OpenVolumeData} volumeData, the initial width of the canvas
 */
export class NativeImageLoader {

    constructor(volumeData) {

        this._canvas = document.createElement("canvas");
        this._canvas.height = 0;
        this._canvas.width = 0;
        /** type{OpenVolumeData} **/this.volumeData = volumeData;
        this.maxVal = Number.NEGATIVE_INFINITY;
        this.minVal = Number.POSITIVE_INFINITY;
        this.avgVal = 0;
        this.sumVal = 0;
        this.context2d = this._canvas.getContext("2d");
//    document.body.appendChild(this.canvas);
//    document.body.appendChild(this._canvas);
    }
    /**
     * callback to be set by the caller before loading data
     * @param {NativeImageLoader} t this instance of NativeImageLoader
     * @callback NativeImageLoader~onSuccess 
     **/
    onSuccess(t) {

    }

    /**
     * save, Starts a download of the current imagedata
     * @param {string} filename The filename of the downloaded file
     */
    save(filename) {
        var dataURL = this._canvas.toDataURL("image/png");
        var data = window.atob(dataURL.substring("data:image/png;base64,".length));
        var asArray = new Uint8Array(data.length);

        for (var i = 0, len = data.length; i < len; ++i) {
            asArray[i] = data.charCodeAt(i);
        }
        var blob = new Blob([asArray.buffer], {type: "image/png"});
        var a = document.createElement("a");
        a.innerHTML = "Click me";
        a.download = filename;
        a.href = (window.webkitURL || window.URL).createObjectURL(blob);
        a.click();
    }

    /**
     * load, loads image data
     * @param {string} URL The URL of the image file to load
     */
    load(URL) {
        console.log("NILoader.load: URL", URL);
        var parts = URL.split(".");

        var colXrow = parts[parts.length - 2].split("x");
        this.cols = parseInt(colXrow[0]);
        this.rows = parseInt(colXrow[1]);
        this.img = new Image();
        this.img.onload = this.onImgLoaded.bind(this);
        this.img.src = URL;
    }

    /**
     * onImgLoaded, eventHandler for the image onLoad event
     * @private
     * @param {Event} e  the event 
     */
    onImgLoaded(e) {
        console.log("NativeImageLoader:loaded:imgage ", this.img);

        var dst = 0;
        var val = 0;
        var srcCol = 0;
        var src_imgd;
        var srcRow;
        var src_xoffset;
        var src_yoffset;
        var src_scan_address;
        var dst_zoffset;
        this.maxVal = Number.NEGATIVE_INFINITY;
        this.minVal = Number.POSITIVE_INFINITY;
        this.avgVal = 0;
        this.sumVal = 0;

        this.height = this.img['height'];
        this.width = this.img['width'];

        var v_width = Math.ceil(this.width / this.cols);
        var v_height = Math.ceil(this.height / this.rows);
        var v_depth = this.rows * this.cols;

        this._canvas['height'] = v_height;
        this._canvas['width'] = v_width;
        this.volumeData.setDimensions(v_width, v_height, v_depth, this.cols, this.rows);
//    this.context2d.globalAlpha = 1.0;
        this.context2d.globalCompositeOperation = "copy";

        console.time("Transfer img to datatexture");
//    this.volumeData.values['flipY'] = false;
        for (var z = 0; z < this.volumeData.depth; z++) {
            srcCol = z % this.cols;
            srcRow = Math.floor(z / this.cols);
            src_xoffset = srcCol * this.volumeData.width;
            src_yoffset = srcRow * this.volumeData.height;

            this.context2d.drawImage(this.img, src_xoffset, src_yoffset, this.volumeData.width, this.volumeData.height, 0, 0, this.volumeData.width, this.volumeData.height);
            src_imgd = this.context2d.getImageData(0, 0, this.volumeData.width, this.volumeData.height).data;
            this.volumeData.setSlice(z, src_imgd, 4);



        }


        console.timeEnd("Transfer img to datatexture");
        this.avgVal = this.sumVal / (this._canvas.width * this._canvas.height);

        // Set scale
        this.volumeData.scalex = this.img.width / this.cols;
        this.volumeData.scaley = this.img.height / this.rows;
        this.volumeData.scalez = this.rows * this.cols;

        var scale_max = Math.max(Math.max(this.volumeData.scalex, this.volumeData.scaley), this.volumeData.scalez);

        this.volumeData.scalex /= scale_max;
        this.volumeData.scaley /= scale_max;
        this.volumeData.scalez /= scale_max;

        this.volumeData.values['flipY'] = true;
        this.volumeData.values['needsUpdate'] = true;

        this.onSuccess(this);
    }

    onImgLoaded2(e) {
        console.log("NativeImageLoader:loaded:imgage ", this.img);
        this._canvas['height'] = this.img['height'];
        this._canvas['width'] = this.img['width'];
        this.context2d.drawImage(this.img, 0, 0);

        this.height = this.img['height'];
        this.width = this.img['width'];
        this.volumeData.setDimensions(Math.ceil(this.width / this.cols),
                Math.ceil(this.height / this.rows),
                this.rows * this.cols,
                this.cols, this.rows);
        var ccData = this.getColorChannelData(0);

        var di, siA, dioffsetA, siB, dioffsetB;
        for (var z = 0; z < this.volumeData.depth + 20; z++) {
            dioffsetA = (z % this.cols * this.volumeData.width);
            dioffsetA += (Math.floor(z / this.cols) * this.volumeData.height * this.width);
            dioffsetB = ((z + 1) % this.cols * this.volumeData.width);
            dioffsetB += (Math.floor((z + 1) / this.cols) * this.volumeData.height * this.width);

            for (var y = 0; y < this.volumeData.height; y++) {
                for (var x = 0; x < this.volumeData.width; x++) {

                    di = this.volumeData.getAddress(x, y, z);
                    siA = x + (this.volumeData.height - y) * this.width + dioffsetA;
                    this.volumeData.values['image']['data'][ di ] = ccData[ siA ];
                    if (z < this.volumeData.depth - 1) {
                        siB = x + (this.volumeData.height - y) * this.width + dioffsetB;
                        this.volumeData.values['image']['data'][ di + 1] = ccData[ siB  ];
                    }
                }
            }
        }
//    for (var i = 0; i < this.width * this.height; i++) {
//        this.volumeData.values['image']['data'][ i * 2 ] = ccData[ i ];
//        this.volumeData.values['image']['data'][ i * 2 + 1 ] = ccData[ i + 1 ];
//    }
//    this.volumeData.values['image'].data.set(ccData);

        this.volumeData.maxVal = this.maxVal;
        this.volumeData.minVal = this.minVal;
        this.volumeData.avgVal = this.avgVal;
        this.volumeData.sumVal = this.sumVal;

        // Set scale
        this.volumeData.scalex = this.img.width / this.cols;
        this.volumeData.scaley = this.img.height / this.rows;
        this.volumeData.scalez = this.rows * this.cols;

        var scale_max = Math.max(Math.max(this.volumeData.scalex, this.volumeData.scaley), this.volumeData.scalez);

        this.volumeData.scalex /= scale_max;
        this.volumeData.scaley /= scale_max;
        this.volumeData.scalez /= scale_max;

        this.volumeData.values['flipY'] = true;
        this.volumeData.values['needsUpdate'] = true;

        this.onSuccess(this);
    }

    /**
     * getImageData, return the current image data as Uint8Array
     * @returns {Uint8Array}
     */
    getImageData() {
        this.maxVal = Number.NEGATIVE_INFINITY;
        this.minVal = Number.POSITIVE_INFINITY;
        this.avgVal = 0;
        this.sumVal = 0;
        var val;
        var imgd = this.context2d.getImageData(0, 0, this._canvas.width, this._canvas.height);
        var pix = imgd.data;
        var data = new Uint8Array(this._canvas.width * this._canvas.height * 4);
        for (var i = 0; i < this._canvas.width * this._canvas.height * 4; i++) {
            val = pix[i];
            data[i] = val;
            this.sumVal += val;
            this.minVal = Math.min(this.minVal, val);
            this.maxVal = Math.max(this.maxVal, val);
        }
        this.avgVal = this.sumVal / (this._canvas.width * this._canvas.height);
        return data;

    }

    /**
     * getColorChannelData, return the selected color channel data as Uint8Array
     * @param {number} channel The color channel to return [0=Red | 1=Green | 2=blue | 3=Alpha]
     * @returns {Uint8Array}
     */
    getColorChannelData(channel) {
        this.maxVal = Number.NEGATIVE_INFINITY;
        this.minVal = Number.POSITIVE_INFINITY;
        this.avgVal = 0;
        this.sumVal = 0;
        var val;
        channel = channel || 0;
        var imgd = this.context2d.getImageData(0, 0, this._canvas.width, this._canvas.height);
        var pix = imgd.data;
        var data = new Uint8Array(this._canvas.width * this._canvas.height);
        for (var i = 0; i < this._canvas.width * this._canvas.height; i++) {
            val = pix[i * 4 + channel];
            data[i] = val;
            this.sumVal += val;
            this.minVal = Math.min(this.minVal, val);
            this.maxVal = Math.max(this.maxVal, val);
        }
        this.avgVal = this.sumVal / (this._canvas.width * this._canvas.height);
        return data;
    }
    /**
     * putColorChannelData, sets color channel data from Uint8Array
     * @param {number} channel The color channel to write to [0=Red | 1=Green | 2=blue | 3=Alpha]
     * @param {Uint8Array} data The data to be written
     */
    putColorChannelData(channel, data) {
        console.log("Canvas: put color channel data", this, channel, data, this._canvas.width * this._canvas.height);
        channel = channel || 0;
        this.context2d.clearRect(0, 0, this._canvas.width, this._canvas.height);
        var imgd = this.context2d.createImageData(this._canvas.width, this._canvas.height);

        for (var i = 0; i < this._canvas.width * this._canvas.height; i++) {
            imgd.data[i * 4 + channel] = data[i];
            imgd.data[i * 4 + 3] = 255;// data[i];
        }
        this.context2d.putImageData(imgd, 0, 0);
    }
}