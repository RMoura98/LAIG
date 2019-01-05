class Skull extends CGFobject {
	constructor(scene) {
        super(scene);
        this.scene = scene;
        this.obj = new CGFOBJModel(this.scene, '../models/skull.obj');
        this.material = new CGFappearance(this.scene);
        this.material.setTexture(new CGFtexture(this.scene, "scenes/images/skull.jpg"));
    }

    display() {
        this.scene.pushMatrix();
            this.scene.rotate(-Math.PI/2,1,0,0);
            this.scene.scale(0.025, 0.025, 0.025);
            this.material.apply();
            this.obj.display();
		this.scene.popMatrix();
    }

    updateTexCoords(){}
};
