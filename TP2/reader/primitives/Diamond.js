/**
 * Diamond
 * @constructor
 */
function Diamond(scene, slices) {
    CGFobject.call(this, scene);
    this.slices = slices;
    this.initBuffers();

};

Diamond.prototype = Object.create(CGFobject.prototype);
Diamond.prototype.constructor = Diamond;

Diamond.prototype.initBuffers = function() {
    this.vertices = [];

    this.indices = [];

    this.normals = [];

    var angle = 0;

    for (var i = 0; i < this.slices; i++) {
        this.vertices.push(0.5 * Math.cos(angle * Math.PI / 180), 0, 0.5 * Math.sin(angle * Math.PI / 180));
        this.normals.push(Math.cos(angle * Math.PI / 180), 0, Math.sin(angle * Math.PI / 180));
        angle -= 360 / this.slices;
    }
    this.vertices.push(0, 1, 0);
    this.normals.push(0, 1, 0);
    this.vertices.push(0, -1, 0);
    this.normals.push(0, -1, 0);


    for (var i = 0; i < this.slices; i++) {
        if (i < this.slices - 1) {
            this.indices.push(i, i + 1, this.slices);
            this.indices.push(i, this.slices + 1, i + 1);
        } else {
            this.indices.push(i, 0, this.slices);
            this.indices.push(i, this.slices + 1, 0);
        }
    }

    console.log(this.indices);
    console.log(this.vertices);

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
