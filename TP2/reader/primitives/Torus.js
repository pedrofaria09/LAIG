/**
 * Torus
 * @constructor
 */
function Torus(scene, id, inner, outer, slices, loops) {
    CGFobject.call(this, scene);
    this.id = id;
    this.inner = inner;
    this.outer = outer;
    this.slices = slices;
    this.loops = loops;

    this.initBuffers();
};

Torus.prototype = Object.create(CGFobject.prototype);
Torus.prototype.constructor = Torus;

Torus.prototype.initBuffers = function() {



    var outAngle = 360 / this.loops;
    var inAngle = 360 / this.slices;

    var degToRad = Math.PI / 180;

    var stackOut = 0;
    var stackIn = -90;
    this.vertices = [];
    this.normals = [];

    for (var i = 0; i < this.loops; i++) {
        for (var j = 0; j < this.slices; j++) {
            this.vertices.push((this.outer + this.inner + this.inner * Math.sin(stackIn * degToRad)) * Math.cos(stackOut * degToRad), (this.outer + this.inner + this.inner * Math.sin(stackIn * degToRad)) * Math.sin(stackOut * degToRad), this.inner * Math.cos(stackIn * degToRad));
            this.normals.push((this.outer + this.inner + this.inner * Math.sin(stackIn * degToRad)) * Math.cos(stackOut * degToRad), (this.outer + this.inner + this.inner * Math.sin(stackIn * degToRad)) * Math.sin(stackOut * degToRad), Math.cos(stackIn * degToRad));
            stackIn += inAngle;
        }
        this.vertices.push((this.outer + this.inner + this.inner * Math.sin(-90 * degToRad)) * Math.cos(stackOut * degToRad), (this.outer + this.inner + this.inner * Math.sin(-90 * degToRad)) * Math.sin(stackOut * degToRad), this.inner * Math.cos(-90 * degToRad));
        this.normals.push((this.outer + this.inner + this.inner * Math.sin(-90 * degToRad)) * Math.cos(stackOut * degToRad), (this.outer + this.inner + this.inner * Math.sin(-90 * degToRad)) * Math.sin(stackOut * degToRad), Math.cos(-90 * degToRad));
        stackOut += outAngle;
        var stackIn = -90;
    }

    stackOut = 0;
    stackIn = -90;
    for (var j = 0; j < this.slices; j++) {
        this.vertices.push((this.outer + this.inner + this.inner * Math.sin(stackIn * degToRad)) * Math.cos(stackOut * degToRad), (this.outer + this.inner + this.inner * Math.sin(stackIn * degToRad)) * Math.sin(stackOut * degToRad), this.inner * Math.cos(stackIn * degToRad));
        this.normals.push((this.outer + this.inner + this.inner * Math.sin(stackIn * degToRad)) * Math.cos(stackOut * degToRad), (this.outer + this.inner + this.inner * Math.sin(stackIn * degToRad)) * Math.sin(stackOut * degToRad), Math.cos(stackIn * degToRad));
        stackIn += inAngle;
    }

    var contador = 1;
    this.indices = [];
    for (var i = 0; i <= this.slices * this.loops - 1; i++) {
        if ((i + 1) % this.slices != 0) {

            this.indices.push(i + contador - 1, (i + contador), (i + this.slices + 1 + contador));
            this.indices.push(i + contador - 1, (i + this.slices + 1 + contador), (i + contador + this.slices));
        } else {
            this.indices.push(i + contador, (this.slices * contador + contador), (i + this.slices + contador));
            this.indices.push(i + contador, (i + this.slices + contador), i + contador - 1);
            contador++;
        }

    }
    this.texCoords = [];

    for (var i = 0; i <= this.loops; i++) {
        for (var j = 0; j <= this.slices; j++) {
            this.texCoords.push((j / this.loops), 1 - (i / this.slices));
        }
    }
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

Torus.prototype.updateTexture = function(length_s, length_t) {
    this.texCoords = [];

    for (var i = 0; i <= this.loops; i++) {
        for (var j = 0; j <= this.slices; j++) {
            this.texCoords.push((j / this.loops) / length_s, (1 - (i / this.slices)) / length_t);
        }
    }

    this.updateTexCoordsGLBuffers();
}
