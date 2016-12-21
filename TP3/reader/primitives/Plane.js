function Plane(scene, id, dimX, dimY, partsX, partsY) {
    CGFobject.call(this, scene);

    this.id = id;
    this.dimX = dimX;
    this.dimY = dimY;
    this.partsX = partsX;
    this.partsY = partsY;
    this.dimTotal = this.dimX * this.dimY;

    //this.appearance = new CGFappearance(this.scene);
    //this.appearance.setAmbient(1, 1, 1, 1);
      //this.appearance.setDiffuse(1, 1, 1, 1);
      //this.appearance.setSpecular(1, 1, 1, 1);
      //this.appearance.setShininess(300);
    //this.texture = new CGFtexture(this.scene, "images/texture.jpg");
    //this.appearance.setTexture(this.texture);
    //this.appearance.setTextureWrap('REPEAT', 'REPEAT');


    this.makeSurface(this.dimX, this.dimY, this.partsX, this.partsY);

    /*this.texCoords = [];
    this.Length = 1.0 / this.dimTotal;
    for (var i = 0; j <= this.dimTotal; j++) {
        for (var j = 0; i <= this.dimTotal; i++) {
            this.texCoords.push(i * this.Length, j * this.Length);
        }
    }*/
}

Plane.prototype = Object.create(CGFscene.prototype);
Plane.prototype.constructor = Plane;

Plane.prototype.makeSurface = function(dimX, dimY, partsX, partsY) {
    var degree1 = 1;
    var degree2 = 1;
    var knotsU = [0,0,1,1];
    var knotsV = [0,0,1,1];
    var controlvertexes = [];
    controlvertexes.push([[-dimX/2,dimY/2,0,1],[-dimX/2,-dimY/2,0,1]]);
    controlvertexes.push([[dimX/2,dimY/2,0,1],[dimX/2,-dimY/2,0,1]]);
    controlvertexes.reverse();

    var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knotsU, knotsV, controlvertexes);
    getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    };

    this.obj = new CGFnurbsObject(this.scene, getSurfacePoint, this.partsX, this.partsY);
}

Plane.prototype.display = function() {
  
    this.obj.display();
}
