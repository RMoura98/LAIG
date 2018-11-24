class Cylinder2 extends CGFobject {
	constructor(scene, base, top, height, slices, stacks) {
		super(scene);
        
        this.scene = scene;

		this.baseRadius = base;
		this.topRadius = top;
		this.height = height;
		this.slices = slices;
		this.stacks = stacks;

        this.npointsU = this.slices + 1;
        this.npointsV = this.stacks + 1;
        this.npartsU = 20;
        this.npartsV = 20;
        this.cp = [];

        this.surface;

        this.init();
    }

    init() {

        var angInt = (Math.PI * 2) / this.slices;
		var varRaioS = (this.topRadius - this.baseRadius) / this.stacks;
        var varheightS = this.height / this.stacks;

        var tempCP = []
        var tempCP2 = []

        for(var i=0; i<this.npointsV; i++) {
            tempCP = [];
            for(var j=0; j<this.npointsU; j++) {
                tempCP.push(
                    [(this.baseRadius + (varRaioS * i)) * Math.cos(j * angInt), 
                    (this.baseRadius + (varRaioS * i)) * Math.sin(j * angInt), 
                    i * varheightS,
                    1]
                );
            }
            tempCP2.push(tempCP);
        }

        var tempCP3 = [];
        for(var k=0; k<tempCP2[0].length; k++) {
            tempCP3 = [];
            for(var l=0; l<tempCP2.length; l++) {
                tempCP3.push(tempCP2[l][k]);
            }
            this.cp.push(tempCP3);
        }
        
        var nurbSurface = new CGFnurbsSurface(this.npointsU-1, this.npointsV-1, this.cp);
        this.surface = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbSurface);
        
    }

    display() {
        this.surface.display();
    }

};
