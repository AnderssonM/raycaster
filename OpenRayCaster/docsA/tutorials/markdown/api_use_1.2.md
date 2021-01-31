RayCaster API usage
===================

Geometry Scaling
----------------


A small guide to exploring the options using the provided sample data.

1. **Auto scaling**

    If the loaded data format, such as vol-data and rec-data, includes
    scaling information, the volume geometry will be scaled accordingly.
    
2. **Manual Scaling**

    Once we have a canvas we include the supporting libraries from the 'lib.js' file, 
    which is a bundle of THREE.js and some other external libraries that we will need.   
    Next we need to do a bit of THREE.js setup to create a Scene, and a WebGLRenderer.

        <script>
            rayCaster.pixelVolume.scale.x = 1.2;
            rayCaster.pixelVolume.scale.y = 0.8;
            rayCaster.pixelVolume.scale.z = 0.25;
            rayCaster.render();
        </script>
        
    Which gives us this result. 
    
    <canvas id="rayCanvas" style="height:300px; width:300px; background: grey" ></canvas>
    
    (Actual output, not a screen shot)
   
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
    <a href="./api_use_1.1.html">Prev</a>
    <a href="./api_use_1.3.html">Next</a>
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

    scene.add(rayCaster.pixelVolume);

    rayCaster.loadDataFile('../../../data/logo2.4x8.png');           
    rayCaster.pixelVolume.scale.x = 1.2;
    rayCaster.pixelVolume.scale.y = 0.8;
    rayCaster.pixelVolume.scale.z = 0.25;
    rayCaster.render();
</script>