getChar(Input) :-
	get_char(Input),
	get_char(_),
	garbage_collect. 			%eu nao sei se isto da ou nao mas faz tipo um flush em c


invalidInput :-
	nl,
	write('Error: invalid input.'), nl,
	pressAnyKey, nl.


invalidMove :-
	write('\nError: Invalid Move\n').


pressAnyKey:-
	write('Press a key to continue.'),
	get_char(_), !.



getRow(Row):-
	write('\n # Row: '),
	getChar(R),
	helpInputRow(Rtmp, R),
	(%process options
		Rtmp =\= -1 -> Row is Rtmp;
		write('Error: different from [a-g] & [A-B]'),	%TODO: melhorar esta mensagem de erro
		garbage_collect, 								%flush
		getRow(Row)
	).


getCol(Col):-
	write('\n # Col: '),
	getChar(C),
	helpInputCol(Ctmp, C),
	(%process options
		Ctmp =\= -1 -> Col is Ctmp;
		write('Error: different from [1-7]'),			%TODO: melhorar esta mensagem de erro
		garbage_collect,								%flush
		getCol(Col)
	).

printBotRow(Row) :-
    write('\n # Row: '),
	helpInputRow(Row, PrintR),
	write(PrintR).

printBotCol(Col) :-
    write('\n\n # Col: '),
	helpInputCol(Col, PrintC),
	write(PrintC).


helpInputCol(0, '1').
helpInputCol(1, '2').
helpInputCol(2, '3').
helpInputCol(3, '4').
helpInputCol(4, '5').
helpInputCol(5, '6').
helpInputCol(6, '7').

helpInputCol(-1, _). 									%erro


helpInputRow(0, 'A').
helpInputRow(1, 'B').
helpInputRow(2, 'C').
helpInputRow(3, 'D').
helpInputRow(4, 'E').
helpInputRow(5, 'F').
helpInputRow(6, 'G').

helpInputRow(0, 'a').
helpInputRow(1, 'b').
helpInputRow(2, 'c').
helpInputRow(3, 'd').
helpInputRow(4, 'e').
helpInputRow(5, 'f').
helpInputRow(6, 'g').

helpInputRow(-1, _). 									%erro
