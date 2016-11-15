function Patch(scene, id, orderU, orderV, partsU, partsV, controlpoints) {
    CGFobject.call(this, scene);
    this.id = id;
    this.orderU = orderU;
    this.orderV = orderV;
    this.partsU = partsU;
    this.partsV = partsV;
    this.controlpoints = controlpoints;

    this.appearance = new CGFappearance(this.scene);
    this.appearance.setAmbient(1, 1, 1, 1);
    this.appearance.setDiffuse(1, 1, 1, 1);
    this.appearance.setSpecular(1, 1, 1, 1);
    this.appearance.setShininess(300);
    this.texture = new CGFtexture(this.scene, "images/texture.jpg");
    this.appearance.setTexture(this.texture);
    this.appearance.setTextureWrap('REPEAT', 'REPEAT');

    this.makeSurface(this.orderU, this.orderV, this.controlpoints);
}

Patch.prototype = Object.create(CGFobject.prototype);
Patch.prototype.constructor = Patch;

Patch.prototype.getKnotsVector = function(degree) {

    var v = new Array();
    for (var i = 0; i <= degree; i++) {
        v.push(0);
    }
    for (var i = 0; i <= degree; i++) {
        v.push(1);
    }
    return v;
}

Patch.prototype.getVertexs = function(degree1, degree2, controlvertexes) {
    var aux = 0;
    var aux2 = [];
    for (var i = 0; i <= degree1; ++i) {
        var temp = [];
        for (var j = 0; j <= degree2; ++j) {
            controlvertexes[aux].push(1);
            temp.push(controlvertexes[aux++]);
        }
        aux2.push(temp);
    }
    return aux2;
}

Patch.prototype.makeSurface = function(degree1, degree2, controlvertexes) {

    var knotsU = this.getKnotsVector(degree1); // to be built inside webCGF in later versions ()
    var knotsV = this.getKnotsVector(degree2); // to be built inside webCGF in later versions

    var vertexesModified = this.getVertexs(degree1, degree2, controlvertexes);

    var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knotsU, knotsV, vertexesModified);
    getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    };

    this.obj = new CGFnurbsObject(this.scene, getSurfacePoint, this.partsU, this.partsV);

}

Patch.prototype.display = function() {
    // draw scene
    this.appearance.apply();
    this.scene.translate(-3, 0.5, 0);
    this.obj.display();
}
