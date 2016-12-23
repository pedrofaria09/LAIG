function Game(scene) {
  this.scene=scene;
  this.turn=1;
  this.SelectedPick=0;
  this.SelectedPeca=0;
  this.State=0;
  this.SelectedObj=null;

  this.board=[['c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c'],
['b','b','b','b','b','b','b','b','b','b','b'],
['c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c'],
['b','b','b','b','b','b','b','b','b','b','b'],
['c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c'],
['b','b','b','b','b','b','b','b','b','b','b'],
['c','a','c','a','c','a','r','a','c','a','c','a','c','a','r','a','c','a','c','a','c'],
['b','b','b','b','b','b','b','b','b','b','b'],
['c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c'],
['b','b','b','b','b','b','b','b','b','b','b'],
['c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c'],
['b','b','b','b','b','b','b','b','b','b','b'],
['c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c'],
['b','b','b','b','b','b','b','b','b','b','b'],
['c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c'],
['b','b','b','b','b','b','b','b','b','b','b'],
['c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c'],
['b','b','b','b','b','b','b','b','b','b','b'],
['c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c'],
['b','b','b','b','b','b','b','b','b','b','b'],
['c','a','c','a','c','a','e','a','c','a','c','a','c','a','e','a','c','a','c','a','c'],
['b','b','b','b','b','b','b','b','b','b','b'],
['c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c'],
['b','b','b','b','b','b','b','b','b','b','b'],
['c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c'],
['b','b','b','b','b','b','b','b','b','b','b'],
['c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c']];
}

Game.prototype.stateMachine = function(pick) {
  var xmlscene=this;
    switch(this.State){
      case 0:
            if(pick>154 && pick<159)
              {
                var pos=this.coordsToPosition([this.SelectedObj.childrenPrimitives[0].y,this.SelectedObj.childrenPrimitives[0].x]);
                this.sendMessage('/checkChosenPawn./'+this.turn+'./'+this.boardToString()+'./['+pos.toString()+']./[]',function (data){
                    if(data.currentTarget.responseText=="ok"){
                      console.log();
                      xmlscene.changeSelected(pick-154);
                      xmlscene.changeState(1);
                    }

               });

              }
            break;
      case 1:
          if(pick<155){
            if(pick%14!=0)
              var posX=15-pick%14;
            else var posX=1;
            var posY=Math.ceil(pick/14);
            this.SelectedPick=pick;
            var pos=this.coordsToPosition([this.SelectedObj.childrenPrimitives[0].y,this.SelectedObj.childrenPrimitives[0].x]);
            this.sendMessage('/move./'+this.turn+'./'+this.boardToString()+'./['+pos.toString()+']./['+posX+','+posY+']',function (data){
                if(data.currentTarget.responseText=="ok"){
                  xmlscene.changePosPeca(posY,posX);
                  xmlscene.changeState(2);
                  xmlscene.SelectedPeca=0;
                  xmlscene.SelectedObj=null;
                }
                xmlscene.SelectedPick=0;
           });
          }
          break;
        case 2:
            if((pick>158 && pick<176 && this.turn==2)||(pick>175 && this.turn==1)){
                xmlscene.changeState(3);
            }
          break;
        case 3:
            if(pick<155){
              if(pick%14!=0)
                var posX=15-pick%14;
              else var posX=1;
              var posY=Math.ceil(pick/14);
              this.SelectedPick=pick;
              console.log(this.SelectedObj)
              var choice;
              if(this.SelectedObj.childrenPrimitives[0].tipo=="hor")
                choice=1;
              else choice =2;
              this.sendMessage('/placeWall./'+this.turn+'./'+this.boardToString()+'./'+choice+'./['+posX+','+posY+']',function (data){
                  if(data.currentTarget.responseText=="ok"){
                    if(choice==1)
                      xmlscene.changePosPeca(posY-0.5,posX+0.6);
                    else xmlscene.changePosPeca(posY+0.4,posX-0.6);
                    xmlscene.changeState(0);
                    xmlscene.SelectedObj=null;
                  }
                  xmlscene.SelectedPick=0;
             });
            }
          break;
    }
}

Game.prototype.changePosPeca = function(posY,posX) {
  this.SelectedObj.childrenPrimitives[0].changeY((14-posX+0.5)/14*20);
  this.SelectedObj.childrenPrimitives[0].changeX((posY-0.5)/11*20);
}

Game.prototype.boardToString = function() {
    var string="[";
    for(var i=0;i<this.board.length;i++){
      if(i!=this.board.length-1)
        string+='['+this.board[i].toString()+'],'
      else string+='['+this.board[i].toString()+']'
    }
    string+=']';

    return string;
}

Game.prototype.sendMessage = function(string,onSuccess,onError) {
  var requestPort = 8081
  var request = new XMLHttpRequest();
  request.open('GET', 'http://localhost:'+requestPort+string, true);

  request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
  request.onerror = onError || function(){console.log("Error waiting for response");};

  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.send();
}

Game.prototype.changeSelected = function(ind) {
  this.SelectedPeca=ind;
}

Game.prototype.changeState = function(ind) {
  this.State=ind;
}


Game.prototype.coordsToPosition = function(coords) {
    return [15-Math.ceil(coords[0]/20*14),Math.ceil(coords[1]/20*11)];
}
