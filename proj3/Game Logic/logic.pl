

getTypePlayer(Player,Type):-
	sub_atom(Player,0,1,_,Type).

getBotDif(Player,Dif):-
	sub_atom(Player,1,1,_,Dif).


start_game(Player1,Player2) :-										
	midboard(Board),
	game(Board, Player1,Player2).
	

%option = p2 ou ce ou ch
game(Board, CurrPlayer,Option) :-
	printBoard(Board),
	count(Board,1,1,0,0,P1S,P2S),
	showNStones(P1S, P2S, Option),
	showCurrentPlayer(CurrPlayer),
	move(Board, NewBoard, CurrPlayer, NextPlayer,Option),
	NStones is P1S + P2S,
	write(NStones),
	(
		NStones =\= 24 -> game(NewBoard, NextPlayer,Option);
		game_over(NewBoard,Option)
	).


getElement(Board, Row, Col, Element):-
	nth0(Row, Board, SubBoard),							%obtem a linha
	nth0(Col, SubBoard, Element), !.					%obtem o elemento na linha


changeElement(Board, Row, Col, Symbol, NewBoard) :-
	nth0(Row, Board, BoardRow),							%obtem a linha
	replace(BoardRow, Col, Symbol, NewBoardRow),		%troca o elemento na linha
	replace(Board, Row, NewBoardRow,NewBoard).			%troca a linha na board (tabuleiro)


placeStonePlayer1(Board, Row, Col, NewBoard):-
	changeElement(Board, Row, Col, 'red', NewBoard).


placeStonePlayer2(Board, Row, Col, NewBoard):-
	changeElement(Board, Row, Col, 'blue', NewBoard).


game_over(Board,Option) :-
	printBoard(Board),
	count(Board,1,1,0,0,P1S,P2S),
	showNStones(P1S, P2S, Option),
    showWinner(P1S, P2S, Option),
    garbage_collect.


isStone(Board, Row, Col, IsStoneBool) :-
	symbol(S,0),
	getElement(Board, Row, Col, Element),
	(
		Element \= S -> IsStoneBool is 1;
		IsStoneBool is 0
	).


checkNextTo3or4(Board, Row, Col, Bool) :-	%aqui vai verificar os 4 lados e vai dizer se tem ou nao 3 ou 4 ao seu lado
	R1 is Row + 1,
	R2 is Row - 1,
	C1 is Col + 1,
	C2 is Col - 1,
	isStone(Board, R1, Col, IsStone1),
	isStone(Board, R2, Col, IsStone2),
	isStone(Board, Row, C1, IsStone3),
	isStone(Board, Row, C2, IsStone4),
	NextTo3or4 is IsStone1 + IsStone2 + IsStone3 + IsStone4,
	(
		NextTo3or4 > 2 -> Bool is 1;
		Bool is 0
	).


placeStone(Board, Row, Col, NewBoard, CurrPlayer, NextPlayer, Option) :- %vai ser aqui que vamos saber quem joga a seguir
	(
        CurrPlayer = 'p1' -> placeStonePlayer1(Board, Row, Col, NewBoard);
        CurrPlayer = 'ch1' ->  placeStonePlayer1(Board, Row, Col, NewBoard);
        CurrPlayer = 'ce1' ->  placeStonePlayer1(Board, Row, Col, NewBoard);

		placeStonePlayer2(Board, Row, Col, NewBoard)
	),
	checkNextTo3or4(Board, Row, Col, Bool),
	(
		Bool =\= 1 ->
			(
				CurrPlayer = 'p1' -> NextPlayer = Option;
				CurrPlayer = 'p2' -> NextPlayer = 'p1';
				CurrPlayer = 'ce' -> NextPlayer = 'p1';
				CurrPlayer = 'ch' -> NextPlayer = 'p1';
				CurrPlayer = 'ce1' -> NextPlayer = 'ce2';
				CurrPlayer = 'ch1' -> NextPlayer = 'ch2';
				CurrPlayer = 'ce2' -> NextPlayer = 'ce1';
				CurrPlayer = 'ch2' -> NextPlayer = 'ch1';
				true
			);
		NextPlayer = CurrPlayer
	).


validateMove(Board, Row, Col, Bool) :-
	isStone(Board, Row, Col, IsStoneBool),
	(
		Row =:= 0 -> invalidMove, Bool is 0;
		Row =:= 6 -> invalidMove, Bool is 0;
		Col =:= 0 -> invalidMove, Bool is 0;
		Col =:= 6 -> invalidMove, Bool is 0;
		IsStoneBool =:= 1 -> invalidMove, Bool is 0;
		Bool is 1
	).




%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%



	

move(Board, NewBoard, CurrPlayer, NextPlayer, Option) :-
	getTypePlayer(CurrPlayer,Type),
	(
		Type = 'c' -> getBotDif(CurrPlayer, Dif), choose_move(R, C, Dif, Board,CurrPlayer);
		getRow(R),
		getCol(C)
	),
	validateMove(Board, R, C, Bool),
	(
		Bool =:= 1 -> placeStone(Board, R, C, NewBoard, CurrPlayer, NextPlayer, Option); 		
		move(Board, NewBoard, CurrPlayer, NextPlayer,Option)
	).


increment(Var, Res) :-
	Res is Var + 1.


replace([_|T], 0, X, [X|T]).
replace([H|T], I, X, [H|R]):- %funçao usada para substituir um elemento no tabuleiro
	I > -1,
	NI is I-1,
	replace(T, NI, X, R), !.
replace(L, _, _, L).


valid_moves(Matrix,I,J,ListofMoves,Return, PrintOption):-
nth0(I,Matrix,Row),                %vai buscar a linha
nth0(J,Row,Value),                 %vai buscar o elemento a linha
(
	Value = 'empty' -> append(ListofMoves,[[I,J]],NewList); %se o lugar no board estiver vazio junta as coordenadas a lista de jogadas
	append(ListofMoves,[],NewList)                          %se nao estiver nao acrescenta nada
),
(
    I = 5,J = 5-> Return = NewList, (PrintOption =:= 1 -> printValidMoves(NewList); true); %chegou ao final da matriz
    J = 5 -> increment(I,I1),valid_moves(Matrix,I1,0,NewList,Return, PrintOption); %chegou ao final da fila
    increment(J,J1),                                                             %ainda nao chegou ao final da fila
    valid_moves(Matrix,I,J1,NewList,Return, PrintOption)
).




getSpecialPlays(Board,[H|T],SpecialPlays,Return):- %retorna a lista de jogadas especiais a partir da lista de jogadas possiveis
	nth0(0,H,Row),
	nth0(1,H,Col),
	checkNextTo3or4(Board,Row,Col,Bool),
(	
	Bool =:= 1 , append(SpecialPlays,[[Row,Col]],NewList);
	append(SpecialPlays,[],NewList)

), 
	getSpecialPlays(Board,T,NewList,Return).


getSpecialPlays(_,[],SpecialPlays,Return):- 
	Return = SpecialPlays.



count(Matrix,I,J,P1S,P2S,Return1,Return2):-
nth0(I,Matrix,Row),                
nth0(J,Row,Value),                 
(	

	if(Value = 'red',  P1SNew is P1S + 1,P1SNew is P1S),
	if(Value =  'blue',P2SNew is P2S + 1,P2SNew is P2S)     
),
(
    I = 5,J = 5 -> (Return1 is P1SNew,Return2 is P2SNew); 
    J = 5 -> increment(I,I1),count(Matrix,I1,1,P1SNew,P2SNew,Return1,Return2);
    increment(J,J1),                                                            
	count(Matrix,I,J1,P1SNew,P2SNew,Return1,Return2)
).

test :-
midboard(Board),
printBoard(Board),
count(Board,1,1,0,0,P1S,P2S),
write(P1S),nl,
write(P2S).







