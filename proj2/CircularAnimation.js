class CircularAnimation extends Animation {

    /**
    * @constructor
    */

    constructor(span, center, radius, startang, rotang) {

        super("circular");

        this.animationSpan = span;
		this.animationCenter = center;
		console.log(this.animationCenter[0]);
        this.animationRadius = radius;
		this.animationStartang = startang; // Ângulo Inicial graus
        this.animationRotang = rotang; // Ângulo de rotação graus

        this.hasEnded = false;

        console.log(Math.PI);

    }

    getMatrix(time) {

        var animationMat = mat4.create();       
		mat4.identity(animationMat);
		
		let ang = this.startang + this.angularSpeed * time;

        mat4.translate(animationMat, animationMat, [this.animationCenter[0], this.animationCenter[1], this.animationCenter[2]]);
        mat4.rotate(animationMat, animationMat, ang, [0, 1, 0]); 		//rotacao eixo vertical (a unica rotacao possivel)
        mat4.translate(animationMat, animationMat, [this.animationRadius, 0, 0]);


       
        return animationMat;
    }

    updateValues() {

       /*  if( (this.CPTransition + 1) >= this.controlPoints.length)
            this.hasEnded = true;
        else {

            this.TperCPSum = 0;

            this.velocityX = Math.pow(this.controlPoints[this.CPTransition+1][0] - this.controlPoints[this.CPTransition][0], 2) / this.TperCP;

            this.velocityY = Math.pow(this.controlPoints[this.CPTransition+1][1] - this.controlPoints[this.CPTransition][1], 2) / this.TperCP;

            this.velocityZ = Math.pow(this.controlPoints[this.CPTransition+1][2] - this.controlPoints[this.CPTransition][2], 2) / this.TperCP;

            this.CPTransition++;

        } */
    }

    clone() {
        return new CircularAnimation(this.animationSpan = span, this.animationCenter, this.animationRadius, this.animationStartang = startang, this.animationRotang);
    }    
   
}