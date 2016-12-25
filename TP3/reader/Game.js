function Game(scene) {
  this.scene=scene;
  this.turn=1;
  this.SelectedPick=0;
  this.SelectedPeca=0;
  this.SelectedWall=null;
  this.State=0;
  this.SelectedObj=null;
  this.wallsPlaced=0;
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
  console.log(this.State);
    switch(this.State){
      case 0:
            if(pick>154 && pick<159)
              {
                var pos=this.coordsToPosition([this.SelectedObj.childrenPrimitives[0].y,this.SelectedObj.childrenPrimitives[0].x]);
                this.sendMessage('/checkChosenPawn./'+this.turn+'./'+this.boardToString()+'./['+pos.toString()+']./[]',function (data){
                    if(data.currentTarget.responseText=="ok"){
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

                  xmlscene.SelectedPeca=0;
                  xmlscene.SelectedObj=null;
                  if(xmlscene.turn==1)
                  xmlscene.changePawnPos(pos,[posX,posY],'r');
                  else xmlscene.changePawnPos(pos,[posX,posY],'e');

                  if(xmlscene.hasGameEnded()){
                    xmlscene.changeState(4);
                  }
                  else if(xmlscene.wallsPlaced==32)
                    {
                      xmlscene.changeState(0);
                      xmlscene.changeTurn();
                    }else xmlscene.changeState(2);

                }
                xmlscene.SelectedPick=0;
           });
          }
          break;
        case 2:
            if((pick>158 && pick<175 && this.turn==2)||(pick>174 && this.turn==1)){
                this.SelectedWall=this.SelectedObj.childrenPrimitives[0];
                xmlscene.changeState(3);
            }
          break;
        case 3:
            if(pick<155){
              if(!this.SelectedWall.placed){
                if(pick%14!=0)
                  var posX=15-pick%14;
                else var posX=1;
                var posY=Math.ceil(pick/14);
                this.SelectedPick=pick;
                var choice;
                if(this.SelectedWall.tipo=="hor")
                  choice=2;
                else choice =1;
                this.sendMessage('/placeWall./'+this.turn+'./'+this.boardToString()+'./'+choice+'./['+posX+','+posY+']',function (data){
                    if(data.currentTarget.responseText=="ok"){
                      if(choice==2)
                        xmlscene.changePosPeca(posY-0.5,posX+0.6);
                      else xmlscene.changePosPeca(posY+0.4,posX-0.6);
                      xmlscene.changeState(0);
                      xmlscene.changeTurn();
                      xmlscene.SelectedWall.place();
                      xmlscene.SelectedWall=null;
                      xmlscene.SelectedObj=null;
                      if(choice==2)
                        xmlscene.placeWall([posX,posY],'w');
                      else xmlscene.placeWall([posX,posY],'q');
                    }
                    xmlscene.wallsPlaced++;
                    xmlscene.SelectedPick=0;
               });
             }else{
                 xmlscene.changeState(2);
                 this.SelectedObj=null;
             }

            }
          break;
    }
}

Game.prototype.changePosPeca = function(posY,posX) {
  this.SelectedObj.childrenPrimitives[0].changeY((14-posX+0.5)/14*20);
  this.SelectedObj.childrenPrimitives[0].changeX((posY-0.5)/11*20);
}

Game.prototype.changeTurn = function() {
  if(this.turn==1)
    this.turn=2;
  else this.turn=1;
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

Game.prototype.changePawnPos = function(PosI,PosF,Char) {
  this.board[2*PosI[0]-2][2*PosI[1]-2]='c';
  this.board[2*PosF[0]-2][2*PosF[1]-2]=Char;
}

Game.prototype.placeWall = function(Pos,Char) {
  if(Char=='q'){
    this.board[2*Pos[0]-2][2*Pos[1]-1]=Char;
    this.board[2*Pos[0]][2*Pos[1]-1]=Char;
  }
  else{
     this.board[2*Pos[0]-1][Pos[1]]=Char;
      this.board[2*Pos[0]-1][Pos[1]-1]=Char;
  }
}

Game.prototype.changeSelected = function(ind) {
  this.SelectedPeca=ind;
}

Game.prototype.changeState = function(ind) {
  this.State=ind;
}

Game.prototype.hasGameEnded = function(ind) {
  if((this.board[6][6]=='e' && this.board[6][14]=='e')||(this.board[20][6]=='r' && this.board[20][14]=='r'))
    return true;
  else return false;
}

Game.prototype.coordsToPosition = function(coords) {
    return [15-Math.ceil(coords[0]/20*14),Math.ceil(coords[1]/20*11)];
}
