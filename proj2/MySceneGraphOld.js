var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var scene_INDEX = 0;
var views_INDEX = 1;
var ambient_INDEX = 2;
var lights_INDEX = 3;
var textures_INDEX = 4;
var materials_INDEX = 5;
var transformations_INDEX = 6;
var primitives_INDEX = 7;
var components_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);
    }


    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // DEBUG: console.log(rootElement);

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "SCENE")
            return "root tag <SCENE> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        //DEBUG: console.log(nodeNames);

        var error;

        // Processes each node, verifying errors.

        // <INITIALS>
        var index;
        if ((index = nodeNames.indexOf("INITIALS")) == -1)
            return "tag <INITIALS> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <INITIALS> out of order");

            //Parse INITIAL block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <ILLUMINATION>
        if ((index = nodeNames.indexOf("ILLUMINATION")) == -1)
            return "tag <ILLUMINATION> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <ILLUMINATION> out of order");

            //Parse ILLUMINATION block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <LIGHTS>
        if ((index = nodeNames.indexOf("LIGHTS")) == -1)
            return "tag <LIGHTS> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <LIGHTS> out of order");

            //Parse LIGHTS block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <TEXTURES>
        if ((index = nodeNames.indexOf("TEXTURES")) == -1)
            return "tag <TEXTURES> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <TEXTURES> out of order");

            //Parse TEXTURES block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <MATERIALS>
        if ((index = nodeNames.indexOf("MATERIALS")) == -1)
            return "tag <MATERIALS> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <MATERIALS> out of order");

            //Parse MATERIALS block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <NODES>
        if ((index = nodeNames.indexOf("NODES")) == -1)
            return "tag <NODES> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <NODES> out of order");

            //Parse NODES block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
    }

    /**
     * Parses the <scene> block.
     */
    parseScene(initialsNode) {

        var children = initialsNode.children;

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);
        
        

        // DEBUG: console.log(nodeNames);

        // Frustum planes
        // (default values)

        
        this.near = 0.1;
        this.far = 500;
        var indexFrustum = nodeNames.indexOf("frustum");
        if (indexFrustum == -1) {
            this.onXMLMinorError("frustum planes missing; assuming 'near = 0.1' and 'far = 500'");
        }
        else {
            this.near = this.reader.getFloat(children[indexFrustum], 'near');
            this.far = this.reader.getFloat(children[indexFrustum], 'far');

            if (!(this.near != null && !isNaN(this.near))) {
                this.near = 0.1;
                this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0.1'");
            }
            else if (!(this.far != null && !isNaN(this.far))) {
                this.far = 500;
                this.onXMLMinorError("unable to parse value for far plane; assuming 'far = 500'");
            }

            if (this.near >= this.far)
                return "'near' must be smaller than 'far'";
        }

        // Checks if at most one translation, three rotations, and one scaling are defined.
        if (initialsNode.getElementsByTagName('translation').length > 1)
            return "no more than one initial translation may be defined";

        if (initialsNode.getElementsByTagName('rotation').length > 3)
            return "no more than three initial rotations may be defined";

        if (initialsNode.getElementsByTagName('scale').length > 1)
            return "no more than one scaling may be defined";

        // Initial transforms.
        this.initialTranslate = [];
        this.initialScaling = [];
        this.initialRotations = [];

        // Gets indices of each element.
        var translationIndex = nodeNames.indexOf("translation");
        var thirdRotationIndex = nodeNames.indexOf("rotation");
        var secondRotationIndex = nodeNames.indexOf("rotation", thirdRotationIndex + 1);
        var firstRotationIndex = nodeNames.lastIndexOf("rotation");
        var scalingIndex = nodeNames.indexOf("scale");

        // Checks if the indices are valid and in the expected order.
        // Translation.
        this.initialTransforms = mat4.create();
        mat4.identity(this.initialTransforms);

        if (translationIndex == -1)
            this.onXMLMinorError("initial translation undefined; assuming T = (0, 0, 0)");
        else {
            var tx = this.reader.getFloat(children[translationIndex], 'x');
            var ty = this.reader.getFloat(children[translationIndex], 'y');
            var tz = this.reader.getFloat(children[translationIndex], 'z');

            if (tx == null || ty == null || tz == null) {
                tx = 0;
                ty = 0;
                tz = 0;
                this.onXMLMinorError("failed to parse coordinates of initial translation; assuming zero");
            }

            //TODO: Save translation data
            mat4.translate(this.initialTransforms, this.initialTransforms, [tx, ty, tz]);
        }

        //Parse Rotations
        //DEBUG: console.log(children[scalingIndex]);

    /*var xRot = -1;
    var yRot = -1;
    var zRot = -1;*/
    
    var rotations = [];
    rotations['x'] = null;
    rotations['y'] = null;
    rotations['z'] = null;

    var rotOrder = [];

    var axis;

    if (thirdRotationIndex != -1) {
        axis = this.reader.getString(children[thirdRotationIndex], 'axis');
        if (axis != null ) {
            var angle = this.reader.getFloat(children[thirdRotationIndex], 'angle');
            if (angle != null) {
                rotations[axis] = angle;
                rotOrder.push(axis);
            }
            else this.onXMLMinorError("failed to parse third rotation");
        }
    }

    // DEBUG: console.log(axis+" "+rotations[axis]);

    if (secondRotationIndex != -1) {
        axis = this.reader.getString(children[secondRotationIndex], 'axis');
        if (axis != null ) {
            var angle = this.reader.getFloat(children[secondRotationIndex], 'angle');
            if (angle != null) {
                rotations[axis] = angle;
                rotOrder.push(axis);
            }
            else this.onXMLMinorError("failed to parse second rotation");
        }
    }

//    DEBUG: console.log(axis+" "+rotations[axis]);

    if (firstRotationIndex != -1) {
        axis = this.reader.getString(children[firstRotationIndex], 'axis');
        if (axis != null ) {
            var angle = this.reader.getFloat(children[firstRotationIndex], 'angle');
            if (angle != null) {
                rotations[axis] = angle;
                rotOrder.push(axis);
            }
            else this.onXMLMinorError("failed to parse first rotation");
        }
    }

//    DEBUG: console.log(axis+" "+rotations[axis]);

    //TODO: Save Rotating data
    for (var i = 0; i < rotOrder.length; i++)
        mat4.rotate(this.initialTransforms, this.initialTransforms, DEGREE_TO_RAD * rotations[rotOrder[i]], this.axisCoords[rotOrder[i]]);


        // Parse Scaling
        //DEBUG: console.log(children[scalingIndex]);
        //variaveis chamadas sx sy sz

        if (scalingIndex == -1)
            this.onXMLMinorError("initial scaling undefined; assuming S = (1, 1, 1)");
        else {
            var sx = this.reader.getFloat(children[scalingIndex], 'sx');
            var sy = this.reader.getFloat(children[scalingIndex], 'sy');
            var sz = this.reader.getFloat(children[scalingIndex], 'sz');

            if (sx == null || sy == null || sz == null) {
                sx = 1;
                sy = 1;
                sz = 1;
                //this.onXMLMinorError("failed to parse coordinates of initial scaling; assuming 1");
            }

            //TODO: Save Scaling data
            mat4.scale(this.initialTransforms, this.initialTransforms, [sx, sy, sz]);
        }

        //TODO: Parse Reference length

        



        //DEBUG: console.log(this.initialTransforms);
        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <ILLUMINATION> block.
     * @param {illumination block element} illuminationNode
     */
    parseIllumination(illuminationNode) {
        // Parse Illumination node

        //DEBUG: console.log(illuminationNode);
        //tirar daqui ambiente e background.

        var children = illuminationNode.children;

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        //DEBUG: console.log(nodeNames);
        
        var ambient = [];
        ambient['r'] = 0;
        ambient['g'] = 0;
        ambient['b'] = 0;
        ambient['a'] = 1;
        var background = [];
        background['r'] = 0;
        background['g'] = 0;
        background['b'] = 0;
        background['a'] = 1;
        

        var indexAmbient = nodeNames.indexOf("ambient");
        var indexBackground = nodeNames.indexOf("background");

        if (indexAmbient == -1) {
            this.onXMLMinorError("ambient illumination missing; assuming R = 0 | G = 0 | B = 0 | A = 0");
        } else {
            var ambientR = this.reader.getFloat(children[indexAmbient], 'r');
            var ambientG = this.reader.getFloat(children[indexAmbient], 'g');
            var ambientB = this.reader.getFloat(children[indexAmbient], 'b');
            var ambientA = this.reader.getFloat(children[indexAmbient], 'a');
            if (ambientR != null || ambientG != null || ambientB != null || ambientA != null) {
                ambient['r'] = ambientR;
                ambient['g'] = ambientG;
                ambient['b'] = ambientB;
                ambient['a'] = ambientA;
            }
            else this.onXMLMinorError("unable to parse ambient illumination; assuming R = 0 | G = 0 | B = 0 | A = 0");
        }

        DEBUG: console.log(ambient);

        if (indexAmbient == -1) {
            this.onXMLMinorError("background illumination missing; assuming R = 0 | G = 0 | B = 0 | A = 0");
        } else {
            var backgroundR = this.reader.getFloat(children[indexBackground], 'r');
            var backgroundG = this.reader.getFloat(children[indexBackground], 'g');
            var backgroundB = this.reader.getFloat(children[indexBackground], 'b');
            var backgroundA = this.reader.getFloat(children[indexBackground], 'a');
            if (backgroundR != null || backgroundG != null || backgroundB != null || backgroundA != null) {
                background['r'] = backgroundR;
                background['g'] = backgroundG;
                background['b'] = backgroundB;
                background['a'] = backgroundA;
            }
            else this.onXMLMinorError("unable to parse background illumination; assuming R = 0 | G = 0 | B = 0 | A = 0");
        }

        DEBUG: console.log(background);

        //TODO: falta guardar esta info
        this.log("Parsed illumination");

        return null;
    }


    /**
     * Parses the <LIGHTS> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "LIGHT") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets indices of each element.
            var enableIndex = nodeNames.indexOf("enable");
            var positionIndex = nodeNames.indexOf("position");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            // Light enable/disable
            var enableLight = true;
            if (enableIndex == -1) {
                this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'value = 1'");
            }
            else {
                var aux = this.reader.getFloat(grandChildren[enableIndex], 'value');
                if (!(aux != null && !isNaN(aux) && (aux == 0 || aux == 1)))
                    this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
                else
                    enableLight = aux == 0 ? false : true;
            }

            // Retrieves the light position.
            var positionLight = [];
            if (positionIndex != -1) {
                // x
                var x = this.reader.getFloat(grandChildren[positionIndex], 'x');
                if (!(x != null && !isNaN(x)))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(x);

                // y
                var y = this.reader.getFloat(grandChildren[positionIndex], 'y');
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(y);

                // z
                var z = this.reader.getFloat(grandChildren[positionIndex], 'z');
                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(z);

                // w
                var w = this.reader.getFloat(grandChildren[positionIndex], 'w');
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(w);
            }
            else
                return "light position undefined for ID = " + lightId;

            // Retrieves the ambient component.
            var ambientIllumination = [];
            if (ambientIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(a);
            }
            else
                return "ambient component undefined for ID = " + lightId;

            // TODO: Retrieve the diffuse component

            // TODO: Retrieve the specular component

            // TODO: Store Light global information.
            //this.lights[lightId] = ...;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");

        return null;
    }

    /**
     * Parses the <TEXTURES> block.
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        // Parse block

        var children = texturesNode.children;

        var textures = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        console.log(children);

        for (var i = 0; i < children.length; i++) {
            var id = this.reader.getString(children[i], 'id');
            var file = this.reader.getString(children[i], 'file');
            textures[id] = file;
        }

        DEBUG: console.log(textures);

        // TODO: falta gravar isto na extrutura de dados

        console.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <MATERIALS> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        var nodeNames = [];
        var materialID = [];
        var materialShi = [];
        var materials = [];
        // DEBUG: console.log(children);

        for (var i = 0; i < children.length; i++){

            nodeNames.push(children[i].nodeName);

            var id = this.reader.getString(children[i], 'id');
            var shininess = this.reader.getFloat(children[i], 'shininess');
            materialID.push(id);
            materialShi.push(shininess);
        }
        DEBUG: console.log(materialShi);

        for (var i = 0; i < materialID.length; i++) {
            materials[materialID[i]] = new Array();
            materials[materialID[i]]['shininess'] = materialShi[i];
            for (var j = 0; j < children[i].children.length; j++) {
                var r = this.reader.getFloat(children[i].children[j], 'r');
                var g = this.reader.getFloat(children[i].children[j], 'g');
                var b = this.reader.getFloat(children[i].children[j], 'b');
                var a = this.reader.getFloat(children[i].children[j], 'a');
                var tmp = [r,g,b,a];
                materials[materialID[i]][children[i].children[j].nodeName]=tmp;
            }
        }
        //isto mete medo TODO:tentar arranjar uma maneira melhor!
        // DEBUG: console.log(children[0].children[0]);

        console.log(materials);


        this.log("Parsed materials");
        return null;

    }

    /**
     * Parses the <NODES> block.
     * @param {nodes block element} nodesNode
     */
    parseNodes(nodesNode) {
        // TODO: Parse block
        this.log("Parsed nodes");
        return null;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorErro(message) {
        console.warn("Warning: " + message);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        // entry point for graph rendering
        //TODO: Render loop starting at root of graph
    }
}