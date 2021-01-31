import{ RenderPass} from './RenderPass.js';
import {THREE} from '../../lib.js/three.js';

/**
 * VolumeEgressCoordinatePass class
 * An implementation of the RenderPass.
 * Renders the volumetric coordinate of the exit point of the rays intersection
 * with the volume to a texture(buffer). 
 * 
 * @author Martin Andersson, V.I.C, 2015. All rights reserved
 * @constructor
 * @extends RenderPass
 * @param {Object} options The RayCaster Options Object
 * 
 */

export class VolumeEgressCoordinatePass extends RenderPass
{

    constructor(options) {
//    console.log("RayTracingPass constructor");
        var vs = RenderPass.shaders.vol_egress_vert;
        var fs = RenderPass.shaders.vol_egress_frag;
        super(vs,fs);
        this.material['side'] = THREE.BackSide;
    }

}
