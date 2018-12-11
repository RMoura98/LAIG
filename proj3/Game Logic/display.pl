board([
	[border,border,border,border,border,border,border],
	[border,empty,empty,empty,empty,empty,border],
	[border,empty,empty,empty,empty,empty,border],
	[border,empty,empty,empty,empty,empty,border],
	[border,empty,empty,empty,empty,empty,border],
	[border,empty,empty,empty,empty,empty,border],
	[border,border,border,border,border,border,border]
]).

midboard([	
[border,border,border,border,border,border,border],	
[border,red,red,red,red,red,border],	
[border,red,red,empty,empty,empty,border],	
[border,blue,blue,empty,empty,empty,border],	
[border,blue,blue,red,empty,empty,border],	
[border,blue,red,blue,blue,empty,border],	
[border,border,border,border,border,border,border]	
 ]).


specialboard([
	[border,border,border,border,border,border,border],
	[border,red,empty,red,empty,red,border],
	[border,empty,empty,empty,empty,empty,border],
	[border,red,empty,empty,empty,red,border],
	[border,empty,empty,empty,empty,empty,border],
	[border,red,empty,red,empty,red,border],
	[border,border,border,border,border,border,border]
]).


symbol(empty,P) :- P = ' . '.
symbol(border,P) :- P = ' G '.
symbol(blue,P) :- P = ' b '.
symbol(red,P) :- P =' r '.
symbol(empty,0). 


letra(1, L) :- L='A '.
letra(2, L) :- L='B '.
letra(3, L) :- L='C '.
letra(4, L) :- L='D '.
letra(5, L) :- L='E '.
letra(6, L) :- L='F '.
letra(7, L) :- L='G '.


printBoard(X):-
	clearConsole,
	printLogo,
    nl,
	write('      1   2   3   4   5   6   7   \n'),

	write('\n    -----------------------------\n'),
	printMatrix(X,1).

printMatrix([],_).


printMatrix([H|T],N):-
	letra(N,L),
	write(' '),
	write(L),
	N1 is N + 1,
	write(' |'),
	printLine(H),
	line_separator,
	printMatrix(T,N1).


printLine([H|T]):-
    symbol(H,P),
    write(P),
    write('|'),
    printLine(T).

printLine([]).

line_separator:-
	write('\n    |---|---|---|---|---|---|---|\n').


clearConsole :-
	write('\33\[2J').


showNStones(P1S, P2S, Option) :-
    (
        Option = 'p2' -> write('\n> PLAYER1: '),write(P1S),write(' stones \n> '),write('PLAYER2: ');
        Option = 'ce' -> write('\n> PLAYER1: '),write(P1S),write(' stones \n> '),write('EASYBOT: ');
        Option = 'ch' -> write('\n> PLAYER1: '),write(P1S),write(' stones \n> '),write('HARDBOT: ');
        Option = 'ch2' -> write('\n> HARDBOT1: '), write(P1S),write(' stones \n> '), write('HARDBOT2: ');
        Option = 'ce2' -> write('\n> EASYBOT1: '), write(P1S),write(' stones \n> '), write('EASYBOT2: ');
        true
    ),
	write(P2S),
	write(' stones \n').


showCurrentPlayer(CurrPlayer) :-
	write('\nIt\'s '),
	(
        CurrPlayer = 'p1' -> write('PLAYER1');
        CurrPlayer = 'p2' -> write('PLAYER2');
        CurrPlayer = 'ce' -> write('EASYBOT');
        CurrPlayer = 'ch' -> write('HARDBOT');
        CurrPlayer = 'ch2' -> write('HARDBOT2');
        CurrPlayer = 'ch1' -> write('HARDBOT1');
        CurrPlayer = 'ce1' -> write('EASYBOT1');
        CurrPlayer = 'ce2' -> write('EASYBOT2');
        true
	),
	write(' turn:\n').


showWinner(P1S, P2S, Option) :-
	write('\n         #################\n'),
	(
        P1S > P2S -> 
        (
            Option = 'ce2' -> write('            EASYBOT1 WON!');
            Option = 'ch2' -> write('            HARDBOT1 WON!');
            write('            PLAYER1 WON!')
        ); % 12 chars
        (
            Option = 'p2' -> write('            PLAYER2 WON!');
            Option = 'ce' -> write('            EASYBOT WON!');
            Option = 'ce2' -> write('            EASYBOT2 WON!');
            Option = 'ch2' -> write('            HARDBOT2 WON!');
            write('            HARDBOT WON!')
        )
	),
	write('\n         #################\n\n').


printValidMoves(List) :-
    write(List), nl,
    write('Done!\n').

	
printLogo :-
	nl,
    write(' _______        _     _ _______ _______\n'),
    write(' |______ |      |     | |  |  | |______\n'),
    write(' |       |_____ |_____| |  |  | |______\n'),
    nl,nl,nl.


