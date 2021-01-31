import {RenderPass} from './RenderPass.js';
import {THREE} from '../../lib.js/three.js';
export class VolumeIngressCoordinatePass extends RenderPass {
    /**
     * VolumeIngressCoordinatePass class
     * An implementation of the RenderPass.
     * Renders the volumetric coordinate of the entry point of the rays intersection
     * with the volume to a texture(buffer). 
     * @author Martin Andersson, V.I.C, 2015. All rights reserved
     * @constructor
     * @extends RenderPass
     * @this {FrontCoordinatePass}
     * @param {Object} options The RayCaster Options Object
     * 
     */
    constructor(options) {
//    console.log("RayTracingPass constructor");
        
        var vs = RenderPass.shaders.vol_ingress_vert;
        var fs = RenderPass.shaders.vol_ingress_frag;
        super(vs,fs);
//        RenderPass.call(this, vs, fs);
        this.material['side'] = THREE.FrontSide;
    }
}