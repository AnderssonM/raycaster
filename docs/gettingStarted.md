Web GL Raycasting volume viewer manual
======================================

Getting Started
---------------


A small guide to exploring the options using the provided sample data.

1. **Frog Sample Volume.**

    1.1. Use the _'File'_ selector in the _'Load Data'_ toolbox to load the data file named
    _'Frog'_ from the _'Vol Data'_ selection group.

    1.2. Use the _'selectedColormap'_ control in the _'Color Map'_ toolbox to select the 
    colormap _'Froggy'_. 

    1.3. Try changing the _'Intensity'_ setting in the _'Display Settings'_ tool box to 
    see how it affects the image.  For the purpose of this exercise, an intensity 
    setting of about 1.1-1.3 should work well. 

    1.4. Rotate and zoom the image using your mouse. Click and drag to rotate. 
    Use the scroll wheel to zoom in and out. For the purpose of this exercise, turn
    the model around until you have a top view covering most of the screen.

    1.5. Try changing the _'Composition'_ setting in the _'Display Settings'_ tool box
    to _'Max Intensity'_ and see how it changes the image. The internal organs of
    the frog,  should show up more clearly while soft tissue should be less
    prominent

2. **C60 Bucky Ball  Sample Volume.**

    2.0  **Important:** Reset all values by reloading the page in your browser. 

    2.1. Use the _'File'_ selector in the _'Load Data'_ toolbox to load the data file named
    _'C60 Bucky Ball'_ from the _'Vol Data'_ selection group. 
    (You may need to scroll down a bit in the selection box).

    2.2. Use the _'selectedColormap'_ control in the _'Color Map'_ toolbox to select the 
    colormap _'Frozen'_. 

    2.3. Use the _'Mode'_ setting in the _'Surface Detect'_ toolbox to select the
    surface mode _'Src Mode_.

    2.4. Try changing the _'Min'_ setting of the _'Surface Detect'_ toolbox to 
    and see how it affects the image. 

    2.5. Set the _'Min'_ setting to 0.16, use the keyboard to input if needed.

    2.6. Change  _'Interpolation XY'_ and _'Interpolation Z'_  of the _'Interpolation'_
    toolbox from _'Nearest'_ to _'Linear'_   and see how it changes the image. 
     The shape should become 'rounded' rather than 'pixelated'.

    2.7. Set the _'Y-Depth' and 'Z-depth' of _'Slicing'_ toolbox to about 0.6

    2.8. Set the _'Max'_ setting to 0.17, use the keyboard to input if needed.

    2.9. Try changing the _'Plasma Level'_  of the _'Surface Detect'_ toolbox and
    see how it affects the image. (The voxels that are not part  of a surface
    should be transparently mixed into the image)

    2.9. Try changing the _'Depth Shade'_ level of the _'Surface Detect'_ toolbox and
    see how it affects the image. (Voxels further away from the camera should 
    appear darker and voxels closer to the camera should become brighter, emulating
    a 3D lighting model)

    2.10. Try changing the _'Mode'_ in the _'Surface Detect'_ toolbox to _'Selected'_
    and then select a color in the _'Color'_ selector. The surface voxels should 
    change to the selected color.
    
    2.11. Set the _'Max'_ setting to 1.0, use the keyboard to input if needed. 

    2.12. Use the _'Mode'_ setting in the _'Surface Detect'_ toolbox to select the
    surface mode _'ISO Mode_.

    2.13. Change the _'Min'_ setting to different values and see how it affects
    the color.  Compare with the _'Src Mode'_ setting.  The Src Mode will color
    the surface based on the first encountered voxel, that is in the the range 
    between Min and Max. Where as the _'Iso Mode' will color the surface based
    on the _'Min'_ value.
    
3. **Histogram Sample Volume.**
    
    3.0  **Important:** Reset all values by reloading the page in your browser. 

    3.1. Use the _'File'_ selector in the _'Load Data'_ toolbox to load the data file named
    _'Histogram 04'_ from the _'Histogram Data'_ selection group. 
    (You may need to scroll down a bit in the selection box).

    3.2. Use the _'selectedColormap'_ control in the _'Color Map'_ toolbox to select the 
    colormap _'Starry Night'_. 

    3.3. Try changing the _'Intensity'_ setting in the _'Display Settings'_ tool box to 
    see how it affects the image.  For the purpose of this exercise, an intensity 
    setting of about 3.0 should work well. 
    
    3.4 Change the _'Camera'_ setting from _'Perspective'_ to _'Orthographic'_.
    ( The scaling function for Orthographic is not implemented, which was the 
    reason for ensuring a square view port in point 2.0)

    3.5. Rotate and zoom the image using your mouse. Click and drag to rotate. 
    Use the scroll wheel to zoom in and out. For the purpose of this exercise, turn
    the model around until you have a front view covering most of the screen.

    3.6. Try changing the _'Composition'_ setting in the _'Display Settings'_ tool box
    to _'Max Intensity'_ and see how it changes the image. The peaks should show
    more clearly, with less noise.

    3.6. Rotate the image to a slight side/front view. Try changing 
    _'Interpolation XY'_ and _'Interpolation Z'_ from _'Nearest'_ to _'Linear'_ 
    and see how it changes the image.  The peaks should become 'rounded' rather
     than 'pixelated'.
 
    3.7  Change both interpolation settings back to _'Nearest'_.  Change the _Intensity_ setting to 4.0.

    3.8  Set the _'Limit'_ in _'Surface Detect' tool box to 0.14. 
        (use the keyboard, if the slider is difficult to control)

    3.9  Select the _'Detect'_ option in the _'Mode'_ selection control.
     Noise should be further suppressed while the peaks are visible.

    **Warning: Some of the below step puts a heavy load on the GPU, on slower systems the browser might become unresponsive.** 

    3.10  Set the _'Limit'_ in _'Surface Detect' to 0.04. 
        (use the keyboard, if the slider is difficult to control)

    3.11  Select the _'Filter'_ option in _'Mode'_. Noise should be
    further suppressed while the peaks are visible.

    3.12 Select the _'none'_ option in _'Mode'_ and  Select the
         _'Grayscale'_ color map 

    3.13 Set the _'Composition'_ setting in the _'Display Settings'_ tool box
        to _'Average'_.

    3.14  Select the _'Mark'_ check box in _'Mode'_. The peaks should be 
        marked by a bluish hue on the gray background noise.
    
