%given a board, after placing a wall it calls predicates to check if all the pawns can get to it's opponent's initial positions
checkPawnsPath(Board):- getpawnsPath(Board,Pawn1,Pawn2,Pawn3,Pawn4,1),write(Pawn1),nl,write(Pawn2),nl,write(Pawn3),nl,write(Pawn4),nl,checkPawnPath(Board,Pawn1,1),checkPawnPath(Board,Pawn2,1),checkPawnPath(Board,Pawn3,2),checkPawnPath(Board,Pawn4,2).

getpawnsPath([L1|L2],Pawn1,Pawn2,Pawn3,Pawn4,Counter):-getpawnsPathAux(L1,Pawn1,Pawn2,Pawn3,Pawn4,Counter,1),Counter1 is Counter+1,getpawnsPath(L2,Pawn1,Pawn2,Pawn3,Pawn4,Counter1).
getpawnsPath([],_,_,_,_,_).
getpawnsPathAux([L1|L2],Pawn1,Pawn2,Pawn3,Pawn4,X,Y):-X1 is round((X+1)/2),Y2 is round((Y+1)/2), (L1==r,(var(Pawn1),Pawn1=[X1,Y2],!;Pawn2=[X1,Y2]),Y1 is Y+1,getpawnsPathAux(L2,Pawn1,Pawn2,Pawn3,Pawn4,X,Y1),!;L1==e,(var(Pawn3),Pawn3=[X1,Y2],!;Pawn4=[X1,Y2]),Y1 is Y+1,getpawnsPathAux(L2,Pawn1,Pawn2,Pawn3,Pawn4,X,Y1),!);Y1 is Y+1,getpawnsPathAux(L2,Pawn1,Pawn2,Pawn3,Pawn4,X,Y1).
getpawnsPathAux([],_,_,_,_,_,_).
%given a Board, and a player, checks if for the pawn (X,Y) can arrive to its opponent's final position.
checkPawnPath(Board,[X,Y],Player):-(Player==2,X1 is 2*X-1,Y1 is 2*Y-1,assert(visited([[X1,Y1]])),checkPath(Board,X1,Y1,[7,7],[7,15]),
retract(visited(_));
Player==1,X1 is 2*X-1,Y1 is 2*Y-1,assert(visited([[X1,Y1]])),checkPath(Board,X1,Y1,[21,7],[21,15]),
retract(visited(_)))
;retract(visited(_)),fail.

%checks if any of the players arrived to the opponent's position and returns End with 1 or 0, whether someone was successfull or not
checkWinners(End):-pawn1([P1v,P1h]),pawn2([P2v,P2h]),pawn3([P3v,P3h]),pawn4([P4v,P4h]),
(P1v==11,P2v==11,(P1h==4;P1h==8),(P2h==4;P2h==8),nl,write('Player 1 wins'),nl,End is 1;
P3v==4,P4v==4,(P3h==4;P3h==8),(P4h==4;P4h==8),nl,write('Player 2 wins'),nl,End is 1);End is 0,true.

%checks if the in the new position of the pawn are any other pawns.
checkPawnColision(NewX,NewY):-pawn1([Pawn1x,Pawn1y]),pawn2([Pawn2x,Pawn2y]),pawn3([Pawn3x,Pawn3y]),pawn4([Pawn4x,Pawn4y]),
(NewX=\=2*Pawn3x-1;NewY=\=2*Pawn3y-1),(NewX=\=2*Pawn4x-1;NewY=\=2*Pawn4y-1),
(NewX=\=2*Pawn2x-1;NewY=\=2*Pawn2y-1),(NewX=\=(2*Pawn1x-1);NewY=\=(2*Pawn1y-1)),!.

%given a Board, a position and the kind of movement, checks if it is able to get there, whithout crossing any walls
canPassWalls(Board,[P1,P2],Char):-Char=='NN',P1-2>0,P3 is 2*P1-2,getElementFromMatrix(Board,P3,P2,1,1,Value1),Value1\=w,P4 is 2*P1-4,getElementFromMatrix(Board,P4,P2,1,1,Value2),Value2\=w;
Char=='N',P1-1>0,P3 is 2*P1-2,getElementFromMatrix(Board,P3,P2,1,1,Value1),Value1\=w;
Char=='SS',P1+2<15,P3 is 2*P1,getElementFromMatrix(Board,P3,P2,1,1,Value1),Value1\=w,P4 is 2*P1+2,getElementFromMatrix(Board,P4,P2,1,1,Value2),Value2\=w;
Char=='S',P1+1<15,P3 is 2*P1,getElementFromMatrix(Board,P3,P2,1,1,Value1),Value1\=w;
Char=='OO',P2-2>0,P3 is 2*P1-1,P4 is 2*P2-2,getElementFromMatrix(Board,P3,P4,1,1,Value1),Value1\=q,P5 is 2*P2-4,getElementFromMatrix(Board,P3,P5,1,1,Value2),Value2\=q;
Char=='O',P2-1>0,P3 is 2*P1-1, P4 is 2*P2,getElementFromMatrix(Board,P3,P4,1,1,Value1),Value1\=q;
Char=='EE',P2+2<12,P3 is 2*P1-1,P4 is 2*P2,getElementFromMatrix(Board,P3,P4,1,1,Value1),Value1\=q,P5 is 2*P2-2,getElementFromMatrix(Board,P3,P5,1,1,Value2),Value2\=q;
Char=='E',P2+1<12,P3 is 2*P1-1, P4 is 2*P2,getElementFromMatrix(Board,P3,P4,1,1,Value1),Value1\=q;
Char=='SE',P2+1<12,P1+1<15,(P3 is 2*P1-1,P4 is 2*P2,getElementFromMatrix(Board,P3,P4,1,1,Value1),Value1\=q,P5 is 2*P1 ,P6 is P2 +1,getElementFromMatrix(Board,P5,P6,1,1,Value2),Value2\=w;
                            P3 is 2*P1,getElementFromMatrix(Board,P3,P2,1,1,Value1),Value1\=w,P4 is 2*P1+1,P5 is 2*P2,getElementFromMatrix(Board,P4,P5,1,1,Value2),Value2\=w) ;
Char=='NE',P1-1>0,P2+1<12,(P3 is 2*P1-1,P4 is 2*P2,getElementFromMatrix(Board,P3,P4,1,1,Value1),Value1\=q,P5 is 2*P1-2 ,P6 is P2 +1,getElementFromMatrix(Board,P5,P6,1,1,Value2),Value2\=w;
                           P3 is 2*P1-2,getElementFromMatrix(Board,P3,P2,1,1,Value1),Value1\=w,P4 is 2*P1-3,P5 is 2*P2,getElementFromMatrix(Board,P4,P5,1,1,Value2),Value2\=w);
Char=='NO',P2-1>0,P1-1>0,(P3 is 2*P1-1,P4 is 2*(P2-1),getElementFromMatrix(Board,P3,P4,1,1,Value1),Value1\=q,P5 is 2*(P1-1) ,P6 is P2 -1,getElementFromMatrix(Board,P5,P6,1,1,Value2),Value2\=w;
                           P3 is 2*P1-2,getElementFromMatrix(Board,P3,P2,1,1,Value1),Value1\=w,P4 is 2*P1-3,P5 is 2*(P2-1),getElementFromMatrix(Board,P4,P5,1,1,Value2),Value2\=w);
Char=='SO',P2-1>0,P1+1<15,(P3 is 2*P1-1,P4 is 2*(P2-1),getElementFromMatrix(Board,P3,P4,1,1,Value1),Value1\=q,P5 is 2*P1 ,P6 is P2 -1,getElementFromMatrix(Board,P5,P6,1,1,Value2),Value2\=w;
                           P3 is 2*P1,getElementFromMatrix(Board,P3,P2,1,1,Value1),Value1\=w,P4 is 2*P1+1,P5 is 2*(P2-1),getElementFromMatrix(Board,P4,P5,1,1,Value2),Value2\=w).

%given a Board, an initial position (X,Y) and two final positions ([C1,C2] and [C3,C4]), checks if from the initial position, the pawn can arrive to the two final positions
checkPath(Board,X,Y,[C1,C2],[C3,C4]):-(visited(Lista),(member([C1,C2],Lista),member([C3,C4],Lista); X1 is X+2,XWall is X+1,YWall is round((Y+1)/2),X1<28,getElementFromMatrix(Board,XWall,YWall,1,1,Value),Value\=w,\+ member([X1,Y],Lista),append(Lista,[[X1,Y]],NewVisited),retract(visited(_)),asserta(visited(NewVisited)),checkPath(Board,X1,Y,[C1,C2],[C3,C4]));
visited(Lista),(member([C1,C2],Lista),member([C3,C4],Lista);X1 is X-2,X1>0, XWall is X-1,YWall is round((Y+1)/2),getElementFromMatrix(Board,XWall,YWall,1,1,Value),Value\=w, \+ member([X1,Y],Lista),append(Lista,[[X1,Y]],NewVisited),retract(visited(_)),asserta(visited(NewVisited)),checkPath(Board,X1,Y,[C1,C2],[C3,C4]));
visited(Lista),(member([C1,C2],Lista),member([C3,C4],Lista);Y1 is Y+2,Y1<22, YWall is Y+1,getElementFromMatrix(Board,X,YWall,1,1,Value),Value\=q, \+ member([X,Y1],Lista),append(Lista,[[X,Y1]],NewVisited),retract(visited(_)),asserta(visited(NewVisited)),checkPath(Board,X,Y1,[C1,C2],[C3,C4]));
visited(Lista),(member([C1,C2],Lista),member([C3,C4],Lista);Y1 is Y-2,Y1>0, YWall is Y-1,getElementFromMatrix(Board,X,YWall,1,1,Value),Value\=q, \+ member([X,Y1],Lista),append(Lista,[[X,Y1]],NewVisited),retract(visited(_)),asserta(visited(NewVisited)),checkPath(Board,X,Y1,[C1,C2],[C3,C4]))).
checkPath(_,_,_,[_,_],[_,_]):-false.

%given a Board and a position, checks if the new wall is gonna intercect any horizontal wall and if there is already an vertical wall in that position
checkColisionVertical(Board,[C1,C2]):-C3 is 2* C1-1,C4 is C2*2,C5 is 2* C1+1,getElementFromMatrix(Board,C3,C4,1,1,Value),Value ==a,getElementFromMatrix(Board,C5,C4,1,1,Value2),Value2 ==a ,P1 is C1*2,checkColisionVerticalAux(Board,[P1,C2],Return),!,Return mod 2 =:=0.
checkColisionVerticalAux(Board,[P1,P2],Return):-getElementFromMatrix(Board,P1,P2,1,1,Value),Value ==w,P3 is P2-1,P3>0,checkColisionVerticalAux(Board,[P1,P3],ReturnAux),Return is ReturnAux+1.
checkColisionVerticalAux(Board,[P1,P2],1):-getElementFromMatrix(Board,P1,P2,1,1,Value),Value ==w.
checkColisionVerticalAux(_,[_,_],0).

%given a Board and a position, checks if the new wall is gonna intercect any vertical wall and if there is already an horizontal wall in that position
checkColisionHorizontal(Board,[C1,C2]):-C3 is 2* C1,C4 is C2+1,getElementFromMatrix(Board,C3,C2,1,1,Value),Value ==b,getElementFromMatrix(Board,C3,C4,1,1,Value2),Value2 ==b,P1 is C1*2-1,P2 is C2*2,checkColisionHorizontalAux(Board,[P1,P2],Return),!,Return mod 2 =:=0.
checkColisionHorizontalAux(Board,[P1,P2],Return):-getElementFromMatrix(Board,P1,P2,1,1,Value),Value ==q,P3 is P1-2,P3>0,checkColisionHorizontalAux(Board,[P3,P2],ReturnAux),Return is ReturnAux+1.
checkColisionHorizontalAux(Board,[P1,P2],1):-getElementFromMatrix(Board,P1,P2,1,1,Value),Value ==q.
checkColisionHorizontalAux(_,[_,_],0).
