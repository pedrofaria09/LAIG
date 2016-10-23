function Circle(scene, slices, radius) {
    CGFobject.call(this, scene);
    this.slices = slices;
    this.radius = radius;
    this.initBuffers();
};

Circle.prototype = Object.create(CGFobject.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.initBuffers = function() {

    this.vertices = [];

    this.indices = [];

    this.normals = [];
    this.texCoords = [];

    var deg2rad = Math.PI / 180.0;
    var alpha = (360 / this.slices) * deg2rad;

    this.vertices.push(0, 0, 0);
    this.normals.push(0, 0, 1);
    this.texCoords.push(0.5, 0.5);
    for (var i = 0; i < this.slices; i++) {
        this.vertices.push(this.radius * Math.cos((i) * alpha), this.radius * Math.sin((i) * alpha), 0);
        this.normals.push(0, 0, 1);
        if (i == this.slices - 1) {
            this.indices.push(0, 1 + i, 1);
        } else
            this.indices.push(0, 1 + i, 2 + i);
        this.texCoords.push(0.5 + Math.cos(i * alpha) / 2);
        this.texCoords.push(0.5 - Math.sin(i * alpha) / 2);
    }
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
