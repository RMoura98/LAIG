class PieceBox extends CGFobject {
	constructor(scene) {
		super(scene);
        
        this.scene = scene;

        this.init();
    }

    init() {

        this.quad = new MyQuad(this.scene, -0.5, -0.5, 0.5, 0.5);


        this.appearance = new CGFappearance(this.scene);
        this.appearance.setEmission(0, 0, 0, 1);
        this.appearance.setAmbient(0, 0, 0.1, 1);
		this.appearance.setDiffuse(0.2, 0.2, 0.3, 1);
        this.appearance.setSpecular(0.2, 0.2, 0.3, 1);
        this.appearance.setShininess(30);

        this.appearance2 = new CGFappearance(this.scene);
        this.appearance2.setEmission(0, 0, 0, 1);
        this.appearance2.setAmbient(0.1, 0, 0, 1);
		this.appearance2.setDiffuse(0.4, 0.3, 0.2, 1);
        this.appearance2.setSpecular(0.4, 0.3, 0.2, 1);
        this.appearance2.setShininess(30);

        this.appearance3 = new CGFappearance(this.scene);
        this.appearance3.setEmission(0, 0, 0, 1);
        this.appearance3.setAmbient(0.1, 0.1, 0.1, 1);
		this.appearance3.setDiffuse(0.2, 0.05, 0.05, 1);
        this.appearance3.setSpecular(0.2, 0.05, 0.05, 1);
        this.appearance3.setShininess(30);

    }

    display() {

        this.scene.pushMatrix();
            this.scene.pushMatrix();    //front-front
                this.scene.translate(1.1, 1.8, 0.5);
                this.scene.scale(0.4, 0.2, 1);
                this.quad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();    //front-back
                this.scene.translate(1.1, 1.8, 0.5);
                this.scene.scale(0.4, 0.2, 1);
                this.scene.rotate(Math.PI, 0, 1, 0);
                this.quad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();    //left-left
                this.scene.translate(0.9, 1.8, 0.25);
                this.scene.scale(0.4, 0.2, 0.5);
                this.scene.rotate(-Math.PI/2, 0, 1, 0);
                this.quad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();    //left-right
                this.scene.translate(0.9, 1.8, 0.25);
                this.scene.scale(0.4, 0.2, 0.5);
                this.scene.rotate(Math.PI/2, 0, 1, 0);
                this.quad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();    //right-right
                this.scene.translate(1.3, 1.8, 0.25);
                this.scene.scale(0.4, 0.2, 0.5);
                this.scene.rotate(Math.PI/2, 0, 1, 0);
                this.quad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();    //right-left
                this.scene.translate(1.3, 1.8, 0.25);
                this.scene.scale(0.4, 0.2, 0.5);
                this.scene.rotate(-Math.PI/2, 0, 1, 0);
                this.quad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();    //back-back
                this.scene.translate(1.1, 1.8, 0);
                this.scene.scale(0.4, 0.2, 0.5);
                this.scene.rotate(Math.PI, 0, 1, 0);
                this.quad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();    //back-front
                this.scene.translate(1.1, 1.8, 0);
                this.scene.scale(0.4, 0.2, 0.5);
                this.quad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();    //bottom
                this.scene.translate(1.1, 1.701, 0.25);
                this.scene.scale(0.4, 1, 0.5);
                this.scene.rotate(-Math.PI/2, 1, 0, 0);
                this.quad.display();
            this.scene.popMatrix();
            
        this.scene.popMatrix();
    };


    updateTexCoords(){}

};
