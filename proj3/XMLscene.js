var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface
     */
    constructor(myinterface) {
        super();

        this.previousTime = 0;

        this.interface = myinterface;
        this.lightValues = {};

        this.currentCamera = null;
        this.previousCamera = null;

        this.initialBoard = [];
        this.board = [];

        this.currentPlayer = null;
        this.secondPlayer = null;

        this.gameMode = {};
        this.gameDifficulty = {};
        this.rotatingCamera = true;
        
        this.originalPositionMatrix = null;

        this.redPieces = []
        this.redPieceIndex = null;

        this.bluePieces = [];
        this.bluePieceIndex = null;

        this.redCount = 0;
        this.blueCount = 0;

        this.animationInProgress = false;
        this.gameRunning = false;

        this.movie = [];
        this.movieIndex = 0;
        this.movieRunning = false;
        this.animationTimeCount = 0;

        this.rotateCamera = 0;
        this.rotateCamBool = false;
        
        
        
        this.startGame = function() {

            if(this.gameRunning){
                Swal({
                    type: 'error',
                    text: 'A game has already started',
                });
                return;
            }
                

            if( this.isEmpty(this.gameMode) ){
                Swal({
                    type: 'error',
                    text: 'Select a Mode on Game Settings',
                    timer: 5000
                });
                return;
            }
                

            if( ((this.gameMode == 'Player vs Bot') || (this.gameMode == 'Bot vs Bot')) && this.isEmpty(this.gameDifficulty) ){
                Swal({
                    type: 'error',
                    text: 'Select a Difficulty on Game Settings',
                    timer: 5000
                });
                return;
            }

            const toast = Swal.mixin({
                toast: true,
                position: 'top-start',
                showConfirmButton: false,
                timer: 3000
            });

            toast({
                type: 'success',
                title: 'Starting the game'
            })

            this.gameRunning = false;
            this.animationInProgress = false;
            
            this.preparePieces();

            this.redPieceIndex = 0;
            this.bluePieceIndex = 0;

            this.board = this.initialBoard;

            this.movie = [];
            this.movieIndex = 0;
            this.animationTimeCount = 0;

            let errorSample;

            errorSample = this.setPlayers();

            if(errorSample == -1)
                return;

            this.redCount = 0;
            this.blueCount = 0;

           this.gameRunning = true;

           this.timeOnStart = new Date().getTime();

           this.camera = this.returnCameraDefault();
        };

        this.undoMove = function() {

            if( !this.gameRunning )
                return;

            if(this.gameMode == 'Bot vs Bot')
                return;

            if( this.animationInProgress )
                return;

            const toast = Swal.mixin({
                toast: true,
                position: 'top-start',
                showConfirmButton: false,
                timer: 3000
            });

           

            if(this.gameMode == 'Player vs Player') {
                if(this.currentPlayer == 'p1')
                    this.makeP1Undo();
    
                else if(this.currentPlayer == 'p2')
                    this.makeP2Undo();
            }

            else if(this.gameMode == 'Player vs Bot') {
                if( (this.currentPlayer == 'ce') || (this.currentPlayer == 'ch') )
                    return;
                
                this.makeP1Undo();
            }
                

            toast({
                type: 'success',
                title: 'Undo'
            })
        };

        this.watchMovie = function() {      
            
            if(this.gameRunning)
                return;

            if(this.movie.length == 0)
                return;

            const toast = Swal.mixin({
                toast: true,
                position: 'top-start',
                showConfirmButton: false,
                timer: 3000
            });

            toast({
                type: 'success',
                title: 'Watching the movie'
            })

            this.preparePieces();

            this.redPieceIndex = 0;
            this.bluePieceIndex = 0;

            this.movieIndex = 0;
            this.animationTimeCount = 0;

            this.movieRunning = true;
        };


        //Handle the Reply Option 2 -> used for player move handling
        this.handleReplyGameRound = function handleReplyGameRound(data) {

            let comArray = data.target.response.split(',');
            let currPlayer = comArray.pop().slice(0, -1);
            let board;

            if( this.gameMode == "Player vs Bot" ) {
                if( (this.currentPlayer == 'ce') || (this.currentPlayer == 'ch') ) {
                    board = data.target.response.substring(5, data.target.response.indexOf("," + currPlayer));
                    let row = parseInt(comArray[0].substring(1, 2));
                    let column = parseInt(comArray[1]);

                    this.movePieceAccordingly(row, column);
                    this.animationInProgress = true;
                }
                else
                    board = data.target.response.substring(1, data.target.response.indexOf("," + currPlayer));
            }

            else if( this.gameMode == "Bot vs Bot" ) {
                board = data.target.response.substring(5, data.target.response.indexOf("," + currPlayer));
                let row = parseInt(comArray[0].substring(1, 2));
                let column = parseInt(comArray[1]);

                this.movePieceAccordingly(row, column);
                this.animationInProgress = true;
            }

            else
                board = data.target.response.substring(1, data.target.response.indexOf("," + currPlayer));


            // console.table(this.stringToArray(board));
            // console.log("next Player:" + currPlayer);
            // console.log((board.match(/empty/g) || []).length); // se calhar fazer esta parte no prolog ... nao sei bem

            this.redCount = (board.match(/red/g) || []).length;
            this.blueCount = (board.match(/blue/g) || []).length;


            if((board.match(/empty/g) || []).length == 0) {
                if(this.redCount > this.blueCount )
                    setTimeout(function(){  
                        Swal({
                            title:'Congratulations!',
                            text:'Player 1 won the game!',
                            type:'success',
                            animation: false,
                            customClass: 'animated tada'
                        });
                    }, 2000);
                else 
                    setTimeout(function(){  
                        Swal({
                            title:'Congratulations!',
                            text:'Player 2 won the game!',
                            type:'success',
                            animation: false,
                            customClass: 'animated tada'
                        });
                    }, 2000);

                this.timeOnStart = null;
                //esta parte e so temporaria e quando acaba no bot ele continua a jogar --> maquina de estados!

                this.gameRunning = false;
            }

            this.board = this.stringToArray(board);
            if(this.currentPlayer != currPlayer){
                this.rotateCamBool = true;
                this.rotateCamera += Math.PI;
            }
            this.currentPlayer = currPlayer;
            this.alronit = 0;
        }
        this.handleReplyGameRound = this.handleReplyGameRound.bind(this);

        this.handleError = function handleError(data) {
            Swal({
                type: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: 'Check Prolog Server'
            });
            this.gameRunning = false;
        }
        this.handleError = this.handleError.bind(this);


        
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

        this.setUpdatePeriod(33.33);
        
        this.initialBoard = [['border','border','border','border','border','border','border'],['border','empty','empty','empty','empty','empty','border'],['border','empty','empty','empty','empty','empty','border'],['border','empty','empty','empty','empty','empty','border'],['border','empty','empty','empty','empty','empty','border'],['border','empty','empty','empty','empty','empty','border'],['border','border','border','border','border','border','border']];

        this.board = this.initialBoard;
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.currentCamera = "default_";
        this.previousCamera = "";

        this.camera = new CGFcamera(1,0.1,500,vec3.fromValues(0.8, 0.8, 0.8),vec3.fromValues(0, 0, 0));
        this.interface.setActiveCamera(this.camera);
    }

    returnCameraDefault() {
        return new CGFcamera( 76, 0.1, 500, vec3.fromValues(2, 5, 5), vec3.fromValues(2, 2, 2) );
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;
            // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                //lights are predefined in cgfscene
                if (light.length > 17) {
                    this.lights[i].setSpotCutOff(light[1]);
                    this.lights[i].setSpotExponent(light[2]);
                    this.lights[i].setPosition(light[3], light[4], light[5], light[6]);
                    this.lights[i].setSpotDirection(light[7], light[8], light[9]);
                    this.lights[i].setAmbient(light[10], light[11], light[12], light[13]);
                    this.lights[i].setDiffuse(light[14], light[15], light[16], light[17]);
                    this.lights[i].setSpecular(light[18], light[19], light[20], light[21]);
                } else {
                    this.lights[i].setPosition(light[1], light[2], light[3], light[4]);
                    this.lights[i].setAmbient(light[5], light[6], light[7], light[8]);
                    this.lights[i].setDiffuse(light[9], light[10], light[11], light[12]);
                    this.lights[i].setSpecular(light[13], light[14], light[15], light[16]);
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    /* Handler called when the graph is finally loaded.
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {

        this.axis = new CGFaxis(this,this.graph.axis_length);

        this.setGlobalAmbientLight(this.graph.ambient['ambient'][0], this.graph.ambient['ambient'][1], this.graph.ambient['ambient'][2], this.graph.ambient['ambient'][3]);

        this.gl.clearColor(this.graph.ambient['background'][0], this.graph.ambient['background'][1], this.graph.ambient['background'][2], this.graph.ambient['background'][3]);

        this.initLights();

        this.setCamera();

        // Adds cameras group.
        this.interface.addCamerasGroup(this.graph.views);

        // Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);

        // Adds game setting group
        this.interface.addGameSettingsGroup();

        // Adds game options group
        this.interface.addGameActionsGroup();

        this.sceneInited = true;

        this.getPieces();
    }

    //para o server inicio
    getPrologRequest(requestString, onSuccess, onError, port)
    {
        var requestPort = port || 8081
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

        request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
        request.onerror = onError || this.handleError;

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }
		
    makeRequest(requestString, handleReply)
    {
        // Make Request
        this.getPrologRequest(requestString, handleReply);
    }
    
    //Handle the Reply
    handleReply(data){
        console.log( data.target.response);
    }


    //para o server fim

    arrayToString(array){
        let res = ""; 
        for (let i = 0; i < array.length; i++) {
            if(i == 0)
                res += "[";
            for (let j = 0; j < array[i].length; j++) {
                if(j == 0)
                    res += "[";
                res += array[i][j];
                if(j != array[i].length - 1)
                    res += ",";
            }
            res += "]";
            if(i != array.length - 1)
                res += ",";
        }
        res += "]";
        return res;
    }

    stringToArray(string){
        let array = []; 
        let tmpString = string.substring(1, string.length - 1);
        let arrayStr = tmpString.split(',');
        let tmpArray = [];
        for (let i = 0; i < arrayStr.length; i++) {
            if (i % 7 == 0)  
                tmpArray.push(arrayStr[i].substring(1, arrayStr[i].length));
            else if (i % 7 == 6)  {
                tmpArray.push(arrayStr[i].substring(0, arrayStr[i].length-1));
                array.push(tmpArray);
                tmpArray = [];
            }
            else
                tmpArray.push(arrayStr[i]);
        }
        return array;
    }

    logPicking() {

        if( !this.gameRunning ) {
            this.pickResults = [];
            return;
        }

        if( this.animationInProgress ) {
            this.pickResults = [];
            return;
        }
		
		if( this.rotateCamBool ) {
            this.pickResults = [];
            return;
        }

        if(this.gameMode == 'Bot vs Bot') {
            this.pickResults = [];
            return;
        }

        if(this.gameMode == 'Player vs Bot') {
            if( (this.currentPlayer == 'ce') || (this.currentPlayer == 'ch') ) {
                this.pickResults = [];
                return;
            }
        }

        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i=0; i< this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj)
                    {
                        var customId = this.pickResults[i][1];			
                        let customIdc = customId % 10;	
                        let customIdr = Math.floor(customId / 10);
                        //1 a 7 vai ser pesitios do tabuleiro apartir dai e para butoes e outras cenas 
                        customIdc--;    
                        customIdr--;
                        //console.log("Picked object: " + obj + ", with pick position [" + customIdr + ", " + customIdc + "]");
                        if(this.board[customIdr][customIdc] == "empty") {

                            this.makeRequest("gameRound(" + this.arrayToString(this.board) + "," + customIdr + "," + customIdc + "," + this.currentPlayer + "," + this.secondPlayer + ")", this.handleReplyGameRound);

                            this.movePieceAccordingly(customIdr, customIdc);
                            this.animationInProgress = true;
                        }
                        else {
                            //Swal('Oops...', 'You cannot play a piece there!', 'error');
                        }
                            
                    }

                }
                this.pickResults.splice(0,this.pickResults.length);
            }		
        }
    }

    setCamera() {
        this.currentCamera = this.graph.defaultViewId;
        this.previousCamera = "";

        this.camera = this.graph.views[this.graph.defaultViewId];
    }

    update(currTime) {
        this.time = (currTime - this.previousTime) / 1000;
        /* this.makeRequest("valid_moves(" + this.arrayToString(this.board) +")", this.handleReply); */
        var nodeName;
        var newMatrix;
        
        for (let i = 0; i < Object.keys(this.graph.nodes).length; i++) {
            
            nodeName = Object.keys(this.graph.nodes)[i];
            
            if (this.graph.nodes[nodeName].animations.length != 0) {
                
                for (let k = 0; k < this.graph.nodes[nodeName].animations.length; k++) {
                    
                    if (this.graph.nodes[nodeName].animations[k].hasEnded) 
                        continue;

                    //gets new position matrix
                    newMatrix = this.graph.nodes[nodeName].animations[k].getMatrix(this.time);
                    
                    //updates object position matrix
                    this.graph.nodes[nodeName].updateMatrix(newMatrix);
                    
                    break;
                }
            }
        }

        this.checkIfAnimationRunning();
        
        this.animationTimeCount += this.time;
        this.previousTime = currTime;
        
        //&& !this.rotateCamBool
        if( this.gameRunning ) {
            if(this.animationInProgress)
                return;
			
			if(!this.rotateCamBool){

                //is the bot already on it
                if(this.currentPlayer.charAt(0) == 'c') {
                    if(this.alronit == 0) {
                        this.alronit = 1;
                        this.makeRequest("getCompPlay(" + this.arrayToString(this.board) + "," + this.currentPlayer + "," + this.secondPlayer + ")",this.handleReplyGameRound);
                    }
                }
                else {
                    this.alronit = 0;
                }
			}
        }

        if(this.rotateCamera > 0 && !this.animationInProgress && this.rotatingCamera){
            let currAngle = this.rotateCamera - this.time < 0 ? this.rotateCamera : this.time;
            this.rotateCamera -= currAngle; 
            this.camera.orbit(vec3.fromValues(0, 1, 0), currAngle);
            if(this.rotateCamera == 0 )
                this.rotateCamBool = false;
        }

        if(this.movieRunning) {
            if(this.animationInProgress)
                return;
            
            if(this.movieIndex >= 75) {
                this.movieRunning = false;
                return;
            }
            
            if(this.animationTimeCount < 2)
                return;

            this.manageMovie();
        }
    }
    
    display() {
        // ---- BEGIN Background, camera and axis setup
        
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        
        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();
        
        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();
        
        this.clearPickRegistration();

        this.pushMatrix();

        if (this.sceneInited) {
            // Draw axis
            this.axis.display();

            var i = 0;
            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    } else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            if (this.currentCamera != this.previousCamera) {
                this.camera = this.graph.views[this.currentCamera];
                this.previousCamera = this.currentCamera;
                if (this.currentCamera == "default_")
                    this.interface.setActiveCamera(this.camera);
            }

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        } 
        else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    getPieces() {
        for(let i in this.graph.nodes) {

            if(this.graph.nodes[i].primitive instanceof Piece ) {

                if(this.graph.nodes[i].primitive.colour == 'red')
                    this.redPieces.push(this.graph.nodes[i].id);

                else if(this.graph.nodes[i].primitive.colour == 'blue')
                    this.bluePieces.push(this.graph.nodes[i].id);
            }
       }

       this.redPieceIndex = 0;
       this.bluePieceIndex = 0;


       this.originalPositionMatrix = mat4.create();

       this.originalPositionMatrix[0] = 1;
       this.originalPositionMatrix[1] = 0;
       this.originalPositionMatrix[2] = 0;
       this.originalPositionMatrix[3] = 0;
       this.originalPositionMatrix[4] = 0;
       this.originalPositionMatrix[5] = 1;
       this.originalPositionMatrix[6] = 0;
       this.originalPositionMatrix[7] = 0;
       this.originalPositionMatrix[8] = 0;
       this.originalPositionMatrix[9] = 0;
       this.originalPositionMatrix[10] = 1;
       this.originalPositionMatrix[11] = 0;
       this.originalPositionMatrix[12] = 1.0499999523162842;
       this.originalPositionMatrix[13] = 1.850000023841858;
       this.originalPositionMatrix[14] = 0.18000000715255737;
       this.originalPositionMatrix[15] = 1;
    }

    getPositioningAnimationRed(row, column) {
        var x = 0.56;
        var z = -1.42;

        while(column > 1) {
            z += 0.185;
            column--;
        }

        while(row > 1) {
            x -= 0.19;
            row--;
        }

        var animation = new LinearAnimation(1, [[0, 0, 0], [x, 0, z]]);

        return animation;
    }

    getPositioningAnimationBlue(row, column) {
        var x = 0.053;
        var z = 0.78;

        while(column > 1) {
            z += 0.186;
            column--;
        }

        while(row > 1) {
            x -= 0.185;
            row--;
        }

        var animation = new LinearAnimation(1, [[0, 0, 0], [x, 0, z]]);

        return animation;
    }

    isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    movePieceAccordingly(customIdr, customIdc) {

        var ascencion = new LinearAnimation(0.5, [[0, 0, 0], [0, 0.2, 0]]);

        var descending = new LinearAnimation(0.5, [[0, 0, 0], [0, -0.27, 0]]);

        if( this.currentPlayer == 'p1' || this.currentPlayer == 'ce1' || this.currentPlayer == 'ch1' ) {
            var positioning = this.getPositioningAnimationRed(customIdr, customIdc);

            this.graph.nodes[this.redPieces[this.redPieceIndex]].animations.push(ascencion);
            this.graph.nodes[this.redPieces[this.redPieceIndex]].animations.push(positioning);
            this.graph.nodes[this.redPieces[this.redPieceIndex]].animations.push(descending);

            this.graph.nodes[this.redPieces[this.redPieceIndex]].pieceRow = customIdr;
            this.graph.nodes[this.redPieces[this.redPieceIndex]].pieceColumn = customIdc;

            this.movie.push(this.redPieces[this.redPieceIndex]);
            this.movie.push(customIdr);
            this.movie.push(customIdc);

            this.redPieceIndex++;
        }

        else if( this.currentPlayer == 'p2' || this.currentPlayer == 'ce' || this.currentPlayer == 'ch' || this.currentPlayer == 'ce2' || this.currentPlayer == 'ch2' ) {
            var positioning = this.getPositioningAnimationBlue(customIdr, customIdc);

            this.graph.nodes[this.bluePieces[this.bluePieceIndex]].animations.push(ascencion);
            this.graph.nodes[this.bluePieces[this.bluePieceIndex]].animations.push(positioning);
            this.graph.nodes[this.bluePieces[this.bluePieceIndex]].animations.push(descending);

            this.graph.nodes[this.bluePieces[this.bluePieceIndex]].pieceRow = customIdr;
            this.graph.nodes[this.bluePieces[this.bluePieceIndex]].pieceColumn = customIdc;

            this.movie.push(this.bluePieces[this.bluePieceIndex]);
            this.movie.push(customIdr);
            this.movie.push(customIdc);

            this.bluePieceIndex++;
        }
    }

    setPlayers() {

        if( this.gameMode == 'Player vs Player' ) {
            this.currentPlayer = 'p1';
            this.secondPlayer = 'p2';
        }
        else if( this.gameMode == 'Player vs Bot') {
            if( this.gameDifficulty == 'Easy') {
                this.currentPlayer = 'p1';
                this.secondPlayer = 'ce';
            }
            else if( this.gameDifficulty == 'Hard' ) {
                this.currentPlayer = 'p1';
                this.secondPlayer = 'ch';
            }
            else
                return -1;
        }
        else if( this.gameMode == 'Bot vs Bot' ) {
            if( this.gameDifficulty == 'Easy vs Easy') {
                this.currentPlayer = 'ce1';
                this.secondPlayer = 'ce2';
            }
            else if( this.gameDifficulty == 'Easy vs Hard') {
                this.currentPlayer = 'ce1';
                this.secondPlayer = 'ch2';
            }
            else if( this.gameDifficulty == 'Hard vs Easy') {
                this.currentPlayer = 'ch1';
                this.secondPlayer = 'ce2';
            }
            else if( this.gameDifficulty == 'Hard vs Hard') {
                this.currentPlayer = 'ch1';
                this.secondPlayer = 'ch2';
            }
            else
                return -1;

            this.alronit = 0;
        }
        else
            return -1;
    }

    preparePieces() {
        for(let i in this.graph.nodes) {
            if(this.graph.nodes[i].primitive instanceof Piece) {
                this.graph.nodes[i].resetMatrix(this.originalPositionMatrix);
                this.graph.nodes[i].resetPosition();
                this.graph.nodes[i].resetAnimations();
            }
        }
    }

    makeP1Undo() {
        if(this.redPieceIndex == 0)
            return;

        this.redPieceIndex--;
        this.graph.nodes[this.redPieces[this.redPieceIndex]].resetMatrix(this.originalPositionMatrix);
        this.board[this.graph.nodes[this.redPieces[this.redPieceIndex]].pieceRow][this.graph.nodes[this.redPieces[this.redPieceIndex]].pieceColumn] = "empty";
        this.graph.nodes[this.redPieces[this.redPieceIndex]].resetPosition();
        this.redCount--;

        if( this.bluePieceIndex > this.redPieceIndex ) {
            while( this.bluePieceIndex > this.redPieceIndex ) {
                this.bluePieceIndex--;
                this.graph.nodes[this.bluePieces[this.bluePieceIndex]].resetMatrix(this.originalPositionMatrix);

                this.board[this.graph.nodes[this.bluePieces[this.bluePieceIndex]].pieceRow][this.graph.nodes[this.bluePieces[this.bluePieceIndex]].pieceColumn] = "empty";
                this.graph.nodes[this.bluePieces[this.bluePieceIndex]].resetPosition();

                this.blueCount--;

                this.deleteFromMovie();
            }
        }

        this.deleteFromMovie();
    }

    makeP2Undo() {
        if(this.bluePieceIndex == 0)
            return;

        this.bluePieceIndex--;
        this.graph.nodes[this.bluePieces[this.bluePieceIndex]].resetMatrix(this.originalPositionMatrix);
        this.board[this.graph.nodes[this.bluePieces[this.bluePieceIndex]].pieceRow][this.graph.nodes[this.bluePieces[this.bluePieceIndex]].pieceColumn] = "empty";
        this.graph.nodes[this.bluePieces[this.bluePieceIndex]].resetPosition();
        this.blueCount--;

        if( this.redPieceIndex > (this.bluePieceIndex + 1) ) {
            while( this.redPieceIndex > (this.bluePieceIndex + 1) ) {
                this.redPieceIndex--;
                this.graph.nodes[this.redPieces[this.redPieceIndex]].resetMatrix(this.originalPositionMatrix);
                this.board[this.graph.nodes[this.redPieces[this.redPieceIndex]].pieceRow][this.graph.nodes[this.redPieces[this.redPieceIndex]].pieceColumn] = "empty";
                this.graph.nodes[this.redPieces[this.redPieceIndex]].resetPosition();
                this.redCount--;

                this.deleteFromMovie();
            }
        }

        this.deleteFromMovie();
    }

    deleteFromMovie() {
        this.movie.pop();
        this.movie.pop();
        this.movie.pop();
    }   

    manageMovie() {
        let ascencion = new LinearAnimation(0.5, [[0, 0, 0], [0, 0.2, 0]]);

        let positioning;

        if(this.graph.nodes[this.movie[this.movieIndex]].primitive.colour == "red")
            positioning = this.getPositioningAnimationRed(this.movie[this.movieIndex+1], this.movie[this.movieIndex+2]);
        else if(this.graph.nodes[this.movie[this.movieIndex]].primitive.colour == "blue")
            positioning = this.getPositioningAnimationBlue(this.movie[this.movieIndex+1], this.movie[this.movieIndex+2]);
        
        let descending = new LinearAnimation(0.5, [[0, 0, 0], [0, -0.27, 0]]);

        this.graph.nodes[this.movie[this.movieIndex]].animations.push(ascencion);
        this.graph.nodes[this.movie[this.movieIndex]].animations.push(positioning);
        this.graph.nodes[this.movie[this.movieIndex]].animations.push(descending);

        this.graph.nodes[this.movie[this.movieIndex]].pieceRow = this.movie[this.movieIndex+1];
        this.graph.nodes[this.movie[this.movieIndex]].pieceColumn = this.movie[this.movieIndex+2];

        this.movieIndex += 3;

        this.animationTimeCount = 0;
    }

    checkIfAnimationRunning() {

        if( this.currentPlayer == 'p1' || this.currentPlayer == 'ce1' || this.currentPlayer == 'ch1' ) {
            if(this.bluePieceIndex < 1)
                return;

           if(this.graph.nodes[this.bluePieces[this.bluePieceIndex-1]].animations[this.graph.nodes[this.bluePieces[this.bluePieceIndex-1]].animations.length-1].hasEnded) {
                if(this.redPieceIndex < 1) {
                    this.animationInProgress = false;
                    return;
                }
                
                if(this.graph.nodes[this.redPieces[this.redPieceIndex-1]].animations[this.graph.nodes[this.redPieces[this.redPieceIndex-1]].animations.length-1].hasEnded)
                    this.animationInProgress = false;
           }
        }

        else if( this.currentPlayer == 'p2' || this.currentPlayer == 'ce' || this.currentPlayer == 'ch' || this.currentPlayer == 'ce2' || this.currentPlayer == 'ch2' ) {
            if(this.redPieceIndex < 1)
                return;

            if(this.graph.nodes[this.redPieces[this.redPieceIndex-1]].animations[this.graph.nodes[this.redPieces[this.redPieceIndex-1]].animations.length-1].hasEnded) {
                if(this.bluePieceIndex < 1) {
                    this.animationInProgress = false;
                    return;
                }
                
                if(this.graph.nodes[this.bluePieces[this.bluePieceIndex-1]].animations[this.graph.nodes[this.bluePieces[this.bluePieceIndex-1]].animations.length-1].hasEnded)
                    this.animationInProgress = false;
            }
        }
    }
}
