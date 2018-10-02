class MyQuad extends CGFobject
{
	constructor(scene, minS, maxS, minT, maxT) 
	{
		super(scene);

		this.minS = minS || 0.0;
		this.maxS = maxS || 1.0;
		this.minT = minT || 0.0;
		this.maxT = maxT || 1.0;

// 		this.floorAppearance = new CGFappearance(this.scene);
// 		this.floorAppearance.loadTexture("../resources/images/floor.png");

// 		this.windowAppearance = new CGFappearance(this.scene);
// 		this.windowAppearance.loadTexture("../resources/images/window.png");

		this.initBuffers();
		
	};

	initBuffers() 
	{
		this.vertices = [
				-0.5, -0.5, 0,
				0.5, -0.5, 0,
				-0.5, 0.5, 0,
				0.5, 0.5, 0
				];

		this.indices = [
				0, 1, 2, 
				3, 2, 1
			];
		

		this.texCoords = [
				this.maxS, this.maxT,
				this.minS, this.maxT,
				this.maxS, this.minT,
				this.minS, this.minT,
		];
		
			
		this.primitiveType=this.scene.gl.TRIANGLES;

		
		this.normals = [
				0, 0, 1,
				0, 0, 1,
				0, 0, 1,
				0, 0, 1
		];
		
			
		this.initGLBuffers();
	};
};
