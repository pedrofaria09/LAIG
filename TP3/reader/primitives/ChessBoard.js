/**
 * Cylinder
 * @constructor
 */
function ChessBoard(scene, id, du, dv, texture,colors) {
    CGFobject.call(this, scene);

    this.material = new Material(this.scene,null,null);
    this.material.setAmbient(1,0.3,1,1);
    this.material.setEmission(0,0,0,1);
    this.material.setDiffuse(1,0.3,0,1);
    this.material.setSpecular(1,1,1,1);
    this.material.setTexture(texture);

    this.scene=scene;
    this.id=id;
    this.du=du;
    this.dv=dv;
    this.texture=texture;
    this.color1=colors[0];
    this.color2=colors[1];
    this.color3=colors[2];
    this.color4=colors[3];
    this.rectangle= new Plane(scene, null, 1,1, 5*du, 5*dv);

};

ChessBoard.prototype = Object.create(CGFobject.prototype);
ChessBoard.prototype.constructor = ChessBoard;

ChessBoard.prototype.pickingBoard = function() {
var material= new Material(this.scene,null,null);
    for (var i = 0; i < this.du; i++) {
        for(var j=0;j<this.dv;j++){
          var ret = new Rectangle(this.scene,null,i/this.du,j/this.dv,(i+1)/this.du,(j+1)/this.dv);
          if(this.scene.pickMode){
              this.scene.registerForPick(this.scene.pickmeId, ret);
              this.scene.pickmeId++;
          }
          material.apply();
          ret.display();
        }
    }
}



ChessBoard.prototype.display = function() {
this.material.apply();
  this.rectangle.display();
  this.scene.pushMatrix();
    this.scene.translate(-0.5,-0.5,0.01);
    if(this.scene.pickMode)
      this.pickingBoard();

  this.scene.popMatrix();
}
