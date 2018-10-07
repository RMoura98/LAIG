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

        // add a group of controls (and open/expand by defult)

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

        for (var key in lights[0]) {
            if (lights[0].hasOwnProperty(key)) {
				if (lights[0][key][0]) this.scene.lightValues[key] = true;
				else this.scene.lightValues[key] = false;
                //this.scene.lightValues[key] = lights[0][key][0];
                group.add(this.scene.lightValues, key);
            }
        }
        for (var key in lights[1]) {
            if (lights[1].hasOwnProperty(key)) {
				if (lights[1][key][0]) this.scene.lightValues[key] = true;
				else this.scene.lightValues[key] = false;
                //this.scene.lightValues[key] = lights[1][key][0];
                group.add(this.scene.lightValues, key);
            }
        }
    }
}
