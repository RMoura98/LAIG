class MySphere extends CGFobject {
	constructor(scene, radius, slices, stacks, minS, maxS, minT, maxT) {
		super(scene);

		this.minS = minS || 0.0;
		this.maxS = maxS || 1.0;
		this.minT = minT || 0.0;
		this.maxT = maxT || 1.0;

		this.radius = radius;
		this.slices = slices;
		this.stacks = stacks;

		this.initBuffers();
	};

	initBuffers() {

        this.vertices = [];

		this.indices = [];

		this.normals = [];

        this.texCoords = [];
        
        
        var theta = Math.PI / this.stacks;
        var phi = (2 * Math.PI) / this.slices;

        for (var latNumber = 0; latNumber <= this.stacks; latNumber++) { 

            for (var longNumber = 0; longNumber <= this.slices; longNumber++) {

                var x = Math.cos(phi * longNumber) * Math.sin(theta * latNumber);
                var y = Math.cos(theta * latNumber);
                var z = Math.sin(phi * longNumber) * Math.sin(theta * latNumber);
                var s = 1 - (longNumber / this.slices);
                var t = 1 - (latNumber / this.stacks);

                this.normals.push(x);
                this.normals.push(y);
                this.normals.push(z);

                this.texCoords.push(s);
                this.texCoords.push(t);

                this.vertices.push(this.radius * x);
                this.vertices.push(this.radius * y);
                this.vertices.push(this.radius * z);
            }
        }
    

        for (var latNumber = 0; latNumber < this.stacks; latNumber++) {

            for (var longNumber = 0; longNumber < this.slices; longNumber++) {

                var first = (latNumber * (this.slices + 1)) + longNumber;

                var second = first + this.slices + 1;

                this.indices.push(first);
                this.indices.push(second);
                this.indices.push(first + 1);

                this.indices.push(second);
                this.indices.push(second + 1);
                this.indices.push(first + 1);
            }
        }
        
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();

    };
    
    updateTexCoords(s, t) {};
};
