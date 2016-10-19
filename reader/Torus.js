/**
 * Torus
 * @constructor
 */
function Torus(scene, id, inner, outer, slices, loops) {
    CGFobject.call(this, scene);
    this.id = id;
    this.inner = inner;
    this.outer = outer;
    this.slices = slices;
    this.loops = loops;
	
	this.initBuffers();
};

Torus.prototype = Object.create(CGFobject.prototype);
Torus.prototype.constructor = Torus;

Torus.prototype.initBuffers = function() {
	
	
	
 	var outAngle=360/this.loops;
	var inAngle=360/this.slices;
	
	var degToRad = Math.PI/180;
	
	var stackOut=0;
	var stackIn=-90;
	this.vertices=[];
	this.normals=[];
	
	for(var i=0;i<this.loops;i++){
		for(var j=0;j<this.slices;j++){
			this.vertices.push((this.outer + this.inner +this.inner*Math.sin(stackIn*degToRad))*Math.cos(stackOut*degToRad),(this.outer + this.inner +this.inner*Math.sin(stackIn*degToRad))*Math.sin(stackOut*degToRad),	this.inner*Math.cos(stackIn*degToRad));
			this.normals.push((this.outer + this.inner +this.inner*Math.sin(stackIn*degToRad))*Math.cos(stackOut*degToRad),(this.outer + this.inner +this.inner*Math.sin(stackIn*degToRad))*Math.sin(stackOut*degToRad),Math.cos(stackIn*degToRad));
			stackIn+=inAngle;
		}
		stackOut+=outAngle;
		var stackIn=-90;
	}

	var contador=1;
	this.indices = [];
	for(var i=0;i<this.slices*this.loops;i++){
		if((i+1)%this.slices!=0){
			
			this.indices.push(i,(i+1)%(this.slices*this.loops),(i+this.slices+1)%(this.slices*this.loops));
			this.indices.push(i,(i+this.slices+1)%(this.slices*this.loops),(i+this.slices)%(this.slices*this.loops));
		}
		else{
			this.indices.push(i-(this.slices-1),(this.slices*contador)%(this.slices*this.loops),(i+this.slices)%(this.slices*this.loops));
			this.indices.push(i-(this.slices-1),(i+this.slices)%(this.slices*this.loops),i);
			contador++;
		}
		
	}
	this.texCoords=[];

 	for (var i = 0; i <= this.loops; i++) {
        for (var j = 0; j <= this.slices; j++) {
            this.texCoords.push(1 - (i / this.loops), 1 - (j / this.slices));
        }
    }
	

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
 
 Torus.prototype.updateTextures = function(length_s,length_t){
	 this.texCoords = [];
	 
	 for (var i = 0; i <= this.loops; i++) {
        for (var j = 0; j <= this.slices; j++) {
            this.texCoords.push((1 - (i / this.loops))/length_s, (1 - (j / this.slices))/length_t);
        }
    }
 }