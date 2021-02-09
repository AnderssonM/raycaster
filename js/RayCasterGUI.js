//dat.gui uses obsolete webkitRequestAnimationFrame
//Stop gap to quiet warnings.
webkitRequestAnimationFrame = requestAnimationFrame;
console.log("trying to include colormap");
//from("../OpenRayCaster/js").import("ColorMap.js");
//from("../lib.js").import("stats.min.js", "dat.gui.min.js");
import {Stats} from '../OpenRayCaster/lib.js/stats.min.js';
import {ColorMap,Colormaps} from '../OpenRayCaster/js/ColorMap.js';
import { dat } from '../lib.js/dat.gui.min.js';
export class RayCasterGUI {
    /**
     * RayCasterGUI,
     * A graphical user interface menu implemented in DAT.GUI
     * @author Martin Andersson, V.I.C, 2015. All rights reserved
     * @constructor
     * @this {Gui}
     */
    constructor(parentID, rayCaster, cameraCrew) {
//Parameters that can be modified.
        this.settings = rayCaster.settings;
        this.rayCaster = rayCaster;
        this.cameraCrew = cameraCrew;
        /** type{Stats} **/ this.stats = new Stats();
        this.menu = new dat.GUI({autoPlace: false});
        this.toolBox = document.getElementById(parentID);
        this.colorMap = new ColorMap();
        console.log("GUI Constructor", this.settings);
        this.toolBox.appendChild(this.colorMap.canvas);
        this.toolBox.appendChild(this.menu.domElement);
        this.addDataFolder();
        this.addColorSettingsFolder();
        this.addDisplaySettingsFolder();
        this.addInterpolationFolder();
        this.addSliceFolder();
        this.addSurfaceFolder();
        this.addBoxFilterFolder();
        this.addPerfTestFolder();
        this.addHelpFolder();
        this.cmRangeDivider = 255;
    }
    /**
     * addDataFolder, adds the data folder and its controls
     * @returns {undefined}
     */
    addDataFolder = function () {
        console.log("addDataFolder", this.settings)
        this.dataFolder = this.menu.addFolder('Load Data');
        this.dataSelect = this.dataFolder.add({'File': 'Dummy'}, 'File', []);


        var html = "<option>Select</option><optgroup label = 'PCL data as Volume' >";
        html += "<option value='./data/PCLHorse.pcl'>Horse.pcl</option>";
        html += "</optgroup>";
        html += "<optgroup label = 'PCL data direct' >";
        html += "<option value='./data/PCLHorse.pcl'>Horse.pcd</option>";
        html += "</optgroup>";
        html += "<optgroup label = 'VOL data' >";
        html += "<option value='./data/Frog.vol'>Frog</option>";
        html += "<option value='./data/Foot.vol'>Foot 1</option>";
        html += "<option value='./data/C60BuckyBall.vol'>C60BuckyBall</option>";
        html += "<option value='./OpenRayCaster/sampleData/Hydrogen.json'>Hydrogen</option>";    
        html += "<option value='./OpenRayCaster/sampleData/fuel_64x64x64_uint8.json'>fuel_64x64x64_uint8</option>";    
        html += "<option value='./OpenRayCaster/sampleData/mrt_angio_416x512x112_uint16.json'>mrt_angio_416x512x112_uint16</option>";    
        html += "<option value='./OpenRayCaster/sampleData/stag_beetle_832x832x494_uint16.json'>stag_beetle_832x832x494_uint16</option>";    
        
        html += "</optgroup>";
//        html += "<optgroup label = 'REC data' >";
//        html += "<option value='./data/hkl2.rec'>hkl2.rec</option>";
//        html += "<option value='./data/hkl5.rec'>hkl5.rec</option>";
//        html += "<option value='./data/hkl10.rec'>hkl10.rec</option>";
//        html += "</optgroup>";
        html += "<optgroup label = 'PNG data' >";
        html += "<option selected value='./data/logo2.4x8.png'>VIC Logo</option>";
        html += "<option value='./data/KEKlogo.1x8.png'>KEK Logo</option>";
        html += "<option value='./data/bonsai.16x16.png'>Bonsai</option>";
        html += "<option value='./data/foot.16x16.png'>Foot 2</option>";
        html += "<option value='./data/teapot.16x16.png'>Teapot</option>";
        html += "<option value='./data/hist-04.1x128.png'>Histogram 04</option>";
        html += "</optgroup>";

        html += "<optgroup label = 'JPEG Data' >";
        html += "<option value='./data/bonsai.1x128.jpeg' >Bonsai</option>";
        html += "</optgroup>";

        var webPStatus = this.canLoadWebP() ? "" : "disabled";
        html += "<optgroup " + webPStatus + " label = 'WEBP Lossless' >";
        html += "<option value='./data/bonsai.16x16.webp'>Bonsai</option>";
        html += "<option value='./data/hist-04_lossless.1x128.webp'>Histogram 04</option>";
        html += "</optgroup>";

        html += "<optgroup " + webPStatus + " label = 'WEBP Lossy' >";
        html += "<option value='./data/hist-04_lossy.1x128.webp' >Histogram 04</option>";
        html += "</optgroup>";

//        html += "<optgroup label = 'HST data' >";
//        html += "<option value='./data/hist-1.hst' >Histogram 01</option>";
//        html += "<option value='./data/hist-2.hst' >Histogram 02</option>";
//        html += "<option value='./data/hist-3.hst' >Histogram 03</option>";
//        html += "<option value='./data/hist-4.hst' >Histogram 04</option>";
//        html += "<option value='./data/hist-5.hst' >Histogram 05</option>";
//        html += "<option value='./data/hist-6.hst' >Histogram 06</option>";
//        html += "<option value='./data/hist-7.hst' >Histogram 07</option>";
//        html += "<option value='./data/hist-8.hst' >Histogram 08</option>";
//        html += "<option value='./data/hist-9.hst' >Histogram 09</option>";
//        html += "<option value='./data/hist-10.hst' >Histogram 10</option>";
//        html += "<option value='./data/hist-11.hst' >Histogram 11</option>";
//        html += "<option value='./data/hist-12.hst' >Histogram 12</option>";
//        html += "<option value='./data/hist-13.hst' >Histogram 13</option>";
//        html += "<option value='./data/hist-14.hst' >Histogram 14</option>";
//        html += "<option value='./data/hist-15.hst' >Histogram 15</option>";
//        html += "<option value='./data/hist-16.hst' >Histogram 16</option>";
//        html += "<option value='./data/hist-17.hst' >Histogram 17</option>";
//        html += "<option value='./data/hist-18.hst' >Histogram 18</option>";
//        html += "<option value='./data/hist-19.hst' >Histogram 19</option>";
//        html += "<option value='./data/hist-20.hst' >Histogram 20</option>";
//        html += "<option value='./data/hist-21.hst' >Histogram 21</option>";
//        html += "<option value='./data/hist-22.hst' >Histogram 22</option>";
//        html += "<option value='./data/hist-23.hst' >Histogram 23</option>";
//        html += "<option value='./data/hist-24.hst' >Histogram 24</option>";
//        html += "<option value='./data/hist-25.hst' >Histogram 25</option>";
//        html += "<option value='./data/hist-26.hst' >Histogram 26</option>";
//        html += "<option value='./data/hist-27.hst' >Histogram 27</option>";
//        html += "<option value='./data/hist-28.hst' >Histogram 28</option>";
//        html += "<option value='./data/hist-29.hst' >Histogram 29</option>";
//        html += "<option value='./data/hist-30.hst' >Histogram 30</option>";
//        html += "</optgroup>";

        // this.resampleButton = this.dataFolder.add(this, 'resampleData');

        this.dataSelect.__select.innerHTML = html;
        this.dataSelect.onChange(this.onDataSelected.bind(this));
        this.dataFolder.open();
        this.registerCloseHandler(this.dataFolder);
        // this.addDataInfo();
    }
    /**
     * resampleData, event handler for resample button
     * @returns {undefined}
     */
    resampleData = function () {
        console.log("Gui:onDataSelected", this.dataSelect.__select.value);

        this.dataFolder.__ul.firstChild.innerText = "Loading ....";
        this.dataFile = this.dataSelect.__select.value;
        this.rayCaster.volumeData.sampleRangeDivider = this.CMapMax.__input.value;
        this.rayCaster.loadDataFile(this.dataFile, this.onDataLoaded.bind(this));
    }
    /**
     * registerCloseHandler, registers close event handler for folder 
     * @param {Object} folder
     */
    registerCloseHandler = function (folder) {
        folder.__ul.firstChild.onclick = this.onFolderOpen.bind({instance: this, folder: folder});
    }

    /**
     * addDataInfo, adds the data info folder and its controls
     * @returns {undefined}
     */
    addDataInfo = function (dim, scale, size, min, max, avg) {

//    var li = document.createElement('li');
//    var html = "<table > <colgroup>";
//    html += '   <col span="1" style="width: 130px;">';
//    html += '   <col span="1" style="width: 90px; ">';
//    html += '</colgroup>';
//    html += '<tr><td style="text-align: right;">Dimension(x,y,z):</td><td>22,22,22</td></tr>';
//    html += '<tr><td style="text-align: right;">Size kb:</td><td>22222</td></tr>';
//    html += '<tr><td style="text-align: right;">Scale(x,y,z):</td><td>22,22,22</td></tr>';
//    html += '<tr><td style="text-align: right;">Min/Max/Avg:</td><td>22222</td></tr>';
//    html += "</table>";
//
//    this.infoElement.innerHTML = html;
//    this.infoElement.style.height = "130px ";
//    li.style.height = "150px";


    }

    /**
     * addDisplaySettingsFolder, adds the display setting folder and its controls
     * @returns {undefined}
     */
    addDisplaySettingsFolder = function () {
//    console.log("add display settings");
        this.displayFolder = this.menu.addFolder('Display Settings');
        var tmpOpt = {};
        tmpOpt['Max'] = "This is a bug";
        tmpOpt["Min"] = "This is a bug"; //Text type, forces dat gui to create an <input> element, text will be replaced by numbers 
        this.CMapMin = this.displayFolder.add(tmpOpt, 'Min');
        this.CMapMax = this.displayFolder.add(tmpOpt, 'Max');

        this.CMapMin.__input.value = 0;
        this.CMapMin.__input.type = "number";
        this.CMapMin.__input.min = 0;
        this.CMapMin.__input.max = 255;
        this.CMapMin.__input.step = 1;

        this.CMapMax.__input.value = 255;
        this.CMapMax.__input.type = "number";
        this.CMapMax.__input.min = this.CMapMin.value + 1;
        this.CMapMax.__input.step = 1;

        this.CMapMax.__input.onchange = this.onCMapMaxChange.bind(this);
        this.CMapMax.__input.onblur = this.onCMapMaxChange.bind(this);
        this.CMapMin.__input.onchange = this.onCMapMinChange.bind(this);
        this.CMapMin.__input.onblur = this.onCMapMinChange.bind(this);

        document.getElementById("MinLabel").innerHTML = this.CMapMin.__input.value;
        document.getElementById("MaxLabel").innerHTML = this.CMapMax.__input.value;
        //this.dampeningControl = this.displayFolder.add(this.settings['display'], 'Dampening', 0.0001, 5.00000).step(0.0001);
        this.composition = this.displayFolder.add(this.settings['display'],
                'Composition', {
                    'Sample Mean': 'COMPOSE_AVG',
                    'Sum': 'COMPOSE_SUM',
                    'Max Intensity': 'COMPOSE_MAX',
                    '(1 - Src) * Dst': 'COMPOSE_ONE',
                    'Gamma': 'COMPOSE_GMA'}
        );

        this.cameraSel = this.displayFolder.add(this.settings['display'],
                'Camera', {
                    'Perspective': 'pCam',
                    'Orthographic': 'oCam',
                    'Orthographic YZ': 'oCamX',
                    'Orthographic ZX': 'oCamY',
                    'Orthographic XY': 'oCamZ'
                }
        );
        var axisMarkers = this.displayFolder.add(this.settings['display'], 'Axis Markers');

//    this.cameraSel.onChange(window.selectCamera);
        //this.dampeningControl.onChange(this.uniformUpdate.bind(this));
        this.composition.onChange(this.shaderUpdate.bind(this));
        this.registerCloseHandler(this.displayFolder);
        axisMarkers.onChange(this.shaderUpdate.bind(this));
    }
    /**
     * addSliceFolder, adds the slice folder and its controls
     * @returns {undefined}
     */
    addSliceFolder = function () {
        this.sliceFolder = this.menu.addFolder('Slicing');
        this.sliceX1 = this.sliceFolder.add({'X start': 0}, 'X start', 0, 128);
        this.sliceX2 = this.sliceFolder.add({'X end': 128}, 'X end', 0, 128);
        this.sliceY1 = this.sliceFolder.add({'Y start': 0}, 'Y start', 0, 128);
        this.sliceY2 = this.sliceFolder.add({'Y end': 128}, 'Y end', 0, 128);
        this.sliceZ1 = this.sliceFolder.add({'Z start': 0}, 'Z start', 0, 128);
        this.sliceZ2 = this.sliceFolder.add({'Z end': 128}, 'Z end', 0, 128);

        this.sliceX1.onChange(this.onSetSliceX1.bind(this));
        this.sliceX2.onChange(this.onSetSliceX2.bind(this));
        this.sliceY1.onChange(this.onSetSliceY1.bind(this));
        this.sliceY2.onChange(this.onSetSliceY2.bind(this));
        this.sliceZ1.onChange(this.onSetSliceZ1.bind(this));
        this.sliceZ2.onChange(this.onSetSliceZ2.bind(this));
        this.registerCloseHandler(this.sliceFolder);

    }
    /**
     * addColorSettingsFolder, adds the color setting folder and its controls
     * @returns {undefined}
     */
    addColorSettingsFolder = function () {
        this.cmFolder = this.menu.addFolder('Color & Intensity');
        //var li = document.createElement("li");
        //li.appendChild(this.colorMap.canvas);

//    this.cmFolder.__ul.firstChild.appendChild(this.colorMap.canvas);
//    this.cmFolder.__ul.firstChild.style.height = "50px";
        var cmDiv = document.getElementById('ColorBar');
//    this.colorMap.canvas.style.height="600px";
        this.colorMap.canvas.addEventListener('DOMMouseScroll', this.onColormapZoom.bind(this), false); // for Firefox, fails silently on others
        this.colorMap.canvas.addEventListener('mousewheel', this.onColormapZoom.bind(this), false);
        cmDiv.appendChild(this.colorMap.canvas);

        this.colormapsel = this.cmFolder.add(this.settings['color'],
                'selected', {
                    'Gray Scale': 'Gray',
                    'Heatwave': 'Hot',
                    'Frozen': 'Cold',
                    'Froggy': 'Frog',
                    'StarryNight': 'StarryNight',
                    'IsoSurfer': 'IsoSurfer',
                    'Custom Map': 'Custom'
                }
        );
        this.controllerColor1 = this.cmFolder.addColor(Colormaps['Custom'][0], 'color').listen();
        this.controllerStepPos1 = this.cmFolder.add(Colormaps['Custom'][0], 'stop', 0.0, 1.0).step(0.001).listen();
        this.controllerColor2 = this.cmFolder.addColor(Colormaps['Custom'][1], 'color').listen();
        this.controllerStepPos2 = this.cmFolder.add(Colormaps['Custom'][1], 'stop', 0.0, 1.0).step(0.001).listen();
        this.controllerColor3 = this.cmFolder.addColor(Colormaps['Custom'][2], 'color').listen();
        this.controllerStepPos3 = this.cmFolder.add(Colormaps['Custom'][2], 'stop', 0.0, 1.0).step(0.001).listen();

        this.controllerColor1.onChange(this.onColorMapUpdate.bind(this));
        this.controllerStepPos1.onChange(this.onColorMapUpdate.bind(this));
        this.controllerColor2.onChange(this.onColorMapUpdate.bind(this));
        this.controllerStepPos2.onChange(this.onColorMapUpdate.bind(this));
        this.controllerColor3.onChange(this.onColorMapUpdate.bind(this));
        this.controllerStepPos3.onChange(this.onColorMapUpdate.bind(this));
        this.colormapsel.onChange(this.onColorMapUpdate.bind(this));

        var map = this.settings['color'].selected;
        this.toggleCMControls(map);
        this.colorMap.update(Colormaps[map]);
        this.registerCloseHandler(this.cmFolder);
    }
    /**
     * addHelpFolder, adds the help folder and its controls
     * @returns {undefined}
     */
    addHelpFolder = function () {
        this.helpFolder = this.menu.addFolder('Help & Docs');
        //var html = "< ol >";
        var li1 = document.createElement('li');
        var li2 = document.createElement('li');
//    var li3 = document.createElement('li');
        li1.innerHTML = '<a href = "assets/gettingStarted.html" target = "blank" > Getting Started </a>';
        li2.innerHTML = '<a href = "assets/readme.html" target = "blank" > User Manual </a>';
//    li3.innerHTML = '<a href = "assets/designdoc.html" target = "blank" > Design document </a>';
        //   html += " < /ol>";
        this.helpFolder.__ul.appendChild(li1);
        this.helpFolder.__ul.appendChild(li2);
//    this.helpFolder.__ul.appendChild(li3);
    }
    /**
     * addInterpolationFolder, adds the interpolation setting folder
     * @this{Gui}
     * @returns {undefined}
     **/
    addInterpolationFolder = function () {
        this.interpolationFolder = this.menu.addFolder('Interpolation');
        var interpolationXY = this.interpolationFolder.add(this.settings['interpolation'],
                'XY', {'Nearest': 'INTERPOLATION_NEAR', 'Linear': 'INTERPOLATION_LINEAR'}
        );

        var interpolationZ = this.interpolationFolder.add(this.settings['interpolation'],
                'Z', {'Nearest': 'INTERPOLATION_NEAR', 'Linear Slow': 'INTERPOLATION_LINEAR_SLOW', 'Linear Fast': 'INTERPOLATION_LINEAR_FAST'}
        );
        interpolationXY.onChange(this.interpolationXYudpate.bind(this));
        interpolationZ.onChange(this.shaderUpdate.bind(this));
        this.registerCloseHandler(this.interpolationFolder);
    }
    /**
     * addSurfaceFolder, adds the surface finding folder
     * @this{Gui}
     * @returns {undefined}
     **/
    addSurfaceFolder = function () {
        this.surfFindFolder = this.menu.addFolder('Surface Detect');

        var SurfMode = this.surfFindFolder.add(this.settings['surface'], 'Mode',
                {
                    'None': 'SURF_NONE',
                    'Src Mode': 'SURF_SRC',
                    'ISO Mode': 'SURF_ISO',
                    'Selected': 'SURF_MARK'
                }
        );
        var sfDummyOption = {};
        sfDummyOption['Min'] = 0;
        sfDummyOption['Max'] = 255;
        var surfMarkColor = this.surfFindFolder.addColor(this.settings['surface'], 'Color').listen();
        this.surfMinLimit = this.surfFindFolder.add(sfDummyOption, 'Min', 0, 255).step(1);
        this.surfMaxLimit = this.surfFindFolder.add(sfDummyOption, 'Max', 0, 255).step(1);
        var plasmaOpacity = this.surfFindFolder.add(this.settings['surface'], 'Plasma Level', 0.00, 1.000).step(0.001);
        var depthShade = this.surfFindFolder.add(this.settings['surface'], 'Depth Shade', 0.00, 2.000).step(0.001);

        this.surfMinLimit.onChange(this.onSurfMinChange.bind(this));
        this.surfMaxLimit.onChange(this.onSurfMaxChange.bind(this));
        surfMarkColor.onChange(this.uniformUpdate.bind(this));
        SurfMode.onChange(this.shaderUpdate.bind(this));
        plasmaOpacity.onChange(this.uniformUpdate.bind(this));
        depthShade.onChange(this.uniformUpdate.bind(this));
        this.registerCloseHandler(this.surfFindFolder);
    }
    /**
     * addBoxFilterFolder, adds the box filtering folder
     * @this{Gui}
     * @returns {undefined}
     **/
    addBoxFilterFolder = function () {
        this.FilterFolder = this.menu.addFolder('Filter');
        var BoxFilter = this.FilterFolder.add(this.settings['filter'],
                'Mode', {
                    'None': 'BOX_NONE',
                    'Filter-slow': 'BOX_FILTER',
                    'Mark-slow': 'BOX_MARK',
                    'Mark And Filter': 'BOX_BOTH'
                }
        );
        var bfDummyOption = {};
        bfDummyOption['Min'] = this.settings['filter']['Min'];
        this.boxFilterLimit = this.FilterFolder.add(bfDummyOption, 'Min', 0, 255).step(1);
        var boxMarkColor = this.FilterFolder.addColor(this.settings['filter'], 'Mark Color');
        var boxMixLevel1 = this.FilterFolder.add(this.settings['filter'], 'Mark Opacity', 0.00, 1.000).step(0.001);

        this.boxFilterLimit.onChange(this.onBoxMinChange.bind(this));
        boxMixLevel1.onChange(this.uniformUpdate.bind(this));
        boxMarkColor.onChange(this.uniformUpdate.bind(this));
        BoxFilter.onChange(this.shaderUpdate.bind(this));
        this.registerCloseHandler(this.FilterFolder);
    }
    /**
     * addPerfTestFolder, adds the test and performance folder
     * @this{Gui}
     * @returns {undefined}
     **/
    addPerfTestFolder = function () {
        var enhancementFolder = this.menu.addFolder('Performance  & Test ');
        enhancementFolder.__ul.firstChild.appendChild(this.stats.domElement);
        enhancementFolder.__ul.firstChild.style.height = "90px";
        var breakDST = enhancementFolder.add(this.settings['enhancement'], 'BreakOnDST');
        var breakMAXDST = enhancementFolder.add(this.settings['enhancement'], 'BreakOnMAXDST');
        var adaptiveSampling = enhancementFolder.add(this.settings['enhancement'], 'AdaptiveSampling');
        this.depthSampleControl = enhancementFolder.add(this.settings['enhancement'], 'DepthSamples', 0.0, 512.0);

        this.mixing = enhancementFolder.add(this.settings['enhancement'], 'Mixing', {'Early (Src)': 'MIX_EARLY', 'Late (Dst)': 'MIX_LATE'});
        this.mixing.onChange(this.shaderUpdate.bind(this));
        breakDST.onChange(this.shaderUpdate.bind(this));
        breakMAXDST.onChange(this.shaderUpdate.bind(this));
        adaptiveSampling.onChange(this.shaderUpdate.bind(this));
        this.depthSampleControl.onChange(this.shaderUpdate.bind(this));
    }
    /**
     * uniformUpdate, requests a rayCaster uniform update 
     * @returns {undefined}
     */
    uniformUpdate = function () {
        requestAnimationFrame(this.rayCaster.updateUniforms.bind(this.rayCaster));
    }
    /**
     * shaderUpdate, requests a rayCaster shader update (compile)
     * @returns {undefined}
     */
    shaderUpdate = function () {
        requestAnimationFrame(this.rayCaster.updateShader.bind(this.rayCaster));
        this.updateSideViews();
    }
    /**
     * interpolationXYudpate, requests update of the texture interpolation setting.
     * @returns {undefined}
     */
    interpolationXYudpate = function (value) {
        this.rayCaster.updateInterpolation(value);
        this.updateSideViews();
    }

    /**
     * onColormapZoom, event handler for color map range change
     * @returns {undefined}
     */
    onColormapZoom = function (e) {
        var wDelta = e.wheelDelta < 0 ? 0.9 : 1.1;
        this.CMapMax.__input.value = Math.round(this.CMapMax.__input.value * wDelta);
        this.onCMapMaxChange();
    }
    /**
     * onCMapMinChange, event handler for color map range change
     * @returns {undefined}
     */
    onCMapMinChange = function () {

        this.CMapMax.__input.min = parseFloat(this.CMapMin.__input.value) + 1;
        if (parseFloat(this.CMapMin.__input.value) >= parseFloat(this.CMapMax.__input.value)) {
            this.CMapMin.__input.value = parseFloat(this.CMapMax.__input.value) - 1;
        }
        this.settings['display']['Dampening'] = (parseFloat(this.CMapMax.__input.value) - parseFloat(this.CMapMin.__input.value)) / this.cmRangeDivider;
        this.settings['display']['Rng_Offset'] = parseFloat(this.CMapMin.__input.value) / this.cmRangeDivider;
        document.getElementById("MinLabel").innerHTML = this.CMapMin.__input.value;
        console.log("CMapMinChange", this.CMapMin.__input.value, this.settings['display']['Dampening']);
        this.uniformUpdate();
        this.updateSideViews();

    }
    /**
     * onCMapMaxChange, event handler for color map range change
     * @returns {undefined}
     */
    onCMapMaxChange = function () {

        this.CMapMin.__input.max = parseInt(this.CMapMax.__input.value) - 1;
        if (parseInt(this.CMapMax.__input.value) <= parseInt(this.CMapMin.__input.value)) {
            this.CMapMax.__input.value = parseInt(this.CMapMin.__input.value) + 1;
        }
        this.settings['display']['Dampening'] = (parseInt(this.CMapMax.__input.value) - parseInt(this.CMapMin.__input.value)) / this.cmRangeDivider;
        this.settings['display']['Rng_Offset'] = parseInt(this.CMapMin.__input.value) / this.cmRangeDivider;
        document.getElementById("MaxLabel").innerHTML = this.CMapMax.__input.value;
        console.log("CMapMaxChange", this.CMapMax.__input.value, this.settings['display']['Dampening']);
        this.uniformUpdate();
        this.updateSideViews();

    }

    /**
     * onDataSelected, event handler for data selection events
     * @param {String} value
     * @returns {undefined}
     */
    onDataSelected = function (value) {
        console.log("Gui:onDataSelected", value);
        this.dataFolder.__ul.firstChild.innerText = "Loading ....";
        this.dataFile = value;
        this.rayCaster.loadDataFile(value, this.onDataLoaded.bind(this));
        document.body.style.cursor = "wait";
    }
    /**
     * onDataLoaded, callback for successfully loaded data
     * @returns {undefined}
     */
    onDataLoaded = function () {
        console.log("GUI:onDataLoaded");
        document.body.style.cursor = "";
        this.CMapMin.__input.value = 0;
        this.CMapMin.__input.max = this.rayCaster.volumeData.maxVal - 1.0;
        this.CMapMin.__input.step = 1.0;
//this.CMapMax.__input.value = Math.floor( this.rayCaster.volumeData.maxVal) ;
        this.CMapMax.__input.value = Math.floor(Math.min(this.rayCaster.volumeData.avgVal * 5, this.rayCaster.volumeData.maxVal / 2));
        this.CMapMax.__input.min = this.CMapMin.value + 1.0;
        this.CMapMax.__input.step = 1.0;
        this.cmRangeDivider = this.rayCaster.volumeData.maxVal;
        this.onCMapMaxChange();

        this.boxFilterLimit.max(this.rayCaster.volumeData.maxVal);
        this.boxFilterLimit.step(1);
        this.boxFilterLimit.setValue(0);

        this.surfMaxLimit.max(this.rayCaster.volumeData.maxVal);
        this.surfMinLimit.max(this.rayCaster.volumeData.maxVal);

        this.surfMinLimit.setValue(this.rayCaster.volumeData.avgVal);
        this.surfMaxLimit.setValue(this.rayCaster.volumeData.maxVal);

        this.sliceX1.max(this.rayCaster.volumeData.width);
        this.sliceX2.max(this.rayCaster.volumeData.width);
        this.sliceX2.setValue(this.rayCaster.volumeData.width);
        this.sliceX1.setValue(0);

        this.sliceY1.max(this.rayCaster.volumeData.height);
        this.sliceY2.max(this.rayCaster.volumeData.height);
        this.sliceY2.setValue(this.rayCaster.volumeData.height);
        this.sliceY1.setValue(0);

        this.sliceZ1.max(this.rayCaster.volumeData.depth);
        this.sliceZ2.max(this.rayCaster.volumeData.depth);
        this.sliceZ2.setValue(this.rayCaster.volumeData.depth);
        this.sliceZ1.setValue(0);

        this.boxFilterLimit.setValue(0);
        this.dataFolder.__ul.firstChild.innerText = "Load Data";
        var htext = document.getElementById("header");
        htext.innerText = this.dataFile;
        htext.innerText += " [w:" + this.rayCaster.volumeData.width;
        htext.innerText += ", h:" + this.rayCaster.volumeData.height;
        htext.innerText += ", d:" + this.rayCaster.volumeData.depth + "]";

        htext.innerText += " [min:" + this.rayCaster.volumeData.minVal;
        htext.innerText += ", max:" + this.rayCaster.volumeData.maxVal;
        htext.innerText += ", avg:" + Math.round(this.rayCaster.volumeData.avgVal * 100) / 100;
        htext.innerText += ", total:" + this.rayCaster.volumeData.sumVal + "]";

        var d2 = Math.pow(this.rayCaster.volumeData.depth, 2);
        var w2 = Math.pow(this.rayCaster.volumeData.width, 2);
        var h2 = Math.pow(this.rayCaster.volumeData.height, 2);

        var depthSamples = Math.sqrt(d2 + w2 + h2);
        this.settings['enhancement']['DepthSamples'] = Math.ceil(depthSamples);
        this.depthSampleControl.updateDisplay();
        this.updateSideViews();
    }
    /**
     * onBoxMinChange, event handler BoxFilter limit change
     * @param {Number} value
     * @returns {undefined}
     */
    onBoxMinChange = function (value) {
        console.log("Gui:onBoxMinChange", value / this.rayCaster.volumeData.maxVal);
        this.settings['filter']['Min'] = value / this.rayCaster.volumeData.maxVal;
        this.uniformUpdate();
        this.updateSideViews();
    }

    /**
     * onSurfMaxChange, event handler BoxFilter limit change
     * @param {Number} value
     * @returns {undefined}
     */
    onSurfMaxChange = function (value) {
        console.log("Gui:onSurfMaxChange", value / this.rayCaster.volumeData.maxVal);
        this.settings['surface']['Max'] = value / this.rayCaster.volumeData.maxVal;
        this.uniformUpdate();
        this.updateSideViews();
    }
    /**
     * onSurfMinChange, event handler BoxFilter limit change
     * @param {Number} value
     * @returns {undefined}
     */
    onSurfMinChange = function (value) {
        console.log("Gui:onSurfMinChange", value / this.rayCaster.volumeData.maxVal);
        this.settings['surface']['Min'] = value / this.rayCaster.volumeData.maxVal;
        this.uniformUpdate();
        this.updateSideViews();
    }
    /**
     * onSetSliceX1, event handler for X axis slice change events
     * @param {Number} value
     * @returns {undefined}
     */
    onSetSliceX1 = function (value) {
        console.log("Gui:onSetSliceX1", value);
        this.rayCaster.setSliceX(this.sliceX1.getValue(), this.sliceX2.getValue());
        this.updateSideViews();
    }
    /**
     * onSetSliceX2, event handler for X axis slice change events
     * @param {Number} value
     * @returns {undefined}
     */
    onSetSliceX2 = function (value) {
        console.log("Gui:onSetSliceX2", value);
        this.rayCaster.setSliceX(this.sliceX1.getValue(), this.sliceX2.getValue());
        this.updateSideViews();
    }
    /**
     * onSetSliceY1, event handler for Y axis slice change events
     * @param {Number} value
     * @returns {undefined}
     */
    onSetSliceY1 = function (value) {
        console.log("Gui:onSetSliceY1", value);
        this.rayCaster.setSliceY(this.sliceY1.getValue(), this.sliceY2.getValue());
        this.updateSideViews();
    }
    /**
     * onSetSliceY2, event handler for Y axis slice change events
     * @param {Number} value
     * @returns {undefined}
     */
    onSetSliceY2 = function (value) {
        console.log("Gui:onSetSliceY2", value);
        this.rayCaster.setSliceY(this.sliceY1.getValue(), this.sliceY2.getValue());
        this.updateSideViews();
    }
    /**
     * onSetSliceZ1, event handler for Z axis slice change events
     * @param {Number} value
     * @returns {undefined}
     */
    onSetSliceZ1 = function (value) {
        console.log("Gui:onSetSliceZ1", value);
        this.rayCaster.setSliceZ(this.sliceZ1.getValue(), this.sliceZ2.getValue());
        this.updateSideViews();
    }
    /**
     * onSetSliceZ2, event handler for Z axis slice change events
     * @param {Number} value
     * @returns {undefined}
     */
    onSetSliceZ2 = function (value) {
        console.log("Gui:onSetSliceZ2", value);
        this.rayCaster.setSliceZ(this.sliceZ1.getValue(), this.sliceZ2.getValue());
        this.updateSideViews();
    }
    /**
     * onColorMapUpdate, event handler for colormap change events
     * @returns {undefined}
     */
    onColorMapUpdate = function ()
    {
        console.log("Gui:onColorMapUpdate:" + this.settings['color'].selected);
        var map = this.settings['color'].selected;
        this.toggleCMControls(map);
        this.colorMap.update(Colormaps[map]);
        this.rayCaster.updateColorMap(map);
        this.updateSideViews();
    }
    /**
     * toggleCMControls, toggles custom color map controls
     * @param {string} map
     * @returns {undefined}
     */
    toggleCMControls = function (map) {
        var disp = map === 'Custom' ? 'list-item' : 'none';
        if (map !== 'Custom') {
            this.cmFolder.close();
        }
        this.controllerColor1.domElement.parentNode.parentNode.style.display = disp;
        this.controllerStepPos1.domElement.parentNode.parentNode.style.display = disp;
        this.controllerColor2.domElement.parentNode.parentNode.style.display = disp;
        this.controllerStepPos2.domElement.parentNode.parentNode.style.display = disp;
        this.controllerColor3.domElement.parentNode.parentNode.style.display = disp;
        this.controllerStepPos3.domElement.parentNode.parentNode.style.display = disp;
    }
    /**
     * onFolderOpen, event handler for folder open events
     * @this {Object}
     * @returns {undefined}
     */
    onFolderOpen = function () {
        // Last value
        var closed = this.folder.closed;
        // Close all
        this.instance.dataFolder.close();
        this.instance.cmFolder.close();
        this.instance.displayFolder.close();
        this.instance.sliceFolder.close();
        this.instance.interpolationFolder.close();
        this.instance.surfFindFolder.close();
        this.instance.FilterFolder.close();
        // Toggle active
        if (closed) {
            this.folder.close();
        } else {
            this.folder.open();
        }
    }

    /**
     * canLoadWebP, tests if browser webp capability is available
     * @returns {Boolean}
     */
    canLoadWebP = function () {

        var testImage = new Image;
        testImage.src = "data:image/webp,RIFF*%00%00%00WEBPVP8%20%1E%00%00%00%10%02%00%9D%01*%04%00%04%00%0B%C7%08%85%85%88%85%84%88%3F%82%00%0C%0D%60%00%FE%E6%B5%00";
        return (4 === testImage.height && 4 === testImage.width);

    }

    updateSideViews = function () {
//    console.log("renderSideViews");
//    var cvs1 = document.getElementById("viewXY");
//    var cvs2 = document.getElementById("viewZX");
//    var cvs3 = document.getElementById("viewYZ");
//
//    var c1 = this.cameraCrew.cameras['oCamZ'];
//    var c2 = this.cameraCrew.cameras['oCamY'];
//    var c3 = this.cameraCrew.cameras['oCamX'];
//    console.log("----FROM HERE ----");
//    this.rayCaster.renderToCanvas(cvs1, c1);
//    this.rayCaster.renderToCanvas(cvs2, c2);
//    this.rayCaster.renderToCanvas(cvs3, c3);
//    console.log("----TO HERE ----");
    }

}