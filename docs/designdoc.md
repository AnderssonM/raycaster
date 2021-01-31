#Design Document

Background
----------
After evaluating some other techniques, such as splatting and marching cubes,
 I finally settled on Raycasting as the most feasible method for being able to 
reproduce good images from a variety of volume data types in a browser-based 
software. Working within the constraints of a modern browser with no plugins, 
the program is based on HTML5, JavaScript (ECMA 5) and WebGL 1.0.


Constraints
-----------

Working with WebGL 1.0, which is based on Open GLES 2.0, means only a subset of 
the full Open GL spec is available. This means that some tricks have to be used 
to emulate 3D textures, which does not exist in WebGL 1.0. 

Tech. Design
------------


1. **Data Texture Layout**

    Volume data is loaded and transfered to the shader as a _data texture_. Each slice 
 located after each other on the bitmap. Such that a volume with _voxel_ dimensions
 x:64,y:64,z:64, in the simplest form will create a texture with _pxiel_ dimensions
 (x:64, y:64*64). 

            -----
            |z1 |
            -----
            |z2 |
            -----
            |z3 |
            -----
            |z..|
    
    Since it is possible that some browsers will not allow textures with sides 
larger than 4096 pixels, it is necessary to also allow the following layout of 
slices.

            ---------
            |z1|z5|z..
            -------
            |z2|z6|
            -------
            |z3|z7|
            -------
            |z4|z8|
            ---------

    As volume rendering will have to access this data very frequently, an 
_index texture_ is also created containing the _data texure_ [x,y] _texel_ offsets
 for each z slice encoded as [r,g]. 

    (Additionally, for optimization purposes, the _index texture_ values [b,a] 
contains the offset for slice z+1.)

2. **Volume Geometry**

    The volume geometry consists of a unit cube (with a side of 1). 
As the cube gets rendered, its vertices are multiplied by the view matrix
and the model matrix causing each vertex to be displaced based on rotation 
and perspective. 

    The first step of a simple rendering of this cube would normally be passing 
these vertices to a _vertex shader_ doing this matrix multiplication which then
 passes the resulting x:y screen coordinates to the _fragment shader_.
    
    The _fragment_shader_ then colors each pixel of a triangle made up of every
three vertices being passed. The coordinates and any other vertex attribute passed 
from the _vertex_shader_ is automatically interpolated for each pixel within 
each triangle to be drawn.

3. **Ray Casting**

    Ray Casting complicates this process significantly as we are no longer drawing
3D objects on the screen, but rather evaluate each pixel location on the screen 
to find what volume data is behind it.  This would be simple enough if we didn't
need to consider rotation and perspective but since we do, we need to cast a _ray_
from each pixel through the transformed (rotation, scale, perspective) volume and
figure out which _voxels_ the ray traverses. 

    So we need to draw a square based on two triangles representing the _view port_
(or window), such as:

            ______
            |   /|
            |  / |
            | /  |
            |/___|

    To further complicate things, the _vertex shader_ is only aware of the coordinates and attributes of the single
vertex currently being processed. While the _fragment shader_ is only aware of
the interpolated coordinate and attribute values for the current pixel being drawn. 

    3.1 **Ray origin and end points.**
    
    So with all the complications listed above, we need to find the start and end
points (in data _voxel_ coordinates) for the ray behind each screen pixel. The 
way we achieve this is by first rendering the back-face of the hidden surfaces of
the volume geometry. (Think of back faces as the insides of each of the cube
 faces, and think of the hidden surfaces as the faces of the cube which are hidden 
on the back side of the cube).

    So we render the three hidden faces but instead of giving them a normal color
we use the color information to encode the _voxel coordinate_  for each pixel
such that [r,g,b,a] equals [x,y,z,w] and then  store this rendered view in a 
texture called _back_end_coordinates_. 

    Next we repeat the procedure with the front-face of the three visible
 surfaces of the cube and again encode the corresponding _voxel coordinates_,
and store the resulting texture as _front_end_coordinates_.

    Both of these textures are rendered in the size of the _view port_
    
    3.2 **Voxel Coordinate lookup**

    Now we can render our square _view port_, and for each x:y screen pixel, the
_fragment shader_ can lookup the corresponding color values in _front_end_coordinates_ 
and _back_end_coordinates_. The transformed  [x,y,z] coordinates for the
ray start and end can now be found in the [r,g,b] color values of each x:y screen pixel.

    3.3 **Data Texture coordinate lookup**

    The fragment shader can now calculate the length of the ray and iterate over
the voxel coordinates of each depth sample along the path. The _fragment shader_ 
looks up the corresponding _data texture_ offset for the voxel z coordinate and
finally looks up the _data texture_ value at the offset + voxel xy coordinate.
    
    This is repeated for each depth sample, and the integrated value is returned
based on the selected composition mode.


    
    
    
