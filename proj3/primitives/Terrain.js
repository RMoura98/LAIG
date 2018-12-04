class Terrain extends Plane {

    constructor(scene, textureId, heightmapId, parts, heightScaleX) {
        super(scene, parts, parts);
        
        this.scene = scene;    
        
        this.shader = new CGFshader(this.scene.gl, 'shaders/terrainVertex.glsl', 'shaders/frag.glsl');

        this.shader.setUniformsValues({heightScale: heightScaleX, uSampler2: 1});

        this.texture = this.scene.graph.textures[textureId];
        this.heightmap = this.scene.graph.textures[heightmapId];
    }

    display(){
        this.scene.setActiveShader(this.shader);

        this.displayPlane();

        this.scene.setActiveShader(this.scene.defaultShader);    
    }

    displayPlane() {
        this.texture.bind();
        this.heightmap.bind(1);
        super.display();
    }

    updateTexCoords(){}

}