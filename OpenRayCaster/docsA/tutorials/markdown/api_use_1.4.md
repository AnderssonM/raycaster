RayCaster API usage
===================

Mouse interaction
-----------------


A small guide to exploring the options using the provided sample data.

1. **Mouse interaction**

    To setup mouse interaction, we need to tie the render-loop of
    the CameraCrew Instance to the rayCaster render function.
    We also need to tell the camera crew to start listening to mouse 
    events.

    This is achieved as shown here.
    
        <script>
            cameraCrew.render=rayCaster.render.bind(rayCaster);
            cameraCrew.setupMouseEvents();
        </script>
        
    Which gives us this result. 
    
    <canvas id="rayCanvas" style="height:300px; width:300px; background: grey" ></canvas>
    
    (Try rotating model by click and drag, or zoom by scroll wheel)
   
    ***Full code for this exercise.***

        <!DOCTYPE html> 
        <html> 
        <body> 
            <script src="js/lib.js" >  </script>
            <script src="js/RayCaster.js" >  </script>

            <canvas id="rayCanvas" style="height:300px; width:300px; background: grey" > </canvas>

            <script>
                var canvas_element = document.getElementById("rayCanvas");
                var renderer = new THREE.WebGLRenderer({canvas: canvas_element});
                var scene = new THREE.Scene();

                var options = default_options;
                options.scene = scene;
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
        </body> 
        </html> 

<p style="text-align:center">
<a href="./api_use_1.3.html"><Prev</a>
</p>

<script src="../../../js/lib.js"  ></script>
<script src="../../../js/RayCaster.js"></script>
<script>
    var canvas_element = document.getElementById("rayCanvas");
    var renderer = new THREE.WebGLRenderer({canvas: canvas_element});
    var scene = new THREE.Scene();

    var options = default_options;
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