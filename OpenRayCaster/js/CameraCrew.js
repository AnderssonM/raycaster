import {OrbitControls} from '../lib.js/OrbitControls.js';
import {TrackballControls} from '../lib.js/TrackballControls.js';
import {THREE} from '../lib.js/three.js';
/**
 * RayCaster
 * A web based program for ray traced rendering of volumetric data.
 * @author Martin Andersson, V.I.C, 2015. All rights reserved
 *                
 */


export class CameraCrew {

    ORTHO_CAM_X = 0;
    ORTHO_CAM_Y = 1;
    ORTHO_CAM_Z = 2;
    ORTHOGRAPHIC = 3;
    PRESPECTIVE = 4;

    /**
     * CameraCrew class, a collection of cameras and camera controls
     * @author Martin Andersson, V.I.C, 2015. All rights reserved
     * @constructor
     * @param {Object} options A raycaster options object
     * @param {Element} target The target canvas 
     * @param {Integer} [FPS=60]  Max Frames Per Seconds
     * @param {Integer} [DPSANIM=256] Number of depth samples to use during animation.
     */
    constructor(rayCaster, FPS, DPSANIM) {
        this.FPS = FPS || 60;
        console.log("FPS:", rayCaster, this.FPS);

        this.DPSANIM = DPSANIM || 256;
        this.lastRender = 0;
        this.lastZoom = 0;
        this.oRange = 0.865;
        this.oOffsetX = 0;
        this.oOffsetY = 0;
        this.rx = 1;
        this.ry = 1;
        /** @type{Object} **/
        this.afRequest = -1;
        this.rayCaster = rayCaster;
        this.render = rayCaster.render.bind(rayCaster);
        this.aspect = 1.0;
        this.target = rayCaster.renderTarget;
        this.settings = rayCaster.settings;
        this.renderer = rayCaster.renderer;

        this.cameras = this.setupCameraCollection();

        this.settings['camera'] = this.camera = this.cameras[CameraCrew.PRESPECTIVE];
//    this.initTrackballControls();
        this.controls = new THREE.OrbitControls(this.cameras[CameraCrew.PRESPECTIVE], this.target);
        this.selectCamera(CameraCrew.PRESPECTIVE);
        rayCaster.camera = this.camera;
    }

    setupCameraCollection = function () {
        var cameras = {};

        //ORTHO_CAM_X Setup
        var ocx = new THREE.OrthographicCamera(1.2 / -2, 1.2 / 2, 1.2 / 2, 1.2 / -2, -10, 10);
        ocx.position.x = 2.0;
        ocx.up = new THREE.Vector3(0, 0, 1);
        ocx.lookAt(new THREE.Vector3(0, 0, 0));
        cameras[CameraCrew.ORTHO_CAM_X] = ocx;

        //ORTHO_CAM_Y Setup
        var ocy = new THREE.OrthographicCamera(1.2 / -2, 1.2 / 2, 1.2 / 2, 1.2 / -2, -10, 10);
        ocy.position.y = 2.0;
        ocy.up = new THREE.Vector3(1, 0, 0);
        ocy.lookAt(new THREE.Vector3(0, 0, 0));
        cameras[CameraCrew.ORTHO_CAM_Y] = ocy;

        //ORTHO_CAM_Z Setup
        var ocz = new THREE.OrthographicCamera(1.2 / -2, 1.2 / 2, 1.2 / 2, 1.2 / -2, -10, 10);
        ocz.position.z = 2.0;
        ocz.up = new THREE.Vector3(0, 1, 0);
        ocz.lookAt(new THREE.Vector3(0, 0, 0));
        cameras[CameraCrew.ORTHO_CAM_Z] = ocz;

        //ORTHOGRPAHIC Cam Setup
        var oc = new THREE.OrthographicCamera(1.2 / -2, 1.2 / 2, 1.2 / 2, 1.2 / -2, -10, 10);
        oc.position.z = 2.0;
        oc.up = new THREE.Vector3(0, 1, 0);
        oc.lookAt(new THREE.Vector3(0, 0, 0));
        cameras[CameraCrew.ORTHOGRAPHIC] = oc;

        //PERSPECTIVE Cam setup
        var pc = this.pCam = new THREE.PerspectiveCamera(40, 1 / 1, 0.01, 3000.0);
        pc.position.z = 2.0;
        pc.lookAt(new THREE.Vector3(0, 0, 0));
        cameras[CameraCrew.PRESPECTIVE] = pc;

        return cameras;
    }
    /**
     * selectCamera, selects the active camera
     * @param {string} cameraType  Can be any of the following:<br>
     *                              |'oCamX': Orthographic locked view along X axis<br> 
     *                              |this.ORTHO_CAM_Y: Orthographic locked view along Y axis<br> 
     *                              |this.ORTHO_CAM_Z: Orthographic locked view along Z axis<br> 
     *                              |CameraCrew.ORTHOGRAPHIC : Orthographic unlocked view<br> 
     *                              |CameraCrew.PRESPECTIVE : Perspective  unlocked view<br>
     * @returns {undefined}
     */
    selectCamera = function (cameraType) {
        console.log("selectCamera", cameraType);
        this.settings['camera'] = this.camera = this.cameras[cameraType];
        if (cameraType === CameraCrew.ORTHOGRAPHIC || cameraType === CameraCrew.PRESPECTIVE) {
            this.controls.object = this.camera;
        }
        this.controls.reset();
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
//    this.controls.center.set(0.0, 0.0, 0.0);
        this.cameraType = cameraType;
        this.setSize(this.target.clientWidth, this.target.clientHeight, this.rx, this.ry);

    }
    /**
     * setSize, sets the size and aspect of the camera frustum
     * @param {type} w , width of camera frustum in pixels
     * @param {type} h , height of camera frustum in pixels
     * @param {type} [rx=1] , render resolution
     * @param {type} [ry=1] , render resolution
     * @returns {undefined}
     */
    setSize = function (w, h, rx, ry) {
        console.log("CameraCrew:setSize", w, h, this.cameraType);
        this.aspect = w / h;
        this.w = w;
        this.h = h;
        this.rx = rx || 1;
        this.ry = ry || 1;
        this.renderer.setSize(this.w / this.rx, this.h / this.ry);
        if (this.cameraType === CameraCrew.PRESPECTIVE) {
            this.camera['aspect'] = this.aspect;
        } else {
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
        }

        this.camera.updateProjectionMatrix();
    }

    /**
     * initTrackballControls, use trackball style controls
     * @this{CameraCrew}
     * @returns {undefined}
     */
    initTrackballControls = function () {
        this.controls = new THREE.TrackballControls(this.camera, this.target);
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;

        this.controls.noZoom = false;
        this.controls.noPan = false;
        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;

    }
    /**
     * initOrbitControls, use orbit style controls
     * @this{CameraCrew}
     * @returns {undefined}
     */
    initOrbitControls = function () {
        this.controls = new THREE.OrbitControls(this.camera, this.target);
        this.controls.center.set(0.0, 0.0, 0.0);
    }

    /**
     * selectControls, select the type of controls to use
     * @this {CameraCrew}
     * @param {string} controlType The type of controls to use ['orbit'|'trackball']
     * @returns {undefined}
     * 
     */
    selectControls = function (controlType) {
        if (controlType === 'orbit' || controlType === 'orb') {
            this.initOrbitControls();
        } else {
            this.initTrackballControls();
        }
    }
    /**
     * setupMouseEvents, set up mouse event listeners.
     * @returns {undefined}
     */
    setupMouseEvents = function () {
        this.target.onmouseout = this.stopAnimation.bind(this);
        this.target.onmouseup = this.stopAnimation.bind(this);
        this.target.onmousedown = this.startAnimation.bind(this);
        this.target.onmousemove = this.onMouseMove.bind(this);
        this.target.onclick = this.onMouseClick.bind(this);
//    this.target.addEventListener('DOMMouseScroll', this.onZoom.bind(this), false); // for Firefox, fails silently on others
        this.target.addEventListener('mousewheel', this.onZoom.bind(this), false);     // For others, fails silently on FF
        document.onkeydown = this.onKeyPress.bind(this);
    }
    /**
     * onMouseMove event handler mouse cursor movement
     * orthographic camera views.
     * @private
     * @param {type} e
     */
    onMouseMove = function (e) {

//  this.settings['mouse']['x']=e.x;
//  this.settings['mouse']['y']=e.y;    
    }
    /**
     * onMouseClick event handler mouse clicks
     * orthographic camera views.
     * @private
     * @param {type} e
     */
    onMouseClick = function (e) {

//  this.settings['mouse']['x']=e.x;
//  this.settings['mouse']['y']=e.y;    
    }
    /**
     * onKeyPress event handler for arrow keys, intended for panning with
     * orthographic camera views.
     * @private
     * @param {type} e
     * @returns {undefined}
     */
    onKeyPress = function (e) {
        //if (this.cameraType !== CameraCrew.PRESPECTIVE) {
        console.log("key event", e.keyCode)
        switch (e.keyCode) {
            case 37:
                this.oOffsetX += .01;
                e.preventDefault();
                break;
            case 38:
                this.oOffsetY += .01;
                e.preventDefault();
                break;
            case 39:
                this.oOffsetX -= .01;
                e.preventDefault();
                break;
            case 40:
                this.oOffsetY -= .01;
                e.preventDefault();
                break;
        }
        this.setSize(this.target.clientWidth, this.target.clientHeight, this.rx, this.ry);
        requestAnimationFrame(this.animate.bind(this));
        //}
    }
    /**
     * onZoom, event handler for zoom(mouse wheel) events
     * @private
     * @returns {undefined}
     */
    onZoom = function (e) {

        if (this.cameraType === CameraCrew.PRESPECTIVE) {
            if (this.afRequest === -1) {
                this.startAnimation();
            }
            window.clearTimeout(this.lastZoom);
            this.lastZoom = window.setTimeout(this.stopAnimation.bind(this), 300);
        } else {
            var wDelta = e.wheelDelta < 0 ? 0.004 : -0.004;
            this.oRange += wDelta;
            if (this.oRange < 0.02)
                this.oRange = 0.02;
            this.setSize(this.target.clientWidth, this.target.clientHeight, this.rx, this.ry);
            if (this.afRequest === -1) {
                this.startAnimation();
            }
            window.clearTimeout(this.lastZoom);
            this.lastZoom = window.setTimeout(this.stopAnimation.bind(this), 300);
        }

    }
    /**
     * startAnimation, starts animation mode. Normally only private use
     * @this{CameraCrew}
     * @returns {undefined}
     */
    startAnimation = function () {
        console.log("animation start");
//    this.depth_samples = this.settings['enhancement']['DepthSamples'];
//    this.settings['enhancement']['DepthSamples'] = this.DPSANIM;
//    this.updateShader();
        this.afRequest = requestAnimationFrame(this.animate.bind(this));
//    this.setSize(this.target.clientWidth, this.target.clientHeight, 2, 2);
    }
    /** 
     * stopAnimation, stops the animation by canceling last frame.
     * Normally only private use.
     * @this{CameraCrew}
     * @returns {undefined}
     */
    stopAnimation = function () {
//    this.setSize(this.target.clientWidth, this.target.clientHeight, 1, 1);

        if (this.depth_samples) {
            console.log("animation stop", this.depth_samples);
            this.settings['enhancement']['DepthSamples'] = this.depth_samples;
        }
        window.cancelAnimationFrame(this.afRequest);
        this.updateShader();
        this.afRequest = -1;
    }
    /**
     * animate, Frame rate limited animation frame request loop
     * @private
     * @this{CameraCrew}
     * @param {dateTime} tstamp last render time 
     * @returns {undefined}
     */
    animate = function (tstamp) {
        if (tstamp - this.lastRender > 1000 / this.FPS) {
            this.lastRender = tstamp;
            this.controls.update();
            this.render();
        }
        if (this.afRequest !== -1) {
            this.afRequest = requestAnimationFrame(this.animate.bind(this));
        }
    }
    /**
     * render Callback. Set this to the render function
     * of your RayCaster instance, to get automatic render updates when the camera
     * view is updated.
     * @callback CameraCrew~render
     */
    render = function () {

    }

    /**
     * updateShader Callback. To provide smoother camera interaction, the depth sample setting
     * can be automatically modified to a lower value during camera rotation and zoom.
     * Set this to the updateShader function of your RayCaster instance, to allow 
     * the shader to be updated with the modified depth sample values
     * @callback CameraCrew~updateShader 
     * @returns {undefined}
     */
    updateShader = function () {

    }

}
