class Patch extends CGFobject {

    constructor(scene, npointsU, npointsV, npartsU, npartsV, CP) {
        super(scene);
        
        this.scene = scene;
        
        this.npointsU = npointsU;
        this.npointsV = npointsV;

        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.cp = CP;

        this.surface;


        this.init();
    }

    init() {
        // grau nPontos -1
        var formatedCP = [];
        let index = 0;

        for(var i=0; i<this.npointsU; i++) {
            var tempCP = [];
            for(var j=0; j<this.npointsV; j++) {
                tempCP.push(this.cp[index]);
                index++;
            }
            formatedCP.push(tempCP);
        }

        var nurbSurface = new CGFnurbsSurface(this.npointsU-1, this.npointsV-1, formatedCP);
        this.surface = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbSurface);
        
    }

    display() {
        this.surface.display();
    }
    

}