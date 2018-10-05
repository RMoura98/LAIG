class MyQuad extends CGFobject
{
	constructor(scene, x1, y1, x2, y2) 
	{
		super(scene);

		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;

		this.minS = 0.0;
		this.maxS = 1.0;
		this.minT = 0.0;
		this.maxT = 1.0;

// 		this.floorAppearance = new CGFappearance(this.scene);
// 		this.floorAppearance.loadTexture("../resources/images/floor.png");

// 		this.windowAppearance = new CGFappearance(this.scene);
// 		this.windowAppearance.loadTexture("../resources/images/window.png");

		this.initBuffers();
		
	};

	initBuffers() 
	{
		this.vertices = [
				x1, y1, 0,
				x1, y2, 0,
				x2, y1, 0,
				x2, y2, 0
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
