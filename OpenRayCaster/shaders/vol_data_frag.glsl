/**
* RayCaster
* A web based program for ray traced rendering of volumetric data.
* @author Martin Andersson, V.I.C, 2015. All rights reserved
*                
*/

// Operating modes
#define COMPOSE_AVG 0
#define COMPOSE_MAX 1
#define COMPOSE_ONE 2
#define COMPOSE_GMA 3
#define COMPOSE_SUM 4
#define MIX_EARLY 0
#define MIX_LATE 1
#define INTERPOLATION_NEAR 0
#define INTERPOLATION_LINEAR_SLOW 1
#define INTERPOLATION_LINEAR_FAST 2
#define BOX_NONE 0
#define BOX_FILTER 1
#define BOX_MARK 2
#define BOX_BOTH 3
#define SURF_NONE 0
#define SURF_SRC 1
#define SURF_ISO 2
#define SURF_MARK 3
#define A 0
#define B 3
// Depth sample setting
#ifndef DEPTH_SAMPLES
    #define DEPTH_SAMPLES 256
#endif
uniform highp vec3 sliceMax;//"=vec3(0.8,0.8,0.8)";
uniform highp vec3 sliceMin;//=vec3(0.2,0.2,0.3);
// Textures containing the start and end point of the ray
// created by the back and front renderpass
uniform highp sampler2D  frontFaceTex;
uniform highp sampler2D  backFaceTex;
// The volume data, divided into squares representing the z slices
uniform highp sampler2D  dataTex;
// The color  map lookup texture 
uniform highp sampler2D  colorTex;
// Indexed precalculated offsets of each z-slice-square
uniform highp sampler2D  zIndexTex;

uniform highp vec4 pointer;

uniform highp float dampening;          //Intensity setting
uniform highp float rng_offset; 
uniform highp vec4 volumeDimensions;     
varying highp vec4 projectedCoords;

// Going to need both float and integer versions of the depth sample parameter
const int i_depth_samples = DEPTH_SAMPLES;  //WebGL requires loop length to be known at compile time
const highp float f_depth_samples = float(i_depth_samples);

highp vec4 z_offset;
highp vec3 backPos, frontPos, dir, deltaDirection;
highp vec2 texc;   
highp vec2 z_offset_texel = vec2(0.0,0.5);
highp vec2 cmap_offset_texel = vec2(0.5,0.0);


highp float alphaFactor = 1.0;
highp float Dst = 0.0;
highp float Src = 0.0;

// Mode specific variable definitions
#if Z_INTERPOLATION == INTERPOLATION_LINEAR_SLOW || Z_INTERPOLATION == INTERPOLATION_LINEAR_FAST
    highp float  sampleP1;
    highp float  sampleP2;
    highp vec4 sampleP;
    highp float z_distance;
    
#endif

#if BOX_MODE == BOX_FILTER || BOX_MODE == BOX_MARK  || BOX_MODE == BOX_BOTH 
    #define BOX_MODE_ON
    uniform highp float minBoxValue;
    uniform highp vec4 box_mark_color;
    uniform highp float box_mark_opacity;

    highp float sampleB1;
    highp float sampleB2;
    highp float sampleB3;
    highp float sampleB4;
    highp float sampleB5;

    highp vec2 offsetB1 = vec2(-volumeDimensions.x ,0.0);
    highp vec2 offsetB2 = vec2(0.0 ,-volumeDimensions.y);
    highp vec2 offsetB3 = vec2(volumeDimensions.x , 0.0);
    highp vec2 offsetB4 = vec2(0.0 , volumeDimensions.y);

    highp float box;  
    bool mark=false;
#endif

#if SURF_MODE == SURF_SRC || SURF_MODE == SURF_ISO || SURF_MODE == SURF_MARK
    #define SURF_MODE_ON
    uniform highp vec4 surface_color;
    uniform highp float minSurfValue;
    uniform highp float maxSurfValue;
    uniform highp float fogOpacity;
    uniform highp float depthShade;
    highp float surfDepth=-1.0;
    highp float surfDst;
    highp float surfSrc;  
#endif

// Mode specific axis drawing function
#ifdef AXIS_MARKERS
    const float axis_thickness = 0.003;
    void draw_axis_markers(){
        if  ( frontPos.x < axis_thickness && frontPos.y < axis_thickness ) {
                    gl_FragColor.r =0.5;
        }
        if (backPos.x < axis_thickness &&  backPos.y < axis_thickness ){                  
                     gl_FragColor.r+= (1.0 - gl_FragColor.a) /2.0;
        }
        if  ( frontPos.z < axis_thickness && frontPos.x < axis_thickness ){
                    gl_FragColor.g =0.5;
        }
        if ( backPos.z < axis_thickness &&  backPos.x < axis_thickness ){    
                    gl_FragColor.g+=(1.0 - gl_FragColor.a) /2.0;
        }
        if  ( frontPos.z < axis_thickness && frontPos.y < axis_thickness ){
                    gl_FragColor.b=0.5;
        }
        if ( backPos.z < axis_thickness &&  backPos.y < axis_thickness ){         
                    gl_FragColor.b+=(1.0 - gl_FragColor.a) /2.0;
        }

        
    }
#endif

// Lookup rgba for val in colormap
vec4  colorLookup(highp float val){
   val =max(val - rng_offset, 0.0) /dampening;
   cmap_offset_texel.t= min(val , 0.9999);
   return texture2D( colorTex, cmap_offset_texel );
}

bool inSlice(vec3 pos){
  return  all(lessThan(pos,sliceMax*volumeDimensions.xyz)) && all(greaterThan(pos,sliceMin*volumeDimensions.xyz));
}
// Ray marching function 
// Takes parameters
// vec3 currentPosition , the start position of the ray
// vec3 deltaDirection, the ray length vector diveded by depthsamples
void  marchray(highp vec3 currentPosition, highp vec3 deltaDirection){

    // WebGL require compile time fixed length loops
    // High likelihood of loop beeing unrolled during compilation.
    for(int i = 0; i < i_depth_samples; i++)
    {
        if (inSlice(currentPosition)){
          

            // Are we doing Z interpolation?
            #if Z_INTERPOLATION == INTERPOLATION_LINEAR_SLOW
                z_offset_texel.s=floor(currentPosition.z * volumeDimensions.w )/volumeDimensions.w ;
                z_offset= texture2D( zIndexTex, z_offset_texel ); 
                sampleP1 = texture2D( dataTex, currentPosition.xy + z_offset.st ).a;
                sampleP2 = texture2D( dataTex, currentPosition.xy + z_offset.pq ).a;
                z_distance =fract(currentPosition.z * volumeDimensions.w  );
                Src= mix(sampleP1, sampleP2, z_distance);  
            #elif Z_INTERPOLATION == INTERPOLATION_LINEAR_FAST
                z_offset_texel.s=floor(currentPosition.z * volumeDimensions.w )/volumeDimensions.w ;
                z_offset= texture2D( zIndexTex, z_offset_texel ); 
                sampleP = texture2D( dataTex, currentPosition.xy + z_offset.st );
                z_distance =fract(currentPosition.z * volumeDimensions.w  );
                Src= mix(sampleP[A], sampleP[B], z_distance);
             
                
                
            #else  // No, one sample is enough 
                // Find texture coordinate for current voxel
                z_offset_texel.s=currentPosition.z;
                z_offset= texture2D( zIndexTex,z_offset_texel ); 
                Src = texture2D( dataTex, currentPosition.xy + z_offset.st).a;
            #endif
            // Are we using a filter mode?
            #ifdef BOX_MODE_ON
                sampleB1 = texture2D( dataTex, currentPosition.xy + offsetB1 + z_offset.st ).a;
                sampleB2 = texture2D( dataTex, currentPosition.xy + offsetB2 + z_offset.st ).a;
                sampleB3 = texture2D( dataTex, currentPosition.xy + offsetB3 + z_offset.st ).a;
                sampleB4 = texture2D( dataTex, currentPosition.xy + offsetB4 + z_offset.st ).a; 
                sampleB5 = texture2D( dataTex, currentPosition.xy + z_offset.pq ).a;

                box = Src + sampleB1 + sampleB2 + sampleB3 + sampleB4 + sampleB5;

                #if BOX_MODE == BOX_MARK || BOX_MODE == BOX_BOTH 
                    if (box  > minBoxValue && Src > minBoxValue * 2.0){
                       mark=true;
                    }
                #endif
                #if BOX_MODE == BOX_FILTER || BOX_MODE == BOX_BOTH 
                    if (box  < minBoxValue || Src < minBoxValue * 2.0){
                        Src=0.0;
                    }
                #endif
            #endif
            // Are we using a surface mode?
            #ifdef SURF_MODE_ON
               if (Src >  minSurfValue  && Src < maxSurfValue ) { 
                    if ( surfDepth == -1.0){
                        #if SURF_MODE == SURF_SRC 
                            surfSrc=Src;
                        #elif SURF_MODE == SURF_ISO
                            surfSrc=minSurfValue;
                        #endif 
                        surfDepth = float( i ) / f_depth_samples; // Remember the depth where we found surface
                        surfDst=Dst;
                        break;                     
                    }
               }
            #endif
            // Are we doing per voxel color mixing?  (Experimental)
            #if MIX == MIX_EARLY            
                #if COMPOSE == COMPOSE_MAX         
                    Dst = max(Dst, Src);
                    gl_FragColor = colorLookup(Dst );
                #elif  COMPOSE == COMPOSE_AVG 
                     Src=Src/f_depth_samples;
                     gl_FragColor += colorLookup(Src );
                #elif COMPOSE == COMPOSE_ONE
                   Src = ( 1.0 - Dst ) * Src * alphaFactor; 
                   Dst+=Src;
                   gl_FragColor += colorLookup(Src );
                #elif COMPOSE == COMPOSE_GMA
                    Src= Src  - pow(Src,alphaFactor);           
                    gl_FragColor += colorLookup(Src );
                #endif
            #else  // Nah, per ray color mixing should be good enough.
                #if COMPOSE == COMPOSE_MAX         
                   Dst = max(Dst, Src);
                #elif  COMPOSE == COMPOSE_AVG ||  COMPOSE == COMPOSE_SUM
                   Dst+=Src;
                #elif COMPOSE == COMPOSE_ONE
                   Dst += ( 1.0 - Dst ) * Src * (alphaFactor/ f_depth_samples);    
                #elif COMPOSE == COMPOSE_GMA
                   Dst += Src / f_depth_samples - pow(Src,alphaFactor) / f_depth_samples;       
                #endif
            #endif

           // 1.0 is the highest value that can be looked up in the color table
           // Not much point in contiuing beyond that.
           // On the other hand, branching hurts performance on some GPUs
           // So this is an option
            #ifdef BREAK_ON_MAX_DST
                if (Dst >  0.999) { break;}
            #endif
        }  
        //Advance along the ray.
        currentPosition += deltaDirection;
       
    }

    // Surface mode?
    #ifdef SURF_MODE_ON
        #if  COMPOSE == COMPOSE_SUM 
            Dst = Dst / (1.0/distance(backPos , frontPos));
        #elif COMPOSE == COMPOSE_AVG
            Dst = (Dst/f_depth_samples) / (1.0/distance(backPos , frontPos));
        #endif 
        // No surface found behind this pixel
        if (surfDepth == -1.0){
            // Calculate fog (plasma) color
            float depthDampening= (1.0 + depthShade/2.0)  -  depthShade;
            vec4 BackFogColor = colorLookup(Dst) * fogOpacity * depthDampening;
            gl_FragColor.rgba =  BackFogColor.rgba ;
        }
        // Pixel-Ray hit surface
        else{ 
            float depthDampening= mix((1.0 + depthShade/2.0) , (1.0 - depthShade/2.0) ,  surfDepth) ;
            
            #if SURF_MODE == SURF_MARK 
                //Use user selected color
                vec4 surfaceColor = surface_color;
            #else
                //Use color map value of surfSrc
                vec4 surfaceColor = colorLookup(surfSrc);
            #endif
            
            // Mix surface and fog (plasma)
            vec4 FrontFogColor = colorLookup(surfDst)* fogOpacity * depthDampening;
            vec4 depth_shaded_surfaceColor = surfaceColor.rgba * depthDampening;
            vec3 depth_shaded_surfaceColorPlusFog = depth_shaded_surfaceColor.rgb + FrontFogColor.rgb * fogOpacity;
            gl_FragColor.rgb = depth_shaded_surfaceColorPlusFog.rgb;
            gl_FragColor.a=1.0;
        }
    #elif MIX == MIX_LATE
        #if  COMPOSE == COMPOSE_SUM 
            Dst = Dst / (1.0/distance(backPos , frontPos));
        #elif COMPOSE == COMPOSE_AVG
            Dst = (Dst/f_depth_samples) / (1.0/distance(backPos , frontPos));
        #endif 
        // No surface mode and per ray color mixing
        gl_FragColor = colorLookup(Dst);

    #endif
}


// This is where it all begins
void main( void ) {
    // Get texture coordinates from projected coordinates transformed from [-1;1] to [0;1]
    texc= vec2(((projectedCoords.x / projectedCoords.w) + 1.0 ) / 2.0, ((projectedCoords.y / projectedCoords.w) + 1.0 ) / 2.0 );
    //Lookup voxel positions for start and end of ray;
    frontPos = texture2D(frontFaceTex, texc).xyz;
    backPos = texture2D(backFaceTex, texc).xyz;

    // Direction and length of each delta step
    deltaDirection = (backPos - frontPos) / f_depth_samples;
    // Lets go marching
      marchray(frontPos.xyz * volumeDimensions.xyz, deltaDirection.xyz * volumeDimensions.xyz);   
    
    // Do you want Axis markers with that?
    #ifdef AXIS_MARKERS
        draw_axis_markers();
    #endif  
    
    // Are we in filter-mark mode?
    #if BOX_MODE == BOX_MARK || BOX_MODE == BOX_BOTH  
        // Did filter find anything for us to mark?
        if (mark) { 
            gl_FragColor =mix(gl_FragColor, box_mark_color,  box_mark_opacity );
        }
    #endif

    if ( abs(texc.x-pointer.x) < 0.001 && abs(texc.y-pointer.y) < 0.02){
  
        gl_FragColor.rgb= vec3(0.2,0.6,0.4);
    }
    if ( abs(texc.x-pointer.x) < 0.02 && abs(texc.y-pointer.y) < 0.001){
  
        gl_FragColor.rgb= vec3(0.2,0.6,0.4);
    }
}

