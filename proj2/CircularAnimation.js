class CircularAnimation extends Animation {

    /**
    * @constructor
    */

    constructor(span, center, radius, startang, rotang) {

        super("circular");

        this.animationSpan = span;
        this.animationCenter = center;
        this.animationRadius = radius;
        this.animationStartang = startang;
        this.animationRotang = rotang;

        this.hasEnded = false;

    }

    getMatrix(time) {

        var animationMat = mat4.create();       
        mat4.identity(animationMat);
       
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