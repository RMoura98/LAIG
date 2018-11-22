class Water extends Terrain {

    constructor(scene, textureId, heightmapId, parts, heightScaleX, textScale) {
        super(scene, textureId, heightmapId, parts, heightScaleX);
        
        this.scene = scene;    
        
        this.shader = new CGFshader(this.scene.gl, 'shaders/waterVertex.glsl', 'shaders/frag.glsl');

        this.shader.setUniformsValues({heightScale: heightScaleX, uSampler2: 1, textScale: textScale});

        this.timeInit = Date.now();

        this.texture = this.scene.graph.textures[textureId];
        this.heightmap = this.scene.graph.textures[heightmapId];
    }

    display(){ 

        this.scene.setActiveShader(this.shader);

        let time = (Date.now() - this.timeInit) * 0.001 * 0.05; 
        
        this.shader.setUniformsValues({time: time});

        this.displayPlane();

        this.scene.setActiveShader(this.scene.defaultShader);    
    }

    updateTexCoords(){}

}