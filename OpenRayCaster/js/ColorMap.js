import {THREE} from '../lib.js/three.js';

export class ColorMap {

    /**
     * ColorMap,
     * A class for creating colormap textures from a set of color stops
     * @author Martin Andersson, V.I.C, 2015. All rights reserved
     * @constructor
     * @this {ColorMap}
     */
    constructor() {
        /** @type{Element} **/ this.canvas = document.createElement('canvas');
        this.canvas['id'] = "cmCanvas";
//    this.canvas=document.getElementById('cmCanvas');
        //this.img=document.createElement('img');

        /** @type{WebGLRenderingContext} **/ this.ctx = this.canvas.getContext('2d');
//    this.ctx.fillStyle = "#FF0000";
//    this.ctx.fillRect(0, 0, 200, 12);
        //   console.log("ColorMap:canvas", this.canvas);
    }
    /**
     * @this {ColorMap}
     * @param {Object[]} a colormap object following the definition style of 
     *  the predefined maps in the Colormaps namespace.
     * @returns {THREE.Texture}
     */
    update = function (colormap) {

        this.canvas.height = 256;
        this.canvas.width = 16;
//    console.log("ColorMap:", colormap);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var grd = this.ctx.createLinearGradient(0, this.canvas.height, 0, 0);

        grd.addColorStop(0.0, 'rgba(0,0,0,0)');
        var entry;
        for (entry in colormap) {
//        console.log("entry");
            grd.addColorStop(colormap[entry].stop, colormap[entry].color);
        }

        if (entry) {
            grd.addColorStop(1.0, colormap[entry].color);
        }
        this.ctx.fillStyle = grd;
        this.ctx.fillRect(0, 0, 25, this.canvas.height);
        var transferTexture = new THREE.Texture(this.canvas);
        transferTexture['wrapS'] = transferTexture['wrapT'] = THREE.ClampToEdgeWrapping;
        transferTexture['needsUpdate'] = true;
        return transferTexture;
    }
}
/**
 * Colormaps, predefined color maps
 * @name Colormaps
 * @namespace 
 * @type {dict}
 */
export var Colormaps = {
    /** @type Colormap  **/
    'Hot': [
        {'stop': 0.15, 'color': "rgba(32,0,0,0.2)"},
        {'stop': 0.7, 'color': "rgba(228,30,0,0.3)"},
        {'stop': 1.0, 'color': "rgba(200,228,0,.9)"}
    ],
    /** @type Colormap  **/
    'Frog': [
        {'stop': 0.12, 'color': "rgba(21,33,21,0.2)"},
        {'stop': 0.19, 'color': "rgba(11,138,11,0.3)"},
        {'stop': 0.74, 'color': "rgba(192,225,37,0.9)"}
    ],
    /** @type Colormap  **/
    'Cold': [
        {'stop': 0.03, 'color': "rgba(6,7,17,0.2)"},
        {'stop': 0.31, 'color': "rgba(27,0,228,0.3)"},
        {'stop': 0.84, 'color': "rgba(228,228,255,0.9)"}
    ],
    /** @type Colormap  **/
    'Gray': [
        {'stop': 0.03, 'color': "rgba(10,10,10,0.2)"},
        {'stop': 0.31, 'color': "rgba(110,110,110,0.4)"},
        {'stop': 0.84, 'color': "rgba(255,255,255,0.9)"}
    ],
    /** @type Colormap  **/
    'StarryNight': [
        {'stop': 0.1, 'color': "rgba(0,0,64,1.0)"},
        {'stop': 0.3, 'color': "rgba(0,128,255,1.0)"},
        {'stop': 0.4, 'color': "rgba(255,255,255,1.0)"},
        {'stop': 0.6, 'color': "rgba(255,255,0,1.0)"},
        {'stop': 0.95, 'color': "rgba(255,64,0,1.0)"},
        {'stop': 1.0, 'color': "rgba(0,0,0,1.0)"}
    ],
    /** @type Colormap  **/
    'IsoSurfer': [
        {'stop': 0.12, 'color': "rgba(0,0,0,0.0)"},
        {'stop': 0.12, 'color': "rgba(6,7,17,0.2)"},
        {'stop': 0.033, 'color': "rgba(6,7,17,0.2)"},
        {'stop': 0.033, 'color': "rgba(27,0,228,0.3)"},
        {'stop': 0.31, 'color': "rgba(27,0,228,0.3)"},
        {'stop': 0.31, 'color': "rgba(228,228,255,0.9)"},
        {'stop': 0.8, 'color': "rgba(228,228,255,0.9)"},
        {'stop': 0.8, 'color': "rgba(0,0,255,0.9)"}
    ],
    /** @type Colormap  **/
    'Custom': [
        {'stop': 0.15, 'color': "rgba(32,0,0,0.2)"},
        {'stop': 0.07, 'color': "rgba(228,30,0,0.3)"},
        {'stop': 1.0, 'color': "rgba(200,228,0,.9)"}
    ]

}

