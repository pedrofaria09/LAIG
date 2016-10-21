/**
 * MyCylinder
 * @constructor
 */
function MyCylinder(scene, id, base, top, height, slices, stacks) {
    CGFobject.call(this, scene);
    this.id = id;
    this.base = base;
    this.top = top;
    this.height = height;
    this.slices = slices;
    this.stacks = stacks;
    this.cil = new Cylinder(scene, this.base, this.top, this.height, this.slices, this.stacks);
    this.tampaBot = new Circle(scene, this.slices, this.base);
    this.tampaTop = new Circle(scene, this.slices, this.top);
    this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.display = function() {
    this.cil.display();
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.tampaTop.display();
    this.scene.popMatrix();
    this.scene.pushMatrix();
    this.scene.translate(0, 0, this.height);
    this.tampaBot.display();
    this.scene.popMatrix();
};

/*
MyCylinder.prototype.updateTextures = function(length_s,length_t){
	this.texCoords = [];

	 for (var i = 0; i <= this.stacks; i++) {
        for (var j = 0; j <= this.slices; j++) {
            this.texCoords.push((1 - (i / this.loops))/length_s, (1 - (j / this.slices))/length_t);
        }
    }
}*/
