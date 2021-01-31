import {THREE} from '../lib.js/three.js'
export class VolumeGeometry extends THREE.BoxGeometry {

    /**
     * VolumeGeometry, volume geometry class
     * @author Martin Andersson, V.I.C, 2015. All rights reserved
     * @constructor
     **/
    constructor() {
        super(1.0,1.0,1.0,1,1,1)
//        THREE.BoxGeometry.call(this, 1.0  , 1.0, 1.0, 1, 1, 1);
        this.type = "VolumeGeometry";
        this.doubleSided = true;
        this.sliceMax = new THREE.Vector3(0.5, 0.5, 0.5);
        this.sliceMin = new THREE.Vector3(-0.5, -0.5, -0.5);
    }

    /**
     * setSliceX, sets the start and depth of dimension x slice
     * @param {Number} start The start position of the slize, normalized to [0.0:1.0]
     * @param {Number} depth The depth(length) of the slize, normalized to [0.0:1.0]
     */
    setSliceX = function (start, depth) {
        this.sliceMin.x = start - 0.5;
        this.sliceMax.x = Math.min(start + depth, 1.0) - 0.5;
        //   this.update();
    }
    /**
     * setSliceY, sets the start and depth of dimension y slice
     * @param {Number} start The start position of the slize, normalized to [0.0:1.0]
     * @param {Number} depth The depth(length) of the slize, normalized to [0.0:1.0]
     **/
    setSliceY(start, depth) {
        this.sliceMin.y = start - 0.5;
        this.sliceMax.y = Math.min(start + depth, 1.0) - 0.5;
        //  this.update();
    }
    /**
     * setSliceZ, sets the start and depth of dimension z slice
     * @param {Number} start The start position of the slize, normalized to [0.0:1.0]
     * @param {Number} depth The depth(length) of the slize, normalized to [0.0:1.0]
     **/
    setSliceZ(start, depth) {
        this.sliceMin.z = start - 0.5;
        this.sliceMax.z = Math.min(start + depth, 1.0) - 0.5;
        //  this.update();
    }
    /**
     * update, updates the volumegeometry vertices and 'normals'
     * 
     *        the normal vertice parameters are used here to carry the volume 
     *        coordinates translated from [-0.5:05] to [0:1] they don't contain 
     *        actual normals. (This saves the GPU from a bit of work)
     *        Some day, this should be updated to a THREE.Buffergeometry 
     *        that will allow  custom vertice paramters.
     *        
     * @private
     **/
    update() {
//    console.log("VolumeGeometry:updateVolumeGeometry");
        var tmp = new THREE.BoxGeometry(1.0, 1.0, 1.0, 1, 1, 1);
        var offset = new THREE.Vector3(0.5, 0.5, 0.5);
        var vgVerts = this.vertices;
        var tmpVerts = tmp.vertices;

        for (var x in  tmp.faces) {
            //    console.log("x", x);
            var f = this.faces[x];
            var fvn = f.vertexNormals;
            var fvna = fvn[0];
            var fvnb = fvn[1];
            var fvnc = fvn[2];

            tmpVerts[f.a].min(this.sliceMax);
            tmpVerts[f.b].min(this.sliceMax);
            tmpVerts[f.c].min(this.sliceMax);

            tmpVerts[f.a].max(this.sliceMin);
            tmpVerts[f.b].max(this.sliceMin);
            tmpVerts[f.c].max(this.sliceMin);

            vgVerts[f.a].copy(tmpVerts[f.a]);
            vgVerts[f.b].copy(tmpVerts[f.b]);
            vgVerts[f.c].copy(tmpVerts[f.c]);

            fvna.copy(tmpVerts[f.a]);
            fvnb.copy(tmpVerts[f.b]);
            fvnc.copy(tmpVerts[f.c]);

            fvna.add(offset);
            fvnb.add(offset);
            fvnc.add(offset);
        }

        this.verticesNeedUpdate = true;
        this.normalsNeedUpdate = true;
        this['needsUpdate'] = true;
    }
}