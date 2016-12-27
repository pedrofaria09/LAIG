function Game(scene) {
  this.scene=scene;
  this.turn=1;
  this.SelectedPick=0;
  this.SelectedPeca=0;
  this.SelectedWall=null;
  this.State=0;
  this.SelectedObj=null;
  this.wallsPlaced=0;
  this.player1Vitories=0;
  this.player2Vitories=0;
  this.player1WallsLeft=16;
  this.player2WallsLeft=16;
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

this.stack=new Array();

}

Game.prototype.stateMachine = function(pick) {
  if(this.scene.typeOfGame=="Human vs Human")
    this.stateMachineHuman(pick);
  else if(this.scene.typeOfGame=="CPU vs CPU" && this.scene.dificulty!=null)
    this.stateMachineCPU();
  else if(this.scene.typeOfGame=="Human vs CPU" && this.scene.dificulty!=null)
    this.stateMachineHumanVsCPU(pick);
}

Game.prototype.stateMachineHumanVsCPU = function(pick){
    switch (this.turn) {
      case 1:
        this.stateMachineHuman(pick);
        break;
      case 2:
        this.stateMachineCPU();
        break;
    }
}

Game.prototype.stateMachineCPU = function() {
  var xmlscene=this;
  switch(this.State){
    case 0:
    if(this.scene.dificulty=="Random"){
      this.sendMessage('/moveRandom./'+this.turn+'./'+this.boardToString()+'./[]./[]',function (data){
        var newBoard=xmlscene.getBoard(data.currentTarget.responseText);
        xmlscene.whoMoved(newBoard);
        if(xmlscene.hasGameEnded())
          xmlscene.changeState(4);
        else if(!arraysEqual([0,0],xmlscene.findNumberWalls()))
          xmlscene.changeState(1);
        else{
          xmlscene.changeTurn();
        }
      });
    }else if(this.scene.dificulty=="Impossible"){
      this.sendMessage('/moveSmart./'+this.turn+'./'+this.boardToString()+'./[]./[]',function (data){
        var newBoard=xmlscene.getBoard(data.currentTarget.responseText);
        xmlscene.whoMoved(newBoard);
        if(xmlscene.hasGameEnded())
          xmlscene.changeState(4);
        else if(!arraysEqual([0,0],xmlscene.findNumberWalls()))
          xmlscene.changeState(1);
        else{
          xmlscene.changeTurn();
        }
      });
    }
    break;
    case 1:
    var walls=this.findNumberWalls();
    if(this.scene.dificulty=="Random"){
      this.sendMessage('/placeRandom./'+this.turn+'./'+this.boardToString()+'./'+walls[0]+'./'+walls[1],function (data){
        var newBoard=xmlscene.getBoard(data.currentTarget.responseText);
        xmlscene.placeRandomWall(newBoard);
        xmlscene.updateNumberOfPecies();
        xmlscene.changeState(0);
        xmlscene.changeTurn();
      });
    }else if(this.scene.dificulty=="Impossible"){
      this.sendMessage('/placeSmart./'+this.turn+'./'+this.boardToString()+'./'+walls[0]+'./'+walls[1],function (data){
        var newBoard=xmlscene.getBoard(data.currentTarget.responseText);
        xmlscene.placeRandomWall(newBoard);
        xmlscene.updateNumberOfPecies();
        xmlscene.changeState(0);
        xmlscene.changeTurn();
      });
    }
    break;
  }

}

Game.prototype.updateNumberOfPecies = function(){
  this.player1WallsLeft=0;
  this.player2WallsLeft=0;
  console.log(this.scene.walls);
  for(var i=0;i<32;i++){
    if(!this.scene.walls[i].placed){
      if( i < 16 )
        this.player2WallsLeft++;
      else
        this.player1WallsLeft++;
    }
  }
}
Game.prototype.getBoard = function(board) {
  var realBoard=[];
  var array=[];
  for(var i=0;i<board.length;i++){
    if(board[i]!='[' && board[i]!=']'&& board[i]!=',')
      array.push(board[i]);
    else if(board[i]==']'&& array.length>0){
      realBoard.push(array);
      array=[];
    }
  }
  return realBoard;
}

Game.prototype.placeRandomWall = function(board){
  //char, x, y = array
  var array = this.findWallPlaced(board);
  var wall=this.find1stPlaced(array[0]);

  wall.place();
  if(array[0]=='w')
    {
      this.stack.push([wall,[wall.x,wall.y],[array[2]+1-0.5,(1+array[1])/2+0.6],[array[2]+1,(1+array[1])/2]]);
      this.changePosPeca((array[2]+1)-0.5,(1+array[1])/2+0.6,wall);
    }
  else{
    this.stack.push([wall,[wall.x,wall.y],[(array[2]+1)/2+0.4,(array[1]+1)/2],[(array[2]+1)/2,(1+array[1])/2]]);
    this.changePosPeca((array[2]+1)/2+0.4,(array[1]+1)/2,wall);
  }

  this.board=board;
}

Game.prototype.find1stPlaced = function(char){
  var max,min;
  if(this.turn==2){
    min=0;
    max=16;
  }else if(this.turn==1){
    min=16;
    max=32;
  }
  for(var i=min;i<max;i++){
    if(!this.scene.walls[i].placed){
      if(this.scene.walls[i].tipo=='hor' && char=='w')
        return this.scene.walls[i];
      else if(this.scene.walls[i].tipo=='ver' && char=='q'){
        return this.scene.walls[i];
      }
    }
  }
}

Game.prototype.findWallPlaced = function(board) {
  for(var i=0;i<board.length;i++){
    for(var j=0;j<board[i].length;j++){
      if(board[i][j]!=this.board[i][j]){
        return [board[i][j],i,j];
      }
    }
  }
}

Game.prototype.whoMoved = function(board) {
  var peca;
  for(var i=0;i<this.scene.pecas.length;i++){
    var posx=2*this.scene.pecas[i].realx-2;
    var posy=2*this.scene.pecas[i].realy-2;
      if(i<2 && board[posx][posy]!='r'){
        peca=this.scene.pecas[i];
      }
      else if(i>1 && board[posx][posy]!='e'){
        peca=this.scene.pecas[i];
      }
  }
  this.board=board;
  var posMoved;
  if(peca.pecaId<3)
    posMoved= this.findPositionMoved(board,'r',[peca.realy,peca.realx]);
  else posMoved = this.findPositionMoved(board,'e',[peca.realy,peca.realx]);
    peca.realx=posMoved[0];
    peca.realy=posMoved[1];
    this.stack.push([peca,[peca.x,peca.y],[peca.realx,peca.realy]]);
    this.changePosPeca(posMoved[1],posMoved[0],peca);
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

Game.prototype.findNumberWalls = function() {
  var max,min;
  if(this.turn==1){
    min=0;
    max=16;
  }else if(this.turn==2){
    min=16;
    max=32;
  }
  var Hor=0,Ver=0;
  for(var i=min;i<max;i++){
    if(!this.scene.walls[i].placed){
      if(this.scene.walls[i].tipo=='hor')
        Hor++;
      else Ver++;
    }
  }
  return [Hor,Ver];
}

Game.prototype.findPositionMoved = function(board,char,pos) {
  var array=[];
  for(var i=0;i<board.length;i++){
    for(var j=0;j<board[i].length;j++){
      if(board[i][j]==char){
          if(char=='r'){
            if(!arraysEqual([(i+2)/2,(j+2)/2], [this.scene.pecas[0].realx,this.scene.pecas[0].realy]) && !arraysEqual([(i+2)/2,(j+2)/2] ,[this.scene.pecas[1].realx,this.scene.pecas[1].realy])){
              return [(i+2)/2,(j+2)/2];
            }

          }else if(char=='e'){
            if(!arraysEqual([(i+2)/2,(j+2)/2],[this.scene.pecas[2].realx,this.scene.pecas[2].realy]) && !arraysEqual([(i+2)/2,(j+2)/2],[this.scene.pecas[3].realx,this.scene.pecas[3].realy]))
                          return [(i+2)/2,(j+2)/2];
          }}
    }
  }
  return null;
}

Game.prototype.undo= function(){
  if(this.scene.typeOfGame=="Human vs Human" || (this.scene.typeOfGame=="Human vs CPU" && this.turn==1)){
    if(this.stack.length>=4){
      //1a peca
      var array=this.stack[this.stack.length-4];
      array[0].x=array[1][0];
      array[0].y=array[1][1];
      var posI=this.coordsToPosition([array[1][1],array[1][0]]);
      array[0].realx=posI[0];
      array[0].realy=posI[1];
      if(array[0].pecaId<3)
        this.changePawnPos(array[2],posI,'r');
      else this.changePawnPos(array[2],posI,'e');
      //1a parede
      array=this.stack[this.stack.length-3];
      array[0].x=array[1][0];
      array[0].y=array[1][1];
      array[0].unplace();
      if(array[0].tipo=="hor")
        this.placeWall(array[3],'w','b');
      else if(array[0].tipo=="ver")
        this.placeWall(array[3],'q','a');
      //2a peca
      array=this.stack[this.stack.length-2];
      array[0].x=array[1][0];
      array[0].y=array[1][1];
      var posI=this.coordsToPosition([array[1][1],array[1][0]]);
      array[0].realx=posI[0];
      array[0].realy=posI[1];
      if(array[0].pecaId<3)
        this.changePawnPos(array[2],posI,'r');
      else this.changePawnPos(array[2],posI,'e');
      //2a parede
      array=this.stack[this.stack.length-1];
      array[0].x=array[1][0];
      array[0].y=array[1][1];
      array[0].unplace();
      if(array[0].tipo=="hor")
        this.placeWall(array[3],'w','b');
      else if(array[0].tipo=="ver")
        this.placeWall(array[3],'q','a');
    }
  }
}

Game.prototype.stateMachineHuman = function(pick) {
  var xmlscene=this;
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
                  xmlscene.stack.push([xmlscene.SelectedObj.childrenPrimitives[0],[xmlscene.SelectedObj.childrenPrimitives[0].x,xmlscene.SelectedObj.childrenPrimitives[0].y],[posX,posY]]);
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
                      if(choice==2){
                        xmlscene.stack.push([xmlscene.SelectedObj.childrenPrimitives[0],[xmlscene.SelectedObj.childrenPrimitives[0].x,xmlscene.SelectedObj.childrenPrimitives[0].y],[posY-0.5,posX+0.6],[posY,posX]]);
                        xmlscene.changePosPeca(posY-0.5,posX+0.6);
                      }
                      else {
                        xmlscene.stack.push([xmlscene.SelectedObj.childrenPrimitives[0],[xmlscene.SelectedObj.childrenPrimitives[0].x,xmlscene.SelectedObj.childrenPrimitives[0].y],[posY+0.4,posX-0.6],[posY,posX]]);
                        xmlscene.changePosPeca(posY+0.4,posX-0.6);
                      }
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
                    xmlscene.updateNumberOfPecies();
               });
             }else{
                 xmlscene.changeState(2);
                 this.SelectedObj=null;
             }
            }
          
          break;
    }
}

Game.prototype.changePosPeca = function(posY,posX,updatePeca) {
  var peca=updatePeca || this.SelectedObj.childrenPrimitives[0];
  peca.changeY((14-posX+0.5)/14*20);
  peca.changeX((posY-0.5)/11*20);
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

Game.prototype.placeWall = function(Pos,Char,Char2) {
  charToPlace=Char2||Char;
  console.log(Pos);
  console.log(charToPlace);
  if(Char=='q'){
    this.board[2*Pos[0]-2][2*Pos[1]-1]=charToPlace;
    this.board[2*Pos[0]][2*Pos[1]-1]=charToPlace;
  }
  else{
     this.board[2*Pos[0]-1][Pos[1]]=charToPlace;
      this.board[2*Pos[0]-1][Pos[1]-1]=charToPlace;
  }
}

Game.prototype.changeSelected = function(ind) {
  this.SelectedPeca=ind;
}

Game.prototype.changeState = function(ind) {
  this.State=ind;
}

Game.prototype.hasGameEnded = function(ind) {
  if((this.board[6][6]=='e' && this.board[6][14]=='e')||(this.board[20][6]=='r' && this.board[20][14]=='r')){
    if(this.turn == 1)
      this.player1Vitories++;
    else
      this.player2Vitories++;
    return true;
  }

  else return false;
}

Game.prototype.coordsToPosition = function(coords) {
    return [15-Math.ceil(coords[0]/20*14),Math.ceil(coords[1]/20*11)];
}
