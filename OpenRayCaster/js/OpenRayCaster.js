import {THREE } from '../lib.js/three.js'
import {CameraCrew } from './CameraCrew.js';
import {OpenVolumeData } from './OpenVolumeData.js';
import {VolumeGeometry } from './VolumeGeometry.js';
import {VolumeEgressCoordinatePass } from './RenderPass/VolumeEgressCoordinatePass.js';
import {VolumeIngressCoordinatePass } from './RenderPass/VolumeIngressCoordinatePass.js';
import {RayTracingPass } from './RenderPass/RayTracingPass.js';
import {ColorMap,Colormaps} from './ColorMap.js';

export const default_settings = {
        'interpolation': {
            'XY': 'INTERPOLATION_LINEAR',
            'Z': 'INTERPOLATION_LINEAR_FAST',
            map: {}
        },
        'data': {
//        'File': './data/logo2.4x8.png'
        },
        'display': {
            'Dampening': 0.1,
            'Rng_Offset': 0.0,
            'Composition': 'COMPOSE_AVG',
            'Camera': 'PRESPECTIVE',
            'Axis Markers': true
        },
        'enhancement': {
            'Mixing': 'MIX_LATE',
            'BreakOnDST': false,
            'BreakOnMAXDST': false,
            'AdaptiveSampling': false,
            'DepthSamples': 256.0,
            'Animation DepthSamples': 32.0
        },
        'surface': {
            'Mode': 'SURF_NONE',
            'Color': {'r': 128, 'g': 128, 'b': 128},
            'Min': 0.101,
            'Max': 1.999,
            'Plasma Level': 0.5,
            'Depth Shade': 0.9
        },
        'filter': {
            'Mode': 'BOX_NONE',
            'Min': 0.184,
            'Mark Color': {'r': 0.9, 'g': 0.1, 'b': 0.1},
            'Mark Opacity': 1.0
        },
        'slice': {
            'X start': 0.0000,
            'X depth': 0.9999,
            'Y start': 0.0000,
            'Y depth': 0.9999,
            'Z start': 0.0000,
            'Z depth': 0.9999
        },
        'color': {
            'selected': 'Cold'
        },
        'mouse': {
            'x': 0.0,
            'y': 0.0
        },
        'URLroot': '/OpenRayCaster/'
    }

export class OpenRayCaster {

    VolumeDataType = OpenVolumeData;

    default_settings = default_settings;
    /**
     * OpenRayCaster class for ray traced rendering of volumetric data.
     * This is the open version of the class.
     * @export
     * @author Martin Andersson, V.I.C.
     * @constructor
     * @this {RayCaster}
     * @argument {Gui.prototype.options} options option object
     * 
     **/
    constructor(options) {
        this.shaderDefines = "";
        this.resetScale = false;
        this.settings = JSON.parse(JSON.stringify(this.default_settings));
        if (options && options.hasOwnProperty("renderer")) {
            this.renderer = options["renderer"];
            this.renderTarget = options["renderer"]['domElement'];
            this.canvasSize = new THREE.Vector2(this.renderTarget['clientWidth'], this.renderTarget['clientHeight']);
        } else {
            if (options && options.hasOwnProperty("renderTarget")) {
                this.renderTarget = options["renderTarget"];
            } else {
                this.renderTarget = document.createElement("canvas");
                this.renderTarget["height"] = 640;
                this.renderTarget["width"] = 640;
                this.renderTarget["style"]["width"] = "640px";
                this.renderTarget["style"]["height"] = "640px";
                document.body.appendChild(this.renderTarget);
            }
            this.canvasSize = new THREE.Vector2(this.renderTarget.width, this.renderTarget.height);
            this.renderer = this.setupInitialRenderer();
        }
        console.log("OpenRayCaster:renderTarget:", this.renderTarget['clientWidth']);
        if (options && options.hasOwnProperty("camera")) {
            this.camera = options["camera"];
        } else {
            this.setupInitialCamera();
        }
        if (options && options.hasOwnProperty("scene")) {
            this.scene = options["scene"];
        } else {
            this.setupInitialScene();
        }
        this.colorMap = new ColorMap();
        this.volumeGeometry = new VolumeGeometry();
        this.volumeGeometry.update();
//
        this.buildCoordinatePass();
        this.volumeData = new this.VolumeDataType();
        this.volumeData.onLoadSuccess = this.onLoadSuccess.bind(this);
        this.buildDataPassMaterial();
        this.resize(this.canvasSize.x, this.canvasSize.y);
        this.updateColorMap(this.settings['color']['selected']);
        if (this.settings['data']['File']) {
            this.loadDataFile(this.settings['data']['File']);
        }

    }

    /**
     * 
     * @param {string} settings_file the string url of the settings file to load
     * @returns {undefined}
     */
    loadSettingsFile(settings_file) {
        var settingsLoader = new GeneralDataLoader();
        settingsLoader.responseType = "text";
        settingsLoader.done = this.settingsLoaded.bind(this);
        settingsLoader.loadURL(settings_file);
    }
    /**
     * CallBack for the settingsLoader
     * @param {string} json_settings JSON encoded settings string
     * @returns {undefined}
     */
    settingsLoaded(json_settings) {
        console.log("OpenRayCaster.settingsLoaded:", json_settings);
        this.useSettings(JSON.parse(json_settings));
    }
    importObjectSetting(new_settings, obj, name) {

        if (obj.hasOwnProperty(name)) {
            new_settings[name] = obj[name];
            console.log("imported:", name, new_settings[name]);
        } else {
            new_settings[name] = JSON.parse(JSON.stringify(default_settings[name]));
            console.log("default:", name, new_settings[name]);
        }

    }
    /**
     * useSettings sets the settings object to be used
     * @param {Object} use_settings
     * @returns {undefined}
     */
    useSettings(use_settings) {
        console.log("OpenRayCaster.useSettings:", use_settings);
        var new_settings = {};
        this.importObjectSetting(new_settings, use_settings, 'interpolation');
        this.importObjectSetting(new_settings, use_settings, 'data');
        this.importObjectSetting(new_settings, use_settings, 'display');
        this.importObjectSetting(new_settings, use_settings, 'enhancement');
        this.importObjectSetting(new_settings, use_settings, 'surface');
        this.importObjectSetting(new_settings, use_settings, 'Mixing');
        this.importObjectSetting(new_settings, use_settings, 'filter');
        this.importObjectSetting(new_settings, use_settings, 'Mode');
        this.importObjectSetting(new_settings, use_settings, 'slice');
        this.importObjectSetting(new_settings, use_settings, 'color');
        this.importObjectSetting(new_settings, use_settings, 'mouse');
        this.importObjectSetting(new_settings, use_settings, 'URLroot');
        console.log(new_settings);
        this.settings = new_settings;

        this.updateColorMap(this.settings['color']['selected']);
        if (this.settings['data']['File']) {
            this.loadDataFile(this.settings['data']['File']);
        }
        this.updateUniforms();
        this.updateShader();
    }
    /**
     * buildCoordinatePass, sets up the Coordinate render pass
     * @private
     * @returns {undefined}
     */
    buildCoordinatePass() {
        this.frontPass = new VolumeIngressCoordinatePass(this.settings);
        this.backPass = new VolumeEgressCoordinatePass(this.settings);
        this.frontPass.createBuffer(this.canvasSize);
        this.backPass.createBuffer(this.canvasSize);
        this.waitingForResizeEnd = false;
    }
    /**
     * resize, resize the renderbuffers.<br>
     * Use to resize the render buffers to match the canvas size, or an even
     * multiple/fraction of the the dimensions to achieve under/over sampling.
     * The resize function waits 30 ms before applying the changes, during this timeout no
     * further resize calls are accepted.
     * @param {Number} w , width of the buffer in pixels
     * @param {Number} h , height of the buffer in pixels
     * @returns {undefined}
     */
    resize(w, h) {
        console.log("resize", w, h, this.waitingForResizeEnd);
        this.oRange = 0.565;
        this.oOffsetX = 0;
        this.oOffsetY = 0;
        this.aspect = w / h;

        if (w >= h) {
            this.camera['top'] = this.oRange + this.oOffsetY;
            this.camera['bottom'] = -this.oRange + this.oOffsetY;
            this.camera['left'] = -this.oRange * this.aspect + this.oOffsetX;
            this.camera['right'] = this.oRange * this.aspect + this.oOffsetX;
        } else {
            this.camera['top'] = this.oRange / this.aspect + this.oOffsetY;
            this.camera['bottom'] = -this.oRange / this.aspect + this.oOffsetY;
            this.camera['left'] = -this.oRange + this.oOffsetX;
            this.camera['right'] = this.oRange + this.oOffsetX;
        }
        this.camera.updateProjectionMatrix();
        if (!this.waitingForResizeEnd) {
            this.frontPass.renderBuffer.dispose();
            this.backPass.renderBuffer.dispose();
            this.waitingForResizeEnd = true;
            setTimeout(this.resizeEnd.bind(this), 30);
        }
        this.canvasSize = new THREE.Vector2(w, h);
    }
    /**
     * resizeEnd, event handler triggered 30ms after last accepted resize event.<br>
     * resizeEnd rebuilds the coordinate passes, updates textures and uniforms
     * and then requests new render
     * @private
     * @returns {undefined}
     */
    resizeEnd() {
        this.waitingForResizeEnd = false;
        this.buildCoordinatePass();
        this.updateTextures();
        this.updateUniforms();
        this.requestRender();
        var xyInterpolation = this.settings['interpolation']['XY'];
        this.updateInterpolation(xyInterpolation);
    }
    /**
     * loadDataFile, Load a new data file from the server.
     * <br>The file name extension will determine the type of loader to use.
     * Currently accepted extensions are browser suport image extensions (such as
     * jpeg,png, gif, etc.) and .vol 
     * 
     * @param {String} file the file url to load
     * @param {Function} [callback]  optional callback for load complete notification
     * @returns {undefined}
     */
    loadDataFile(file, callback) {
        console.log("OpenRayCaster.loadData: file", file);
        this.callback = callback || function () {
        };
        this.volumeData.loadData(file);
    }
    /**
     * onLoadSuccess,  data load callback <br>
     * Triggered by the volumedata class, after new data has been loaded.
     * @private
     * @returns {undefined}
     */
    onLoadSuccess() {
        console.log("RayCaster:onLoadSuccess");
        var volumeDimensions = [1.0 / this.volumeData.cols,
            1.0 / this.volumeData.rows,
            1.0,
            this.volumeData.depth];
        this.dataPass.material['uniforms']['volumeDimensions'].value = volumeDimensions;
        this.dataPass.material['needsUpdate'] = true;
        this.dataPass.material['uniforms']['needsUpdate'] = true;
        if (this.resetScale) {
            this.pixelVolume['scale'].x = this.volumeData.scalex;
            this.pixelVolume['scale'].y = this.volumeData.scaley;
            this.pixelVolume['scale'].z = this.volumeData.scalez;
        }
        this.pixelVolume['needsUpdate'] = true;
        this.pixelVolume['material']['needsUpdate'] = true;
        this.updateUniforms();
        this.updateShader();
        this.updateTextures();
        this.requestRender();
        this.callback();
    }
    /**
     * buildDataPassMaterial, builds the datapass and related material 
     * @private
     * @returns {undefined}
     */
    buildDataPassMaterial() {
        console.log("RayCaster: Building Data Pass Material");
        this.dataPass = new RayTracingPass(this.settings);
        this.dataPass.updateDefines(this.settings);
        this.pixelVolume = new THREE.Mesh(this.volumeGeometry, this.dataPass.material);
        this['pixelVolume'] = this.pixelVolume;
        this.scene.add(this.pixelVolume);
        this.updateTextures();
        this.updateUniforms();
    }
    /**
     * updateInterpolation, Update the XY interpolation setting
     * @param {string} value [INTERPOLATION_NEAR |INTERPOLATION_LINEAR]
     * @returns {undefined}
     */
    updateInterpolation(value) {
        console.log("RayCaster:updateInterpolation", value);
        if (value === 'INTERPOLATION_NEAR') {
            this.dataPass.material['uniforms']['dataTex']['value']['magFilter'] = THREE.NearestFilter;
            this.dataPass.material['uniforms']['dataTex']['value']['minFilter'] = THREE.NearestFilter;
        } else {
            this.dataPass.material['uniforms']['dataTex']['value']['magFilter'] = THREE.LinearFilter;
            this.dataPass.material['uniforms']['dataTex']['value']['minFilter'] = THREE.LinearFilter;
        }
        this.dataPass.material['uniforms']['dataTex'].value['needsUpdate'] = true;
        this.requestRender();
    }
    /**
     * updateTextures, updates the texture uniforms of the data pass.
     * @returns {undefined}
     **/
    updateTextures() {
        console.log("RayCaster:updateTextures");
        this.dataPass.material['uniforms']['dataTex'] = {'type': "t", 'value': this.volumeData.values};
        this.dataPass.material['uniforms']['zIndexTex'] = {'type': "t", 'value': this.volumeData.index};
        this.dataPass.material['uniforms']['backFaceTex'] = {'type': "t", 'value': this.backPass.renderBuffer};
        this.dataPass.material['uniforms']['frontFaceTex'] = {'type': "t", 'value': this.frontPass.renderBuffer};
        this.dataPass.material['uniforms']['needsUpdate'] = true;
    }
    /**
     * updateUniforms, updates non texture uniforms of the data pass
     * @returns {undefined}
     **/
    updateUniforms() {
        //console.log("RayCaster:updateUniforms", this.settings);

        this.dataPass.updateUniforms(this.settings);
        // Volume -Slice- Dimensions
        var volumeDimensions = [
            1.0 / this.volumeData.cols,
            1.0 / this.volumeData.rows,
            1.0,
            this.volumeData.depth
        ];
        this.dataPass.setUniform('volumeDimensions', '4f', volumeDimensions);
        this.requestRender();
    }
    /**
     * updateShader, updates (recompiles) the volume shader using updated shader 
     * defines.
     * @returns {undefined}
     **/
    updateShader() {
//    console.log("RayCaster:updateShader");
        this.dataPass.updateDefines(this.settings);
        this.pixelVolume['neesUpdate'] = true;
        this.pixelVolume['material']['needsUpdate'] = true;
        this.requestRender();
    }
    /**
     * requestRender, Request render in next animation frame.
     * @returns {undefined}
     **/
    requestRender() {
        requestAnimationFrame(this.render.bind(this));
    }
//Experimental, not used
// Technically the last renderpass doesnt need to render the cube
// It can just as well be a flat pane 
    setupInitialCamera() {
        this.camera = new THREE.OrthographicCamera(1.2 / -2, 1.2 / 2, 1.2 / 2, 1.2 / -2, -10, 10);
        this.camera.position.z = 4.0;
        this.camera.up = new THREE.Vector3(0, 1, 0);
    }
    setupInitialScene() {
        this.scene = new THREE.Scene();
//    var viewPlaneG = new THREE.PlaneBufferGeometry(1.2, 1.2);
//    var viewPlane = new THREE.Mesh(viewPlaneG);
//    this.scene.add(viewPlane);
    }
    setupInitialRenderer() {

        var renderOptions = {
            canvas: this.renderTarget,
            precission: 'highp',
            alpha: false,
            depth: false,
            stencil: false,
            antialias: false,
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            logarithmicDepthBuffer: false
        };
        return new THREE.WebGLRenderer(renderOptions);
    }
    /**
     * render, immediate render
     * @returns {undefined}
     **/
    render() {

        this.frontPass.render(this.renderer, this.scene, this.camera);  
        this.backPass.render(this.renderer, this.scene, this.camera);
        this.dataPass.render(this.renderer, this.scene, this.camera);
//        console.log(this)
//        this.frontPass.renderToCanvas(this.renderer, this.scene, this.camera,this.debugCanvas);
        
        //var sum=this.frontPass.renderTime + this.backPass.renderTime + this.dataPass.renderTime;
        // console.log(sum,this.frontPass.renderTime, this.backPass.renderTime, this.dataPass.renderTime);
    }
    /**
     * updateColorMap,  Updates the colormap of the data pass material
     * @param {String} map
     * @returns {undefined}
     */
    updateColorMap(map) {
        console.log("RayCaster:setting colormap ", map, Colormaps[map]);
        this.colormapTexture = this.colorMap.update(Colormaps[map]);
        this.dataPass.material['uniforms']['colorTex'] = {'type': "t", 'value': this.colormapTexture};
        this.dataPass.material['uniforms']['needsUpdate'] = true;
        this.dataPass.material['needsUpdate'] = true;
        this.requestRender();
    }
    /**
     * setSliceX, sets the start and depth of volume dimension x slice
     * @param {Number} start The start position of the slize, normalized to [0.0:1.0]
     * @param {Number} depth The depth(length) of the slize, normalized to [0.0:1.0]
     */
    setSliceX(start, depth) {
        this.settings['slice']['X start'] = start / this.volumeData.width;
        this.settings['slice']['X depth'] = depth / this.volumeData.width;
        this.updateUniforms();
        this.requestRender();
    }
    /**
     * setSliceY, sets the start and depth of dimension y slice
     * @param {Number} start The start position of the slize, normalized to [0.0:1.0]
     * @param {Number} depth The depth(length) of the slize, normalized to [0.0:1.0]
     */
    setSliceY(start, depth) {
        this.settings['slice']['Y start'] = start / this.volumeData.height;
        this.settings['slice']['Y depth'] = depth / this.volumeData.height;
        this.updateUniforms();
        this.requestRender();
    }
    /**
     * setSliceZ, sets the start and depth of dimension z slice
     * @param {Number} start The start position of the slize, normalized to [0.0:1.0]
     * @param {Number} depth The depth(length) of the slize, normalized to [0.0:1.0]
     */
    setSliceZ(start, depth) {
        this.settings['slice']['Z start'] = start / this.volumeData.depth;
        this.settings['slice']['Z depth'] = depth / this.volumeData.depth;
        this.updateUniforms();
        this.requestRender();
    }
    /**
     * Set new interpolation modes
     * @param {string} XY INTERPOLATION_NONE | INTERPOLATION_LINEAR
     * @param {string} Z  INTERPOLATION_NONE | 
     *                    INTERPOLATION_LINEAR | INTERPOLATION_LINEAR_FAST
     * @returns {undefined}
     */
    setInterpolation(XY, Z)
    {
        this.settings.interpolation.XY = XY;
        this.settings.interpolation.Z = Z;
        this.updateInterpolation(XY);
        this.updateShader();
        this.requestRender();
    }
 }