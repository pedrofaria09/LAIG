/**
 * Rectangle
 * @constructor
 */
function Rectangle(scene, id, x1, y1, x2, y2) {
    CGFobject.call(this, scene);
    this.id = id;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
	this.angle=45*Math.PI/180;
    this.initBuffers();

};

Rectangle.prototype = Object.create(CGFobject.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.initBuffers = function() {
    this.vertices = [
      this.x1, this.y1, 0,
         this.x2, this.y1, 0,
         this.x1, this.y2, 0,
         this.x2, this.y2, 0
    ];

    this.indices = [
       0, 1, 2,
       3, 2, 1
   ];

   this.normals = [
       0, 0, 1,
       0, 0, 1,
       0, 0, 1,
       0, 0, 1
   ];

   this.texCoords = [
       0, 1,
       1, 1,
       0, 0,
       1, 0
   ]
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

Rectangle.prototype.updateTexture = function(length_s, length_t) {

    this.texCoords = [
        0, Math.abs(this.y1 - this.y2) / length_t,
        Math.abs(this.x1 - this.x2) / length_s, Math.abs(this.y1 - this.y2) / length_t,
        0, 0,
        Math.abs(this.x1 - this.x2) / length_s, 0
    ];


    this.updateTexCoordsGLBuffers();
};
