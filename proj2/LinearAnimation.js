
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

		this.TperCP = [];
		this.CPTransition = 0;

		let d_CP = [];
		let d_Total = 0;

		for (let i = 0; i < controlPoints.length - 1; i++) {
			//calcular a dist entre dois CP
			d_CP.push(Math.sqrt(Math.pow(this.controlPoints[i + 1][0] - this.controlPoints[i][0], 2) + Math.pow(this.controlPoints[i + 1][1] - this.controlPoints[i][1], 2) + Math.pow(this.controlPoints[i + 1][2] - this.controlPoints[i][2], 2)));
			//calcular a dist total percorrida na animacao
			d_Total += d_CP[i];
		}

		for (let j = 0; j < d_CP.length; j++) {
			this.TperCP[j] = this.animationSpan * (d_CP[j] / d_Total);
		}

		this.velocityX = 0;
		this.velocityY = 0;
		this.velocityZ = 0;

		this.TperCPSum = 0;

		this.hasEnded = false;

		this.CPTransition = 0;
        this.updateValues();
		this.angle = 0;
        this.aiiii = false;
	}

	getMatrix(time) {

		var animationMat = mat4.create();
		mat4.identity(animationMat);

		var dx;
		var dy;
        var dz;
        
        var oldAngle = this.angle;

		if (this.TperCPSum == 0 && this.CPTransition - 1 == 0){
			this.getAngle(0);
			/* mat4.rotate(animationMat, animationMat, Math.PI / 2 - this.angle, [0, 1, 0]);  */
		}

		if ((this.TperCPSum + time) >= this.TperCP[this.CPTransition - 1]) {
			var ans = (this.TperCPSum + time) - this.TperCP[this.CPTransition - 1];
			var ans2 = time - ans;

			dx = this.velocityX * ans2;
			dy = this.velocityY * ans2;
			dz = this.velocityZ * ans2;

			this.updateValues();
			
			

			if (!this.hasEnded) {
                this.getAngle(this.CPTransition-1);
                this.aiiii = true;
				dx += this.velocityX * ans;
				dy += this.velocityY * ans;
				dz += this.velocityZ * ans;
			}
		}
		else {

			this.TperCPSum += time;

			var dx = this.velocityX * time;
			var dy = this.velocityY * time;
			var dz = this.velocityZ * time;
        }

       
        mat4.rotateY(animationMat, animationMat, -oldAngle);
        mat4.translate(animationMat, animationMat, [dx, dy, dz]);
        mat4.rotateY(animationMat, animationMat, oldAngle);

        if(this.aiiii){
            this.aiiii = false;
            mat4.rotateY(animationMat, animationMat, -oldAngle);
			mat4.rotateY(animationMat, animationMat, this.angle);
        }

		return animationMat;
	}

	updateValues() {

		if (this.CPTransition + 1 >= this.controlPoints.length)
			this.hasEnded = true;
		else {
			this.TperCPSum = 0;

			this.velocityX = Math.sqrt(Math.pow(this.controlPoints[this.CPTransition + 1][0] - this.controlPoints[this.CPTransition][0], 2)) / this.TperCP[this.CPTransition];

			if (this.controlPoints[this.CPTransition + 1][0] < this.controlPoints[this.CPTransition][0])
				this.velocityX *= -1;

			this.velocityY = Math.sqrt(Math.pow(this.controlPoints[this.CPTransition + 1][1] - this.controlPoints[this.CPTransition][1], 2)) / this.TperCP[this.CPTransition];

			if (this.controlPoints[this.CPTransition + 1][1] < this.controlPoints[this.CPTransition][1])
				this.velocityY *= -1;

			this.velocityZ = Math.sqrt(Math.pow(this.controlPoints[this.CPTransition + 1][2] - this.controlPoints[this.CPTransition][2], 2)) / this.TperCP[this.CPTransition];

			if (this.controlPoints[this.CPTransition + 1][2] < this.controlPoints[this.CPTransition][2])
				this.velocityZ *= -1;

			this.CPTransition++;

		}
	}

	clone() {
		return new LinearAnimation(this.animationSpan, this.controlPoints);
	}

	getAngle(cp) {
        var dX = this.controlPoints[cp + 1][0] - this.controlPoints[cp][0];
        var dZ = this.controlPoints[cp + 1][2] - this.controlPoints[cp][2];
        
        this.angle = this.angle2V([dX,0,dZ ],[0,0,1]);
/*         this.angle = Math.atan2(dZ, dX); */
        if(dX < 0)
            this.angle *= -1;
        /*if(dX == 0 && dZ == 0)
            this.angle = 0;
 */
       /*  if (Math.abs(dZ) < 0.01){
            this.angle *= -1;
            console.log(dZ);
            console.log(this.angle);
        } */
 
    }

    angle2V(a, b) {
        let tempA = vec3.fromValues(a[0], a[1], a[2]);
        let tempB = vec3.fromValues(b[0], b[1], b[2]);
        vec3.normalize(tempA, tempA);
        vec3.normalize(tempB, tempB);
        let cosine = vec3.dot(tempA, tempB);
        if(cosine > 1.0) {
          return 0;
        }
        else if(cosine < -1.0) {
          return Math.PI;
        } else {
          return Math.acos(cosine);
        }
    }
   

}