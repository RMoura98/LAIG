class Board extends CGFobject {
	constructor(scene) {
		super(scene);
        
        this.scene = scene;

        this.init();
    }

    init() {

        this.plane = new Plane(this.scene,20,20);
        this.quad = new MyQuad(this.scene, -0.5, -0.5, 0.5, 0.5);
        this.greenPiece = new Piece(this.scene, null, 'green');
        this.redPiece = new Piece(this.scene, null, 'red');
        this.bluePiece = new Piece(this.scene, null, 'blue');
        this.pickingQuad = new MyQuad(this.scene, -0.5, -0.5, 0.5, 0.5);

        this.clock = new Clock(this.scene);

        this.quad.updateTexCoords(0.1, 4);

        this.appearance = new CGFappearance(this.scene);
        this.appearance.setEmission(0, 0, 0, 1);
        this.appearance.setAmbient(0.2, 0.2, 0.2, 1);
		this.appearance.setDiffuse(0.5, 0.5, 0.5, 1);
        this.appearance.setSpecular(0.5, 0.5, 0.5, 1);
        this.appearance.setShininess(1);

        this.appearanceSides = new CGFappearance(this.scene);
        this.appearanceSides.setEmission(0, 0, 0, 1);
        this.appearanceSides.setAmbient(0.2, 0.2, 0.2, 1);
		this.appearanceSides.setDiffuse(0.5, 0.5, 0.5, 1);
        this.appearanceSides.setSpecular(0.5, 0.5, 0.5, 1);
        this.appearanceSides.setShininess(1);

       
        
        this.boardTexture = new CGFtexture(this.scene, "../scenes/images/board.png");
        this.boardSideTexture = new CGFtexture(this.scene, "../scenes/images/boardSides.jpg");

        this.appearance.setTexture(this.boardTexture);
        this.appearanceSides.setTexture(this.boardSideTexture);
    }

    display() {
        this.scene.pushMatrix();
            this.scene.translate(-1.3,1.8,0.5);
            this.scene.rotate(-Math.PI/2 + Math.PI/6,1,0,0);
            this.scene.scale(0.35,0.35,1);
            this.clock.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(1.3,1.8,-.5);
            this.scene.rotate(Math.PI/2 - Math.PI/6,1,0,0);
            this.scene.rotate(Math.PI,0,1,0);
            this.scene.scale(0.35,0.35,1);
            this.clock.display();
        this.scene.popMatrix();

        this.scene.logPicking();
	    

        this.scene.pushMatrix();

            this.scene.pushMatrix();
                this.scene.translate(0,1.75,0);
                this.scene.scale(1.3,1,1.3);
                this.appearance.apply();
                this.plane.display();
            this.scene.popMatrix();

            if (this.scene.pickMode) {
                
                this.scene.pushMatrix();
                for (let i = 0; i < 7; i++) {
                    if (i == 0) this.scene.translate(-1.3/7 * 3, 0, -1.3/7 * 3);
                    else this.scene.translate(0 , 0, 1.3/7); 
                    for (let j = 0; j < 7; j++) {
                        this.scene.registerForPick((i+1)*10+(j+1), this.pickingQuad);
                        this.scene.pushMatrix();
                            this.scene.translate(1.3/7 * j,1.76,0);
                            this.scene.rotate(-Math.PI/2,1,0,0);
                            this.scene.scale(1.3/7,1.3/7,1);
                            this.pickingQuad.display();
                        this.scene.popMatrix();
                    }
                }
                this.scene.popMatrix();
                
                this.scene.clearPickRegistration();
            }

            this.scene.pushMatrix();
                this.scene.translate(0,1.73,0.69);
                this.scene.scale(1.38,0.04,1);
                this.appearanceSides.apply();
                this.quad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(0,1.75,0.67);
                this.scene.rotate(-Math.PI/2,1,0,0);
                this.scene.scale(1.3,0.04,1);
                this.appearanceSides.apply();
                this.quad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.rotate(Math.PI/2,0,1,0);
                this.scene.translate(0,1.73,0.69);
                this.scene.scale(1.38,0.04,1);
                this.appearanceSides.apply();
                this.quad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.rotate(Math.PI/2,0,1,0);
                this.scene.translate(0,1.75,0.67);
                this.scene.rotate(-Math.PI/2,1,0,0);
                this.scene.scale(1.38,0.04,1);
                this.appearanceSides.apply();
                this.quad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.rotate(-Math.PI/2,0,1,0);
                this.scene.translate(0,1.73,0.69);
                this.scene.scale(1.38,0.04,1);
                this.appearanceSides.apply();
                this.quad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.rotate(-Math.PI/2,0,1,0);
                this.scene.translate(0,1.75,0.67);
                this.scene.rotate(-Math.PI/2,1,0,0);
                this.scene.scale(1.38,0.04,1);
                this.appearanceSides.apply();
                this.quad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.rotate(Math.PI,0,1,0);
                this.scene.translate(0,1.73,0.69);
                this.scene.scale(1.38,0.04,1);
                this.appearanceSides.apply();
                this.quad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.rotate(Math.PI,0,1,0);
                this.scene.translate(0,1.75,0.67);
                this.scene.rotate(-Math.PI/2,1,0,0);
                this.scene.scale(1.3,0.04,1);
                this.appearanceSides.apply();
                this.quad.display();
            this.scene.popMatrix();
            
            
            this.boderPiecePlacement();

            this.redBoxPiecePlacement();

            this.blueBoxPiecePlacement();
            

        this.scene.popMatrix();
    };

    boderPiecePlacement() {

        //Border pieces placement
        //Starts from topmid counter-clock wise

        this.scene.pushMatrix();
            this.scene.translate(0.006, 1.78, -0.555);
            this.scene.scale(0.09, 0.09, 0.09);
            this.greenPiece.display();

            this.scene.pushMatrix();
                this.scene.translate(-2.05, 0, 0)
                this.greenPiece.display();
        
                this.scene.translate(-2.05, 0, 0)
                this.greenPiece.display();

                this.scene.translate(-2.05, 0, 0)
                this.greenPiece.display();

                this.scene.translate(0, 0, 2.05)
                this.greenPiece.display();

                this.scene.translate(0, 0, 2.05)
                this.greenPiece.display();

                this.scene.translate(0, 0, 2.05)
                this.greenPiece.display();

                this.scene.translate(0, 0, 2.05)
                this.greenPiece.display();

                this.scene.translate(0, 0, 2.05)
                this.greenPiece.display();

                this.scene.translate(0, 0, 2.05)
                this.greenPiece.display();

                this.scene.translate(2.05, 0, 0)
                this.greenPiece.display();

                this.scene.translate(2.05, 0, 0)
                this.greenPiece.display();

                this.scene.translate(2.05, 0, 0)
                this.greenPiece.display();

                this.scene.translate(2.05, 0, 0)
                this.greenPiece.display();

                this.scene.translate(2.05, 0, 0)
                this.greenPiece.display();

                this.scene.translate(2.05, 0, 0)
                this.greenPiece.display();

                this.scene.translate(0, 0, -2.05)
                this.greenPiece.display();

                this.scene.translate(0, 0, -2.05)
                this.greenPiece.display();

                this.scene.translate(0, 0, -2.05)
                this.greenPiece.display();

                this.scene.translate(0, 0, -2.05)
                this.greenPiece.display();

                this.scene.translate(0, 0, -2.05)
                this.greenPiece.display();

                this.scene.translate(0, 0, -2.05)
                this.greenPiece.display();

                this.scene.translate(-2.05, 0, 0)
                this.greenPiece.display();

                this.scene.translate(-2.05, 0, 0)
                this.greenPiece.display();
            this.scene.popMatrix();

        this.scene.popMatrix();
    };

    redBoxPiecePlacement() {
        
        this.scene.pushMatrix();
            this.scene.translate(1, 1.73, 0.41);
            this.scene.scale(0.09, 0.09, 0.09);
            this.redPiece.display();

            this.scene.translate(0, 0, -1.8);
            this.redPiece.display();

            this.scene.translate(0, 0, -1.8);
            this.redPiece.display();

            this.scene.translate(1.9, 0, 0);
            this.redPiece.display();

            this.scene.translate(0, 0, 1.8);
            this.redPiece.display();

            this.scene.translate(0, 0, 1.8);
            this.redPiece.display();

            this.scene.translate(0.5, 0.65, 0);
            this.scene.pushMatrix();
                this.scene.rotate(-Math.PI/8, 0, 0, 1);
                this.redPiece.display();
            this.scene.popMatrix();

            this.scene.translate(-1.5, 0, -1);
            this.redPiece.display();

            this.scene.translate(-0.3, 0.25, 1.2);
            this.scene.pushMatrix();
                this.scene.rotate(Math.PI/4, 1, 0, 0);
                this.redPiece.display();
            this.scene.popMatrix();

            this.scene.translate(1.7, -0.3, -2.4);
            this.redPiece.display();

            this.scene.translate(-2, 0, -0.5);
            this.redPiece.display();

            this.scene.translate(2.2, 0, -1);
            this.scene.pushMatrix();
                this.scene.rotate(-Math.PI/4, 1, 0, 1);
                this.redPiece.display();
            this.scene.popMatrix();

            this.scene.translate(-2, 0, -0.18);
            this.scene.pushMatrix();
                this.scene.rotate(-Math.PI/4, 1, 0, 0);
                this.redPiece.display();
            this.scene.popMatrix();

            this.scene.translate(-0.9, 0.15, 2.7);
            this.scene.pushMatrix();
                this.scene.rotate(Math.PI/4, 0, 0, 1);
                this.redPiece.display();
            this.scene.popMatrix();

            this.scene.translate(2.5, 0.4, -0.2);
            this.redPiece.display();

        this.scene.popMatrix();
    }

    blueBoxPiecePlacement() {

        this.scene.translate(-2.2, 0, -0.5);
        
        this.scene.pushMatrix();
            this.scene.translate(1, 1.73, 0.41);
            this.scene.scale(0.09, 0.09, 0.09);
            this.bluePiece.display();

            this.scene.translate(0, 0, -1.8);
            this.bluePiece.display();

            this.scene.translate(0, 0, -1.8);
            this.bluePiece.display();

            this.scene.translate(1.9, 0, 0);
            this.bluePiece.display();

            this.scene.translate(0, 0, 1.8);
            this.bluePiece.display();

            this.scene.translate(0, 0, 1.8);
            this.bluePiece.display();

            this.scene.translate(0.5, 0.65, 0);
            this.scene.pushMatrix();
                this.scene.rotate(-Math.PI/8, 0, 0, 1);
                this.bluePiece.display();
            this.scene.popMatrix();

            this.scene.translate(-1.5, 0, -1);
            this.bluePiece.display();

            this.scene.translate(-0.3, 0.25, 1.2);
            this.scene.pushMatrix();
                this.scene.rotate(Math.PI/4, 1, 0, 0);
                this.bluePiece.display();
            this.scene.popMatrix();

            this.scene.translate(1.7, -0.3, -2.4);
            this.bluePiece.display();

            this.scene.translate(-2, 0, -0.5);
            this.bluePiece.display();

            this.scene.translate(2.2, 0, -1);
            this.scene.pushMatrix();
                this.scene.rotate(-Math.PI/4, 1, 0, 1);
                this.bluePiece.display();
            this.scene.popMatrix();

            this.scene.translate(-2, 0, -0.18);
            this.scene.pushMatrix();
                this.scene.rotate(-Math.PI/4, 1, 0, 0);
                this.bluePiece.display();
            this.scene.popMatrix();

            this.scene.translate(-0.9, 0.15, 2.7);
            this.scene.pushMatrix();
                this.scene.rotate(Math.PI/4, 0, 0, 1);
                this.bluePiece.display();
            this.scene.popMatrix();

            this.scene.translate(2.5, 0.4, -0.2);
            this.bluePiece.display();

        this.scene.popMatrix();

    }

    updateTexCoords(){}
};
