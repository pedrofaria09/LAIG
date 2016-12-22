/**
 * Peca
 * @constructor
 */
function Peca(scene, id, x,y) {
    CGFobject.call(this, scene);
    this.id = id;
    this.x=x;
    this.y=y;
    this.pecaId=id.split('a')[1];
    this.cil = new MyCylinder(scene,null, 0.5,0.5,1, 20,20);

    this.material = new Material(this.scene,null,null);
    this.material.setEmission(0,0,0,1);
    this.material.setDiffuse(1,1,0,1);

      this.replaceCil = new MyCylinder(scene,null, 0.52,0.52,1.02, 20,20);
  };

  Peca.prototype = Object.create(CGFobject.prototype);
  Peca.prototype.constructor = Peca;

  Peca.prototype.changeX = function(int) {
    this.x=int;
  };
  Peca.prototype.changeY = function(int) {
    this.y=int;
  };

  Peca.prototype.display = function() {
    if(this.pecaId==1)
    console.log(this.y);
      this.scene.pushMatrix();
        this.scene.translate(this.x,this.y,0);
        this.cil.display();
        if(this.scene.game.SelectedPeca==this.pecaId){
          this.material.apply();
          this.replaceCil.display();
        }
      this.scene.popMatrix();
  };