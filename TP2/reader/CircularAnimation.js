function CircularAnimation(id,span,centerx,centery,centerz,radius,startang,rotang) {
    Animation.call(this,id,span,'circular');

  this.centerx=centerx;
  this.centery=centery;
  this.centerz=centerz;
  this.radius=radius;
  this.startang=startang;
  this.rotang=rotang;

	//this.velocity=this.distance()/this.span;
  //this.matrix=mat4.create();
  //this.lastIterator=0;

	//this.timeFunction();
}
