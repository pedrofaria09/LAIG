/**
 * Cylinder
 * @constructor
 */
function ChessBoard(scene, id, du, dv, texture, su, sv,colors) {
    CGFobject.call(this, scene);

    this.id=id;
    this.du=du;
    this.dv=dv;
    this.texture=texture;
    this.su=su ||-1;
    this.sv=sv || -1;
    this.color1=colors[0];
    this.color2=colors[1];
    this.color3=colors[2];
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

  this.shader.setUniformsValues({du: this.du});
  this.shader.setUniformsValues({dv: this.dv});
  this.shader.setUniformsValues({su: this.su});
  this.shader.setUniformsValues({sv: this.sv});
}

ChessBoard.prototype.display = function() {
  this.texture.bind();
    this.scene.setActiveShader(this.shader);
  this.rectangle.display();
  this.scene.setActiveShader(this.scene.defaultShader);
}
