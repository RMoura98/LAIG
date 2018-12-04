class CircularAnimation extends Animation {

    /**
    * @constructor
    */

    constructor(span, center, radius, startang, rotang) {

        super("circular");

        this.animationSpan = span;
        this.animationCenter = center;
        this.animationRadius = radius;
        this.animationStartang = startang; // Ângulo Inicial graus
        this.animationRotang = rotang; // Ângulo de rotação graus

        this.animationRotangDEFAULT = this.animationRotang;
        this.animationStartangDEFAULT = this.animationStartang;

        this.animationRotang = DEGREE_TO_RAD * this.animationRotang;
        this.animationStartang = DEGREE_TO_RAD * this.animationStartang;

        this.TSum = 0;
        this.gSum = 0;
        this.hasEnded = false;

        this.vel = this.animationRotang / this.animationSpan;
    }

    getMatrix(time) {

        var animationMat = mat4.create();
        mat4.identity(animationMat);

        var ang;

        this.TSum += time;
        if (this.TSum > this.animationSpan) {
            let ans = this.TSum - this.animationSpan;
            var ans2 = time - ans;
            ang = this.vel * ans2;
            this.hasEnded = true;
        }
        else {
            ang = this.vel * time;
        }

        if (this.TSum - time == 0) {
            mat4.translate(animationMat, animationMat, [this.animationCenter[0], this.animationCenter[1], this.animationCenter[2]]);
            mat4.rotate(animationMat, animationMat, this.animationStartang, [0, 1, 0]);
            mat4.translate(animationMat, animationMat, [this.animationRadius, 0, 0]);
        }
        else {
            mat4.translate(animationMat, animationMat, [-this.animationRadius, 0, 0]);
            mat4.rotate(animationMat, animationMat, ang, [0, 1, 0]);
            mat4.translate(animationMat, animationMat, [this.animationRadius, 0, 0]);
        }

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
        return new CircularAnimation(this.animationSpan, this.animationCenter, this.animationRadius, this.animationStartangDEFAULT, this.animationRotangDEFAULT);
    }

}