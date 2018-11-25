class Vehicle extends CGFobject {
	constructor(scene) {
		super(scene);
        
        this.scene = scene;

        this.init();
    }

    init() {

        this.rocketBoosterLid = new MyCircle(this.scene, 24);
        
        this.rocketBooster = new Cylinder2(this.scene, 2.5, 1.5, 1.5, 24, 24);

        this.rocketBackBack = new Cylinder2(this.scene, 1.5, 2, 2, 24, 24);

        this.rocketBackFront = new Cylinder2(this.scene, 2, 3, 2, 24, 24);

        this.rocketMidBack = new Cylinder2(this.scene, 3, 3, 1.5, 24, 24);

        this.rocketMid = new Cylinder2(this.scene, 3, 2, 5, 24, 24);

        this.rocketFront = new Cylinder2(this.scene, 2, 0, 3, 24, 24);


        var cp = [];
        cp.push(
                    [-2, 1.5, 0, 1],
                    [-3.5, 1.5, -2, 1],
                    [-2, 0.6, 0, 1],
                    [-2, 0.6, -2, 1],
                    [-1, 0.5, 0, 1],
                    [-1, 0.5, -2, 1],
                    [-0.5, 0.5, 0, 1],
                    [-0.5, 0.5, -1.5, 1],
                    [0, 0.5, 0, 1],
                    [0, 0.5, -1.5, 1]
        );

        this.rocketTopLeftBoosterSupportTop = new Patch(this.scene, 5, 2, 20, 20, cp);


        cp = [];
        cp.push(
            [-3.5, 1.5, -2, 1],
            [-2, 1.5, 0, 1],
            [-2, 0.6, -2, 1],
            [-2, 0.6, 0, 1],
            [-1, 0.5, -2, 1],
            [-1, 0.5, 0, 1],
            [-0.5, 0.5, -1.5, 1],
            [-0.5, 0.5, 0, 1],
            [0, 0.5, -1.5, 1],
            [0, 0.5, 0, 1]
            
        );

        this.rocketTopLeftBoosterSupportBot = new Patch(this.scene, 5, 2, 20, 20, cp);


        cp = [];
        cp.push(
            [0, 0.5, 0, 1],
            [0, 0.5, -1.5, 1],
            [0.5, 0.5, 0, 1],
            [0.5, 0.5, -1.5, 1],
            [1, 0.5, 0, 1],
            [1, 0.5, -2, 1],
            [2, 0.6, 0, 1],
            [2, 0.6, -2, 1],
            [2, 1.5, 0, 1],
            [3.5, 1.5, -2, 1]
        );

        this.rocketTopRightBoosterSupportTop = new Patch(this.scene, 5, 2, 20, 20, cp);


        cp = [];
        cp.push(
            [2, 1.5, 0, 1],
            [3.5, 1.5, -2, 1],
            [2, 0.6, 0, 1],
            [2, 0.6, -2, 1],
            [1, 0.5, 0, 1],
            [1, 0.5, -2, 1],
            [0.5, 0.5, 0, 1],
            [0.5, 0.5, -1.5, 1],
            [0, 0.5, 0, 1],
            [0, 0.5, -1.5, 1]
        );

        this.rocketTopRightBoosterSupportBot = new Patch(this.scene, 5, 2, 24, 24, cp);
        

        this.extraBoosterMid = new Cylinder2(this.scene, 0.4, 0.4, 3, 24, 24);

        this.extraBoosterMidFront = new Cylinder2(this.scene, 0.4, 0.3, 0.4, 24, 24);

        this.extraBoosterFrontBack = new Cylinder2(this.scene, 0.3, 0.2, 0.1, 24, 24);

        this.extraBoosterFrontFront = new Cylinder2(this.scene, 0.2, 0, 0.1, 24, 24);

        this.extraBoosterLid = new MyCircle(this.scene, 24);


        this.appearance = new CGFappearance(this.scene);
        this.appearance.setEmission(0, 0, 0, 1);
        this.appearance.setAmbient(0.2, 0.2, 0.2, 1);
		this.appearance.setDiffuse(0.5, 0.5, 0.5, 1);
        this.appearance.setSpecular(0.5, 0.5, 0.5, 1);
        this.appearance.setShininess(1);
        
        this.CustomTexture = new CGFtexture(this.scene, "../scenes/images/rocketRed.jpg");
        this.textureBlack = new CGFtexture(this.scene, "../scenes/images/rocketBlack.jpg");
        this.textureWhite = new CGFtexture(this.scene, "../scenes/images/rocketWhite.jpg");
		this.appearance.setTexture(this.textureCustom);
        


    }

    display() {

        this.scene.pushMatrix();
            this.scene.scale(0.02, 0.02, 0.02);
            //this.scene.translate(62, 23.4, 68);
            //this.scene.rotate(-Math.PI, 0, 1, 1);
            //this.scene.rotate(Math.PI, 0, 0, 1);

            this.scene.pushMatrix();
                this.appearance.setTexture(this.textureBlack);
                this.appearance.apply();
                this.scene.translate(0.1, 0, -5.7);
                this.scene.scale(1.35, 1.35, 1);
                this.scene.rotate(Math.PI, 0, 1, 0);
                this.rocketBoosterLid.display();
            this.scene.popMatrix();
            
            this.scene.pushMatrix();
                this.appearance.setTexture(this.textureWhite);
                this.appearance.apply();
                this.scene.translate(0, 0, -7);
                this.rocketBooster.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.appearance.setTexture(this.textureBlack);
                this.appearance.apply();
                this.scene.translate(0, 0, -5.5);
                this.rocketBackBack.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.appearance.setTexture(this.CustomTexture);
                this.appearance.apply();
                this.scene.translate(0, 0, -3.5);
                this.rocketBackFront.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.appearance.setTexture(this.textureWhite);
                this.appearance.apply();
                this.scene.translate(0, 0, -1.5);
                this.rocketMidBack.display();
            this.scene.popMatrix();

            this.appearance.setTexture(this.textureWhite);
            this.appearance.apply();
            this.rocketMid.display();

            this.scene.pushMatrix();
                this.appearance.setTexture(this.CustomTexture);
                this.appearance.apply();
                this.scene.translate(0, 0, 5);
                this.rocketFront.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.appearance.setTexture(this.textureBlack);
                this.appearance.apply();
                this.scene.translate(-2, 0.7, -1.7);
                this.scene.rotate(-Math.PI/6.5, 0, 1, 0);
                this.rocketTopLeftBoosterSupportTop.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.appearance.setTexture(this.textureBlack);
                this.appearance.apply();
                this.scene.translate(-2, 0.7, -1.7);
                this.scene.rotate(-Math.PI/6.5, 0, 1, 0);
                this.rocketTopLeftBoosterSupportBot.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.appearance.setTexture(this.textureBlack);
                this.appearance.apply();
                this.scene.translate(2.4, 0.7, -1.7);
                this.scene.rotate(Math.PI/6.5, 0, 1, 0);
                this.rocketTopRightBoosterSupportTop.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.appearance.setTexture(this.textureBlack);
                this.appearance.apply();
                this.scene.translate(2.4, 0.7, -1.7);
                this.scene.rotate(Math.PI/6.5, 0, 1, 0);
                this.rocketTopRightBoosterSupportBot.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.appearance.setTexture(this.CustomTexture);
                this.appearance.apply();
                this.scene.translate(-4.43, 2.5, -5.5);
                this.scene.rotate(Math.PI/20, 0, 1, 0);
                this.extraBoosterMid.display();

                this.appearance.setTexture(this.textureWhite);
                this.appearance.apply();
                this.scene.translate(0, 0, 3);
                this.extraBoosterMidFront.display();

                this.appearance.setTexture(this.CustomTexture);
                this.appearance.apply();
                this.scene.translate(0, 0, 0.4);
                this.extraBoosterFrontBack.display();

                this.appearance.setTexture(this.textureWhite);
                this.appearance.apply();
                this.scene.translate(0, 0, 0.1);
                this.extraBoosterFrontFront.display();

                this.scene.pushMatrix();
                    this.appearance.setTexture(this.textureBlack);
                    this.appearance.apply();
                    this.scene.translate(0.03, 0, -3.5);
                    this.scene.scale(0.35, 0.35, 1);
                    this.scene.rotate(Math.PI, 0, 1, 0);
                    this.scene.rotate(Math.PI/100, 0, 0, 1);
                    this.extraBoosterLid.display();
                this.scene.popMatrix();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.appearance.setTexture(this.CustomTexture);
                this.appearance.apply();
                this.scene.translate(4.77, 2.5, -5.5);
                this.scene.rotate(-Math.PI/20, 0, 1, 0);
                this.extraBoosterMid.display();

                this.appearance.setTexture(this.textureWhite);
                this.appearance.apply();
                this.scene.translate(0, 0, 3);
                this.extraBoosterMidFront.display();

                this.appearance.setTexture(this.CustomTexture);
                this.appearance.apply();
                this.scene.translate(0, 0, 0.4);
                this.extraBoosterFrontBack.display();

                this.appearance.setTexture(this.textureWhite);
                this.appearance.apply();
                this.scene.translate(0, 0, 0.1);
                this.extraBoosterFrontFront.display();

                this.scene.pushMatrix();
                    this.appearance.setTexture(this.textureBlack);
                    this.appearance.apply();
                    this.scene.translate(0.03, 0, -3.5);
                    this.scene.scale(0.35, 0.35, 1);
                    this.scene.rotate(Math.PI, 0, 1, 0);
                    this.scene.rotate(Math.PI/100, 0, 0, 1);
                    this.extraBoosterLid.display();
                this.scene.popMatrix();
            this.scene.popMatrix();
        this.scene.popMatrix();
    };

    applyMaterial(material) {
        this.appearance = material;

    }

    applyTexture(texture) {
        this.CustomTexture = texture;
    }

};
