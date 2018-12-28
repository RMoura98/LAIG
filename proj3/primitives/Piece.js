class Piece extends CGFobject {
    constructor(scene, player, colour) {
        super(scene);
        
        this.player = player || null;
        this.colour = colour;
        this.scene = scene;
        
        this.animations = [];
        
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
            
            this.appearancePiece = new CGFappearance(this.scene);
            this.appearancePiece.setEmission(0, 0, 0, 1);
            this.appearancePiece.setAmbient(0.2, 0.2, 0.2, 1);
            this.appearancePiece.setDiffuse(0.5, 0.5, 0.5, 1);
            this.appearancePiece.setSpecular(0.5, 0.5, 0.5, 1);
            this.appearancePiece.setShininess(1);
            
            this.borderPieceTexture = new CGFtexture(this.scene, "../scenes/images/greenPiece.png");
            this.redPieceTexture = new CGFtexture(this.scene, "../scenes/images/redPiece.png");
            this.bluePieceTexture = new CGFtexture(this.scene, "../scenes/images/bluePiece.png");

        if(this.colour == 'green')
            this.appearancePiece.setTexture(this.borderPieceTexture);
        else if(this.colour == 'red')
            this.appearancePiece.setTexture(this.redPieceTexture);
        else if(this.colour == 'blue')
            this.appearancePiece.setTexture(this.bluePieceTexture);
    }

    display() {

        if( this.player == null ) {
            this.scene.pushMatrix();   
                this.appearancePiece.apply();
                this.piece.display();
            this.scene.popMatrix();

            this.scene.pushMatrix(); 
                this.scene.rotate(Math.PI, 0, 0, 1);  
                this.appearancePiece.apply();
                this.piece.display();
            this.scene.popMatrix();

            this.borderPieceTexture.unbind();
        }

        else if( this.player == 'red' ) {
            this.scene.pushMatrix();

                this.scene.pushMatrix();   
                    this.scene.scale(0.09, 0.09, 0.09);
                    this.appearancePiece.apply();
                    this.piece.display();
                this.scene.popMatrix();

                this.scene.pushMatrix(); 
                    this.scene.rotate(Math.PI, 0, 0, 1); 
                    this.scene.scale(0.09, 0.09, 0.09);
                    this.appearancePiece.apply(); 
                    this.piece.display();
                this.scene.popMatrix();
            this.scene.popMatrix();
        }

        else if( this.player == 'blue' ) {
            this.scene.pushMatrix();

                this.scene.pushMatrix();   
                    this.appearancePiece.apply();
                    this.scene.scale(0.09, 0.09, 0.09);
                    this.piece.display();
                this.scene.popMatrix();

                this.scene.pushMatrix(); 
                    this.scene.rotate(Math.PI, 0, 0, 1);  
                    this.scene.scale(0.09, 0.09, 0.09);
                    this.appearancePiece.apply();
                    this.piece.display();
                this.scene.popMatrix();
            this.scene.popMatrix();
        }
       

    };

    

    applyMaterial(material) {
        this.appearance = material;
    };

    applyTexture(texture) {
        this.CustomTexture = texture;
    };

};
