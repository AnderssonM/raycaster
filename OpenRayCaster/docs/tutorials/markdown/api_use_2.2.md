Options Object, interpolation
-----------------------------

The iterpolation options object controls how data is interpolated when the shader
accesses the array data textures.

 XY Interpolation takes place in hardware and
does not have any major effect on performance. Z interpolation takes place in
the shader program

  
   
1. **Default Options**

    'interpolation': {
        'XY': 'INTERPOLATION_NEAR',
        'Z': 'INTERPOLATION_NEAR',
    },
    
<canvas id="rayCanvas" style="height:300px; width:300px; background: grey" ></canvas>
     
2. **Valid settings**
    
    The interpolation options can be set to either 'INTERPOLATION_NEAR' for
    nearest neighbor or 'INTERPOLATION_LINEAR' for linear interpolation.

<canvas id="rayCanvas2" style="height:300px; width:300px; background: grey" ></canvas>
     

3. **Performance Impact**

    The XY interpolation can use the builtin GPU HW interpolation and has minimal
    impact on performance. The Z interpolation however takes place in the 
    fragment shader program, and can potentially have a negative impact on performance.

    Any performance impact will depend on a number of factors, such as resolution
    (size of the canvas), size of the data volume to be rendered, and whether 
    any other performance impacting options have been enabled.

    This will only be of importance for mouse interaction, which can become 
    a bit sluggish, but will be of any meaning for one shot type of renders.


    ***Full code for this exercise.***

<script id="tutorialScript" class="visible">
    var init_options = {
	renderTarget:document.getElementById("rayCanvas")
    }
    var settings = {
	
	interpolation:{
	    XY:'INTERPOLATION_NEAR',
	    Z:'INTERPOLATION_NEAR',    
	},
	data:{
	    File:root+'/sampleData/logo2.4x8.png'
	}
	
    };

    var rayCaster = new OpenRayCaster(init_options);
    var  cameraCrew = new CameraCrew(rayCaster,30);
    cameraCrew.render=rayCaster.render.bind(rayCaster);
    cameraCrew.setupMouseEvents();
 
    rayCaster.pixelVolume.scale.x = 3;
    rayCaster.pixelVolume.scale.y = 3;
    rayCaster.pixelVolume.scale.z = 1;
    rayCaster.useSettings(settings);
    

    var init_options2 = {
	renderTarget:document.getElementById("rayCanvas2")
    }
    var settings2 = {
	
	interpolation:{
	    XY:'INTERPOLATION_LINEAR',
	    Z:'INTERPOLATION_LINEAR_SLOW',    
	},
	data:{
	    File:root+'/sampleData/logo2.4x8.png'
	}
	
    };
//    
    var rayCaster2 = new OpenRayCaster(init_options2);
    var cameraCrew2 = new CameraCrew(rayCaster2,30);
    cameraCrew2.render=rayCaster.render.bind(rayCaster2);
    cameraCrew2.setupMouseEvents();  
    rayCaster2.pixelVolume.scale.x = 3;
    rayCaster2.pixelVolume.scale.y = 3;
    rayCaster2.pixelVolume.scale.z = 1;
    rayCaster2.useSettings(settings2);	
    
</script>