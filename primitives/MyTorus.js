class MyTorus extends CGFobject {

	constructor(scene, innerRadius, outerRadius, slices, loops) {
		super(scene);

		this.innerRadius = innerRadius;
		this.outerRadius = outerRadius;
		this.slices = slices;
		this.loops = loops;

		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [];

		this.indices = [];

		this.normals = [];

		this.texCoords = [];

		var angY = (Math.PI * 2) / this.slices;
		var angO = (Math.PI * 2) / this.loops;

		var x, y, z;


		for (var i = 0; i <= this.slices; ++i) {
			for (var j = 0; j <= this.loops; ++j) {

				//coordenadas paramétricas ( wiki :) )
				x = (this.outerRadius + this.innerRadius * Math.cos(j * angO)) * Math.cos(i * angY);
				y = (this.outerRadius + this.innerRadius * Math.cos(j * angO)) * Math.sin(i * angY);
				z = this.innerRadius * Math.sin(j*angO);

				this.vertices.push(x, y, z);
				this.normals.push(x - (this.outerRadius * Math.cos(i * angY)), y - (this.outerRadius * Math.sin(i * angY)), z);
				this.texCoords.push(j / this.loops, 1 - i / this.slices);
			}
		}

		for (var i = 0; i < this.slices; ++i) {
			for (var j = 0; j < this.loops; ++j) {
				this.indices.push(i * (this.loops + 1) + j + 1, i * (this.loops + 1) + j,  (i + 1) * (this.loops + 1) + j);
				this.indices.push( (i + 1) * (this.loops + 1) + j,  (i + 1) * (this.loops + 1) + j + 1, i * (this.loops + 1) + j + 1);
			}
		}

		this.primitiveType=this.scene.gl.TRIANGLES;
        this.initGLBuffers();


	}



	updateTexCoords(s, t) {};

}
