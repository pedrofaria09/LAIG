function Vehicle(scene,id) {
	CGFobject.call(this, scene);
  this.id=id;

  this.centro= new Sphere(this.scene, null, 0.6, 40, 40);

  this.cil= new Cylinder(this.scene, 0.2, 0.2, 2.4, 50, 50);

	this.fora = new Patch(this.scene,null, 3,2, 10, 10,
		[	   [-0.7, 0.0, 0.5, 1 ,1],
        [-0.7, 0.0, 0.0, 1,1],
        [-0.7, 0.0, -0.5, 1,1 ],

				 [ 0, 1, 0.5, 1 ,1],
				 [ 0, 1, 0, 1 ,1],
				 [ 0, 1, -0.5, 1,1 ],

         [ 0.5, 1, 0.5, 1 ,1],
				 [ 0.5, 1, 0, 1 ,1],
				 [ 0.5, 1, -0.5, 1,1 ],

        [ 1.2, 0.0, 0.5, 1 ,1],
        [ 1.2, 0.0, 0.0, 1 ,1],
        [ 1.2, 0.0, -0.5, 1 ,1]
	]);
  this.dentro = new Patch(this.scene,null, 3,2, 10, 10,
		[

      [-0.7, 0.0, -0.5, 1 ,1],
          [-0.7, 0.0, 0.0, 1,1],
          [-0.7, 0.0, 0.5, 1,1 ],

  				 [ 0, 1, -0.5, 1 ,1],
  				 [ 0, 1, 0, 1 ,1],
  				 [ 0, 1, 0.5, 1,1 ],

           [ 0.5, 1, -0.5, 1 ,1],
  				 [ 0.5, 1, 0, 1 ,1],
  				 [ 0.5, 1, 0.5, 1,1 ],

          [ 1.2, 0.0, -0.5, 1 ,1],
          [ 1.2, 0.0, 0.0, 1 ,1],
          [ 1.2, 0.0, 0.5, 1 ,1]


	]);
	this.asa=new CGFtexture(this.scene, './images/asa.png');
};

Vehicle.prototype = Object.create(CGFobject.prototype);
Vehicle.prototype.constructor = Patch;

Vehicle.prototype.display = function () {
	this.scene.pushMatrix();
    this.scene.pushMatrix();
      this.scene.translate(-0.25,0.5,0);
			this.asa.bind();
      this.fora.display();
      this.dentro.display();
    this.scene.popMatrix();
    this.scene.pushMatrix();
      this.scene.rotate(Math.PI,1,0,0);
      this.scene.translate(-0.25,0.5,0);
      this.fora.display();
      this.dentro.display();
    this.scene.popMatrix();
    this.centro.display();
    this.scene.pushMatrix();
      this.scene.translate(0,1.2,0);
      this.scene.rotate(Math.PI/2,1,0,0);
      this.cil.display();
    this.scene.popMatrix();
	this.scene.popMatrix();
};
