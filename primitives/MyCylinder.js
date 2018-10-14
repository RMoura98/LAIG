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

		// DEBUG: console.log(Math.abs(this.baseRadius - this.topRadius) == 0);

		var angInt = (Math.PI * 2) / this.slices;
		var varRaioS = (this.topRadius - this.baseRadius) / this.stacks;
		var varheightS = this.height / this.stacks;


		for (var i = 0; i <= this.stacks; ++i) {
			for (var j = 0; j <= this.slices; ++j) {
				var cRaio = varRaioS * i;
				// normais
				this.vertices.push((this.baseRadius + (varRaioS * i)) * Math.cos(j * angInt), (this.baseRadius + (varRaioS * i)) * Math.sin(j * angInt), i * varheightS);
				this.normals.push(this.height * Math.cos(j * angInt) / Math.sqrt(Math.pow(cRaio, 2) + Math.pow(this.height, 2)), this.height * Math.sin(j * angInt) / Math.sqrt(Math.pow(cRaio, 2) + Math.pow(this.height, 2)), cRaio / Math.sqrt(Math.pow(cRaio, 2) + Math.pow(this.height, 2)));
				this.texCoords.push(j / this.slices, 1 - i / this.stacks);
			}
		}


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
		if (this.baseRadius != 0) {
			// DEBUG: console.log("1");
			this.scene.pushMatrix();
				this.scene.scale(this.topRadius, this.topRadius, 1);
				this.scene.translate(0, 0, this.height); //qualquer coisa aqui nao esta bem...
				this.base.display();
			this.scene.popMatrix();
		}


		//bottom base
		if (this.topRadius != 0) {
			// DEBUG: console.log("2");
			this.scene.pushMatrix();
				this.scene.scale(this.baseRadius, this.baseRadius, 1);
				this.scene.rotate(Math.PI, 0, 1, 0);
				this.base.display();
			this.scene.popMatrix();
		}
	}

	updateTexCoords(s, t) {};

};
