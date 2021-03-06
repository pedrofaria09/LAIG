:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).
:- include('InOut.pl').
:- include('algCpu.pl').
:- include('rules.pl').
:- include('main.pl').

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                        Server                                                   %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% To run, enter 'server.' on sicstus command line after consulting this file.
% You can test requests to this server by going to http://localhost:8081/<request>.
% Go to http://localhost:8081/quit to close server.

% Made by Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

port(8081).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

% Server Loop
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		 write('Accepted connection'), nl,
	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			% write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),

		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),

		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: text/plain~n~n', []),
		format(Stream, '~p', [MyReply]),

		% write('Finnished Connection'),nl,nl,
		close_stream(Stream),
	(Request = quit), !.

close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK') :- translateInput(Request,MyReply), !.
handle_request(syntax_error, 'Syntax Error', '400 Bad Request') :- !.
handle_request(_, 'Bad Request', '400 Bad Request').

translateInput(['checkChosenPawn',Turn,Board,Pos,_],'ok'):-write('suag '),write(Pos),nl,checkChosenPawn(Turn,Board,Pos),!.
translateInput(['move',Turn,Board,PosI,PosF],'ok'):-write('suag '),(retract(availableList(_));true),posToMov(PosI,PosF,Result),availablePositions(Board,PosI),availableList(List),write(List),nl,member(Result,List),!.
translateInput(['placeWall',_,Board,Choice,Pos],'ok'):-write('suag '),write(Pos),nl,placeWall(Choice,Board,_,Pos),!.
translateInput(['moveRandom',Turn,Board,_,_],NewBoard):-write('suag '),nl,(retract(availableList(_));true),movePawnRandomly(Board,Turn,NewBoard),!.
translateInput(['placeRandom',Turn,Board,H1,V1],NewBoard):-write('suag '),nl,placeRandomWall(V1,H1,Board,NewBoard,_,_),!.
translateInput(['moveSmart',Turn,Board,_,_],NewBoard):-write('suag '),nl,(retract(availableList(_));true),smartMovementCPU(Board,Turn,NewBoard),!.
translateInput(['placeSmart',Turn,Board,H1,V1],NewBoard):-write('suag '),nl,smartWallCPU(Board,Turn,NewBoard,V1,H1,_,_),!.

translateInput([_,_,_,_,_],'no'):-!.

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, [Pred1,Turn1,Board1,Pos1,Pos2]) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),

	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	processPred(RL,Pred,RestOfCommand),
	catch(read_from_codes(Pred, Pred1), error(syntax_error(_),_), fail),
	processPred(RestOfCommand,Turn,RestOfCommand1),
	catch(read_from_codes(Turn, Turn1), error(syntax_error(_),_), fail),
	processPred(RestOfCommand1,Board,RestOfCommand2),
	catch(read_from_codes(Board, Board1), error(syntax_error(_),_), fail),
	processPred(RestOfCommand2,Pos,RestOfCommand3),
	catch(read_from_codes(Pos, Pos1), error(syntax_error(_),_), fail),
	read_request_aux(RestOfCommand3,RL2),
	catch(read_from_codes(RL2, Pos2), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).

read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).

processPred([L1|L2],[L1|P2],RestOfCommand):-L1\=47,processPred(L2,P2,RestOfCommand).
processPred([L1|L2],[],L2).

% Reads and Ignores the rest of the lines of the HTTP Header
read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

%Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
%print_header_line(_).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here

parse_input(handshake, handshake).
parse_input(test(C,N), Res) :- test(C,Res,N).
parse_input(quit, goodbye).
parse_input([a,b,c], lmao).

test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).
