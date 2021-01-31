
default_options = {
    'interpolation': {
        'XY': 'INTERPOLATION_LINEAR',
        'Z': 'INTERPOLATION_LINEAR',
        map: {}
    },
    'data': {
        'Type': '.png',
        'File': 'VIC Logo'
    },
    'display': {
        'Dampening': 0.1,
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
    },
    'URLroot': '/AdvancedRayCaster/'
};