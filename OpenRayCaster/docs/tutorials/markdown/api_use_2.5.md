
Options Object, surface
-----------------------

As seen in previous examples an options object is send to both the CameraCrew 
class and the RayCaster class on creation. The options object includes lots of
settings telling RayCaster and CameraCrew our preferences for how the data 
should be rendered. 



<canvas id="rayCanvas" style="height:300px; width:300px; background: grey" ></canvas>
       
   
1. **Default Options**


      
           'surface': {
               'Mode': 'SURF_NONE',
               'Color': {'r': 128, 'g': 128, 'b': 128},
               'Min': 0.101,
               'Max': 1.999,
               'Plasma Level': 0.5,
               'Depth Shade': 0.9
           }


<script src="../../../js/lib.js"  ></script>
<script src="../../../js/RayCaster.js"></script>
<script>
    var canvas_element = document.getElementById("rayCanvas");
    var renderer = new THREE.WebGLRenderer({canvas: canvas_element});
    var scene = new THREE.Scene();

    var options =  {
    'interpolation': {
        'XY': 'INTERPOLATION_NEAR',
        'Z': 'INTERPOLATION_NEAR',
        map: {}
    },
    'data': {
        'Type': '.png',
        'File': 'VIC Logo'
    },
    'display': {
        'Dampening': .1,
        'Rng_Offset': 0.0,
        'Composition': 0,
        'Camera': 'pCam',
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
    }
    };
    options.scene = scene;
 options.URLroot="../../../";
    options.renderer = renderer;

    var  cameraCrew = new CameraCrew(options, canvas_element);

    rayCaster = new RayCaster(options);
    cameraCrew.render=rayCaster.render.bind(rayCaster);
    cameraCrew.setupMouseEvents();
    scene.add(rayCaster.pixelVolume);
    rayCaster.loadDataFile('../../../data/logo2.4x8.png');       

    rayCaster.pixelVolume.scale.x = 1.2;
    rayCaster.pixelVolume.scale.y = 0.8;
    rayCaster.pixelVolume.scale.z = 0.25;
    rayCaster.render();
</script>
