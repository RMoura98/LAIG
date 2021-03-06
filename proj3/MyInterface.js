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

        group.add(this.scene, 'currentCamera', Object.keys(views) ).name('Current Camera').listen();
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

    addSceneGroup() {
        var group = this.gui.addFolder("Game Scenes");
        group.open();

        group.add(this.scene, 'windowScenes', ['Porto', 'New York', 'Paris'] ).name("Scenes").onChange((value) => {
            let newTexture1;
            let newTexture2;
            let newTexture3;
            let newTexture4;
            switch (value) {
                case 'Porto':
                    newTexture1 = "porto";
                    newTexture2 = "porto2";
                    newTexture3 = "porto3";
                    newTexture4 = "porto4";
                    break;
                case 'New York':
                    newTexture1 = "NY";
                    newTexture2 = "NY2";
                    newTexture3 = "NY3";
                    newTexture4 = "NY4";
                    break;
                case 'Paris':
                    newTexture1 = "paris";
                    newTexture2 = "paris2";
                    newTexture3 = "paris3";
                    newTexture4 = "paris4";
                    break;
            }
            this.scene.graph.nodes['backWallLeftWindow'].textureId = newTexture1;
            this.scene.graph.nodes['backWallRightWindow'].textureId = newTexture2;
            this.scene.graph.nodes['frontWallLeftWindow'].textureId = newTexture3;
            this.scene.graph.nodes['frontWallRightWindow'].textureId = newTexture4;
        });
    }


    addGameSettingsGroup() {

        var group = this.gui.addFolder("Game Settings");
        group.open();

        group.add(this.scene, 'gameModeGui', ['Player vs Player', 'Player vs Bot', 'Bot vs Bot'] ).name("Mode").onChange((value) => {
            switch (value) {
                case 'Player vs Bot':
                this.updateDatDropdown(this.hmm, [ '‌‌ ‌‌ ‌‌‌‌ ‌‌ ‌‌ ‌‌ ‌‌  ‌‌ ‌‌‌‌ ‌‌ ‌‌ ‌‌ ‌‌  ‌‌ ‌‌‌‌ ‌‌ ‌‌ ‌‌ ‌‌  ‌‌ ‌‌‌‌ ‌‌ ‌‌ ‌‌ ‌‌  ‌‌ ‌‌‌‌','Easy', 'Hard']);
                break;
                case 'Bot vs Bot':
                this.updateDatDropdown(this.hmm, ['‌‌ ‌‌ ‌‌‌‌ ‌‌ ‌‌ ‌‌ ‌‌  ‌‌ ‌‌‌‌ ‌‌ ‌‌ ‌‌ ‌‌  ‌‌ ‌‌‌‌ ‌‌ ‌‌ ‌‌ ‌‌  ‌‌ ‌‌‌‌ ‌‌ ‌‌ ‌‌ ‌‌  ‌‌ ‌‌‌‌','Easy vs Easy', 'Easy vs Hard', 'Hard vs Easy', 'Hard vs Hard']);
                break;
                default:
                this.updateDatDropdown(this.hmm, [ '‌‌ ‌‌ ‌‌‌‌ ‌‌ ‌‌ ‌‌ ‌‌  ‌‌ ‌‌‌‌ ‌‌ ‌‌ ‌‌ ‌‌  ‌‌ ‌‌‌‌ ‌‌ ‌‌ ‌‌ ‌‌  ‌‌ ‌‌‌‌ ‌‌ ‌‌ ‌‌ ‌‌  ‌‌ ‌‌‌‌']);
                break;
            }
            this.scene.gameDifficultyGui = {};
        });

        this.hmm = group.add(this.scene, 'gameDifficultyGui', [ '‌‌ ‌‌ ‌‌‌‌ ‌‌ ‌‌ ‌‌ ‌‌  ‌‌ ‌‌‌‌ ‌‌ ‌‌ ‌‌ ‌‌  ‌‌ ‌‌‌‌ ‌‌ ‌‌ ‌‌ ‌‌  ‌‌ ‌‌‌‌ ‌‌ ‌‌ ‌‌ ‌‌  ‌‌ ‌‌‌‌'] ).name("Difficulty");

        group.add(this.scene, 'rotatingCamera').name("Rotating Camera");
    }

    addGameActionsGroup() {
        var group = this.gui.addFolder("Game Actions");
        group.open();

        group.add(this.scene, 'startGame').name("Start Game");
        group.add(this.scene, 'undoMove').name("Undo Move");
        group.add(this.scene, 'watchMovie').name("Watch Movie");
    }

    updateDatDropdown(target, list){   
        let innerHTMLStr = "";
        if(list.constructor.name == 'Array'){
            for(var i=0; i<list.length; i++){
                var str = "<option value='" + list[i] + "'>" + list[i] + "</option>";
                innerHTMLStr += str;        
            }
        }
    
        if(list.constructor.name == 'Object'){
            for(var key in list){
                var str = "<option value='" + list[key] + "'>" + key + "</option>";
                innerHTMLStr += str;
            }
        }
        if (innerHTMLStr != "") target.domElement.children[0].innerHTML = innerHTMLStr;
    }
    
}
