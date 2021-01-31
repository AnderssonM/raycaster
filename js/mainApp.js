//from("../lib.js").import("three.min.js", "Detector.js");
//from("../OpenRayCaster/js").import("CameraCrew.js");
//from("../AdvancedRayCaster/js").import("AdvancedRayCaster.js");
//from("./js").import("RayCasterGUI.js");
//from("./js").import("devOptions.js");

import {THREE} from '../OpenRayCaster/lib.js/three.js';
import {CameraCrew} from '../OpenRayCaster/js/CameraCrew.js';
import {AdvancedRayCaster, OpenRayCaster} from '../OpenRayCaster/js/AdvancedRayCaster.js';
import {RayCasterGUI} from './RayCasterGUI.js';
import {default_options} from './devOptions.js';

export class App
{
    /**
     * Main Application
     *
     * @author Martin Andersson, V.I.C, 2015. All rights reserved
     * @constructor
     * 
     */
    constructor() {
        var queryParams = this.getParameters();
        this.FPS = ("FPS" in queryParams) ? queryParams['FPS'][0] : 60;
        this.DPSANIM = ("DPSANIM" in queryParams) ? queryParams['DPSANIM'][0] : 256;
        this.rx = ("RX" in queryParams) ? queryParams['RX'][0] : 1;
        this.ry = ("RY" in queryParams) ? queryParams['RY'][0] : 1;
        this.demoMode = false;
        this.sx = 0;
        this.sxSpeed = 0.005;
        /** type{CanvasElement} **/ this.canvas;
        /** type{THREE.Scene} **/   var scene;
        /** type{THREE.Clock} **/this.clock = new THREE.Clock();
        /** type{RayCaster} **/ this.rayCaster;
        /** type{Boolean} **/this.demoMode = false;
        /** type{Gui} **/this.gui;
        /** type{Object} **/ this.options = default_options;
        this.setup();
        //  this.cameraCrew.startAnimation();
//    this.startDemo();
        //this.cameraCrew.setupMouseEvents();
    }

    /**
     * setup
     * @this{App}
     * @returns {undefined}
     */
    setup() {

//    this.container = document.getElementById('container');
        this.canvas = document.getElementById('canvas');
//    this.scene = new THREE.Scene();
//    this.cameraCrew = new CameraCrew(this.options, this.canvas, this.FPS, this.DPSANIM);
//    this.cameraCrew.target = this.canvas;
//    this.options['scene'] = this.scene;
//    this.rayCaster = new AdvancedRayCaster(this.options);
        this.rayCaster = new AdvancedRayCaster({renderTarget: this.canvas});
        this.cameraCrew = new CameraCrew(this.rayCaster, this.FPS, this.DPSANIM);
        this.rayCaster.resetScale = true;
        this.cameraCrew.render = this.render.bind(this);
        this.cameraCrew.updateShader = this.rayCaster.updateShader.bind(this.rayCaster);
        this.cameraCrew.setupMouseEvents();
        this.gui = new RayCasterGUI('toolBox', this.rayCaster, this.cameraCrew);
        this.gui.cameraSel.onChange(this.selectCamera.bind(this));
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        console.log("App setup done", this);
        this.cameraCrew.onMouseMove = this.mouseMove.bind(this);
        this.cameraCrew.onMouseClick = this.keyPress.bind(this);
    }
    /**
     * selectCamera
     * @this{App}
     * @returns {undefined}
     */
    selectCamera() {
        this.cameraCrew.selectCamera(this.options['display']['Camera']);
        this.render();
    }
    /**
     * startDemo
     * @this{App}
     * @returns {undefined}
     */
    startDemo() {
        console.log("starting demo");
        this.rayCaster.resetScale = false;
//    this.rayCaster.pixelVolume.scale.x = 1.2;
//    this.rayCaster.pixelVolume.scale.y = 0.8;
//    this.rayCaster.pixelVolume.scale.z = 0.25;
        this.rayCaster['pixelVolume'].position.z = -12.2;
        this.rayCaster.loadDataFile('../OpenRayCaster/data/KEKlogo2.4x8.png');
//    this.options['surface']['Mode']="SURF_SRC";
//    this.options['surface']['Min']=0.18;
//    this.options['surface']['Max']=1;
//    this.options['interpolation']['XY']="INTERPOLATION_LINEAR";
//    this.options['interpolation']['Z']="INTERPOLATION_LINEAR";
//    this.rayCaster.updateInterpolation();
//    this.rayCaster.updateShader();
//    this.rayCaster.updateUniforms();
        this.demoMode = true;
        window.addEventListener('click', this.stopDemo.bind(this), false);
        this.gui.dataFolder.close();
        this.cameraCrew.startAnimation();
    }
    /**
     * stopDemo
     * @this{App}
     * @returns {undefined}
     */
    stopDemo() {

        if (this.demoMode == 1) {
            console.log("stopping demo");
            this.gui.dataFolder.open();
            this.gui.helpFolder.open();
            this.demoMode = false;
            this.rayCaster['pixelVolume'].rotation.x = 0;
            this.rayCaster['pixelVolume'].rotation.y = 0;
            this.rayCaster['pixelVolume'].position.z = 0;
            this.rayCaster.resetScale = true;
            this.cameraCrew.stopAnimation();
            this.cameraCrew.setupMouseEvents();
        }
        window.removeEventListener('click', this.stopDemo, false);
    }
    /**
     * stopDemo
     * @this{App}
     * @returns {undefined}
     */
    render() {
        if (this.demoMode == 1) {

            this.rayCaster['pixelVolume'].position.z += 2 * 0.035 * 2;
            this.rayCaster['pixelVolume'].rotation.x += 0.036 * 2;
            this.rayCaster['pixelVolume'].rotation.y += 0.036 * 2;
            if (this.rayCaster.pixelVolume.rotation.y > Math.PI * 2) {
                this.stopDemo();
            }
            this.stopDemo();
        }
        this.gui.stats.update();
        this.rayCaster.render();
    }
    ;
            keyPress(e) {

        console.log("keyPress");
        var x = this.options['mouse']['x'] = this.options['mouse']['xtmp'];
        var y = this.options['mouse']['y'] = this.options['mouse']['ytmp'];
        var ctx = this.cameraCrew.renderer.context;
        var s = this.rayCaster.getPixelData(ctx);
        this.rayCaster.updateUniforms();
        this.rayCaster.render();
        var nvc = this.rayCaster.pixelToNormVoxelCoord(ctx, x, y);
        var rvcF = this.rayCaster.volumeData.NormCoordToRealCoord(nvc.front);
        var rvcB = this.rayCaster.volumeData.NormCoordToRealCoord(nvc.back);
        var output = "[min:" + s.min + " avg:" + s.avg + " max:" + s.max + " sum:" + s.sum + "]";
        var cbHeight = document.getElementById("ColorBar").clientHeight;
        var vMax = this.gui.CMapMax.__input.value;
        document.getElementById("errorBar").style.bottom = (Math.min(s.max / vMax, 1.0) * cbHeight) + "px";
        document.getElementById("errorBar").style.height = (Math.min((s.max - s.min) / vMax, 1.0) * cbHeight) + "px";
        document.getElementById("cVal").style.height = ((Math.min(s.max / vMax, 1.0) - Math.min(s.avg / vMax, 1.0)) * cbHeight) + "px";
        document.getElementById("vals").innerHTML = output;
    }
    mouseMove(e) {


//    var ctx = this.cameraCrew.renderer.context;
//    var x = this.options['mouse']['xtmp'] = e.offsetX / this.canvas.clientWidth;
//    var y = this.options['mouse']['ytmp'] = 1.0 - e.offsetY / this.canvas.clientHeight;
//    var nvc = this.rayCaster.pixelToNormVoxelCoord(ctx, x, y);
//    var rvcF = this.rayCaster.volumeData.NormCoordToRealCoord(nvc.front);
//    var rvcB = this.rayCaster.volumeData.NormCoordToRealCoord(nvc.back);
//    var output = "[x" + rvcF.x + ":" + rvcB.x + ", ";
//    output += "y" + rvcF.y + ":" + rvcB.y + ", ";
//    output += "z" + rvcF.z + ":" + rvcB.z + "]";
//    document.getElementById("coords").innerHTML = output;
        return;
    }
    /**
     * onWindowResize
     * @this{App}
     * @returns {undefined}
     */
    onWindowResize() {
        console.log("onWindowResize");
        var w = this.canvas.clientWidth;
        var h = this.canvas.clientHeight;
        this.cameraCrew.renderer.setSize(w / this.rx, h / this.ry);
        this.rayCaster.resize(w / this.rx, h / this.ry);
        this.cameraCrew.setSize(w, h, this.rx, this.ry);
    }

    getParameters() {
        var qd = {};
        location.search.substr(1).split("&").forEach(function (item) {
            var k = item.split("=")[0], v = decodeURIComponent(item.split("=")[1]);
            (k in qd) ? qd[k].push(v) : qd[k] = [v];
        });
        console.log("returning qd", qd)
        return qd;
    }

}