:- use_module(library(random)).
:- use_module(library(samsort)).


%receives a Board, the number of vertical and horizontal walls remaining (Vert and Hor), updates it to the NewBoard and returns the number of horizontal and vertical walls remaining after placement (NewHor and NewVert)
placeWall(Choice,Board,NewBoard,[X,Y]):-(Choice==1,checkColisionVertical(Board,[X,Y]),P1 is 2*X-1,P2 is 2*Y,replaceMatrix(Board,P1,P2,1,q,StackBoard),P3 is 2*X+1,replaceMatrix(StackBoard,P3,P2,1,q,NewBoard),checkPawnsPath(NewBoard);
Choice==2,checkColisionHorizontal(Board,[X,Y]),P1 is 2*X,replaceMatrix(Board,P1,Y,1,w,StackBoard),P2 is Y+1,replaceMatrix(StackBoard,P1,P2,1,w,NewBoard),checkPawnsPath(NewBoard)).

calcboard([
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
  ]).

board([[c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c],
	[b,b,b,b,b,b,b,b,b,b,b],
	[c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c],
	[b,b,b,b,b,b,b,b,b,b,b],
	[c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c],
	[b,b,b,b,b,b,b,b,b,b,b],
	[c,a,c,a,c,a,p,a,c,a,c,a,c,a,p,a,c,a,c,a,c],
	[b,b,b,b,b,b,b,b,b,b,b],
	[c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c],
	[b,b,b,b,b,b,b,b,b,b,b],
	[c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c],
	[b,b,b,b,b,b,b,b,b,b,b],
	[c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c],
	[b,b,b,b,b,b,b,b,b,b,b],
	[c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c],
	[b,b,b,b,b,b,b,b,b,b,b],
	[c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c],
	[b,b,b,b,b,b,b,b,b,b,b],
	[c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c],
	[b,b,b,b,b,b,b,b,b,b,b],
	[c,a,c,a,c,a,j,a,c,a,c,a,c,a,j,a,c,a,c,a,c],
	[b,b,b,b,b,b,b,b,b,b,b],
	[c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c],
	[b,b,b,b,b,b,b,b,b,b,b],
	[c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c],
	[b,b,b,b,b,b,b,b,b,b,b],
	[c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c,a,c]]).

:-dynamic visited/1.
:-dynamic availableList/1.
:-dynamic pawn1/1.
:-dynamic pawn2/1.
:-dynamic pawn3/1.
:-dynamic pawn4/1.
:-dynamic availableWallH/1.
:-dynamic availableWallV/1.
:-dynamic calcBoard/1.

%start of game
start(?):-intro(?),menu(X),((X==2;X==3),chooseDificulty(Y);true),(X<4,board(L1),asserta(pawn1([4,4])),asserta(pawn2([4,8])),asserta(pawn3([11,4])),asserta(pawn4([11,8])),J1=player(8,8),J2=player(8,8),initiateGame(?),play(L1,J1,J2,1,0,X,Y);true,!).

checkChosenPawn(1,Board,[X,Y]):-X1 is 2*X-1,Y1 is 2*Y-1,write('cheguei aqui'),nl,getElementFromMatrix(Board,X1,Y1,1,1,Value),Value==r,!.
checkChosenPawn(2,Board,[X,Y]):-X1 is 2*X-1,Y1 is 2*Y-1,getElementFromMatrix(Board,X1,Y1,1,1,Value),Value==e,!.

%termination condition
play(Board,_,_,_,1,_,_):-startDisplay(Board,1,1),retract(pawn2(_)),retract(pawn1(_)),retract(pawn3(_)),retract(pawn4(_)),start(?).
%receives a board (L1), the players J1 J2, the Turn to determine which players play. Game 1v1
play(L1,J1,J2,Turn,0,1,_):-J1=player(V1,H1),J2=player(V2,H2),startDisplay(L1,1,1),pawn1(Pawn1),pawn2(Pawn2),pawn3(Pawn3),pawn4(Pawn4),
((Turn==1,
	chooseStaringPiece(Turn,Pawn),
	choosePositionToMove(Place),
  (Pawn==1,availablePositions(L1,Pawn1),availableList(List),member(Place,List),retract(availableList(_)),move(L1,Pawn1,Place,NewPawn,StackBoard,r),retract(pawn1(_)),asserta(pawn1(NewPawn)),((V1>0;H1>0),placeWall(V1,H1,StackBoard,NewBoard,NewVert,NewHor);NewBoard=StackBoard,NewVert is 0,NewHor is 0),checkWinners(End),play(NewBoard,player(NewVert,NewHor),player(V2,H2),2,End,1,_);
	Pawn==2,availablePositions(L1,Pawn2),availableList(List),member(Place,List),retract(availableList(_)),move(L1,Pawn2,Place,NewPawn,StackBoard,r),retract(pawn2(_)),asserta(pawn2(NewPawn)),((V1>0;H1>0),placeWall(V1,H1,StackBoard,NewBoard,NewVert,NewHor);NewBoard=StackBoard,NewVert is 0,NewHor is 0),checkWinners(End),play(NewBoard,player(NewVert,NewHor),player(V2,H2),2,End,1,_)));
(Turn==2,
	chooseStaringPiece(Turn,Pawn),
  choosePositionToMove(Place),
  (Pawn==1,availablePositions(L1,Pawn3),availableList(List),member(Place,List),retract(availableList(_)),move(L1,Pawn3,Place,NewPawn,StackBoard,e),retract(pawn3(_)),asserta(pawn3(NewPawn)),((V2>0;H2>0),placeWall(V2,H2,StackBoard,NewBoard,NewVert,NewHor);NewBoard=StackBoard,NewVert is 0,NewHor is 0),checkWinners(End),play(NewBoard,player(V1,H1),player(NewVert,NewHor),1,End,1,_);
	Pawn==2,availablePositions(L1,Pawn4),availableList(List),member(Place,List),retract(availableList(_)),move(L1,Pawn4,Place,NewPawn,StackBoard,e),retract(pawn4(_)),asserta(pawn4(NewPawn)),((V2>0;H2>0),placeWall(V2,H2,StackBoard,NewBoard,NewVert,NewHor);NewBoard=StackBoard,NewVert is 0,NewHor is 0),checkWinners(End),play(NewBoard,player(V1,H1),player(NewVert,NewHor),1,End,1,_))));fail.

%receives a Board, the players J1 J2, the Turn to determine which Cpu plays, and which dificulty are they playing at (Dif). Game CPUvsCPU
play(Board,J1,J2,Turn,0,3,Dif):-J1=player(V1,H1),J2=player(V2,H2),startDisplay(Board,1,1),cpuTurn(Turn),(Dif==1,movePawnRandomly(Board,Turn,StackBoard);Dif==2,smartMovementCPU(Board,Turn,StackBoard)),
(Turn==1,(Dif==1,((V1>0;H1>0),placeRandomWall(V1,H1,StackBoard,NewBoard,NewVert,NewHor);NewBoard=StackBoard,NewVert is 0,NewHor is 0);Dif==2,((V1>0;H1>0),smartWallCPU(StackBoard,Turn,NewBoard,V1,H1,NewVert,NewHor);NewBoard=StackBoard,NewVert is 0,NewHor is 0)),checkWinners(End),!,garbage_collect,play(NewBoard,player(NewVert,NewHor),J2,2,End,3,Dif) ;
Turn==2,(Dif==1,((V1>0;H1>0),placeRandomWall(V2,H2,StackBoard,NewBoard,NewVert,NewHor);NewBoard=StackBoard,NewVert is 0,NewHor is 0);Dif==2,((V2>0;H2>0),smartWallCPU(StackBoard,Turn,NewBoard,V2,H2,NewVert,NewHor);NewBoard=StackBoard,NewVert is 0,NewHor is 0)),checkWinners(End),!,garbage_collect,play(NewBoard,J1,player(NewVert,NewHor),1,End,3,Dif)).

%receives a Board,the players J1 J2, the Turn to determine if its the player or the CPU turn, Dif which the CPU is set. Game 1vsCPU
play(Board,J1,J2,Turn,0,2,Dif):-J1=player(V1,H1),J2=player(V2,H2),pawn1(Pawn1),pawn2(Pawn2),startDisplay(Board,1,1),
  ((Turn==1,
  	chooseStaringPiece(Turn,Pawn),
  	choosePositionToMove(Place),
    (Pawn==1,availablePositions(Board,Pawn1),availableList(List),member(Place,List),retract(availableList(_)),move(Board,Pawn1,Place,NewPawn,StackBoard,r),retract(pawn1(_)),asserta(pawn1(NewPawn)),((V1>0;H1>0),placeWall(V1,H1,StackBoard,NewBoard,NewVert,NewHor);NewBoard=StackBoard,NewVert is 0,NewHor is 0);
  	Pawn==2,availablePositions(Board,Pawn2),availableList(List),member(Place,List),retract(availableList(_)),move(Board,Pawn2,Place,NewPawn,StackBoard,r),retract(pawn2(_)),asserta(pawn2(NewPawn)),((V1>0;H1>0),placeWall(V1,H1,StackBoard,NewBoard,NewVert,NewHor);NewBoard=StackBoard,NewVert is 0,NewHor is 0)),checkWinners(End),play(NewBoard,player(NewVert,NewHor),player(V2,H2),2,End,2,Dif));
    (Turn==2,cpuTurn(1),(Dif==1,movePawnRandomly(Board,Turn,StackBoard);Dif==2,smartMovementCPU(Board,Turn,StackBoard)),(Dif==1,((V2>0;H2>0),placeRandomWall(V2,H2,StackBoard,NewBoard,NewVert,NewHor);NewBoard=StackBoard,NewVert is 0,NewHor is 0);Dif==2,((H2>0;V2>0),smartWallCPU(StackBoard,Turn,NewBoard,V2,H2,NewVert,NewHor));NewBoard=StackBoard,NewVert is 0,NewHor is 0),checkWinners(End),!,play(NewBoard,player(V1,H1),player(NewVert,NewHor),1,End,2,Dif))).


%receives a Board, with a position of the pawn to be moved ([P1,P2]), the movement it represents (Char), the new position of the pawn moved (L1), return the updated  Board with the PlayerChar in NewBoard
move(Board,[P1,P2],Char,L1,NewBoard,PlayerChar):-
(Char=='NN',NewPosX is P1-2,NewX is 2*NewPosX-1,NewY is 2*P2-1,getElementFromMatrix(Board,NewX,NewY,1,1,Value),(Value\=p,Value\=j,replaceMatrix(Board,NewX,NewY,1,PlayerChar,StackBoard);StackBoard=Board),changePawn(NewPosX,P2,L1);
Char=='N',NewPosX is P1-1,NewX is 2*NewPosX-1,NewY is 2*P2-1,getElementFromMatrix(Board,NewX,NewY,1,1,Value),(Value\=p,Value\=j,replaceMatrix(Board,NewX,NewY,1,PlayerChar,StackBoard);StackBoard=Board),changePawn(NewPosX,P2,L1);
Char=='SS',NewPosX is P1+2,NewX is 2*NewPosX-1,NewY is 2*P2-1,getElementFromMatrix(Board,NewX,NewY,1,1,Value),(Value\=p,Value\=j,replaceMatrix(Board,NewX,NewY,1,PlayerChar,StackBoard);StackBoard=Board),changePawn(NewPosX,P2,L1);
Char=='S',NewPosX is P1+1,NewX is 2*NewPosX-1,NewY is 2*P2-1,getElementFromMatrix(Board,NewX,NewY,1,1,Value),(Value\=p,Value\=j,replaceMatrix(Board,NewX,NewY,1,PlayerChar,StackBoard);StackBoard=Board),changePawn(NewPosX,P2,L1);
Char=='OO',NewPosY is P2-2,NewX is 2*P1-1,NewY is 2*NewPosY-1,getElementFromMatrix(Board,NewX,NewY,1,1,Value),(Value\=p,Value\=j,replaceMatrix(Board,NewX,NewY,1,PlayerChar,StackBoard);StackBoard=Board),changePawn(P1,NewPosY,L1);
Char=='O',NewPosY is P2-1,NewX is 2*P1-1,NewY is 2*NewPosY-1,getElementFromMatrix(Board,NewX,NewY,1,1,Value),(Value\=p,Value\=j,replaceMatrix(Board,NewX,NewY,1,PlayerChar,StackBoard);StackBoard=Board),changePawn(P1,NewPosY,L1);
Char=='EE',NewPosY is P2+2,NewX is 2*P1-1,NewY is 2*NewPosY-1,getElementFromMatrix(Board,NewX,NewY,1,1,Value),(Value\=p,Value\=j,replaceMatrix(Board,NewX,NewY,1,PlayerChar,StackBoard);StackBoard=Board),changePawn(P1,NewPosY,L1);
Char=='E',NewPosY is P2+1,NewX is 2*P1-1,NewY is 2*NewPosY-1,getElementFromMatrix(Board,NewX,NewY,1,1,Value),(Value\=p,Value\=j,replaceMatrix(Board,NewX,NewY,1,PlayerChar,StackBoard);StackBoard=Board),changePawn(P1,NewPosY,L1);
Char=='SE',NewPosX is P1+1,NewPosY is P2+1,NewX is 2*NewPosX-1,NewY is 2*NewPosY-1,getElementFromMatrix(Board,NewX,NewY,1,1,Value),(Value\=p,Value\=j,replaceMatrix(Board,NewX,NewY,1,PlayerChar,StackBoard);StackBoard=Board),changePawn(NewPosX,NewPosY,L1);
Char=='NE',NewPosX is P1-1,NewPosY is P2+1,NewX is 2*NewPosX-1,NewY is 2*NewPosY-1,getElementFromMatrix(Board,NewX,NewY,1,1,Value),(Value\=p,Value\=j,replaceMatrix(Board,NewX,NewY,1,PlayerChar,StackBoard);StackBoard=Board),changePawn(NewPosX,NewPosY,L1);
Char=='NO',NewPosX is P1-1,NewPosY is P2-1,NewX is 2*NewPosX-1,NewY is 2*NewPosY-1,getElementFromMatrix(Board,NewX,NewY,1,1,Value),(Value\=p,Value\=j,replaceMatrix(Board,NewX,NewY,1,PlayerChar,StackBoard);StackBoard=Board),changePawn(NewPosX,NewPosY,L1);
Char=='SO',NewPosX is P1+1,NewPosY is P2-1,NewX is 2*NewPosX-1,NewY is 2*NewPosY-1,getElementFromMatrix(Board,NewX,NewY,1,1,Value),(Value\=p,Value\=j,replaceMatrix(Board,NewX,NewY,1,PlayerChar,StackBoard);StackBoard=Board),changePawn(NewPosX,NewPosY,L1)),
(LastX is 2*P1-1, LastY is 2*P2-1,getElementFromMatrix(Board,LastX,LastY,1,1,LastValue) ,LastValue\=p,LastValue\=j, replaceMatrix(StackBoard,LastX,LastY,1,c,NewBoard);NewBoard=StackBoard).

%given the position X,Y of a pawn, it return a list of that position.
changePawn(X,Y,[X,Y]).

%sets a list of a available position in the Board to a dynamic variable, given a position [P1,P2] that represents the pawn
availablePositions(Board,[P1,P2]):-
canPassWalls(Board,[P1,P2],'NN'),NewPosX is P1-2,NewX is 2*NewPosX-1,NewY is 2*P2-1,checkPawnColision(Board,[NewX,NewY]),(\+ availableList(List),asserta(availableList(['NN']));availableList(List),\+ member('NN',List),retract(availableList(_)),append(['NN'],List,NewList),asserta(availableList(NewList))),write(Newlist),nl,fail;
canPassWalls(Board,[P1,P2],'N'),NewPosX is P1-1,NewX is 2*NewPosX-1,NewY is 2*P2-1,checkPawnColision(Board,[NewX,NewY]),(\+availableList(List),asserta(availableList(['N']));availableList(List),\+ member('N',List),retract(availableList(_)),append(['N'],List,NewList),asserta(availableList(NewList))),write(Newlist),nl,fail;
canPassWalls(Board,[P1,P2],'SS'),NewPosX is P1+2,NewX is 2*NewPosX-1,NewY is 2*P2-1,checkPawnColision(Board,[NewX,NewY]),(\+availableList(List),asserta(availableList(['SS']));availableList(List),\+ member('SS',List),retract(availableList(_)),append(['SS'],List,NewList),asserta(availableList(NewList))),write(Newlist),nl,fail;
canPassWalls(Board,[P1,P2],'S'),NewPosX is P1+1,NewX is 2*NewPosX-1,NewY is 2*P2-1,checkPawnColision(Board,[NewX,NewY]),(\+availableList(List),asserta(availableList(['S']));availableList(List),\+ member('S',List),retract(availableList(_)),append(['S'],List,NewList),asserta(availableList(NewList))),write(Newlist),nl,fail;
canPassWalls(Board,[P1,P2],'OO'),write('i can pass OO'),nl,NewPosY is P2-2,NewX is 2*P1-1,NewY is 2*NewPosY-1,checkPawnColision(Board,[NewX,NewY]),(\+availableList(List),asserta(availableList(['OO']));availableList(List),\+ member('OO',List),retract(availableList(_)),append(['OO'],List,NewList),asserta(availableList(NewList))),write(Newlist),nl,fail;
canPassWalls(Board,[P1,P2],'O'),write('i can pass O'),nl,write('i can pass NE'),nl,NewPosY is P2-1,NewX is 2*P1-1,NewY is 2*NewPosY-1,checkPawnColision(Board,[NewX,NewY]),(\+availableList(List),asserta(availableList(['O']));availableList(List),\+ member('O',List),retract(availableList(_)),append(['O'],List,NewList),asserta(availableList(NewList))),write(Newlist),nl,fail;
canPassWalls(Board,[P1,P2],'EE'),write('i can pass EE'),nl,NewPosY is P2+2,NewX is 2*P1-1,NewY is 2*NewPosY-1,checkPawnColision(Board,[NewX,NewY]),(\+availableList(List),asserta(availableList(['EE']));availableList(List),\+ member('EE',List),retract(availableList(_)),append(['EE'],List,NewList),asserta(availableList(NewList))),write(Newlist),nl,fail;
canPassWalls(Board,[P1,P2],'E'),write('i can pass E'),nl,NewPosY is P2+1,NewX is 2*P1-1,NewY is 2*NewPosY-1,checkPawnColision(Board,[NewX,NewY]),(\+availableList(List),asserta(availableList(['E']));availableList(List),\+ member('E',List),retract(availableList(_)),append(['E'],List,NewList),asserta(availableList(NewList))),write(Newlist),nl,fail;
canPassWalls(Board,[P1,P2],'NO'),NewPosX is P1-1,NewX is 2*NewPosX-1,NewPosY is P2-1,NewY is 2*NewPosY-1,checkPawnColision(Board,[NewX,NewY]),(\+availableList(List),asserta(availableList(['NO']));availableList(List),\+ member('NO',List),retract(availableList(_)),append(['NO'],List,NewList),asserta(availableList(NewList))),write(Newlist),nl,fail;
canPassWalls(Board,[P1,P2],'NE'),write('i can pass NE'),nl,NewPosX is P1-1,NewX is 2*NewPosX-1,NewPosY is P2+1,NewY is 2*NewPosY-1,checkPawnColision(Board,[NewX,NewY]),(\+availableList(List),asserta(availableList(['NE']));availableList(List),\+ member('NE',List),retract(availableList(_)),append(['NE'],List,NewList),asserta(availableList(NewList))),write(Newlist),nl,fail;
canPassWalls(Board,[P1,P2],'SE'),write('i can pass SE'),nl,NewPosX is P1+1,NewX is 2*NewPosX-1,NewPosY is P2+1,NewY is 2*NewPosY-1,checkPawnColision(Board,[NewX,NewY]),(\+availableList(List),asserta(availableList(['SE']));availableList(List),\+ member('SE',List),retract(availableList(_)),append(['SE'],List,NewList),asserta(availableList(NewList))),write(Newlist),nl,fail;
canPassWalls(Board,[P1,P2],'SO'),NewPosX is P1+1,NewX is 2*NewPosX-1,NewPosY is P2-1,NewY is 2*NewPosY-1,checkPawnColision(Board,[NewX,NewY]),(\+availableList(List),asserta(availableList(['SO']));availableList(List),\+ member('SO',List),retract(availableList(_)),append(['SO'],List,NewList),asserta(availableList(NewList))),write(Newlist),nl,fail;
true.

%return the element of the board, given a column and line, and it iterates X,Y, until it finds the target, returning it in the Value
getElementFromMatrix([_|L2],X,Y,Linha,Coluna,Value):-Linha<X,Linha1 is Linha +1,getElementFromMatrix(L2,X,Y,Linha1,Coluna,Value).
getElementFromMatrix([L1|_],X,Y,Linha,Coluna,Value):-Linha==X,getElementFromMatrixC(L1,X,Y,Linha,Coluna,Value).
getElementFromMatrixC([_|L2],X,Y,Linha,Coluna,Value):-Coluna<Y, Coluna1 is Coluna+1,getElementFromMatrixC(L2,X,Y,Linha,Coluna1,Value).
getElementFromMatrixC([L1|_],_,Y,_,Coluna,L1):-Coluna==Y.

%replaces an element of the Board, given a position [NewX,NewY] with the PlayerChar, updating it to the NewBoard
replaceMatrix(Board,NewX,NewY,1,PlayerChar,NewBoard):-replaceElementFromMatrix(Board,NewX,NewY,1,PlayerChar,L3),NL is NewX-1,replace(Board,NL,L3,NewBoard).
replaceElementFromMatrix([_|L2],X,Y,Linha,Value,L3):-Linha<X,Linha1 is Linha +1,replaceElementFromMatrix(L2,X,Y,Linha1,Value,L3).
replaceElementFromMatrix([L1|_],X,Y,Linha,Value,L3):-Linha==X,Y1 is Y-1,replace(L1,Y1,Value,L3).

%replaces an element of a list/list of lists
replace([_|T], 0, X, [X|T]).
replace([H|T], I, X, [H|R]):- I > 0, I1 is I-1, replace(T, I1, X, R).

%?-start(?).
