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

		//TODO
		//fix the display e so mudar este !! muito chato
		var angInt = (Math.PI * 2) / this.slices;

		for (var j = 0; j <= this.stacks; j++) {
			for (var i = 0; i <= this.slices; i++) {
				this.vertices.push(this.baseRadius * Math.cos(angInt * i), this.baseRadius * Math.sin(angInt * i), 1 - (j / this.stacks));

				this.normals.push(this.baseRadius * Math.cos(angInt * i), this.baseRadius * Math.sin(angInt * i), 1 - (j / this.stacks));

				this.texCoords.push(this.minS + i * ((this.maxS - this.minS) / this.slices), this.minT + j * ((this.maxT - this.minT) / this.stacks));

			}
		}


		for (let i = 0; i < this.stacks; i++) {
			for (let j = 0; j < this.slices; j++) {
				if (j == this.slices - 1) {
					this.indices.push( (((i + 1) * this.slices + j) + 1) - this.slices,  (i * this.slices + j) + 1 - this.slices,(i * this.slices + j));
					this.indices.push(((i + 1) * this.slices + j), (((i + 1) * this.slices + j) + 1) - this.slices, (i * this.slices + j));
				}
				else {
					this.indices.push(((i + 1) * this.slices + j) + 1, (i * this.slices + j) + 1, (i * this.slices + j));
					this.indices.push(((i + 1) * this.slices + j), ((i + 1) * this.slices + j) + 1,(i * this.slices + j) );
				}
			}
		}


		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	display(){

		//cylinder
		super.display();

		//top base
		this.scene.pushMatrix();
			this.scene.scale(this.topRadius, this.topRadius, 1);
			this.scene.translate(0, 0, 0.65*this.height); //qualquer coisa aqui nao esta bem...
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
		for (var i = 0; i < this.texCoords.length; i += 2) {
			this.texCoords[i] = this.texCoords[i] / s;
			this.texCoords[i + 1] = this.texCoords[i + 1] / t;
		}
		this.updateTexCoordsGLBuffers();
	};

};
