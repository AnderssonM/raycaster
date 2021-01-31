varying vec3 volumeDataCoord;

void main()
{
        //Set the world space coordinates of the back faces vertices as output.
         volumeDataCoord = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        
}