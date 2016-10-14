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
    this.vertices = [];
   this.indices = [];
   this.normals = [];
   this.texCoords = [];

   var diff = (this.base - this.top) / this.stacks;

   var ang = 2 * Math.PI / this.slices;
   var n = 0;
   var tCoord = 1;
   var sPatch = 1 / this.slices;
   var tPatch = 1 / this.stacks;

   //Vertices & Normals
   for (var ind = 0; ind <= this.stacks; ind++) {

       var sCoord = 0;

       for (var m = 0; m < this.slices; m++) {
           this.vertices.push(Math.cos(ang * m) * (this.base - diff * ind),
               Math.sin(ang * m) * (this.base - diff * ind),
               n);
           this.texCoords.push(sCoord, tCoord);
           this.normals.push(Math.cos(ang * m), Math.sin(ang * m), 0);
           sCoord += sPatch;
       }
       tCoord -= tPatch;
       n += this.height / this.stacks;
   }

   //Indices
   for (var j = 0; j < this.stacks; j++) {
       for (var i = 0; i <= (this.slices); i += 1) {
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
