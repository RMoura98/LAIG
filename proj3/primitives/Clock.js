class Clock extends CGFobject {
	constructor(scene) {
		super(scene);
        
        this.scene = scene;

        this.init();
    }

    init() {
        this.quadBox = new MyQuad(this.scene, -0.5, -0.5, 0.5, 0.5);
        this.circle = new MyCircle(this.scene,20);
        this.quadNumber = new MyQuad(this.scene, -0.5, -0.5, 0.5, 0.5);

        this.appearance = new CGFappearance(this.scene);
        this.appearance.setEmission(0, 0, 0, 1);
        this.appearance.setAmbient(0.2, 0.2, 0.2, 1);
		this.appearance.setDiffuse(0.5, 0.5, 0.5, 1);
        this.appearance.setSpecular(0.5, 0.5, 0.5, 1);
        this.appearance.setShininess(1);

        /* this.quad.updateTexCoords(0.1, 4); */

        this.appearanceM1 = new CGFappearance(this.scene);
        this.appearanceM2 = new CGFappearance(this.scene);
        this.appearancePs = new CGFappearance(this.scene);
        this.appearanceS1 = new CGFappearance(this.scene);
        this.appearanceS2 = new CGFappearance(this.scene);

        this.appearancePP11 = new CGFappearance(this.scene);
        this.appearancePP12 = new CGFappearance(this.scene);
        this.appearancePP21 = new CGFappearance(this.scene);
        this.appearancePP22 = new CGFappearance(this.scene);
        
        this.appearanceRed = new CGFappearance(this.scene);
        this.appearanceBlue = new CGFappearance(this.scene);

        this.redPieceTexture = this.scene.graph.textures['redPiece'];
        this.bluePieceTexture = this.scene.graph.textures['bluePiece'];
        this.zero = this.scene.graph.textures['0'];
        this.dp = this.scene.graph.textures['2pontos'];
        this.doisPontosIte = 0;
        this.doisPontosDir = -1;
        this.doisPontosBool = true;

        this.appearanceM1.setTexture(this.zero);
        this.appearanceM2.setTexture(this.zero);
        this.appearancePs.setTexture(this.dp);
        this.appearanceS1.setTexture(this.zero);
        this.appearanceS2.setTexture(this.zero);

        this.appearancePP11.setTexture(this.zero);
        this.appearancePP12.setTexture(this.zero);
        this.appearancePP21.setTexture(this.zero);
        this.appearancePP22.setTexture(this.zero);

        this.appearanceRed.setTexture(this.redPieceTexture);
        this.appearanceBlue.setTexture(this.bluePieceTexture);
    }

    setNumbersTime(m,s){
        let [m1,m2] = m < 10 ? '0' + m : '' + m;
        let [s1,s2] = s < 10 ? '0' + s : '' + s;
        this.appearanceM1.setTexture(this.scene.graph.textures[m1]);
        this.appearanceM2.setTexture(this.scene.graph.textures[m2]);
        this.appearanceS1.setTexture(this.scene.graph.textures[s1]);
        this.appearanceS2.setTexture(this.scene.graph.textures[s2]);
    }

    setNumbersPoints(p1,p2){
        let [p11,p12] = p1 < 10 ? '0' + p1 : '' + p1;
        let [p21,p22] = p2 < 10 ? '0' + p2 : '' + p2;
        this.appearancePP11.setTexture(this.scene.graph.textures[p22]);
        this.appearancePP12.setTexture(this.scene.graph.textures[p21]);
        this.appearancePP21.setTexture(this.scene.graph.textures[p12]);
        this.appearancePP22.setTexture(this.scene.graph.textures[p11]);
        //estranho mas a funcionar nice!
    }
    
    display() {
        if(this.scene.timeOnStart) {
            let elapsed = (new Date().getTime() - this.scene.timeOnStart) / 1000; //in ms
            this.setNumbersTime(Math.floor(elapsed / 60 % 60),Math.floor(elapsed % 60));

            //? isto aqui podia ser no xml e guardar numa variavel global o elapsed e tar sempre a
            //? por la e depois so vamos la buscar o this.scene.elapsed ou algo do genero o que achas? tal como fiz em baixo
            //console.log(this.scene.redCount,this.scene.blueCount);

            this.setNumbersPoints(this.scene.redCount,this.scene.blueCount);
            if(!this.doisPontosBool) this.doisPontosBool = !this.doisPontosBool;
        }
        else {
            this.setNumbersTime('00','00');
            
            this.doisPontosIte += this.doisPontosDir;
            
            if(this.doisPontosIte > 1 || this.doisPontosIte < 0){
                this.doisPontosDir *= -1;
                this.doisPontosBool = !this.doisPontosBool;
            }        
        }


        
        // // // // 

        this.scene.pushMatrix();
            this.scene.scale(3,1,1);
            this.quadBox.display();
        this.scene.popMatrix();

        
        this.scene.pushMatrix();
            this.scene.translate(0,-0.05,0.01);
            this.scene.scale(0.2,0.5,1);
            if (this.doisPontosBool) this.appearancePs.apply();
            this.quadNumber.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(-0.2,-0.05,0.01);
            this.scene.scale(0.2,0.5,1);
            this.appearanceM2.apply();
            this.quadNumber.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(-0.45,-0.05,0.01);
            this.scene.scale(0.2,0.5,1);
            this.appearanceM1.apply();
            this.quadNumber.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(0.2,-0.05,0.01);
            this.scene.scale(0.2,0.5,1);
            this.appearanceS1.apply();
            this.quadNumber.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(0.45,-0.05,0.01);
            this.scene.scale(0.2,0.5,1);
            this.appearanceS2.apply();
            this.quadNumber.display();
        this.scene.popMatrix();


        this.scene.pushMatrix();
            this.scene.translate(-1.10,0.35,0.01);
            this.scene.scale(0.05,0.05,1);
            this.appearanceRed.apply();
            this.circle.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
            this.scene.translate(1.20,-.075,0.01);
            this.scene.scale(0.15,0.45,1);
            this.appearancePP11.apply();
            this.quadNumber.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(1,-.075,0.01);
            this.scene.scale(0.15,0.45,1);
            this.appearancePP12.apply();
            this.quadNumber.display();
        this.scene.popMatrix();
        

        this.scene.pushMatrix();
            this.scene.translate(1.10,0.36,0.01);
            this.scene.scale(0.05,0.05,1);
            this.appearanceBlue.apply();
            this.circle.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
            this.scene.translate(-1,-.075,0.01);
            this.scene.scale(0.15,0.45,1);
            this.appearancePP21.apply();
            this.quadNumber.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(-1.20,-.075,0.01);
            this.scene.scale(0.15,0.45,1);
            this.appearancePP22.apply();
            this.quadNumber.display();
        this.scene.popMatrix();

        
       
    }

    updateTexCoords(){}
};
