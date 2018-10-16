class MyQuad extends CGFobject {
	constructor(scene, x1, y1, x2, y2) {
		super(scene);

		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;

		this.maxS = 1.0;
		this.maxT = 1.0;

		this.initBuffers();

	};

	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,
			this.x2, this.y1, 0,
			this.x1, this.y2, 0,
			this.x2, this.y2, 0
		];

		this.indices = [
			0, 1, 2,
			3, 2, 1
		];


		this.texCoords = [
			1, 1,
			0, 1,
			1, 0,
			0, 0,
		];

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	updateTexCoords(s, t) {

		this.texCoords = [
		  //Left lower
		  0, 1/t,
		  //Right lower
		  1/s, 1/t,
		  //Left upper
		  0, 0,
		  //Rigth upper
		  1/s, 0
	  ];

		this.updateTexCoordsGLBuffers();

	};
};
