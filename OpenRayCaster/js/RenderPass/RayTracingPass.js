import {   RenderPass} from './RenderPass.js';


export class RayTracingPass extends RenderPass {
    /**
     * RayTracingPass class
     * An implementation of the RenderPass.
     * This pass renders the integrated values of the voxels the ray passes from the
     * entry to the exit point.
     * 
     * @author Martin Andersson, V.I.C, 2015. All rights reserved
     * @constructor
     * @extends RenderPass
     * @param {Object} options The RayCaster Options Object
     */
    constructor(options) {
//    console.log("RayTracingPass constructor");
                var vs = RenderPass.shaders.vol_data_vert;
        var fs = RenderPass.shaders.vol_data_frag;
        super(vs,fs);

//    this.material['transparent'] = true;
//    this.material['blending'] = THREE.CustomBlending;
//    this.material['blendEquation'] = THREE.AddEquation;
//    this.material['blendSrc'] = THREE.SrcAlphaFactor;
//    this.material['blendDst'] = THREE.DstAlphaFactor;


    }

    /**
     * updateDefines, update shader defines 
     * @param {Object} options The RayCaster Options Object
     */
    updateDefines(options) {
        this.material['defines'] = {
            'DEPTH_SAMPLES': parseInt(options['enhancement']['DepthSamples']),
            'Z_INTERPOLATION': "INTERPOLATION_LINEAR_FAST", // options['interpolation']['Z'],
            'BOX_MODE': options['filter']['Mode'],
            'SURF_MODE': options['surface']['Mode'],
            'COMPOSE': options['display']['Composition'],
            'MIX': options['enhancement']['Mixing'],
            'AXIS_MARKERS': options['display']['Axis Markers'],
            'BREAK_ON_MAX_DST': options['enhancement']['BreakOnMAXDST'],
            'ADAPTIVE_SAMPLING': options['enhancement']['AdaptiveSampling']
        };
        this.material['defines']['needsUpdate'] = true;
        this.material['needsUpdate'] = true;
    }
    /**
     * updateUniforms, update shader uniforms
     * @param {Object} options The RayCaster Options Object
     */
    updateUniforms(options) {
        console.log("RayTracingPass:updateUniforms:", options);
        // Display
        var display = options['display'];
        this.setUniform('dampening', '1f', display['Dampening']);
        this.setUniform('rng_offset', '1f', display['Rng_Offset']);
        // Enhancement And Testing
        var enhancement = options['enhancement'];
        this.setUniform('depthSamples', "1i", enhancement['DepthSamples']);
        // Surface
        var surface = options['surface'];
        this.setUniform('minSurfValue', "1f", surface['Min']);
        this.setUniform('maxSurfValue', "1f", surface['Max']);
        this.setUniform('fogOpacity', "1f", surface['Plasma Level']);
        this.setUniform('depthShade', "1f", surface['Depth Shade']);
        var minSlice = [
            options['slice']['X start'],
            options['slice']['Y start'],
            options['slice']['Z start']];
        var sliceMax = [
            options['slice']['X depth'],
            options['slice']['Y depth'],
            options['slice']['Z depth']];
        this.setUniform('sliceMax', "3f", sliceMax);
        this.setUniform('sliceMin', "3f", minSlice);
        var r = surface['Color']['r'];
        var g = surface['Color']['g'];
        var b = surface['Color']['b'];
        this.setUniform('surface_color', "4f", [r / 255, g / 255, b / 255, 1.0]);
        var pointer = options['mouse'];
        this.setUniform(['pointer'], "4f", [pointer['x'], pointer['y'], 0.5, 0.5]);
        // Filter 
        var filter = options['filter'];
        var cm = filter['Mark Color'];
        this.setUniform('box_mark_color', "4f", [cm.r / 255, cm.g / 255, cm.b / 255, 1.0]);
        this.setUniform('minBoxValue', "1f", filter['Min']);
        this.setUniform('box_mark_opacity', "1f", filter['Mark Opacity']);
        this.material['uniforms']['needsUpdate'] = true;
        this.material['needsUpdate'] = true;
    }
}