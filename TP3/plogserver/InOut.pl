%menu of the game. returns in X the option chosen
menu(X):-
repeat,
write('---------------------------------------------------'),nl,
write('|Choose type of game you wish to play:            |'), nl,
write('|1- 1 v 1                                         |'), nl,
write('|2- 1 vs CPU                                      |'), nl,
write('|3- CPU vs CPU                                    |'), nl,
write('|4- Exit                                          |'), nl,
write('---------------------------------------------------'),nl, prcss_ans(1,4,X).

%information abou the game
initiateGame(?):-
write('---------------------------------------------------'),nl,
write('|Player1/CPU1 pawns are represented by X.         |'),nl,
write('|Player2/CPU2 pawns are represented by O.         |'),nl,
write('---------------------------------------------------'),nl.

%returns in X the dificulty of the Cpu chosen
chooseDificulty(X):-
repeat,
write('---------------------------------------------------'),nl,
write('|Choose dificult of cpu:                           |'), nl,
write('|1- Random                                         |'), nl,
write('|2- Indeed very hard                               |'), nl,
write('---------------------------------------------------'),nl, prcss_ans(1,2,X).

%returns an integer in Ans, given a maximum and minimum
prcss_ans(Min,Max,Ans):-read(Ans),integer(Ans),Ans=<Max, Ans>=Min,nl.
%returns the Movement chosen by the player in Ans
prcss_str(Ans):-read(Str), atom_codes(Ans,Str), (Str==[79,79];Str==[79];Str==[69];Str==[69,69];Str==[83,83];Str==[83];Str==[78,78];Str==[78];Str==[78,69];Str==[78,79];Str==[83,69];Str==[83,79]).

%receives the number of walls left to be placed (Vert, Hor),asks the player whick type of wall he wishes to move and its position, returnin it in [X,Y]
chooseWall(Vert, Hor, Choice,[X,Y]):-
repeat,
write('---------------------------------------------------'),nl,
write('|Choose type of wall you want to place:           |'),nl,
write('|1- Vertical ('),write(Vert),write(')                                  |'),nl,
write('|2- Horizontal ('),write(Hor),write(')                                |'),nl,
write('---------------------------------------------------'),nl,
prcss_ans(1,2,Choice),chooseWallPosition(X,Y).

%calls predicates that ask line and column of wall returning it in X,Y
chooseWallPosition(X,Y):-chooseWallLine(X),chooseWallColumn(Y).

%ask line of wall and return the choice in X
chooseWallLine(X):-
write('---------------------------------------------------'),nl,
write('|Choose line to place wall (1-14):                |'),nl,
write('---------------------------------------------------'),nl,prcss_ans(1,14,X).

%asks the column of the wall and returns it in Y
chooseWallColumn(Y):-
write('---------------------------------------------------'),nl,
write('Choose column to place wall (1-11):               |'),nl,
write('---------------------------------------------------'),nl,prcss_ans(1,11,Y).

%writes which cpu is going to play
cpuTurn(Turn):-
write('--------------------------------------------'),nl,
write('|Its Cpu '),write(Turn), write(' turn.                           |'),nl,
write('--------------------------------------------'),nl.

%writes name of game
  intro(?):-write(' ________  ___       ________  ________  ___  __    ________  ________  ________'),nl,
write('|\\   __  \\|\\  \\     |\\   __  \\|\\   ____\\|\\  \\|\\  \\ |\\   __  \\|\\   ___ \\|\\  ___  \\'),nl,
write(' \\ \\  \\|\\ /\\ \\  \\    \\ \\  \\|\\  \\ \\  \\___|\\ \\  \\/  /|\\ \\  \\|\\  \\ \\  \\_|\\ \\ \\   __/|'),nl,
write('  \\ \\   __  \\ \\  \\    \\ \\  \\\\\\  \\ \\  \\    \\ \\   ___  \\ \\   __  \\ \\  \\ \\\\ \\ \\  \\_|/__'),nl,
write('   \\ \\  \\|\\  \\ \\  \\____\\ \\  \\\\\\  \\ \\  \\____\\ \\  \\\\ \\  \\ \\  \\ \\  \\ \\  \\_\\\\ \\ \\  \\_|\\ \\'),nl,
write('    \\ \\_______\\ \\_______\\ \\_______\\ \\_______\\ \\__\\\\ \\__\\ \\__\\ \\__\\ \\_______\\ \\_______\\'),nl,
write('     \\|_______|\\|_______|\\|_______|\\|_______|\\|__| \\|__|\\|__|\\|__|\\|_______|\\|_______|'),nl,nl,nl.

%asks the player in which direction he chose to move and returns it in Place
choosePositionToMove(Place):-
  repeat,
  write('--------------------------------------------------------------------------------------------------'),nl,
  write('|In what position would you like to place the pawn?                                              |'),nl,
  write('|You can choose from "N","NN","NO","NE","EE","SE","S","SS","SO","O" or "OO" (with "").           |'),nl,
	write('|O means one position to the left, OO means two positions to the left, etc.                      |'),nl,
	write('|REMEMBER: You can not go through "-", through "|", nor to a position where an enemy pawn stands.|'),nl,
  write('--------------------------------------------------------------------------------------------------'),nl,
	prcss_str(Place).

%given a turn it asks the player which of the pawns would he like to move and returns it n Ans
chooseStaringPiece(Turn,Ans):-
  repeat,
  write('---------------------------------------------------'),nl,
  write('|It´s player´s '),write(Turn),write(' turn.                          |'),nl,
	write('|Which pawn would you like to move?               |'),nl,
  pawn1(P1),pawn2(P2),pawn3(P3),pawn4(P4),
	write('|1- O peao que se encontra na posicao '),(Turn==1,write(P1);Turn==2,write(P3)),write('       |'),nl,
	write('|2- O peao que se encontra na posicao '),(Turn==1,write(P2);Turn==2,write(P4)),write('       |'),nl,
	write('---------------------------------------------------'),nl,prcss_ans(1,2,Ans).

%displays the board game given a Board, and iterates the Board with X and Y
  startDisplay(Board,X,Y):-write('   1 2 3 4 5 6 7 8 9 1011'),nl,
  write('   ---------------------'),nl,display(Board,X,Y),write('   ---------------------'),nl.
  display([],_,_).
  display([L1|L2],X,Y):-(X mod 2=\=0,X2 is round((X+1)/2),write(X2),(X2>9,write('|');write(' '),write('|'));write('   ') ),displayy(L1,X,Y),(X mod 2=\=0,write('|');true),nl,X1 is X+1,display(L2,X1,Y).
  displayy([],_,_).
  displayy([L1|L2],X,Y):-translate(L1,X,Y,Value),write(Value),Y1 is Y+1,displayy(L2,X,Y1).

%given a Char of the board and its position, it returns what is going to be written in Result
  translate(Char,X,Y,Result):-
  (Char==w,Result ='- ';
  Char ==q, Result ='|';
  Char ==a, Result =':';
  Char ==b, Y\=12, Result ='* ';
  Char ==c, Result =' ';
  Char ==r, Result ='X';
  Char ==e, Result ='O').
