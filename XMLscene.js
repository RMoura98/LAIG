var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.


        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                //lights are predefined in cgfscene
				if(light.length > 17){
					this.lights[i].setSpotCutOff(light[1]);
					this.lights[i].setSpotExponent(light[2]);
					this.lights[i].setPosition(light[3], light[4], light[5], light[6]);
					this.lights[i].setSpotDirection(light[7], light[8], light[9]);
	                this.lights[i].setAmbient(light[10], light[11], light[12], light[13]);
	                this.lights[i].setDiffuse(light[14], light[15], light[16], light[17]);
	                this.lights[i].setSpecular(light[18], light[19], light[20], light[21]);
				}
				else{
					this.lights[i].setPosition(light[1], light[2], light[3], light[4]);
					this.lights[i].setAmbient(light[5], light[6], light[7], light[8]);
					this.lights[i].setDiffuse(light[9], light[10], light[11], light[12]);
					this.lights[i].setSpecular(light[13], light[14], light[15], light[16]);
				}


                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }


    /* Handler called when the graph is finally loaded.
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
		// TODO: Melhorar isto nao pode ser assim!
        this.camera.near = this.graph.views['presp0'][0];
        this.camera.far = this.graph.views['presp0'][1];

		this.axis = new CGFaxis(this,this.graph.axis_length);

    	this.setGlobalAmbientLight(this.graph.ambient['ambient'][0], this.graph.ambient['ambient'][1], this.graph.ambient['ambient'][2], this.graph.ambient['ambient'][3]);

    	this.gl.clearColor(this.graph.ambient['background'][0], this.graph.ambient['background'][1], this.graph.ambient['background'][2], this.graph.ambient['background'][3]);

        this.initLights();

        // Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);

        this.sceneInited = true;
    }


    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        if (this.sceneInited) {
            // Draw axis
            this.axis.display();

            var i = 0;
            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            // Displays the scene (MySceneGraph function).
        	this.graph.displayScene();
        }
        else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}
