/**
 * Peca
 * @constructor
 */
function Wall(scene, id,tipo,x,y) {
    CGFobject.call(this, scene);
    this.id = id;
    this.x=x;
    this.y=y;
    this.tipo=tipo;
    this.pecaId=id.split('ll')[1];
    this.placed=false;

    if(this.tipo=="hor")
    {
      this.lado= new Rectangle(scene, null, 0, 0, 40/11, 0.4);
       this.cima= new Rectangle(scene, null, 0, 0, 40/11, 1);
    }
    else{
      this.lado= new Rectangle(scene, null, 0, 0, 40/14, 0.4);
      this.cima= new Rectangle(scene, null, 0, 0, 40/14, 1);
    }
    this.fecho= new Rectangle(scene, null, 0, 0, 1, 0.4);

    this.material = new Material(this.scene,null,null);
    this.material.setEmission(0,0,0,1);
    this.material.setDiffuse(1,1,0,1);
  };

  Wall.prototype = Object.create(CGFobject.prototype);
  Wall.prototype.constructor = Wall;

  Wall.prototype.setComponent = function(component) {
    this.component=component;
    var centerx=this.x/2;
    var centerz=this.y/2;
    var radius=Math.sqrt(centerx*centerx+centery*centery);
    var ani=new UpAnimation(null, 0.1, centerx, 0, centerz, radius, -180);
    this.addAnimation(ani);
  };

  Wall.prototype.removeLastAnimation = function() {
      this.component.removeLastAnimation();
  };

  Wall.prototype.addAnimation = function(ani) {
      this.component.addAnimation(ani);
  };

  Wall.prototype.changeX = function(int) {
    this.x=int;
  };
  Wall.prototype.changeY = function(int) {
    this.y=int;
  };

  Wall.prototype.place = function() {
    this.placed=true;
  };

  Wall.prototype.unplace = function() {
    this.placed=false;
  };

  Wall.prototype.display = function() {
    if(this.scene.game.SelectedWall!=null && this.scene.game.SelectedWall==this)
      this.material.apply();
    if(this.tipo=="hor"){
      this.scene.pushMatrix();
      //  this.scene.translate(this.x,this.y,0);
        this.scene.translate(0,0,1);
        this.lado.display();
        this.scene.pushMatrix();
          this.scene.translate(0,0.4,-1);
          this.scene.rotate(-Math.PI,1,0,0);
          this.lado.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
          this.scene.translate(0,0.4,0);
          this.scene.rotate(-Math.PI/2,1,0,0);
          this.cima.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
          this.scene.translate(0,0,-1);
          this.scene.rotate(Math.PI/2,1,0,0);
          this.cima.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
          this.scene.translate(0,0,-1);
          this.scene.rotate(-Math.PI/2,0,1,0);
          this.fecho.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
          this.scene.translate(40/11,0,0);
          this.scene.rotate(Math.PI/2,0,1,0);
          this.fecho.display();
        this.scene.popMatrix();
      this.scene.popMatrix();
    }else{
      this.scene.pushMatrix();
      //  this.scene.translate(this.x,this.y,0);
        this.scene.translate(0,0,1);
        this.scene.rotate(-Math.PI/2,0,0,1);
        this.lado.display();
        this.scene.pushMatrix();
          this.scene.translate(0,0.4,-1);
          this.scene.rotate(-Math.PI,1,0,0);
          this.lado.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
          this.scene.translate(0,0.4,0);
          this.scene.rotate(-Math.PI/2,1,0,0);
          this.cima.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
          this.scene.translate(0,0,-1);
          this.scene.rotate(Math.PI/2,1,0,0);
          this.cima.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
          this.scene.translate(0,0,-1);
          this.scene.rotate(-Math.PI/2,0,1,0);
          this.fecho.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
          this.scene.translate(40/14,0,0);
          this.scene.rotate(Math.PI/2,0,1,0);
          this.fecho.display();
        this.scene.popMatrix();
      this.scene.popMatrix();
    }

  };
