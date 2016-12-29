function UpAnimation(id,span,centerx,centery,centerz,radius,startang) {
    Animation.call(this,id,span,'up');

  this.centerx=centerx;
  this.centery=centery;
  this.centerz=centerz;
  this.radius=radius;
  this.startang=-180;
  this.rotang=180;
  this.time=0;
  this.itsDone=false;
}

UpAnimation.prototype = Object.create(Animation.prototype);
UpAnimation.prototype.constructor=UpAnimation;

UpAnimation.prototype.callMatrix = function(t){
  var matrix= mat4.create();
  if(!this.itsDone){
    if(this.time==0){
      this.time=t;
      t=0;
    }
    else{
      t=t-this.time;
    }
  }
  if(t>this.span)
    {
      this.itsDone=true;
      t=this.span;
    }
    mat4.translate(matrix,matrix,vec3.fromValues(this.centerx+this.centerx*Math.cos(this.startang*Math.PI/180+(this.rotang*Math.PI/180)*(t/this.span)),this.centerz+this.centerz*Math.cos(this.startang*Math.PI/180+(this.rotang*Math.PI/180)*(t/this.span)),-this.radius*Math.sin(this.startang*Math.PI/180+(this.rotang*Math.PI/180)*(t/this.span))));
    return matrix;
}
