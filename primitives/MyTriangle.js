class MyTriangle extends CGFobject {

	constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
		super(scene);

		this.x1 = x1;
		this.y1 = y1;
		this.z1 = z1;

		this.x2 = x2;
		this.y2 = y2;
		this.z2 = z2;

		this.x3 = x3;
		this.y3 = y3;
		this.z3 = z3;

		this.u = 1.0;
        this.v = 1.0;

		this.initBuffers();
	}

	initBuffers() {

		this.vertices = [
			this.x1, this.y1, this.z1,
			this.x2, this.y2, this.z2,
			this.x3, this.y3, this.z3
		];

		this.indices = [
			0, 1, 2
		];

		var normalX = (this.y2 - this.y1) * (this.z3 - this.z1) - (this.z2 - this.z1) * (this.y3 - this.y1);
		var normalY = (this.z2 - this.z1) * (this.x3 - this.x1) - (this.x2 - this.x1) * (this.z3 - this.z1);
		var normalZ = (this.x2 - this.x1) * (this.y3 - this.y1) - (this.y2 - this.y1) * (this.x3 - this.x1);

		this.normals = [
			normalX, normalY, normalZ,
			normalX, normalY, normalZ,
			normalX, normalY, normalZ
		];

		this.texCoords = [
			0, 1,
			1, 1,
			0, 0,
			1, 0
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}



	updateTexCoords(s, t) {

		this.u = s;
        this.v = t;

		var a = Math.sqrt(Math.pow((this.x1 - this.x3), 2) + Math.pow((this.y1 - this.y3), 2) + Math.pow((this.z1 - this.z3), 2));
		var b = Math.sqrt(Math.pow((this.x2 - this.x1), 2) + Math.pow((this.y2 - this.y1), 2) + Math.pow((this.z2 - this.z1), 2));
		var c = Math.sqrt(Math.pow((this.x3 - this.x2), 2) + Math.pow((this.y3 - this.y2), 2) + Math.pow((this.z3 - this.z2), 2));

		var b_cos = (a * a - b * b + c * c) / (2.0 * a * c);
		var b_sin = Math.sqrt(1 - Math.pow(b_cos, 2));

		this.texCoords = [
			(c - a * b_cos) / s, (this.v - a * b_sin) / t,
			0, 1 / t,
			c / s, 1 / t
		];

		this.updateTexCoordsGLBuffers();
	};

}
