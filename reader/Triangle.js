/**
 * Triangle
 * @constructor
 */
function Triangle(scene, id, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
    CGFobject.call(this, scene);
    this.id = id;
    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;
    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;
    this.x3 = x3;
    this.y3 = y3;
    this.z3 = z3;

    

    this.initBuffers();
};

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor = Triangle;

Triangle.prototype.initBuffers = function() {
	
	
	
 	this.vertices = [
 	this.x1, this.y1, this.z1,
 	this.x2, this.y2, this.z2,
 	this.x3, this.y3, this.z3
 	];
	
	var a=Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2)+Math.pow(z1-z2,2));
	var b=Math.sqrt(Math.pow(x1-x3,2)+Math.pow(y1-y3,2)+Math.pow(z1-z3,2));
	var c=Math.sqrt(Math.pow(x3-x2,2)+Math.pow(y3-y2,2)+Math.pow(z3-z2,2));

 	this.indices = [
 	0, 1, 2
 	];
	
	//V=P1-P2 AND W=P3-P1
	
	var vx=this.x2-this.x1;
	var vy=this.y2-this.y1;
	var vz=this.z2-this.z1;
	
	var wx=this.x3-this.x1;
	var wy=this.y3-this.y1;
	var wz=this.z3-this.z1;

 	this.normals = [
    vy*wz-vz*wy,vz*wx-vx*wz,vx*wy-vy*wx,
    vy*wz-vz*wy,vz*wx-vx*wz,vx*wy-vy*wx,
    vy*wz-vz*wy,vz*wx-vx*wz,vx*wy-vy*wx
 	];
	
 	this.texCoords = [
 	0,0,
 	a,0,
 	a-c*((Math.pow(c,2)-Math.pow(b,2)+Math.pow(a,2))/(2*a*c)),a*Math.sin(Math.acos((Math.pow(c,2)-Math.pow(b,2)+Math.pow(a,2))/(2*a*c)))
 	]

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
 
 Triangle.prototype.updateTextures = function(length_s,length_t){
	 this.texCoords = [
 	0,0,
 	a/length_s,0,
 	(a-c*((Math.pow(c,2)-Math.pow(b,2)+Math.pow(a,2))/(2*a*c)))/length_s,a*Math.sin(Math.acos((Math.pow(c,2)-Math.pow(b,2)+Math.pow(a,2))/(2*a*c)))/length_t
 	]
 }
