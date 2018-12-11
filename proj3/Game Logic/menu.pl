mainMenu :-
	clearConsole,
    printMenu,
	getChar(Input),
	(%process options
		Input = '1' -> menuPlay;
		Input = '2' -> printHelp, pressAnyKey, mainMenu;
		Input = '3' -> write('Thank you for playing !!');
		Input = '4' -> test;
		invalidInput,
		mainMenu
	).

menuPlay :-
	clearConsole,
    printMenuPlay,
	getChar(Input),
	(%process options
		Input = '1' -> start_game('p1', 'p2'), pressAnyKey, mainMenu;%, menuPlay; tem de se ver pq so assim e que vai voltar a este menu
		Input = '2' -> menuPlayBot;
		Input = '3' -> menuPlayBot2;
		Input = '4' -> mainMenu;
		invalidInput,
		menuPlay
	).

menuPlayBot :-
	clearConsole,
    printMenuPlayBot,
	getChar(Input),
	(%process options
		Input = '1' -> start_game('p1', 'ce'), pressAnyKey, mainMenu;%, menuPlay; tem de se ver pq so assim e que vai voltar a este menu
		Input = '2' -> start_game('p1', 'ch'), pressAnyKey, mainMenu;
		Input = '3' -> menuPlay;
		invalidInput,
		menuPlay
	).


menuPlayBot2 :-
	clearConsole,
    printMenuPlayBot,
	getChar(Input),
	(%process options
		Input = '1' -> start_game('ce1', 'ce2'), pressAnyKey, mainMenu;%, menuPlay; tem de se ver pq so assim e que vai voltar a este menu
		Input = '2' -> start_game('ch1', 'ch2'), pressAnyKey, mainMenu;
		Input = '3' -> menuPlay;
		invalidInput,
		menuPlay
	).

printMenu :-
	clearConsole,
    printLogo,
    write('               1.Play                  \n'),
    write('               2.Help                  \n'),
    write('               3.Exit                  \n').

%multiplayer
printMenuPlay :-
	clearConsole,
    printLogo,
    write('               1.PvP                  \n'),
    write('               2.PvC                  \n'),
    write('               3.CvC                  \n'),
	write('               4.Back                 \n').

%multiplayer
printMenuPlayBot :-
	clearConsole,
    printLogo,
    write('               1.Easy                  \n'),
    write('               2.Hard                  \n'),
	write('               3.Back                 \n').


printHelp :-
	clearConsole,
	printLogo,
    write('Objective of the Game\n\n'),
    write('The goal of Flume is to have more stones than the opponent\nwhen the board is completely filled with stones.\nNo draws are possible in Flume.\n\n'),
    write('\nMoves\n\n'),
    write('Each player has an allocated color: Red and Blue.\nStarting with Red, players take turns placing stones of their\nown color on empty intersections of the board. If a player places\nhis stone orthogonally adjacent to 3 or 4 stones of either color\n(red, blue or green) then the player gets an extra turn and he must\nplace another stone of his color somewhere on the board.\nPassing is not allowed.\n\n').
