/**
 * MyCircle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyCircle extends CGFobject {

	constructor(scene, slices)
	{
		super(scene);

		this.slices = slices;
		this.initBuffers();
	};

	initBuffers() {
		this.vertices = [];

		this.indices = [];

		this.normals = [];

		this.texCoords = [];

		var alpha = (2 * Math.PI) / (this.slices);

		this.vertices.push(0, 0, 0);
		this.normals.push(0, 0, 1);
		this.texCoords.push(0.5, 0.5);


		for (let j = 0; j < this.slices; j++) {
			this.vertices.push(Math.cos(j * alpha), Math.sin(j * alpha), 0);
			this.texCoords.push(0.5 + 0.5 * Math.cos(j * alpha), 0.5 - 0.5 * Math.sin(j * alpha));
			this.normals.push(0, 0, 1);
		}

		for (let j = 1; j <= this.slices; j++) {
			this.indices.push(j == this.slices ? 1 : (j + 1), 0, j);
		}

		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	};

};
