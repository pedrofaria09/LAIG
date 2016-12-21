attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform bool uUseTexture;

varying vec4 vFinalColor;
varying vec2 vTextureCoord;

varying vec4 coords;
varying vec4 normal;

uniform float du;
uniform float dv;


void main() {

	vTextureCoord = aTextureCoord;



	float posx=floor(vTextureCoord.s*du);
	float posy=floor(vTextureCoord.t*dv);


	vec4 vertex=vec4(aVertexPosition, 1.0);

	gl_Position = uPMatrix * uMVMatrix * vertex;

	normal = vec4(aVertexNormal, 1.0);

	coords=vertex/10.0;

}
