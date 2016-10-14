function Sphere(scene, id, radius, slices, stacks) {
    CGFobject.call(this, scene);

    this.id = id;
    this.slices = slices;
    this.stacks = stacks;
    this.radius = radius;
    this.scene = scene;
    this.initBuffers();

    this.sphereTop = new MyHalfSphere(scene, slices, stacks);
    this.sphereBottom = new MyHalfSphere(scene, slices, stacks);
};


Sphere.prototype = Object.create(CGFobject.prototype);
Sphere.prototype.constructor = Sphere;

Sphere.prototype.display = function(){
    this.scene.pushMatrix();
      this.sphereTop.display();
      this.scene.rotate(Math.PI,1,0,0);
      this.sphereBottom.display();
    this.scene.popMatrix();

};
