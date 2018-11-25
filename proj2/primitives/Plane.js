class Plane extends CGFobject {

    constructor(scene, npartsU, npartsV) {
        super(scene);
        
        this.scene = scene;
        
        
        this.npartsU = npartsU;
        this.npartsV = npartsV;

        this.surface;

        this.init();
    }

    init() {

        var cp = [
                    [
                        [-0.5, 0, 0.5, 1 ],
                        [-0.5, 0, -0.5, 1 ]
                    ],
                    [ 
                        [ 0.5,  0, 0.5, 1 ],
                        [ 0.5, 0, -0.5, 1 ]
                    ]
                ];

        var nurbSurface = new CGFnurbsSurface(1, 1, cp);
        this.surface = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbSurface);
    }

    display() {
        this.surface.display();
    }

    updateTexCoords(){}
    

}