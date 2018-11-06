
class LinearAnimation extends Animation {

    /**
    * @constructor
    */

    constructor(span, controlPoints) {
        
        // TODO 
        // Need to fix starting position for animation
        // For now when positioned in the starting position the scales and rotates disappear
        // See commented code in line 1926 MySceneGraph


        super("linear");

        this.animationSpan = span;
        this.controlPoints = controlPoints;

        this.TperCP = this.animationSpan / (this.controlPoints.length - 1);

        this.velocityX = Math.pow(this.controlPoints[1][0] - this.controlPoints[0][0], 2) / this.TperCP;

        this.velocityY = Math.pow(this.controlPoints[1][1] - this.controlPoints[0][1], 2)/this.TperCP;

        this.velocityZ = Math.pow(this.controlPoints[1][2] - this.controlPoints[0][2], 2)/this.TperCP;

        this.CPTransition = 1;

        this.TperCPSum = 0;

        this.hasEnded = false;

    }

    getMatrix(time) {

        var animationMat = mat4.create();       
        mat4.identity(animationMat);

        if( (this.TperCPSum + time) >= this.TperCP )
            this.updateValues();
        else 
            this.TperCPSum += time;

        //acho que isto ja se pode tirar
        if(this.hasEnded) 
            return animationMat;
        
        var dx = this.velocityX * time;
        var dy = this.velocityY * time;
        var dz = this.velocityZ * time;

        mat4.translate(animationMat, animationMat, [dx, dy, dz]);
        
        
       
        return animationMat;
    }

    updateValues() {

        if( (this.CPTransition + 1) >= this.controlPoints.length)
            this.hasEnded = true;
        else {

            this.TperCPSum = 0;

            this.velocityX = Math.pow(this.controlPoints[this.CPTransition+1][0] - this.controlPoints[this.CPTransition][0], 2) / this.TperCP;

            this.velocityY = Math.pow(this.controlPoints[this.CPTransition+1][1] - this.controlPoints[this.CPTransition][1], 2) / this.TperCP;

            this.velocityZ = Math.pow(this.controlPoints[this.CPTransition+1][2] - this.controlPoints[this.CPTransition][2], 2) / this.TperCP;

            this.CPTransition++;

        }
    }

    clone() {
        return new LinearAnimation(this.animationSpan, this.controlPoints);
    }

}