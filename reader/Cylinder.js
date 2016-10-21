/**
 * Cylinder
 * @constructor
 */
function Cylinder(scene, base, top, height, slices, stacks) {
    CGFobject.call(this, scene);
    //this.id = id;
    this.base = base;
    this.top = top;
    this.height = height;
    this.slices= 50;//= slices; ESTA A LER MAL ESTA VARIAVEL
    this.stacks = stacks;


    this.initBuffers();
};

Cylinder.prototype = Object.create(CGFobject.prototype);
Cylinder.prototype.constructor = Cylinder;

Cylinder.prototype.initBuffers = function() {
  

   var basesDX = (this.base - this.top) / this.stacks;
   var startingTop=this.top;

  var height=0;

   this.vertices = [];
    
    //this.indices = [];
    
    this.normals = [];
    this.texCoords = [];
    
    var deg2rad = Math.PI / 180.0;
    var alpha = (360 / this.slices) * deg2rad;
    
    
   
        for (var j = 0; j <= this.stacks; j++) {
             for (var i = 0; i < this.slices; i++) 
			{
            
            this.vertices.push(Math.cos((i) * alpha)*startingTop, Math.sin((i) * alpha)*startingTop, height );
            this.normals.push(Math.cos((i) * alpha), Math.sin((i) * alpha), 0);
        
			}
			
			i=0;
			this.vertices.push(Math.cos((i) * alpha)*startingTop, Math.sin((i) * alpha)*startingTop, height);
			this.normals.push(Math.cos((i) * alpha), Math.sin((i) * alpha), 0);
			height+=this.height/this.stacks;
			startingTop+=basesDX;
		}
		this.indices = [];
	
	

    for (var i = 0; i < this.stacks; i++) 
    {
        for (var j = 0; j < this.slices; j++) 
        {
            
            this.indices.push(j+i*(this.slices+1),j+1+i*(this.slices+1),j+2+this.slices+i*(this.slices+1));
            this.indices.push(j+i*(this.slices+1),j+2+this.slices+i*(this.slices+1),j+1+this.slices+i*(this.slices+1));
        
        }
    }
	
    for (var j = 0; j <= this.stacks; j++) 
    {
        for (var i = 0; i <= this.slices; i++) 
		{
			this.texCoords.push(i/(this.slices-1),1-j/this.stacks);
        
		}
	}
	 

   this.primitiveType = this.scene.gl.TRIANGLES;
   this.initGLBuffers();
};

Cylinder.prototype.updateTextures = function(length_s,length_t){
	this.texCoords = [];
	 
	 for (var i = 0; i <= this.stacks; i++) {
        for (var j = 0; j <= this.slices; j++) {
            this.texCoords.push((1 - (i / this.loops))/length_s, (1 - (j / this.slices))/length_t);
        }
    }
}
