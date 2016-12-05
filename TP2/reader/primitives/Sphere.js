function Sphere(scene, id, radius, slices, stacks) {
    CGFobject.call(this, scene);

    this.id = id;
    this.slices = slices;
    this.stacks = stacks;
    this.radius = radius;
    this.scene = scene;
    this.initBuffers();

};


Sphere.prototype = Object.create(CGFobject.prototype);
Sphere.prototype.constructor = Sphere;

Sphere.prototype.initBuffers = function() {

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];


    var angLat = 2*Math.PI/this.slices;
    var angVert = Math.PI/this.stacks;
    var s = 0;
    var t = 1;

    for (var i = this.stacks; i >= 0; i--) {

        s = 0;

        for (var j = 0; j < this.slices; j++) {
            this.vertices.push(Math.cos(angLat*j)*Math.sin(angVert*i)*this.radius,Math.sin(angLat*j)*Math.sin(angVert*i)*this.radius,Math.cos(angVert*i)*this.radius);
            this.normals.push(Math.cos(angLat*j)*Math.sin(angVert*i),Math.sin(angLat*j)*Math.sin(angVert*i),Math.cos(angVert*i));
            s += 1/this.slices;
            this.texCoords.push(s, t);

        }
        t -= 1/this.stacks;
    }

    for (var j = 0; j < this.stacks; j++) {
        for (var i = 0; i < (this.slices); i++) {
            this.indices.push((i+1)%this.slices+j*this.slices,i%this.slices+(j+1)*this.slices,i%this.slices+j*this.slices);
            this.indices.push(i%this.slices+(j+1)*this.slices,(i+1)%this.slices+j*this.slices,(i+1)%this.slices+(j+1)*this.slices);
        }

    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
