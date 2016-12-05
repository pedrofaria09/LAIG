function CircularAnimation(id,span,centerx,centery,centerz,radius,startang,rotang) {
    Animation.call(this,id,span,'circular');

  this.centerx=centerx;
  this.centery=centery;
  this.centerz=centerz;
  this.radius=radius;
  this.startang=startang;
  this.rotang=rotang;


}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor=LinearAnimation;

CircularAnimation.prototype.callMatrix = function(t){
  var matrix= mat4.create();
  if(t>this.span)
    t=this.span;

    mat4.translate(matrix,matrix,vec3.fromValues(this.centerx,this.centery,this.centerz));
    mat4.translate(matrix,matrix,vec3.fromValues(this.radius*Math.cos(this.startang*Math.PI/180+(this.rotang*Math.PI/180)*(t/this.span)),0,-this.radius*Math.sin(this.startang*Math.PI/180+(this.rotang*Math.PI/180)*(t/this.span))));
    mat4.rotate(matrix,matrix,(this.startang+ this.rotang*(t/this.span))*Math.PI/180,[0, 1, 0]);


  return matrix;
}
