%given a Board and a position (X,Y), it determines the fastest way to reach every position of the board from the initial position, using the flood fill algorithm
floodFill(Board,X,Y):-(XC1 is round((X+1)/2),XC2 is round((Y+1)/2), calcBoard(CalcBoard),getElementFromMatrix(CalcBoard,XC1,XC2,1,1,Value),
X1 is X+2,checkPawnColision(Board,[X1,Y]),XWall is X+1,YWall is round((Y+1)/2),X1<28,getElementFromMatrix(Board,XWall,YWall,1,1,WallH),WallH\=w,
XC3 is round((X1+1)/2),getElementFromMatrix(CalcBoard,XC3,XC2,1,1,DestValue),(Value+1<DestValue;DestValue==(-1)),NewValue is Value+1,replaceMatrix(CalcBoard,XC3,XC2,1,NewValue,NewCalcBoard),
retract(calcBoard(_)),asserta(calcBoard(NewCalcBoard)),floodFill(Board,X1,Y),false;

XC1 is round((X+1)/2),XC2 is round((Y+1)/2), calcBoard(CalcBoard),getElementFromMatrix(CalcBoard,XC1,XC2,1,1,Value),
X1 is X-2,X1>0,checkPawnColision(Board,[X1,Y]), XWall is X-1,YWall is round((Y+1)/2),getElementFromMatrix(Board,XWall,YWall,1,1,WallH),WallH\=w,
XC3 is round((X1+1)/2),getElementFromMatrix(CalcBoard,XC3,XC2,1,1,DestValue),(Value+1<DestValue;DestValue==(-1)),NewValue is Value+1,replaceMatrix(CalcBoard,XC3,XC2,1,NewValue,NewCalcBoard),
retract(calcBoard(_)),asserta(calcBoard(NewCalcBoard)),floodFill(Board,X1,Y),false;

XC1 is round((X+1)/2),XC2 is round((Y+1)/2), calcBoard(CalcBoard),getElementFromMatrix(CalcBoard,XC1,XC2,1,1,Value),
Y1 is Y+2,Y1<22,checkPawnColision(Board,[X,Y1]), YWall is Y+1,getElementFromMatrix(Board,X,YWall,1,1,WallV),WallV\=q,
XC3 is round((Y1+1)/2),getElementFromMatrix(CalcBoard,XC1,XC3,1,1,DestValue),(Value+1<DestValue;DestValue==(-1)),NewValue is Value+1,replaceMatrix(CalcBoard,XC1,XC3,1,NewValue,NewCalcBoard),
retract(calcBoard(_)),asserta(calcBoard(NewCalcBoard)),floodFill(Board,X,Y1),false;

XC1 is round((X+1)/2),XC2 is round((Y+1)/2), calcBoard(CalcBoard),getElementFromMatrix(CalcBoard,XC1,XC2,1,1,Value),
Y1 is Y-2,Y1>0,checkPawnColision(Board,[X,Y1]), YWall is Y-1,getElementFromMatrix(Board,X,YWall,1,1,WallV),WallV\=q,
XC3 is round((Y1+1)/2),getElementFromMatrix(CalcBoard,XC1,XC3,1,1,DestValue),(Value+1<DestValue;DestValue==(-1)),NewValue is Value+1,replaceMatrix(CalcBoard,XC1,XC3,1,NewValue,NewCalcBoard),
retract(calcBoard(_)),asserta(calcBoard(NewCalcBoard)),floodFill(Board,X,Y1),false

);true.

%comparation attribute that receives 2 pawns ([P1x,P1y] and [P2x,P2y]), and determines which of the other 2 lists are closer to the pawns.
compareAvg( [P1x,P1y],[P2x,P2y], [X1,Y1],[X2,Y2]) :-Value1 is (abs(P1x-X1)+abs(P1y-Y1)),Value2 is(abs(P1x-X2)+abs(P1y-Y2)), Value3 is(abs(P2x-X1)+abs(P2y-Y1)),Value4 is (abs(P2x-X2)+abs(P2y-Y2)),
min(Value1,Value3)<min(Value2,Value4).

%given a Board, the turn and the number os horizontal and vertical walls to be placed, it places a wall next to one of the opponents pawns, updating the NewBoard and NewVert and NewHor with the number of walls left after placement
smartWallCPU(Board,Turn,NewBoard,Vert,Hor,NewVert,NewHor):-(Turn==2,getpawnsPath(Board,Pawn1,Pawn2,_,_,1);Turn==1,getpawnsPath(Board,_,_,Pawn1,Pawn2,1)),
random(1,3,RandomWall),((RandomWall==1;Vert==0),availableWallHorizontal(Board,1,1),availableWallH(List),samsort(compareAvg(Pawn1,Pawn2),List,OrderedList),positionInList(1,OrderedList,1,[X,Y]),
P1 is 2*X,replaceMatrix(Board,P1,Y,1,w,StackBoard),P2 is Y+1,replaceMatrix(StackBoard,P1,P2,1,w,NewBoard),NewVert is Vert,NewHor is Hor-1,retract(availableWallH(_));
(RandomWall==2;Hor==0),availableWallVertical(Board,1,1),availableWallV(List),samsort(compareAvg(Pawn1,Pawn2),List,OrderedList),positionInList(1,OrderedList,1,[X,Y]),
P1 is 2*X-1,P2 is 2*Y,replaceMatrix(Board,P1,P2,1,q,StackBoard),P3 is 2*(X+1)-1,replaceMatrix(StackBoard,P3,P2,1,q,NewBoard),NewVert is Vert-1,NewHor is Hor,retract(availableWallV(_))).


%receives a Board and a turn, and it moves the closest pawn to the opponent's base through the closest path updating it to NewBoard
smartMovementCPU(Board,Turn,NewBoard):-(Turn==1,getpawnsPath(Board,Posicao1,Posicao2,_,_,1),nth1(1,Posicao1,Pawn1V),nth1(2,Posicao1,Pawn1H),nth1(1,Posicao2,Pawn2V),nth1(2,Posicao2,Pawn2H);Turn ==2,getpawnsPath(Board,_,_,Posicao1,Posicao2,1),nth1(1,Posicao1,Pawn1V),nth1(2,Posicao1,Pawn1H),nth1(1,Posicao2,Pawn2V),nth1(2,Posicao2,Pawn2H)),
calcboard(CalcBoard),replaceMatrix(CalcBoard,Pawn1V,Pawn1H,1,0,NewCalcBoard),Pawn1Vff is 2*Pawn1V-1,Pawn1Hff is 2* Pawn1H-1,asserta(calcBoard(NewCalcBoard)),floodFill(Board,Pawn1Vff,Pawn1Hff),
calcBoard(CalcPawn1),retract(calcBoard(_)),
replaceMatrix(CalcBoard,Pawn2V,Pawn2H,1,0,NewCalcBoard2),asserta(calcBoard(NewCalcBoard2)),Pawn2Vff is 2*Pawn2V-1,Pawn2Hff is 2* Pawn2H-1,floodFill(Board,Pawn2Vff,Pawn2Hff),calcBoard(CalcPawn2),retract(calcBoard(_)),
(Turn==1,getElementFromMatrix(CalcPawn1,11,4,1,1,RealValue1),(getElementFromMatrix(CalcPawn1,11,4,1,1,Value1),Value1\=(-1),Pos1x=11,Pos1y=4;getElementFromMatrix(CalcPawn1,11,5,1,1,Value1),Value1\=(-1),Pos1x=11,Pos1y=5;getElementFromMatrix(CalcPawn1,11,3,1,1,Value1),Value1\=(-1),Pos1x=11,Pos1y=3;getElementFromMatrix(CalcPawn1,12,4,1,1,Value1),Value1\=(-1),Pos1x=12,Pos1y=4;getElementFromMatrix(CalcPawn1,10,4,1,1,Value1),Value1\=(-1),Pos1x=10,Pos1y=4),
getElementFromMatrix(CalcPawn1,11,8,1,1,RealValue2),(getElementFromMatrix(CalcPawn1,11,8,1,1,Value2),Value2\=(-1),Pos2x=11,Pos2y=8;getElementFromMatrix(CalcPawn1,11,7,1,1,Value2),Value2\=(-1),Pos2x=11,Pos2y=7;getElementFromMatrix(CalcPawn1,11,9,1,1,Value2),Value2\=(-1),Pos2x=11,Pos2y=9;getElementFromMatrix(CalcPawn1,10,8,1,1,Value2),Value2\=(-1),Pos2x=10,Pos2y=8;getElementFromMatrix(CalcPawn1,12,8,1,1,Value2),Value2\=(-1),Pos2x=12,Pos2y=8),
getElementFromMatrix(CalcPawn2,11,4,1,1,RealValue3),(getElementFromMatrix(CalcPawn2,11,4,1,1,Value3),Value3\=(-1),Pos3x=11,Pos3y=4;getElementFromMatrix(CalcPawn2,11,5,1,1,Value3),Value3\=(-1),Pos3x=11,Pos3y=5;getElementFromMatrix(CalcPawn2,11,3,1,1,Value3),Value3\=(-1),Pos3x=11,Pos3y=3;getElementFromMatrix(CalcPawn2,10,4,1,1,Value3),Value3\=(-1),Pos3x=10,Pos3y=4;getElementFromMatrix(CalcPawn2,12,4,1,1,Value3),Value3\=(-1),Pos3x=12,Pos3y=4),
getElementFromMatrix(CalcPawn2,11,8,1,1,RealValue4),(getElementFromMatrix(CalcPawn2,11,8,1,1,Value4),Value4\=(-1),Pos4x=11,Pos4y=8;getElementFromMatrix(CalcPawn2,11,7,1,1,Value4),Value4\=(-1),Pos4x=11,Pos4y=7;getElementFromMatrix(CalcPawn2,11,9,1,1,Value4),Value4\=(-1),Pos4x=11,Pos4y=9;getElementFromMatrix(CalcPawn2,10,8,1,1,Value4),Value4\=(-1),Pos4x=10,Pos4y=8;getElementFromMatrix(CalcPawn2,12,8,1,1,Value4),Value4\=(-1),Pos4x=12,Pos4y=8),
P1 is min(Value1,Value2),P2 is min(Value3,Value4),(PFinal is min(P1,P2),RealValue1\=0,RealValue2\=0,RealValue3\=0,RealValue4\=0;RealValue1==0,PFinal is Value4;RealValue2==0,PFinal is Value3;RealValue3==0,PFinal is Value2;RealValue4==0,PFinal is Value1),
(PFinal=:=Value1,RealValue3\=0,Mov is Value1-2,getPath(Board,CalcPawn1,[Pos1x,Pos1y],Value1,[FinalX,FinalY],Mov),posToMov([Pawn1V,Pawn1H],[FinalX,FinalY],Result),move(Board,[Pawn1V,Pawn1H],Result,NewPawn,NewBoard,r);
PFinal=:=Value2,RealValue4\=0,Mov is Value2-2,getPath(Board,CalcPawn1,[Pos2x,Pos2y],Value2,[FinalX,FinalY],Mov),posToMov([Pawn1V,Pawn1H],[FinalX,FinalY],Result),move(Board,[Pawn1V,Pawn1H],Result,NewPawn,NewBoard,r);
PFinal=:=Value3,RealValue1\=0,Mov is Value3-2,getPath(Board,CalcPawn2,[Pos3x,Pos3y],Value3,[FinalX,FinalY],Mov),posToMov([Pawn2V,Pawn2H],[FinalX,FinalY],Result),move(Board,[Pawn2V,Pawn2H],Result,NewPawn,NewBoard,r);
PFinal=:=Value4,RealValue2\=0,Mov is Value4-2,getPath(Board,CalcPawn2,[Pos4x,Pos4y],Value4,[FinalX,FinalY],Mov),posToMov([Pawn2V,Pawn2H],[FinalX,FinalY],Result),move(Board,[Pawn2V,Pawn2H],Result,NewPawn,NewBoard,r))
;
Turn==2,getElementFromMatrix(CalcPawn1,4,4,1,1,RealValue1),(getElementFromMatrix(CalcPawn1,4,4,1,1,Value1),Value1\=(-1),Pos1x=4,Pos1y=4;getElementFromMatrix(CalcPawn1,4,5,1,1,Value1),Value1\=(-1),Pos1x=4,Pos1y=5;getElementFromMatrix(CalcPawn1,4,3,1,1,Value1),Value1\=(-1),Pos1x=4,Pos1y=3;getElementFromMatrix(CalcPawn1,3,4,1,1,Value1),Value1\=(-1),Pos1x=3,Pos1y=4;getElementFromMatrix(CalcPawn1,5,4,1,1,Value1),Value1\=(-1),Pos1x=5,Pos1y=4),
getElementFromMatrix(CalcPawn1,4,8,1,1,RealValue2),(getElementFromMatrix(CalcPawn1,4,8,1,1,Value2),Value2\=(-1),Pos2x=4,Pos2y=8;getElementFromMatrix(CalcPawn1,4,7,1,1,Value2),Value2\=(-1),Pos2x=4,Pos2y=7;getElementFromMatrix(CalcPawn1,4,9,1,1,Value2),Value2\=(-1),Pos2x=4,Pos2y=9;getElementFromMatrix(CalcPawn1,3,8,1,1,Value2),Value2\=(-1),Pos2x=3,Pos2y=8;getElementFromMatrix(CalcPawn1,5,8,1,1,Value2),Value2\=(-1),Pos2x=5,Pos2y=8),
getElementFromMatrix(CalcPawn2,4,4,1,1,RealValue3),(getElementFromMatrix(CalcPawn2,4,4,1,1,Value3),Value3\=(-1),Pos3x=4,Pos3y=4;getElementFromMatrix(CalcPawn2,4,3,1,1,Value3),Value3\=(-1),Pos3x=4,Pos3y=3;getElementFromMatrix(CalcPawn2,4,5,1,1,Value3),Value3\=(-1),Pos3x=4,Pos3y=5;getElementFromMatrix(CalcPawn2,3,4,1,1,Value3),Value3\=(-1),Pos3x=3,Pos3y=4;getElementFromMatrix(CalcPawn2,5,4,1,1,Value3),Value3\=(-1),Pos3x=5,Pos3y=4),
getElementFromMatrix(CalcPawn2,4,8,1,1,RealValue4),(getElementFromMatrix(CalcPawn2,4,8,1,1,Value4),Value4\=(-1),Pos4x=4,Pos4y=8;getElementFromMatrix(CalcPawn2,4,7,1,1,Value4),Value4\=(-1),Pos4x=4,Pos4y=7;getElementFromMatrix(CalcPawn2,4,9,1,1,Value4),Value4\=(-1),Pos4x=4,Pos4y=9;getElementFromMatrix(CalcPawn2,3,8,1,1,Value4),Value4\=(-1),Pos4x=3,Pos4y=8;getElementFromMatrix(CalcPawn2,5,8,1,1,Value4),Value4\=(-1),Pos4x=5,Pos4y=8),
write('Cheguei aqui'),nl,P1 is min(Value1,Value2),P2 is min(Value3,Value4),(PFinal is min(P1,P2),RealValue1\=0,RealValue2\=0,RealValue3\=0,RealValue4\=0;RealValue1==0,PFinal is Value4;RealValue2==0,PFinal is Value3;RealValue3==0,PFinal is Value2;RealValue4==0,PFinal is Value1),
(PFinal=:=Value1,RealValue3\=0,Mov is Value1-2,getPath(Board,CalcPawn1,[Pos1x,Pos1y],Value1,[FinalX,FinalY],Mov),posToMov([Pawn1V,Pawn1H],[FinalX,FinalY],Result),move(Board,[Pawn1V,Pawn1H],Result,NewPawn,NewBoard,e);
PFinal=:=Value2,RealValue4\=0,Mov is Value2-2,getPath(Board,CalcPawn1,[Pos2x,Pos2y],Value2,[FinalX,FinalY],Mov),posToMov([Pawn1V,Pawn1H],[FinalX,FinalY],Result),move(Board,[Pawn1V,Pawn1H],Result,NewPawn,NewBoard,e);
PFinal=:=Value3,RealValue1\=0,Mov is Value3-2,getPath(Board,CalcPawn2,[Pos3x,Pos3y],Value3,[FinalX,FinalY],Mov),posToMov([Pawn2V,Pawn2H],[FinalX,FinalY],Result),move(Board,[Pawn2V,Pawn2H],Result,NewPawn,NewBoard,e);
PFinal=:=Value4,RealValue2\=0,Mov is Value4-2,getPath(Board,CalcPawn2,[Pos4x,Pos4y],Value4,[FinalX,FinalY],Mov),posToMov([Pawn2V,Pawn2H],[FinalX,FinalY],Result),move(Board,[Pawn2V,Pawn2H],Result,NewPawn,NewBoard,e))
).

%given the game's board (Board) and the floodfill board (Board), the final position (X,Y), calculates the path to the position of the pawn, stoping when it reaches the position the pawn will move to, returning it [Posx,Posy]
getPath(RealBoard,Board,[X,Y],Number,[Posx,Posy],Final):-Final=<0,Posx=X,Posy=Y;(X1 is X+1,getElementFromMatrix(Board,X1,Y,1,1,Value),Value =:= Number-1,Xwall is 2*X,getElementFromMatrix(RealBoard,Xwall,Y,1,1,ValueWall),ValueWall\=w,Final1 is Final-1,(Value\=0,Final1\=0,getPath(RealBoard,Board,[X1,Y],Value,[Posx,Posy],Final1);Value\=0,Posx is X1,Posy is Y;Posx is X,Posy is Y);
X1 is X-1,getElementFromMatrix(Board,X1,Y,1,1,Value),Value =:= Number-1,Xwall is 2*(X-1),getElementFromMatrix(RealBoard,Xwall,Y,1,1,ValueWall),ValueWall\=w,Final1 is Final-1,(Value\=0,Final1\=0,getPath(RealBoard,Board,[X1,Y],Value,[Posx,Posy],Final1);Value\=0,Posx is X1,Posy is Y;Posx is X,Posy is Y);
Y1 is Y+1,getElementFromMatrix(Board,X,Y1,1,1,Value),Value =:= Number-1,Xwall is 2*X-1,Ywall is 2*Y,getElementFromMatrix(RealBoard,Xwall,Ywall,1,1,ValueWall),ValueWall\=q,Final1 is Final-1,(Value\=0,Final1\=0,getPath(RealBoard,Board,[X,Y1],Value,[Posx,Posy],Final1);Value\=0,Posx is X,Posy is Y1;Posx is X,Posy is Y);
Y1 is Y-1,getElementFromMatrix(Board,X,Y1,1,1,Value),Value =:= Number-1,Xwall is 2*X-1,Ywall is 2*(Y-1),getElementFromMatrix(RealBoard,Xwall,Ywall,1,1,ValueWall),ValueWall\=q,Final1 is Final-1,(Value\=0,Final1\=0,getPath(RealBoard,Board,[X,Y1],Value,[Posx,Posy],Final1);Value\=0,Posx is X,Posy is Y1;Posx is X,Posy is Y)).

%given a Board and a position (X,Y) if it can place an horizontal wall in that position
availableWallHorizontal(Board,X,Y):-(checkColisionHorizontal(Board,[X,Y]),P1 is 2*X,replaceMatrix(Board,P1,Y,1,w,StackBoard),P2 is Y+1,replaceMatrix(StackBoard,P1,P2,1,w,NewBoard),checkPawnsPath(NewBoard), (\+ availableWallH(List), asserta(availableWallH([[X,Y]]));availableWallH(List),retract(availableWallH(_))
,append([[X,Y]],List,NewList), asserta(availableWallH(NewList)));true),(Y<10,Y1 is Y+1, X1 is X;Y1 is 1,X1 is X+1),X<15,!,garbage_collect,availableWallHorizontal(Board,X1,Y1);true.

%given a Board and a position (X,Y) if it can place a vertical wall in that position
availableWallVertical(Board,X,Y):-(checkColisionVertical(Board,[X,Y]),P1 is 2*X-1,P2 is 2*Y,replaceMatrix(Board,P1,P2,1,q,StackBoard),P3 is 2*X+1,replaceMatrix(StackBoard,P3,P2,1,q,NewBoard),checkPawnsPath(NewBoard),(\+ availableWallV(List), asserta(availableWallV([[X,Y]]));availableWallV(List),retract(availableWallV(_))
 ,append([[X,Y]],List,NewList), asserta(availableWallV(NewList)));true),(Y<11,Y1 is Y+1, X1 is X;Y1 is 1,X1 is X+1),X<14,!,garbage_collect,availableWallVertical(Board,X1,Y1);true.

%given the intial position [Xi,Yi] and the final position [Xf,Yf], it determines which is the movement that needs to be made (Result)
 posToMov([Xi,Yi],[Xf,Yf],Result):-Yi==Yf,Xi-Xf=:=1,Result='N';Yi==Yf,Xi-Xf=:=2,Result='NN';Yi==Yf,Xf-Xi=:=1,Result='S';Yi==Yf,Xf-Xi=:=2,Result='SS';
 Xi==Xf,Yi-Yf=:=1,Result='O';Xi==Xf,Yi-Yf=:=2,Result='OO';Xi==Xf,Yf-Yi=:=1,Result='E';Xi==Xf,Yf-Yi=:=2,Result='EE';
 Xf-Xi=:=1,Yf-Yi=:=1,Result='SE';Xi-Xf=:=1,Yf-Yi=:=1,Result='NE';Xi-Xf=:=1,Yi-Yf=:=1,Result='NO';Xf-Xi=:=1,Yi-Yf=:=1,Result='SO'.

%receives a Board and the number of walls left to be placed, and places a wall randomly given all the lists of available positions, updating it to NewNoard, and updates the walls left to be places after this placement (NewVert,NewHor)
 placeRandomWall(Vert,Hor,Board,NewBoard,NewVert,NewHor):-random(1,3,Choice),((Choice==1,Hor \= 0;Choice==2,Vert==0),availableWallHorizontal(Board,1,1),availableWallH(List),sizeOfList(List,Size),RealSize is Size+1,random(1,RealSize,RandomPos),positionInList(RandomPos,List,1,[X,Y]),
 P1 is 2*X,replaceMatrix(Board,P1,Y,1,w,StackBoard),P2 is Y+1,replaceMatrix(StackBoard,P1,P2,1,w,NewBoard),NewVert is Vert,NewHor is Hor-1,retract(availableWallH(_));
 (Choice==1,Hor == 0;Choice==2,Vert\=0),availableWallVertical(Board,1,1),availableWallV(List),sizeOfList(List,Size),RealSize is Size+1,random(1,RealSize,RandomPos),positionInList(RandomPos,List,1,[X,Y]),
 P1 is 2*X-1,P2 is 2*Y,replaceMatrix(Board,P1,P2,1,q,StackBoard),P3 is 2*X+1,replaceMatrix(StackBoard,P3,P2,1,q,NewBoard),NewVert is Vert-1,NewHor is Hor,retract(availableWallV(_))).

%receives the Board and the Turn and updates The NewBoard with a random movement given a list of movements available to a random pawn
 movePawnRandomly(Board,Turn,NewBoard):-getpawnsPath(Board,Pawn1,Pawn2,Pawn3,Pawn4,1),random(1,3,RandomPawn),
 (RandomPawn==1, (Turn==1,availablePositions(Board,Pawn1);Turn==2,availablePositions(Board,Pawn3));
 RandomPawn==2,(Turn==1,availablePositions(Board,Pawn2);Turn==2,availablePositions(Board,Pawn4))),
 availableList(List),write(List),nl,retract(availableList(_)),sizeOfList(List,Size), RealSize is Size+1,random(1,RealSize,RandomPos),positionInList(RandomPos,List,1,Choice),
 (RandomPawn==1,(Turn==1,move(Board,Pawn1,Choice,NewPawn,NewBoard,r),(retract(pawn1(_)),!;true,!),asserta(pawn1(NewPawn));Turn==2,move(Board,Pawn3,Choice,NewPawn,NewBoard,e),(retract(pawn3(_)),!;true,!),asserta(pawn3(NewPawn)));
 RandomPawn==2,(Turn==1,move(Board,Pawn2,Choice,NewPawn,NewBoard,r),(retract(pawn2(_)),!;true,!),asserta(pawn2(NewPawn));Turn==2,move(Board,Pawn4,Choice,NewPawn,NewBoard,e),(retract(pawn4(_)),!;true,!),asserta(pawn4(NewPawn)))).

%returns the size of a list in Size
 sizeOfList([],0).
 sizeOfList([_|L2],Size):-sizeOfList(L2,Size1),Size is Size1+1.

%returns the element of a List (L1|L2) of a given Pos in Result
 positionInList(Pos,[L1|L2],Iterador,Result):-Iterador==Pos,Result =L1;Iterador1 is Iterador+1,positionInList(Pos,L2,Iterador1,Result).
