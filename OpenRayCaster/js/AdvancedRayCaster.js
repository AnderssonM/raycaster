import {THREE} from '../lib.js/three.js';
import { PointCloudData} from './PointCloudData.js';
import{ AdvancedVolumeData} from './AdvancedVolumeData.js';
import {OpenRayCaster} from './OpenRayCaster.js';
import {VolumeGeometry} from './VolumeGeometry.js';
import {ColorMap} from './ColorMap.js';
import {VolumeEgressCoordinatePass} from './RenderPass/VolumeEgressCoordinatePass.js';
import {VolumeIngressCoordinatePass} from './RenderPass/VolumeIngressCoordinatePass.js';
import {RayTracingPass} from './RenderPass/RayTracingPass.js';

export {OpenRayCaster}
export class AdvancedRayCaster extends OpenRayCaster {

    /**
     * AdvancedRayCaster class for ray traced rendering of volumetric data.
     * This is the advanced (or closed version), based on the open version.
     * @author Martin Andersson, V.I.C.
     * @constructor
     * @this {RayCaster}
     * @argument {Gui.prototype.options} options option object
     * 
     **/
    VolumeDataType = AdvancedVolumeData;
    constructor(options) {
//        OpenRayCaster.call(this, options);
        super(options);
    }

    /**
     * pixelToNormalizedVoxelCoordinates, get the norm pixel data for coordinates x,y
     * @param {type} x
     * @param {type} y
     * @returns {undefined}
     */
    pixelToNormVoxelCoord(ctx, x, y) {
        var front = this.frontPass.readPixels(ctx, x, y);
        var back = this.backPass.readPixels(ctx, x, y);
//    var s= this.volumeData.getRayData(rs[0],rs[1],rs[2],re[0],re[1],re[2])
        return  {front: front, back: back};

    }

    /**
     * getPixelData, get the pixel data for coordinates x,y
     * @param {type} x
     * @param {type} y
     * @returns {undefined}
     */
    getPixelData(ctx) {
        var x = this.options['mouse']['x'];
        var y = this.options['mouse']['y'];

        var front = this.frontPass.readPixels(ctx, x, y);
        var back = this.backPass.readPixels(ctx, x, y);
        var rFront = this.volumeData.NormCoordToRealCoord(front);
        var rBack = this.volumeData.NormCoordToRealCoord(back);
        var s = this.volumeData.getRayData(rFront, rBack);
        return s;

    }

    /**
     * buildDataPassMaterial, builds the datapass and related material 
     * @private
     * @returns {undefined}
     */
    buildDataPassMaterial() {
        console.log("RayCaster: Building Data Pass Material");
        this.dataPass = new RayTracingPass(this.settings);
        // This is not in open version
        this.dataPass.createBuffer(new THREE.Vector2(200, 200), false);
        this.dataPass.updateDefines(this.settings);
        this.pixelVolume = new THREE.Mesh(this.volumeGeometry, this.dataPass.material);
        this['pixelVolume'] = this.pixelVolume;
        this.scene.add(this.pixelVolume);
        this.updateTextures();
        this.updateUniforms();
    }

    /**
     * renderToCanvas, renders current view  to canvas
     * @returns {undefined}
     **/
    renderToCanvas(canvas, camera) {
        var scene = this.options['scene'];
        camera = camera || this.options['camera'];
        var renderer = this.options['renderer'];
        this.frontPass.renderToBuffer(renderer, scene, camera);
        this.backPass.renderToBuffer(renderer, scene, camera);
        this.dataPass.renderToCanvas(renderer, scene, camera, canvas);
        //var sum=this.frontPass.renderTime + this.backPass.renderTime + this.dataPass.renderTime;
        // console.log(sum,this.frontPass.renderTime, this.backPass.renderTime, this.dataPass.renderTime);
    }
}
