
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
			this.TperCP[j] = span * (d_CP[j] / d_Total);
		}

		this.velocityX = 0;
		this.velocityY = 0;
		this.velocityZ = 0;

		this.TperCPSum = 0;

		this.hasEnded = false;

		this.CPTransition = 0;
		this.updateValues();

	}

	getMatrix(time) {

		var animationMat = mat4.create();
		mat4.identity(animationMat);

		var dx;
		var dy;
		var dz;

		if ((this.TperCPSum + time) >= this.TperCP[this.CPTransition-1]){
			var ans = (this.TperCPSum + time) - this.TperCP[this.CPTransition-1];
			var ans2 = time - ans;

			dx = this.velocityX * ans2;
			dy = this.velocityY * ans2;
			dz = this.velocityZ * ans2;

			this.updateValues(ans);
			
			if (this.hasEnded){
				mat4.translate(animationMat, animationMat, [dx, dy, dz]);
				return animationMat;
			}
				
			dx += this.velocityX * ans;
			dy += this.velocityY * ans;
			dz += this.velocityZ * ans;
		}
		else{

			this.TperCPSum += time;

			var dx = this.velocityX * time;
			var dy = this.velocityY * time;
			var dz = this.velocityZ * time;
		}

		mat4.translate(animationMat, animationMat, [dx, dy, dz]);

		return animationMat;6
	}

	updateValues(timeLeft) {

		if (this.CPTransition+1 >= this.controlPoints.length)
			this.hasEnded = true;
		else {
			if(timeLeft != null)
				this.TperCPSum = timeLeft;
			else
				this.TperCPSum = 0;

			this.velocityX = Math.pow(this.controlPoints[this.CPTransition + 1][0] - this.controlPoints[this.CPTransition][0], 2) / this.TperCP[this.CPTransition];

			this.velocityY = Math.pow(this.controlPoints[this.CPTransition + 1][1] - this.controlPoints[this.CPTransition][1], 2) / this.TperCP[this.CPTransition];

			this.velocityZ = Math.pow(this.controlPoints[this.CPTransition + 1][2] - this.controlPoints[this.CPTransition][2], 2) / this.TperCP[this.CPTransition];

			this.CPTransition++;

		}
	}

	clone() {
		return new LinearAnimation(this.animationSpan, this.controlPoints);
	}

}