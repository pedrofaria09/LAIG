/**
 * Peca
 * @constructor
 */
function Peca(scene, id, x,y,realx,realy) {
    CGFobject.call(this, scene);
    this.id = id;
    this.x=x;
    this.y=y;
    this.realx=realx;
    this.realy=realy;
    this.pecaId=id.split('a')[1];

    this.initX=x;
    this.initY=y;

    this.initRealX=realx;
    this.initRealY=realy;

    this.component=null;

    this.cil = new MyCylinder(scene,null, 0.5,0.5,1, 20,20);

    this.material = new Material(this.scene,null,null);
    this.material.setEmission(0,0,0,1);
    this.material.setDiffuse(1,1,0,1);

    this.color1 = new Material(this.scene,null,null);
    this.color1.setEmission(0,0,0,1);
    this.color1.setDiffuse(0,1,0,1);

    this.color2 = new Material(this.scene,null,null);
    this.color2.setEmission(0,0,0,1);
    this.color2.setDiffuse(0,0,0,1);

      this.replaceCil = new MyCylinder(scene,null, 0.52,0.52,1.02, 20,20);
  };

  Peca.prototype = Object.create(CGFobject.prototype);
  Peca.prototype.constructor = Peca;

  Peca.prototype.changeX = function(int) {
    this.x=int;
  };

  Peca.prototype.setComponent = function(component) {
    this.component=component;
    var centerx=this.x/2;
    var centerz=this.y/2;
    var radius=Math.sqrt(centerx*centerx+centery*centery);
    var ani=new UpAnimation(null, 0.1, centerx, 0, centerz, radius, -180);
    this.addAnimation(ani);
  };

  Peca.prototype.addAnimation = function(ani) {
      this.component.addAnimation(ani);
  };

  Peca.prototype.removeLastAnimation = function() {
      this.component.removeLastAnimation();
  };

  Peca.prototype.changeY = function(int) {
    this.y=int;
  };

  Peca.prototype.reset = function() {
    this.x=this.initX;
    this.y=this.initY;
    this.realx=this.initRealX;
    this.realy=this.initRealY;
    this.component.resetAnimation();
  };

  Peca.prototype.display = function() {

      this.scene.pushMatrix();
        if(this.pecaId<3)
          this.color1.apply();
        else this.color2.apply();
        this.cil.display();
        if(this.scene.game!=null && this.scene.game.SelectedPeca==this.pecaId){
          this.material.apply();
          this.replaceCil.display();
        }
      this.scene.popMatrix();
  };
