/**
 * Cylinder
 * @constructor
 */
function ChessBoard(scene, id, du, dv, texture,colors) {
    CGFobject.call(this, scene);

    this.material = new Material(this.scene,null,null);
    this.material.setAmbient(0,0,0,0);
    this.material.setEmission(0,0,0,0);
    this.material.setDiffuse(0,0,0,0);
    this.material.setSpecular(0,0,0,0);
    this.material.setTexture(texture);

    this.id=id;
    this.du=du;
    this.dv=dv;
    this.texture=texture;
    this.color1=colors[0];
    this.color2=colors[1];
    this.color3=colors[2];
    this.color4=colors[3];
    this.rectangle= new Plane(scene, null, 1,1, du, dv);
    this.initBuffers();

};

ChessBoard.prototype = Object.create(CGFobject.prototype);
ChessBoard.prototype.constructor = ChessBoard;

ChessBoard.prototype.initBuffers = function() {
  this.shader = new CGFshader(this.scene.gl, "Shader/texture.vert", "Shader/texture.frag");
  this.shader.setUniformsValues({color1: this.color1});
  this.shader.setUniformsValues({color2: this.color2});
  this.shader.setUniformsValues({color3: this.color3});
  this.shader.setUniformsValues({color4: this.color4});

  this.shader.setUniformsValues({du: this.du});
  this.shader.setUniformsValues({dv: this.dv});
}

ChessBoard.prototype.display = function() {
this.material.apply();
    this.scene.setActiveShader(this.shader);
  this.rectangle.display();
  this.scene.setActiveShader(this.scene.defaultShader);
}
