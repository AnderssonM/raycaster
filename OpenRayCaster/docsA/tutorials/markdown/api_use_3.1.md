RayCaster API usage
===================

Internal data representation
----------------------------


RayCaster supports the loading of a number of different data formats.
Internally they are all represented as GPU textures with the texture array
data type set to monochrome UInt8. 

1. **Volume slice representation**

    The texture is laid out in a grid style with all volume slices along
    the Z axis. The number of rows and columns will be adjusted to match
    the number of slices.

    <table>
        <tr>
            <td>z:0</td><td>z:1</td><td>z:2</td><td>z:3</td>
        </tr>
        <tr>
            <td>z:4</td><td>z:5</td><td>z:6</td><td>z:7</td>
        </tr>
        <tr>
            <td>z:8</td><td>z:9</td><td>z:10</td><td>z:1</td>
        </tr>
        <tr>
            <td>z:12</td><td>z:13</td><td>z:14</td><td>z:15</td>
        </tr>
    </table>

    Where Z:n is image data representing the voxels of slice n. The data of each
    slice is laid out in a grid with origin at the lower left corner.
    
    <table id='voxdata'>
        <tr>
            <td>x:0,y:3</td><td>x:1,y:3</td><td>x:2,y:3</td><td>x:3,y:3</td>
        </tr>
        <tr>
            <td>x:0,y:2</td><td>x:1,y:2</td><td>x:2,y:2</td><td>x:3,y:2</td>
        </tr>
        <tr>
            <td>x:0,y:1</td><td>x:1,y:1</td><td>x:2,y:1</td><td>x:3,y:1</td>
        </tr>
        <tr>
            <td>x:0,y:0</td><td>x:1,y:0</td><td>x:2,y:0</td><td>x:3,y:0</td>
        </tr>
    </table> 

    <a href='data/debuglogo.4x8.png' target="_blank">
        <img src='data/debuglogo.4x8.png' width='200' height='200' > 
    </a>
    
    Test data, with numbered slices Click image to enlarge.
    
    <canvas id="rayCanvas" style="height:300px; width:300px; background: grey" ></canvas>
    <div>
    <button onclick="rayCaster.setSliceZ(4/32,1/32)">Z Slice4</button>
    <button onclick="rayCaster.setSliceZ(10/32,3/32)">Z Slice10-12</button>
    <button onclick="rayCaster.setSliceZ(4/32,24/32)">Z Slice4-24</button>
    <button onclick="rayCaster.setSliceZ(0,32)">All Z slices</button></div>

2. ***Full code for this exercise.*** 

        <!DOCTYPE html> 
        <html> 
        <body> 
            <script src="js/lib.js" >  </script>
            <script src="js/RayCaster.js" >  </script>

            <canvas id="rayCanvas" style="height:300px; width:300px; background: grey" ></canvas>
            <div> 
                <button onclick="rayCaster.setSliceZ(4/32,1/32)">Z Slice4</button> 
                <button onclick="rayCaster.setSliceZ(10/32,3/32)">Z Slice10-12</button> 
                <button onclick="rayCaster.setSliceZ(4/32,24/32)">Z Slice4-24</button>
                <button onclick="rayCaster.setSliceZ(0,32)">All Z slices</button>
            </div>

            <script>
                var canvas_element = document.getElementById("rayCanvas");
                var renderer = new THREE.WebGLRenderer({canvas: canvas_element});
                var scene = new THREE.Scene();

                var options = default_options;
                options.scene = scene;
                options.renderer = renderer;
                options.display.Intensity=0.2;
                var cameraCrew = new CameraCrew(options, canvas_element);

                rayCaster = new RayCaster(options);
                cameraCrew.render = rayCaster.render.bind(rayCaster);
                cameraCrew.setupMouseEvents();
                scene.add(rayCaster.pixelVolume);
                 rayCaster.loadDataFile('debuglogo.4x8.png');       

                rayCaster.pixelVolume.scale.x = 1.2;
                rayCaster.pixelVolume.scale.y = 0.8;
                rayCaster.pixelVolume.scale.z = 0.25;
                rayCaster.render();
            </script>   
        </body> 
        </html> 

<a href="./api_use_2.2.html">Next></a>

<style>
    td{
        border: 1px solid grey;
        width: 30px;
        height: 30px;
    }
</style>
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
    options.display.Intensity=0.2;
    var cameraCrew = new CameraCrew(options, canvas_element);

    rayCaster = new RayCaster(options);
    cameraCrew.render = rayCaster.render.bind(rayCaster);
    cameraCrew.setupMouseEvents();
    scene.add(rayCaster.pixelVolume);
     rayCaster.loadDataFile('debuglogo.4x8.png');       

    rayCaster.pixelVolume.scale.x = 1.2;
    rayCaster.pixelVolume.scale.y = 0.8;
    rayCaster.pixelVolume.scale.z = 0.25;
    rayCaster.render();
</script>