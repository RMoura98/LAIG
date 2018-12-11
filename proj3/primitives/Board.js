class Board extends CGFobject {
	constructor(scene) {
		super(scene);
        
        this.scene = scene;

        this.init();
    }

    init() {

        this.plane = new Plane(this.scene,20,20);
        this.quad = new MyQuad(this.scene, -0.5, -0.5, 0.5, 0.5);
        this.piece = new Piece(this.scene);
        this.pickingQuad = new MyQuad(this.scene, -0.5, -0.5, 0.5, 0.5);

        this.quad.updateTexCoords(0.1, 1);

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
        
        this.scene.logPicking();
	    

        this.scene.pushMatrix();

            this.scene.pushMatrix();
                this.scene.translate(0,1.75,0);
                this.scene.scale(1.3,1,1.3);
                this.appearance.apply();
                this.plane.display();
            this.scene.popMatrix();

            if (this.scene.pickMode){
                
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

            this.piece.display();

        this.scene.popMatrix();
    };

    updateTexCoords(){}

};
