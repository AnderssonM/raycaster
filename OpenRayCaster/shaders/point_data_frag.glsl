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
#define INTERPOLATION_LINEAR 1
#define BOX_NONE 0
#define BOX_FILTER 1
#define BOX_MARK 2
#define BOX_BOTH 3
#define SURF_NONE 0
#define SURF_SRC 1
#define SURF_ISO 2
#define SURF_MARK 3
// Depth sample setting
#ifndef DEPTH_SAMPLES
    #define DEPTH_SAMPLES 256
#endif
uniform highp vec3 sliceMax;//=vec3(0.8,0.8,0.8);
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

highp float alphaFactor = 1.0;
highp float Dst = 0.0;
highp float Src = 0.0;

// Mode specific variable definitions
#if Z_INTERPOLATION == INTERPOLATION_LINEAR
    highp float  sampleP1;
    highp float  sampleP2;
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
   return texture2D( colorTex, vec2(0.5, min(val , 0.9999)) );
}

bool inSlice(vec3 pos){
  return  all(lessThan(pos,sliceMax*volumeDimensions.xyz)) && all(greaterThan(pos,sliceMin*volumeDimensions.xyz));
}

highp vec4 candidate;
highp float a;
 highp float half_a;
highp float b;
highp float c;
highp float sp;
highp float A;
highp float pointDistance;
highp vec2 dTexC;
// Ray marching function 
// Takes parameters
// vec3 'currentPosition' , the start position of the ray
// vec3 'deltaDirection', the ray length vector diveded by depthsamples
void  marchray(highp vec3 startPos, highp vec3 endPos){
    a= distance(startPos.xyz,endPos.xyz);
    half_a = a/2.0;


    
    for(int y = 0; y < 64; y++)
    {
        dTexC.y=float(y)/64.0;
        for(int x = 0; x < 64; x++)
        {
            dTexC.x=float(x)/64.0;
            candidate= texture2D( dataTex,dTexC);
            b= distance(endPos.xyz,candidate.xyz);
            c= distance(candidate.xyz,startPos.xyz);
            sp= (a+b+c)/2.0;
            A= sqrt(  sp*(sp-a)*(sp-b)*(sp-c));
            pointDistance=A/half_a;

            if ( pointDistance < candidate.a /128.0){
                Src= mix(candidate.a,candidate.a/2.0,pointDistance*10.0);
                #if COMPOSE == COMPOSE_MAX         
                   Dst = max(Dst, Src);
                #elif  COMPOSE == COMPOSE_AVG ||  COMPOSE == COMPOSE_SUM
                   Dst+=Src;
                #elif COMPOSE == COMPOSE_ONE
                   Dst += ( 1.0 - Dst ) * Src * (alphaFactor/ f_depth_samples);    
                #elif COMPOSE == COMPOSE_GMA
                   Dst += Src / f_depth_samples - pow(Src,alphaFactor) / f_depth_samples;       
                #endif  
                break;
            }
            
        }   
        if ( pointDistance < candidate.a /128.0){break;}
    }

    #if  COMPOSE == COMPOSE_SUM 
        Dst = Dst / (1.0/distance(backPos , frontPos));
    #elif COMPOSE == COMPOSE_AVG
        Dst = (Dst) / (1.0/distance(backPos , frontPos));
    #endif 
    // No surface mode and per ray color mixing
    gl_FragColor = colorLookup(Dst);


}



// This is where it all begins
void main( void ) {
    // Get texture coordinates from projected coordinates transformed from [-1;1] to [0;1]
    texc= vec2(((projectedCoords.x / projectedCoords.w) + 1.0 ) / 2.0, ((projectedCoords.y / projectedCoords.w) + 1.0 ) / 2.0 );
    //Lookup pixel positions for start and end of ray;
    frontPos = texture2D(frontFaceTex, texc).xyz;
    backPos = texture2D(backFaceTex, texc).xyz;
    deltaDirection = (backPos - frontPos) / f_depth_samples;
    // Lets go marching
      marchray(frontPos.xyz , backPos.xyz );   
    
   // gl_FragColor.rgb=maxComponent(vec3(1.0,0.5,1.0), vec3(0.9,0.6,0.2));
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

