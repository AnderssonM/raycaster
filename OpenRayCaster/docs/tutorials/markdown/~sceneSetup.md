
Scene and volume setup
---------------


A small guide to exploring the options using the provided sample data.

1. **Canvas creation**

    First we create must create a canvas for RayCaster to draw on

         <canvas id="rayCanvas" style="height:300px; width:300px; background: grey" > </canvas>
     
       
    Which gives us this

    <canvas id="rayCanvasGr" style="height:300px; width:300px; background: grey" ></canvas>
    
2. **Scene creation**

    Once we have a canvas we include the supporting libraries from the 'lib.js' file, 
    which is a bundle of THREE.js and some other external libraries that we will need.   
    Next we need to do a bit of THREE.js setup to create a Scene, and a WebGLRenderer.

        <script src="js/lib.js" >  </script>
        <script>
            var canvas_element = document.getElementById("rayCanvas");
            var renderer = new THREE.WebGLRenderer({canvas: canvas_element});
            var scene = new THREE.Scene();
        </script>

        
    The canvas element will turn black at this point, the default background of a THREE.js renderer.
    
    <canvas id="rayCanvasb" style="height:300px; width:300px; background: black" ></canvas>

3. **Include RayCaster**
    
    Next we include the the rayCaster library, using a new script tag.

        <script src="js/RayCaster.js" >  </script>  

4. **Set up a CameraCrew**

    Now that we have a complete scene and a renderer, we can set our scene and 
    render options and create a CameraCrew instance.

        <script>
            var options = default_options;
            options.scene = scene;
            options.renderer = renderer;
        </script>

5. **Create a RayCaster volume**       
    
    After that we create a RayCaster instance, passing the options to the constructor.
    Then we add the RayCaster instance to the scene.

        rayCaster = new RayCaster(options);
        scene.add(rayCaster.pixelVolume);
        rayCaster.loadDataFile('../../../data/logo2.4x8.png');   
  
6. **Load a Data File**

    And now we are ready to load a data file.
    Which gives us the following result.
   
    <canvas id="rayCanvas" style="height:300px; width:300px; background: grey" ></canvas>
    
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
            </script>   
        </body> 
        </html> 



<script id="tutorialScript">
    var canvas_element = document.getElementById("rayCanvas");
    var renderer = new THREE.WebGLRenderer({canvas: canvas_element});
    var scene = new THREE.Scene();
    var canvas_element = document.getElementById("rayCanvas");
    
    rayCaster = new OpenRayCaster({renderTarget:canvas_element});
    rayCaster.loadDataFile(root+'/sampleData/logo2.4x8.png');

</script>