class MyCylinder extends CGFobject
{
	constructor(scene, base, top, height, slices, stacks, minS, maxS, minT, maxT)
	{
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

		this.initBuffers();
	};

	initBuffers()
	{
		this.vertices = [
				];

		this.indices = [
			];

		this.normals = [
		];

		this.texCoords = [
		];

		//TODO
		//fix the display
		var angInt = (Math.PI*2)/this.slices;

		for(var j = 0; j <= this.stacks; j++)
		{
			for(var i = 0; i <= this.slices; i++)
			{
				this.vertices.push(this.baseRadius*Math.cos(angInt*i), this.baseRadius*Math.sin(angInt*i), 1-(j/this.stacks));

				this.normals.push(this.baseRadius*Math.cos(angInt*i), this.baseRadius*Math.sin(angInt*i), 1-(j/this.stacks));

				this.texCoords.push(this.minS + i*((this.maxS - this.minS) / this.slices), this.minT + j*((this.maxT - this.minT) / this.stacks));

			}
		}



		for(var k=0; k < (this.slices*this.stacks); k++)
		{

			if( ((k+1)%this.slices) == 0)
			{
				this.indices.push(k+this.slices + 1, k+1, k);
				this.indices.push(k+1, k+this.slices+1, k+this.slices+2);
			}
			else
			{
				this.indices.push(k + this.slices + 1, k + 1, k);
				this.indices.push(k + 1, k + this.slices + 1, k + 2 + this.slices);
			}

		}

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	updateTexCoords(s, t) {
		for (var i = 0; i < this.texCoords.length; i += 2) {
			this.texCoords[i] = this.texCoords[i] / s;
			this.texCoords[i + 1] = this.texCoords[i+1] / t;
		}
		this.updateTexCoordsGLBuffers();
	};

};
