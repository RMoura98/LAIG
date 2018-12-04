class Piece extends CGFobject {
	constructor(scene) {
		super(scene);
        
        this.scene = scene;

        this.init();
    }

    init() {

        var cp = [];

        
        cp.push(
            [-0.9, 0, 0, 1],
            [-0.9, 0, 0, 1],
            [-0.9, 0, 0, 1],
            [-0.9, 0, 0, 1],

            [-0.9, 0, 1, 0.8],
            [-0.9, 0.5, 1, 0.8],
            [-0.9, 0.5, -1, 0.8],
            [-0.9, 0, -1, 0.8],

            [0, 0, 1, 1],
            [0, 0.5, 1, 1],
            [0, 0.5, -1, 1],
            [0, 0, -1, 1],

            [0.9, 0, 1, 0.8],
            [0.9, 0.5, 1, 0.8],
            [0.9, 0.5, -1, 0.8],
            [0.9, 0, -1, 0.8],

            [0.9, 0, 0, 1],
            [0.9, 0, 0, 1],
            [0.9, 0, 0, 1],
            [0.9, 0, 0, 1]
        );	

        this.piece = new Patch(this.scene, 5, 4, 50, 50, cp);

    }

    display() {

        this.scene.pushMatrix();   
            this.piece.display();
        this.scene.popMatrix();

        this.scene.pushMatrix(); 
            this.scene.rotate(Math.PI, 0, 0, 1);  
            this.piece.display();
        this.scene.popMatrix();

    };

    applyMaterial(material) {
        this.appearance = material;
    };

    applyTexture(texture) {
        this.CustomTexture = texture;
    };

    updateTexCoords(){}

};
