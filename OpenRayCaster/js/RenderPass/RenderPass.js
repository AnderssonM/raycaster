
import {THREE} from '../../lib.js/three.js';

import {shaders, __transmograf} from './ShaderCollection.js';
//
//RenderPass.prototype.shaders = shaders;
//RenderPass.prototype.__transmograf = __transmograf;
console.log("__T", __transmograf);
export class RenderPass {

    static shaders = shaders;
//    static __transmograf=__transmograf;
    /**
     * RenderPass
     * A class representing one pass (step) of the rendering chain
     * @author Martin Andersson, V.I.C, 2015. All rights reserved
     * @constructor
     * @this {RenderPass}
     * @param {string} vertShader vertex shader for the pass
     * @param {string} fragShader fragment shader for the pass
     */
    constructor(vertShader, fragShader) {
//    this.URLroot = options['URLroot'] + "/shaders/";
        this.renderBufferOptions = {
            'minFilter': THREE.LinearFilter,
            'magFilter': THREE.LinearFilter,
            'anisotropy': 2,
            'format': THREE.RGBFormat,
//            'type': THREE.FloatType,
            'depthBuffer': false,
            'stencilBuffer': false
        };

        var params = {
            'vertexShader': __transmograf + vertShader,
            'fragmentShader': __transmograf + fragShader,
            'depthWrite': false,
            'depthTest': false,
            'side': THREE.FrontSide
        };
        /**  @dict */
//        console.log("PARAMS",__transmograf
        this.material = new THREE.ShaderMaterial(params);

        this.material['uniforms'] = {};
        this.material['defines'] = {};
        this.material['needsUpdate'] = true;
        this._render = this.renderToScreen;
        this.renderTime = 0;
    }
    /**
     * createBuffer, create a new buffer of size bufferSize
     * @param {THREE.Vector2} bufferSize the size of the buffer as a V2 Object {x:width,y:height}
     */
    createBuffer(bufferSize, useByDefault) {
        this.bufferSize = bufferSize;
        console.log("RenderPass:Creating buffer (w,h)", bufferSize.x, bufferSize.y);
        this.renderBuffer = new THREE.WebGLRenderTarget(bufferSize.x, bufferSize.y, this.renderBufferOptions);
        this.renderBuffer['wrapS'] = THREE.ClampToEdgeWrapping;
        this.renderBuffer['wrapT'] = THREE.ClampToEdgeWrapping;
        if (useByDefault === true || useByDefault === undefined) {
            this._render = this.renderToBuffer;
        }
    }

    /**
     * loadShader, load the associated GLSL shader code
     * @param {String} path the URL of the shader to load
     * @returns {String}
     */
    loadShader(path) {
        var request = new XMLHttpRequest();
        request.open('GET', path, false);
        request.send(null);
        if (request.status === 200) {
//        console.log("RenderPass:Success, loading shader:", path, request.responseText.length);
            return request.responseText;
        } else {
            console.log("RenderPass:Failed, loading shader:", path, request.responseText.length);
        }
    }

    /**
     * setUniform, sets the a uniform of the material
     * @param {string} name Name of the uniform to set
     * @param {string} type uniform type
     * @param {Object} value uniform value
     */
    setUniform(name, type, value) {
        this.material['uniforms'][name] = {'type': type, 'value': value};
        //console.log("RenderPass:setUniform:",this.material['uniforms'][name]);
    }

    /**
     * renderToBuffer, renders the current view to a frame buffer 
     * @param {THREE.WebGLRenderer} renderer the WebGLRenderer
     * @param {THREE.Scene} scene the scene to render 
     * @param {THREE.Camera} camera the Camera to use for rendering
     */
    renderToBuffer(renderer, scene, camera) {
        console.log("RenderToBuffer", renderer.supportsFloatTextures())
        var omat = scene['overrideMaterial'];
//        renderer.extensions.get( 'EXT_color_buffer_float' );
        
        scene['overrideMaterial'] = this.material;
        renderer.render(scene, camera, this.renderBuffer, true);
        scene['overrideMaterial'] = omat;
         console.log("RenderToBuffer end")
    }

    /**
     * renderToScreen, renders the current view to the screen
     * @param {THREE.WebGLRenderer} renderer the WebGLRenderer
     * @param {THREE.Scene} scene the scene to render 
     * @param {THREE.Camera} camera the Camera to use for rendering
     */
    renderToScreen(renderer, scene, camera) {
        console.log("renderToScreen")
        var omat = scene['overrideMaterial'];
        scene['overrideMaterial'] = this.material;
        renderer.render(scene, camera);
        scene['overrideMaterial'] = omat;
          console.log("renderToScreen end")
    }

    /**
     * renderToScreen, renders the current view to the screen
     * @param {THREE.WebGLRenderer} renderer the WebGLRenderer
     * @param {THREE.Scene} scene the scene to render 
     * @param {THREE.Camera} camera the Camera to use for rendering
     */
    renderToCanvas(renderer, scene, camera, canvas) {
        console.log("RenderPass:renderToCanvas:", renderer, scene, "|", camera, canvas);
        var omat = scene['overrideMaterial'];
        var w = this.bufferSize.x;
        var h = this.bufferSize.y;
        var rctx = renderer.context;
        var ictx = canvas.getContext('2d');

        var pixels = new Uint8Array(4 * w * h);
        var imageData = ictx.createImageData(w, h);

        scene['overrideMaterial'] = this.material;
        renderer.render(scene, camera, this.renderBuffer, true);
        scene['overrideMaterial'] = omat;
        rctx['bindFramebuffer'](rctx['FRAMEBUFFER'], this.renderBuffer['__webglFramebuffer']);
        rctx['readPixels'](0, 0, w, h, rctx['RGBA'], rctx['UNSIGNED_BYTE'], pixels);
        imageData.data.set(pixels);
        ictx.putImageData(imageData, 0, 0);
    }
   

    /**
     * render, renders the current view to the default output. Defaults to
     * renderToScreen in the RenderPass base class, but may be changed in inherriting 
     * classes.
     * @param {THREE.WebGLRenderer} renderer the WebGLRenderer
     * @param {THREE.Scene} scene the scene to render 
     * @param {THREE.Camera} camera the Camera to use for rendering
     */
    render(renderer, scene, camera) {
        console.log("RenderPass::render" , renderer)
        var t0 = performance.now();
        this._render(renderer, scene, camera);
        this.renderTime = performance.now() - t0;
         console.log("RenderPass::render end" )
    }

    /**
     * 
     * @param {THREE.WebGLRenderer.context} ctx
     * @param {Number} x
     * @param {Number} y
     * @returns {Uint8Array} The pixel data 
     */
    readPixels(ctx, x, y) {
        x = Math.floor(this.bufferSize.x * x);
        y = Math.floor(this.bufferSize.y * y);
//    ctx.bindRenderbuffer(ctx.RENDERBUFFER, this.renderBuffer.__webglRenderbuffer);
        ctx['bindFramebuffer'](ctx['FRAMEBUFFER'], this.renderBuffer['__webglFramebuffer']);
//    ctx.bindTexture(ctx.TEXTURE, this.renderBuffer.__webglTexture);

        var pixels = new Uint8Array(4);
        ctx['readPixels'](x, y, 1, 1, ctx['RGBA'], ctx['UNSIGNED_BYTE'], pixels);
        return {x: pixels[0] / 255, y: pixels[1] / 255, z: pixels[2] / 255};
    }

}
