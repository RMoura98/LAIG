class MyCylinder extends CGFobject {
	constructor(scene, base, top, height, slices, stacks, minS, maxS, minT, maxT) {
		super(scene);

		this.minS = minS || 0.0;
		this.maxS = maxS || 1.0;
		this.minT = minT || 0.0;
		this.maxT = maxT || 1.0;

		this.baseRadius = base;
		this.topRadius = top;
		this.height = height;
		this.slices = slices;
		this.stacks = stacks;

		this.base = new MyCircle(this.scene, this.slices);

		this.initBuffers();
	};

	initBuffers() {
		this.vertices = [];

		this.indices = [];

		this.normals = [];

		this.texCoords = [];

		console.log(Math.abs(this.baseRadius - this.topRadius) == 0);

		//TODO
		//fix the display e so mudar este !! muito chato
		var angInt = (Math.PI * 2) / this.slices;

		var varRaioS = (this.topRadius - this.baseRadius) / this.stacks;
		var varheightS = this.height / this.stacks;


		for (var i = 0; i <= this.stacks; ++i) {
			for (var j = 0; j <= this.slices; ++j) {
				var cRaio = varRaioS * i;
				// normais
				this.vertices.push((this.baseRadius + (varRaioS * i)) * Math.cos(j * angInt), (this.baseRadius + (varRaioS * i)) * Math.sin(j * angInt), i * varheightS);
				/*this.normals.push(cRaio * Math.cos(varheightS) * Math.cos(angInt), cRaio * Math.cos(varheightS) * Math.sin(angInt), cRaio * Math.sin(varheightS));*/
				this.normals.push( this.height * Math.cos(j * angInt) / Math.sqrt(Math.pow(cRaio, 2) + Math.pow(this.height, 2)), this.height * Math.sin(j * angInt) / Math.sqrt(Math.pow(cRaio, 2) + Math.pow(this.height, 2)), cRaio / Math.sqrt(Math.pow(cRaio, 2) + Math.pow(this.height, 2)));
				this.texCoords.push(j / this.slices, 1 - i / this.stacks);
			}
		}

		/*for (var j = 0; j <= this.stacks; j++) {
			for (var i = 0; i <= this.slices; i++) {
				this.vertices.push(this.baseRadius * Math.cos(angInt * i), this.baseRadius * Math.sin(angInt * i), 1 - (j / this.stacks));

				if (this.baseRadius > this.topRadius){
					this.normals.push(this.baseRadius * Math.cos(angInt * i), this.baseRadius * Math.sin(angInt * i), 1 - (j / this.stacks));
				}
				if (this.baseRadius < this.topRadius){
					this.normals.push(this.baseRadius * Math.cos(angInt * i), this.baseRadius * Math.sin(angInt * i), 1 - (j / this.stacks));
				}
				else {
					this.normals.push(this.baseRadius * Math.cos(angInt * i), this.baseRadius * Math.sin(angInt * i), 1 - (j / this.stacks));
				}


				this.texCoords.push(this.minS + i * ((this.maxS - this.minS) / this.slices), this.minT + j * ((this.maxT - this.minT) / this.stacks));

			}
		}*/


		/*for (let i = 0; i < this.stacks; i++) {
			for (let j = 0; j <= this.slices; j++) {
					this.indices.push((i * this.slices + j), (i * this.slices + j) + 1, ((i + 1) * this.slices + j) + 1);
					this.indices.push((i * this.slices + j), ((i + 1) * this.slices + j) + 1,((i + 1) * this.slices + j) );

			}
		}*/


				/*for (var stack = 0; stack < this.stacks; ++stack) {
		 		for (var slice = 0; slice < (this.slices + 1); ++slice) {
		            this.indices.push(i * (this.slices + 1) + slice, stack * (this.slices + 1) + (slice + 1) % (this.slices + 1), (stack + 1) * (this.slices + 1) + (slice + 1) % (this.slices + 1));
		            this.indices.push(stack * (this.slices + 1) + slice, (stack + 1) * (this.slices + 1) + (slice + 1) % (this.slices + 1), (stack + 1) * (this.slices + 1) + slice);
		 		}
		 	}*/

		for (var i = 1; i <= this.stacks; i++) {
			for (var j = 1; j <= this.slices; j++) {
				this.indices.push((this.slices + 1) * (i - 1) + (this.slices - j), (this.slices + 1) * (i - 1) + (this.slices - j) + 1, (this.slices + 1) * i + (this.slices - j) + 1);
				this.indices.push((this.slices + 1) * i + (this.slices - j) + 1, (this.slices + 1) * i + (this.slices - j), (this.slices + 1) * (i - 1) + (this.slices - j));
			}
		}



		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	display() {

		//cylinder
		super.display();

		//top base
		this.scene.pushMatrix();
		this.scene.scale(this.topRadius, this.topRadius, 1);
		this.scene.translate(0, 0, this.height); //qualquer coisa aqui nao esta bem...
		this.base.display();
		this.scene.popMatrix();

		//bottom base
		this.scene.pushMatrix();
		this.scene.scale(this.baseRadius, this.baseRadius, 1);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.base.display();
		this.scene.popMatrix();
	}

	updateTexCoords(s, t) {

		//nao e preciso fazer nada

		//nao funcional
		/*for (var i = 0; i < this.texCoords.length; i += 2) {
			this.texCoords[i] = this.texCoords[i] / s;
			this.texCoords[i + 1] = this.texCoords[i + 1] / t;
		}
		this.updateTexCoordsGLBuffers();*/
	};

};
