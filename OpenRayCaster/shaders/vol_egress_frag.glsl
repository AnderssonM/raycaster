varying vec3 volumeDataCoord;

void main()
{
    //The fragment's world space coordinates as fragment output.
    gl_FragColor = vec4( volumeDataCoord.x , volumeDataCoord.y, volumeDataCoord.z, 1.0 );
}
