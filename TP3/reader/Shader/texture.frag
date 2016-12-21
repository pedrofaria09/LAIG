#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler;

varying vec2 vTextureCoord;
varying vec4 coords;

uniform vec4 color1;
uniform vec4 color2;
uniform vec4 color3;
uniform vec4 color4;
uniform float du;
uniform float dv;

void main() {


		vec4 color;

		float posx=floor(vTextureCoord.s*du);
		float posy=floor(vTextureCoord.t*dv);
		float x=posx-2.0*floor(posx/2.0);
		float y=posy-2.0*floor(posy/2.0);

		if(posy==3.0 && (posx==3.0 || posx==7.0) )
				color=color3;
		else if(posy==10.0 && (posx==3.0 || posx==7.0) )
				color=color4;
		else if ((x==0.0 && y==0.0)||(x==1.0 && y==1.0)){
				color=color1;
		}
		else {
			color=color2;
		}
		gl_FragColor=color;
}
