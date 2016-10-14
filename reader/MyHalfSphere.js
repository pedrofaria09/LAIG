/**
 * MyHalfSphere
 * @constructor
 */
function MyHalfSphere(scene, slices, stacks) {
    CGFobject.call(this, scene);

    this.slices = slices;
    this.stacks = stacks;
    this.textS = 1.0 / this.slices;
    this.textT = 1.0 / this.stacks;

    this.initBuffers();
}

MyHalfSphere.prototype = Object.create(CGFobject.prototype);
MyHalfSphere.prototype.constructor = MyHalfSphere;

MyHalfSphere.prototype.initBuffers = function() {

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var ang = 2 * Math.PI / this.slices;
    var ang_vert = Math.PI / (2 * this.stacks);
    var s = 0;
    var t = 1;
    //Vertices & Normals
    for (var ind = 0; ind <= this.stacks; ind++) {

        s = 0;

        for (var m = 0; m < this.slices; m++) {
            this.vertices.push(Math.cos(ang * m) * Math.sin(Math.PI / 2 - ang_vert * ind), Math.sin(ang * m) * Math.sin(Math.PI / 2 - ang_vert * ind), Math.sin(ang_vert * ind));
            this.normals.push(Math.cos(ang * m) * Math.sin(Math.PI / 2 - ang_vert * ind), Math.sin(ang * m) * Math.sin(Math.PI / 2 - ang_vert * ind), Math.sin(ang_vert * ind));
            s += this.textS;
            this.texCoords.push(s, t);

        }
        t -= this.textT;
    }

    //Indices
    for (var j = 0; j < this.stacks; j++) {
        for (var i = 0; i < (this.slices); i += 1) {
            this.indices.push((i + 1) % (this.slices) + (j + 0) * this.slices,
                (i + 0) % (this.slices) + (j + 1) * this.slices,
                (i + 0) % (this.slices) + (j + 0) * this.slices);

            this.indices.push((i + 0) % (this.slices) + (j + 1) * this.slices,
                (i + 1) % (this.slices) + (j + 0) * this.slices,
                (i + 1) % (this.slices) + (j + 1) * this.slices);
        }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
