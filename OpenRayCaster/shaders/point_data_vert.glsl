/**
* RayCaster
* A web based program for ray traced rendering of volumetric data.
* @author Martin Andersson, V.I.C, 2015. All rights reserved
*                
*/
varying highp vec4 projectedCoords;
void main()
{
   // volumeDataCoord = normal;
    projectedCoords =   projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    gl_Position= projectedCoords;
}
