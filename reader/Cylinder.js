/**
 * Cylinder
 * @constructor
 */
function Cylinder(scene, id, base, top, height, slices, stacks) {
    CGFobject.call(this, scene);
    this.id = id;
    this.base = base;
    this.top = top;
    this.height = height;
    this.slices = slices;
    this.stacks = stacks;

    this.initBuffers();
};

Cylinder.prototype = Object.create(CGFobject.prototype);
Cylinder.prototype.constructor = Cylinder;

Cylinder.prototype.initBuffers = function() {

    var alfa = 0;
    var inc = 2 * Math.PI / this.slices;
    var z = 0;
    var DeltaS = 0;
    var DeltaT = 1;

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    for (var j = 0; j < this.stacks; j++) {

        for (var i = 0; i < this.slices; i++) {
            //Vertice 0
            this.vertices.push(Math.cos(alfa), Math.sin(alfa), z);
            //Vertice 1
            this.vertices.push(Math.cos(alfa), Math.sin(alfa), z - 1);

            alfa += inc;
            //Normals

            this.normals.push(Math.cos(inc * i), Math.sin(inc * i), 0);
            this.normals.push(Math.cos(inc * i), Math.sin(inc * i), 0);
            this.texCoords.push(0, DeltaT);
            this.texCoords.push(1, DeltaT);
            DeltaT -= 1 / this.slices;

        }
        DeltaT = 1;
        z--;
    }

    var stackNr = 1;
    var limite = this.slices * this.stacks * 2;

    for (var i = 0; i < limite; i += 2) {
        //Indices

        //0,1,2
        if (i + 2 != this.slices * stackNr * 2)
            this.indices.push(i, i + 1, i + 2);
        else
            this.indices.push(i, i + 1, i + 2 - this.slices * 2);

        //1,3,2
        if (i + 2 != this.slices * stackNr * 2)
            this.indices.push(i + 1, i + 3, i + 2);
        else {
            this.indices.push(i + 1, i + 3 - this.slices * 2, i + 2 - this.slices * 2);
            stackNr++;
        }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
