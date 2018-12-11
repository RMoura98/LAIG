

getEasyBot(Row, Col,ListofMoves) :-
	length(ListofMoves,Size),
	random(0,Size,Index), %escolhe um index 
	nth0(Index,ListofMoves,Elem), % vai buscar o par
	nth0(0,Elem,R), % vai buscar o "car"
	nth0(1,Elem,C), % vai buscar o "cdr"
	Row is R,Col is C.


getHardBot(Board, Row, Col,CurrPlayer) :-
	value(Board,Value,CurrPlayer,Play),
	nth0(0,Play,R),
	nth0(1,Play,C),

	Row is R,Col is C.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

choose_move(R, C, Dif, Board,CurrPlayer) :-
	valid_moves(Board,1,1,[],ListofMoves,0),
	(
		Dif = 'e' -> getEasyBot(R, C,ListofMoves);
		getHardBot(Board, R, C,CurrPlayer)
	),
	sleep(0.5),
	printBotRow(R),
	sleep(1),
	printBotCol(C),
	sleep(1.2).

value(Board,Value,CurrPlayer,Play):-
valid_moves(Board,1,1,[],ListofMoves, 0),
playpossibleplay(CurrPlayer,Board,ListofMoves,-9999,[],ReturnValue,ReturnPlay),
Value is ReturnValue,
random_member(Play,ReturnPlay).



%condiçao de terminaçao
playpossibleplay(_,_,[],Value,BestPlay,ReturnValue,ReturnPlay) :-
ReturnValue = Value,
ReturnPlay = BestPlay.


playpossibleplay(CurrPlayer,Board,[H|T],Value,BestPlay,ReturnValue,ReturnPlay):-

getSpecialPlays(Board,[H|T],[],SpecialPlays),

nth0(0,H,Row),
nth0(1,H,Col),

if(member([Row,Col],SpecialPlays),PLAY_TYPE = 1,PLAY_TYPE = 0), %verifica o tipo de jogada simulada

if(CurrPlayer = 'ch',placeStonePlayer2(Board, Row, Col, NewBoard),true),
if(CurrPlayer = 'ch1',placeStonePlayer1(Board, Row, Col, NewBoard),placeStonePlayer2(Board, Row, Col, NewBoard)),

checkValue(1,1,NewBoard,CheckedValue,0,PLAY_TYPE),

if(Value = CheckedValue, 

(append(BestPlay,[[Row,Col]],NewList),playpossibleplay(CurrPlayer,Board,T,CheckedValue,NewList,ReturnValue,ReturnPlay)),

if(CheckedValue > Value,
playpossibleplay(CurrPlayer,Board,T,CheckedValue,[[Row,Col]],ReturnValue,ReturnPlay),
playpossibleplay(CurrPlayer,Board,T,Value,BestPlay,ReturnValue,ReturnPlay))
).




checkValue(I,J,Board,ReturnValue,Total,PLAY_TYPE):- %retorna o valor total do tabuleiro
isStone(Board, I, J, IsStoneBool),

if(IsStoneBool =\= 1,
(	
	checkNextTo3or4(Board,I,J,Bool),
	if((Bool =:= 1,PLAY_TYPE =:= 1),NewTotal is Total + 20,true), %caso jogada anterior ser especial e haver especiais
	if((Bool =:= 1,PLAY_TYPE =:= 0),NewTotal is Total - 15,true),
	if((Bool =:= 0,PLAY_TYPE =:= 1),NewTotal is Total + 5 ,true),
	if((Bool =:= 0,PLAY_TYPE =:= 0),NewTotal is Total + 1 ,true)

	
),NewTotal is Total),
(

    (I = 5,J = 5) -> ReturnValue = NewTotal;
    J = 5 -> increment(I,I1),checkValue(I1,0,Board,ReturnValue,NewTotal,PLAY_TYPE);
    increment(J,J1),
    checkValue(I,J1,Board,ReturnValue,NewTotal,PLAY_TYPE)
).