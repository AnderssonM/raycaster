
/**
 * TestHarness  This class is generally intended to be used with the provided 
 * testHarness_*.html pages to provide test suites. More specifically it depends
 * on the test page to have a table element with the id "testResults"
 * 
 * @author Martin Andersson, V.I.C, 2015. All rights reserved
 * @constructor
 * 
 */
function TestHarness() {
    this.testResultTable = document.getElementById("testResults");

    this.rows = 0;
    this.runningTest = 0;
    this.tests = {
        11: "Basic image load",
//        12: "Volume Geometry Scaling ",
//        13: "Volume Geometry Rotation",
//        14: "Mouse Events",
//        "21a": "Color Map -scaling (dampening)",
//        "21b": "Color Map -scaling (rng_offset)",
//        "21c": "COMPOSE_MAX composition mode",
//        "21d": "Select Camera Mode (fails, undetected)",
//        "22a": "Mix Early",
//        "22b": "Low Depth Samples",
//        "23a": "Surface Mode SURF_SRC",
//        "23b": "Surface Mode SURF_ISO, plasma=0",
//        "23c": "Surface Mode SURF_MARK, color=redish",
//        "23d": "Surface Mode SURF_NONE, for comparisson"
    };
//    console = {};
//
//    console.log = function () {
//    };
//    console.error = function () {
//    };
//    console.warn = function () {
//    };
//    console.info = function () {
//    };
    this.runAllTests();
}
/**
 * Run all test suites 
 * @returns {undefined}
 */
TestHarness.prototype.runAllTests = function () {

    for (var t in this.tests) {
        console.log("t");
        var title = this.tests[t];
        window.setTimeout(this.runTest.bind(this), 0, t, title);

    }
};
/**
 * Run a specific test
 * @returns {undefined}
 */
TestHarness.prototype.runTest = function (no, title) {
    var testName = "test" + no;

//    console.log = function () {
//        var args = Array.prototype.slice.call(arguments, 0);
//        text_area.value += args.join(" ") + "D\n"
//    };
//    var canvas_element = document.getElementById(testName);
//    var text_area = document.getElementById(testName + "log");
    var text_area = document.createElement("textarea");
    var canvas_element = document.createElement("canvas");
    var func_div = document.createElement("textarea");
    var testTitle = document.createElement("h3");
    testTitle.innerHTML = title;
    var titleRow = this.testResultTable.insertRow(this.rows * 2);
    titleRow.insertCell().appendChild(testTitle);
    var testrow = this.testResultTable.insertRow(this.rows * 2 + 1);
    testrow.insertCell().appendChild(func_div);

    testrow.insertCell().appendChild(canvas_element);
    testrow.insertCell().appendChild(text_area);


    this.rows++;

//    console.log = function () {
//        var args = Array.prototype.slice.call(arguments, 0);
//        if (typeof (args[0]) == "object") {
//            var a2 = Array.prototype.slice.call(args[0], 0);
//            text_area.value += a2.join(" ") + "a2\n"
//        }
//        else {
//            text_area.value += args.join(" ") + "L\n"
//        }
//
//    };
//    console.warn = console.log;
//    console.error = console.log;

    var html_pre = "***Running Test:" + testName + "***\n";

    html_pre += this[testName];

    func_div.innerHTML = html_pre;

    rayCaster = new OpenRayCaster({renderTarget:canvas_element});
    var cameraCrew = new CameraCrew(rayCaster);
    
    window.setTimeout(this[testName].bind(this), 0, rayCaster, cameraCrew, rayCaster.settings);
//    this.runNextTest();
};

TestHarness.prototype.test11 = function (rayCaster, cameraCrew, options) {


    rayCaster.loadDataFile(root+'/sampleData/logo2.4x8.png');
    rayCaster.render();
};
TestHarness.prototype.test12 = function (rayCaster, cameraCrew, options) {

    rayCaster.loadDataFile('data/logo2.4x8.png');
    rayCaster.pixelVolume.scale.x = 1.2;
    rayCaster.pixelVolume.scale.y = 0.8;
    rayCaster.pixelVolume.scale.z = 0.25;
    rayCaster.render();
};
TestHarness.prototype.test13 = function (rayCaster, cameraCrew, options) {

    rayCaster.loadDataFile('data/logo2.4x8.png');
    rayCaster.pixelVolume.scale.x = 1.2;
    rayCaster.pixelVolume.scale.y = 0.8;
    rayCaster.pixelVolume.scale.z = 0.25;
    rayCaster.pixelVolume.rotation.x = 1.2;
    rayCaster.pixelVolume.rotation.y = 0.8;
    rayCaster.render();
};
TestHarness.prototype.test14 = function (rayCaster, cameraCrew, options) {

    cameraCrew.setupMouseEvents();

    rayCaster.loadDataFile('data/logo2.4x8.png');

    rayCaster.pixelVolume.scale.x = 1.2;
    rayCaster.pixelVolume.scale.y = 0.8;
    rayCaster.pixelVolume.scale.z = 0.25;
    rayCaster.render();
};

TestHarness.prototype.test21a = function (rayCaster, cameraCrew, options) {

    options.display.Dampening = 0.35;
    rayCaster.loadDataFile('data/logo2.4x8.png');

    rayCaster.pixelVolume.scale.x = 1.2;
    rayCaster.pixelVolume.scale.y = 0.8;
    rayCaster.pixelVolume.scale.z = 0.25;
    rayCaster.render();
};
TestHarness.prototype.test21b = function (rayCaster, cameraCrew, options) {

    options.display.Rng_Offset = 0.2;
    rayCaster.loadDataFile('data/logo2.4x8.png');
    rayCaster.pixelVolume.scale.x = 1.2;
    rayCaster.pixelVolume.scale.y = 0.8;
    rayCaster.pixelVolume.scale.z = 0.25;
    rayCaster.render();
};
TestHarness.prototype.test21c = function (rayCaster, cameraCrew, options) {

    options.display.Composition = "COMPOSE_MAX";
    rayCaster.loadDataFile('data/logo2.4x8.png');
    rayCaster.pixelVolume.scale.x = 1.2;
    rayCaster.pixelVolume.scale.y = 0.8;
    rayCaster.pixelVolume.scale.z = 0.25;
    rayCaster.render();
};
TestHarness.prototype.test21d = function (rayCaster, cameraCrew, options) {

    options.display.Camera = "oCamY";
    rayCaster.loadDataFile('data/logo2.4x8.png');
    rayCaster.pixelVolume.scale.x = 1.2;
    rayCaster.pixelVolume.scale.y = 0.8;
    rayCaster.pixelVolume.scale.z = 0.25;
    rayCaster.render();
};

TestHarness.prototype.test22a = function (rayCaster, cameraCrew, options) {

    options.enhancement.Mixing = 'MIX_EARLY';
    rayCaster.loadDataFile('data/logo2.4x8.png');
    rayCaster.pixelVolume.scale.x = 1.2;
    rayCaster.pixelVolume.scale.y = 0.8;
    rayCaster.pixelVolume.scale.z = 0.25;
    rayCaster.updateShader(options);
    rayCaster.render();
};
TestHarness.prototype.test22b = function (rayCaster, cameraCrew, options) {
    console.log("!!!!!!!!!!!!!!!!!!!!!!options", options);
    options.enhancement.DepthSamples = 4.0;
    rayCaster.loadDataFile('data/logo2.4x8.png');
    rayCaster.pixelVolume.scale.x = 1.2;
    rayCaster.pixelVolume.scale.y = 0.8;
    rayCaster.pixelVolume.scale.z = 0.25;
    rayCaster.pixelVolume.rotation.x = 0.2;
    rayCaster.pixelVolume.rotation.y = 0.8;
    rayCaster.updateShader(options);
    rayCaster.render();
};


TestHarness.prototype.test23a = function (rayCaster, cameraCrew, options) {

    options.surface.Mode = 'SURF_SRC';
    options.surface.Min = 0.2;
    options.surface.Max = 2;
    options.surface.DepthShade = 2;
    rayCaster.loadDataFile('data/logo2.4x8.png');

    rayCaster.pixelVolume.scale.x = 2;
    rayCaster.pixelVolume.scale.y = 2;
    rayCaster.pixelVolume.scale.z = 0.25;
    rayCaster.updateShader(options);
    rayCaster.render();
};
TestHarness.prototype.test23b = function (rayCaster, cameraCrew, options) {

    options.surface.Mode = 'SURF_ISO';
    options.surface.Min = 0.2;
    options.surface.Max = 2;
    options.surface.DepthShade = 2;
    options.surface["Plasma Level"] = 0;

    rayCaster.loadDataFile('data/logo2.4x8.png');

    rayCaster.pixelVolume.scale.x = 2;
    rayCaster.pixelVolume.scale.y = 2;
    rayCaster.pixelVolume.scale.z = 0.25;
    options.surface["Plasma Level"] = 0;
    rayCaster.updateShader(options);
    rayCaster.render();
};
TestHarness.prototype.test23c = function (rayCaster, cameraCrew, options) {

    options.surface.Mode = 'SURF_MARK';
    options.surface.Color = {r: 233, g: 32, b: 32};
    options.surface.Min = 0.2;
    options.surface.Max = 2;
    options.surface.DepthShade = 2;
    options.surface["Plasma Level"] = 0;

    rayCaster.loadDataFile('data/logo2.4x8.png');

    rayCaster.pixelVolume.scale.x = 2;
    rayCaster.pixelVolume.scale.y = 2;
    rayCaster.pixelVolume.scale.z = 0.25;
    rayCaster.updateShader(options);
    rayCaster.render();
};
TestHarness.prototype.test23d = function (rayCaster, cameraCrew, options) {

    options.surface.Mode = 'SURF_NONE';
    options.surface.Min = 0.141;
    options.surface.Max = 2;
    options.surface["Plasma Level"] = 0;

    rayCaster.loadDataFile('data/logo2.4x8.png');
    rayCaster.pixelVolume.scale.x = 2;
    rayCaster.pixelVolume.scale.y = 2;
    rayCaster.pixelVolume.scale.z = 0.25;
    ;
    rayCaster.updateShader(options);
    rayCaster.render();
};

window['TestHarness'] = TestHarness;