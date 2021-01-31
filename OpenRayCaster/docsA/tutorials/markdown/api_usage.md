-API usage manual-   (OBSOLETE, needs update!)
----------------

First we need to do a bit of THREE.js setup to create a Scene, Camera and Renderer

    var renderer = new THREE.WebGLRenderer({canvas: canvas_dom_element});
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.01, 3000.0); 
    camera.position.z = 2.0;


Then we need to set the rendering options that will be used for volume rendering.
This should be cleaned up to remove experimental settings.

    volume_options = {
        display: {                      // * Display parameters *
            Intensity: 1.0,             // Signal Intensity Amplification
            Composition: 0,             // Composition type  [COMPOSE_AVG | COMPOSE_MAX | COMPOSE_ONE | COMPOSE_GMA ]
            'Axis Markers': true        // Display Axis Markers [true | false]
        },
        interpolation: {                // * Interpolation parameters *
            XY: 'INTERPOLATION_NEAR',   // Interpolation in XY direction [ INTERPOLATION_NEAR || INTERPOLATION_LINEAR ]
            Z: 'INTERPOLATION_NEAR'     // Interpolation in Z direction  [ INTERPOLATION_NEAR || INTERPOLATION_LINEAR ]
        },
        enhancement: {                  // * Test and performance *
            Mixing: 'MIX_LATE',         // Fragment Color calculated continously, or at end of ray [ MIX_EARLY || MIX_LATE ]      
            BreakOnMAXDST: false,       // Break when Dst is greater than 0.999
            AdaptiveSampling: false,    // Try to adapt sampling rate to ray length.
            DepthSamples: 256.0         // Number of depth samples ( screen depth axis, ie. through rotated volume)
                                        // 1.73 * longest side of volume, guarantess full sample coverage. 
                                        // But results are surprisingly good with much lower values, especially if XYZ  interpolation are all linear.
        },
        surface: {                      // * Surface finding parameters *
            Mode: 'SURF_NONE',          // Surface mode [ SURF_NONE || SURF_SRC || SURF_ISO || SURF_SELECT ] 
                                        // SURF_NONE, no surface detection, ignore rest of parameters
                                        // SURF_SRC, The first encountered Src value between Min and Max, will be used as the fragment sample value
                                        // SURF_ISO, When an Src value between Min and Max is encountered, Min will be used as the fragment sample value
                                        // SURF_SELECT,  When an Src value between Min and Max is encountered, Color will be used as the fragment color
                                                
            Color: {r: 128, g: 128, b: 128},    // Surface fragment color used by the SURF_SELECT mode
            Min: 0.01,                 // Min value, the value where surface countour starts
            Max: 1.00,                 // Max value, the value where surface countour stops
            'Plasma Level': 0.5,       // Visibility of 'plasma' (non surface). A mix level between solid (surface) and plasma (non surface) 
            'Depth Shade': 0.9         // Depth Shading, Fake 3D lighting effect by adjusting the brightness of the fragment according to depth 
                                       // (Since we are working with a single fragment here, there is no surface normal to use for a real reflection/shading calculation)
        },
        filter: {                               // * Box-sum Filtering paramters *
            Mode: 'BOX_NONE',                   // Filter Mode [ BOX_NONE || BOX_FILTER || BOX_MARK || BOX_BOTH ] 
            Min: 0.184,                         // Min level, filter out values with a box-sum less than Min or a value less than Min*2.0
            'Mark Color': {r: 0.1, g: 0.1, b: 0.1}, // Color used for marking in BOX_MARK and BOX_BOTH modes
            'Mark Opacity': 1.0                     // Opacity of marks in BOX_MARK and BOX_BOTH modes
        },
        slice: {                        // * Slice paramters *
            'X start': 0.0,             // X-Axis slice start in normalized 0-1 coordinates            
            'X depth': 1.0,             // X-Axis slice depth in normalized 0-1 coordinates 
            'Y start': 0.0,             // Y-Axis slice start in normalized 0-1 coordinates           
            'Y depth': 1.0,             // Y-Axis slice depth in normalized 0-1 coordinates 
            'Z start': 0.0,             // Z-Axis slice start in normalized 0-1 coordinates           
            'Z depth': 1.0              // Z-Axis slice depth in normalized 0-1 coordinates 
        },
        color: {                        // * Color map setting *
            map: Colormaps.Cold         // Predefined or custom color map, [ Colormaps.Cold || ColorMaps.Hot || Colormaps.Gray]  see ColorMap.js for more defined maps.
        },
        scene: scene,                   // The THREE.JS Scene 
        renderer: renderer,             // The THREE.JS Active Renderer
        camera: camera                  // The THREE.JS Active Camera instance
    };

Then we create a new Instance of the RayVolume, using our  rendering options and
add the volume to the scene.

    rayVolume = new RayVolume(volume_options);
    scene.add(rayVolume.pixelVolume);

Next we load a data file, and render.

    rayVolume.loadDataFile('../../../data/logo2.4x8.png');
    rayVolume.render();


Then we can adjust the scale, and render again.

    rayVolume.volumeData.scalex = 1.2;
    rayVolume.volumeData.scaley = 0.8;
    rayVolume.volumeData.scalez = 0.25;
    rayVolume.render();

See the page [api use](../api_use.html) for an example