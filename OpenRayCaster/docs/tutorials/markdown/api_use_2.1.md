<script src="../../../js/lib.js"  ></script>
<script src="../../../js/RayCaster.js"></script>

Settings Object
--------------

As seen in previous examples an options object is send to both the CameraCrew 
class and the RayCaster class on creation. The options object includes lots of
settings telling RayCaster and CameraCrew our preferences for how the data 
should be rendered. 


1. **Default Settings Object**

    The main groups of the default options object are listed below. Each option
    group is described in the following set of tutorials.

        {
           'interpolation': { },
           'display': { },
           'enhancement': { },
           'surface': { },
           'filter': { },
           'slice': { },
           'color': { },
        }
    
    The default settings of RayCaster can be seen by examining the 'RayCaster.prototype.default_settings' object.

2. **Using a new Settings Object**

    A new settings object can be passed to RayCaster using the 'useSettings' 
    function. E.g to load a new data file one can create the following
    settings object and pass it to rayCaster.
    
        <script>
	    settings={
		data:{
		    File:root+'/sampleData/logo2.4x8.png'
		}
	    };
	    rayCaster.useSettings(settings);
        </script>

   This would for example load and render the data file.

3. **Loading JSON Settings**
    
    It is also possible to load settings from a JSON file by using the 
    function 'loadSettingsFile'.

        <script>
	    rayCaster.loadSettingsFile(root+'/settings/my_settings.json');
        </script>

    Which would load and apply all settings from the file 'my_settings.json'.
	