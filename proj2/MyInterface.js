/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        return true;
    }

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {

        var group = this.gui.addFolder("Lights");
        group.open();

        // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
        // e.g. this.option1=true; this.option2=false;

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {

                if (lights[key][0]) 
                    this.scene.lightValues[key] = true;
                else 
                    this.scene.lightValues[key] = false;

                //this.scene.lightValues[key] = lights[0][key][0];

                group.add(this.scene.lightValues, key);
            }
        }
    }

    addCamerasGroup(views) {

        var group = this.gui.addFolder("Cameras");
        group.open();

        group.add(this.scene, 'currentCamera', Object.keys(views) );
    }

    processKeyboard(event) {

        if(event.keyCode == 109 || event.keyCode == 77) {

            for(var key in this.scene.graph.nodes) {

                if(this.scene.graph.nodes[key].materialId.length > 1) {

                    if( this.scene.graph.nodes[key].materialIdPos == (this.scene.graph.nodes[key].materialId.length - 1) )
                        this.scene.graph.nodes[key].materialIdPos = 0;
                    else   
                        this.scene.graph.nodes[key].materialIdPos++;
                }
            }
        }
    }
    
}
