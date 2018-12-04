class Piece extends CGFobject {
	constructor(scene) {
		super(scene);
        
        this.scene = scene;

        this.init();
    }

    init() {

        var cp = [];
        cp.push(
            [ -1.5, -1.5, 0.0, 1 ],
            [ -2.0, -2.0, 2.0, 1 ],
            [ -2.0,  2.0, 2.0, 1 ],
            [ -1.5,  1.5, 0.0, 1 ],
            [ 0, 0, 3.0, 1 ],
            [ 0, -2.0, 3.0, 5 ],
            [ 0,  2.0, 3.0, 5 ],
            [ 0,  0, 3.0, 1 ],
            [ 1.5, -1.5, 0.0, 1 ],
            [ 2.0, -2.0, 2.0, 1 ],
            [ 2.0,  2.0, 2.0, 1 ],
            [ 1.5,  1.5, 0.0, 1 ]
        );

        cp.push(
            [ -1, 0, -1, 1 ],
            [ -1, 0.3, -0.6, 1 ],
            [ -1.0,  0.6, -0.3, 1 ],
            [ -1,  1, 0.0, 1 ],
            [ -1, 0.6, 0.3, 1 ],
            
            [ -1, 0.3, 0.6, 1 ],
            [ -1.0,  0, 0.9, 1 ],
            [ -1,  0, 1.0, 1 ],

            [ 0, -2.0, 3.0, 5 ],
            [ 0,  2.0, 3.0, 5 ],
            [ 0,  0, 3.0, 1 ],

            [ 1.5, -1.5, 0.0, 1 ],
            [ 2.0, -2.0, 2.0, 1 ],
            [ 2.0,  2.0, 2.0, 1 ],
            [ 1.5,  1.5, 0.0, 1 ]
        );



        this.piece = new Patch(this.scene, 2, 3, 20, 20, cp);
        
    }

    display() {

        /* this.scene.pushMatrix();
            this.scene.translate(0,1.75,0);
            this.scene.scale(1.3,1,1.3);
            this.appearance.apply();
            this.plane.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,1.73,0.65);
            this.scene.scale(1.3,0.04,1);
            this.appearanceSides.apply();
            this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.rotate(Math.PI/2,0,1,0);
            this.scene.translate(0,1.73,0.65);
            this.scene.scale(1.3,0.04,1);
            this.appearanceSides.apply();
            this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.rotate(-Math.PI/2,0,1,0);
            this.scene.translate(0,1.73,0.65);
            this.scene.scale(1.3,0.04,1);
            this.appearanceSides.apply();
            this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI,0,1,0);
            this.scene.translate(0,1.73,0.65);
            this.scene.scale(1.3,0.04,1);
            this.appearanceSides.apply();
            this.quad.display();
        this.scene.popMatrix(); */

        this.piece.display();
    };

    applyMaterial(material) {
        this.appearance = material;

    }

    applyTexture(texture) {
        this.CustomTexture = texture;
    }

    updateTexCoords(){}

};
