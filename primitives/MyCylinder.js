class MyCylinder extends CGFobject
{
	constructor(scene, base, top, height, slices, stacks) 
	{
		super(scene);

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
		

		var angInt = (Math.PI*2)/this.slices;

		for(var j = 0; j <= this.stacks; j++)
		{
			for(var i = 0; i < this.slices; i++)
			{
				this.vertices.push(Math.cos(angInt*i), Math.sin(angInt*i), 1-(j/this.stacks));

				this.normals.push(Math.cos(angInt*i), Math.sin(angInt*i), 1-(j/this.stacks));
			}
		}

		for(var k=0; k < (this.slices*this.stacks); k++)
		{
			if( ((k+1)%this.slices) == 0)
			{
				this.indices.push(k+this.slices, k-this.slices+1, k);
				this.indices.push(k-this.slices+1, k+this.slices, k+1);
			}
			else
			{
				this.indices.push(k + this.slices, k + 1, k);
				this.indices.push(k + 1, k + this.slices, k + 1 + this.slices);
			}
			
		}

		/*
		for(var i = 0; i<this.slices; i++)
		{
			this.vertices.push(Math.cos(angInt*i), Math.sin(angInt*i), 0);
			this.normals.push(0, 0, 1);
			this.texCoords.push(0.5 + (Math.cos(angInt*i)/2), 0.5 - (Math.sin(angInt*i)/2));
		}


		for(var j = 1; j<(this.slices+1); j++)
		{	
			if( (j+1) == (this.slices+1) )
				this.indices.push(0, j, 1);

			else
				this.indices.push(0, j, j+1);
		}
		*/
		
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};