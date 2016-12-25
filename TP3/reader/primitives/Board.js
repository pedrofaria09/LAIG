function Board(scene, id) {
    CGFobject.call(this, scene);
    this.id = id;
    this.baseBaixo=new Rectangle(this.scene,null,0,0,22,22);
    this.baseBaixoPecas=new Rectangle(this.scene,null,0,0,22,4);
    this.lado=new Rectangle(this.scene,null,0,0,1,30);
    this.tampa=new Rectangle(this.scene,null,0,0,1,22);
    this.ladoCut=new Rectangle(this.scene,null,0,0,1,20);
  };

  Board.prototype = Object.create(CGFobject.prototype);
  Board.prototype.constructor = Board;


  Board.prototype.display = function() {
      this.scene.pushMatrix();
        this.scene.translate(21,-1,-0.02);
        this.scene.rotate(Math.PI,0,1,0);
        this.baseBaixo.display();
      this.scene.popMatrix();
      //lado Esq
      this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2,0,1,0);
        this.scene.translate(-0.02,-5,1);
        this.lado.display();
      this.scene.popMatrix();
      this.scene.pushMatrix();
        this.scene.translate(-1,-5,0.98);
        this.lado.display();
      this.scene.popMatrix();
      this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2,0,1,0);
        this.scene.translate(-0.98,-5,0);
        this.lado.display();
      this.scene.popMatrix();
      //lado Dir
      this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2,0,1,0);
        this.scene.translate(0,-4.98,-20);
        this.lado.display();
      this.scene.popMatrix();
      this.scene.pushMatrix();
        this.scene.translate(20,-5,0.98);
        this.lado.display();
      this.scene.popMatrix();
      this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2,0,1,0);
        this.scene.translate(-0.98,-5,21);
        this.lado.display();
      this.scene.popMatrix();
      //lado baixo
      this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2,0,0,1);
        this.scene.translate(0,0,0.98);
        this.ladoCut.display();
      this.scene.popMatrix();
      this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2,0,0,1);
        this.scene.rotate(-Math.PI/2,0,1,0);
        this.scene.translate(-0.02,-20,1);
        this.ladoCut.display();
      this.scene.popMatrix();
      this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2,0,0,1);
        this.scene.rotate(Math.PI/2,0,1,0);
        this.scene.translate(-0.98,-20,0);
        this.ladoCut.display();
      this.scene.popMatrix();
      //lado cima
      this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2,0,0,1);
        this.scene.translate(-21,0,0.98);
        this.ladoCut.display();
      this.scene.popMatrix();
      this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2,0,0,1);
        this.scene.rotate(-Math.PI/2,0,1,0);
        this.scene.translate(-0.02,-20,-20);
        this.ladoCut.display();
      this.scene.popMatrix();
      this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2,0,0,1);
        this.scene.rotate(Math.PI/2,0,1,0);
        this.scene.translate(-0.98,-20,21);
        this.ladoCut.display();
      this.scene.popMatrix();
      //base peçasBaixo
      this.scene.pushMatrix();
        this.scene.translate(-1,-5,0);
        this.baseBaixoPecas.display();
        this.scene.rotate(Math.PI,0,1,0);
        this.scene.translate(-22,0,0.02);
        this.baseBaixoPecas.display();
      this.scene.popMatrix();

      //Baixo Baixo
      this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2,0,0,1);
        this.scene.translate(4,0,0.98);
        this.ladoCut.display();
      this.scene.popMatrix();
      this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2,0,0,1);
        this.scene.rotate(-Math.PI/2,0,1,0);
        this.scene.translate(-0.02,-21,5);
        this.tampa.display();
      this.scene.popMatrix();
      this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2,0,0,1);
        this.scene.rotate(Math.PI/2,0,1,0);
        this.scene.translate(-0.98,-20,-4);
        this.ladoCut.display();
      this.scene.popMatrix();

      //base peçasCima
      this.scene.pushMatrix();
        this.scene.translate(-1,21,0);
        this.baseBaixoPecas.display();
        this.scene.rotate(Math.PI,0,1,0);
        this.scene.translate(-22,0,0.02);
        this.baseBaixoPecas.display();
      this.scene.popMatrix();

      //Cima Cima
      this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2,0,0,1);
        this.scene.translate(-25,0,0.98);
        this.ladoCut.display();
      this.scene.popMatrix();
      this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2,0,0,1);
        this.scene.rotate(-Math.PI/2,0,1,0);
        this.scene.translate(-0.02,-20,-24);
        this.ladoCut.display();
      this.scene.popMatrix();
      this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2,0,0,1);
        this.scene.rotate(Math.PI/2,0,1,0);
        this.scene.translate(-0.98,-21,25);
        this.tampa.display();
      this.scene.popMatrix();
  };
