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

        //DEBUG: console.log(rootElement);

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

        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        //DEBUG: console.log(nodeNames);

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != scene_INDEX)
                this.onXMLMinorError("tag <scene> out of order");

            //Parse INITIAL block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != views_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != ambient_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != lights_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != textures_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != materials_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != transformations_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != primitives_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != components_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
    }

    /**
     * Parses the <scene> block.
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // DEBUG: console.log(nodeNames);


        this.axis_length = this.reader.getFloat(sceneNode, 'axis_length');

        if( (this.axis_length == null) || (isNaN(this.axis_length)) ) {
            this.axis_length = 5.0;

            this.onXMLMinorError("unable to parse value for axis_length; assuming 'axis_length = 5.0'");
        }

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {views block element} viewsNode
     */
    parseViews(viewsNode) {
        // Parse views node

        //DEBUG: console.log(illuminationNode);

        var children = viewsNode.children;

        this.views = [];        //  [[perspectives] [orthos]]
        var perspViews = [];     //  [[near far angle x y z x y z]]
        var orthoViews = [];     //  [[near far left right top bottom]]

        var grandChildren = [];
        var grandChildrenNodeNames = [];


        if(children.length < 1) {
            return "at least one perspective or ortho view must be defined";
        }

        //DEBUG: console.log(nodeNames);

        for(var i = 0; i < children.length; i++) {

            if( (children[i].nodeName != "perspective") && (children[i].nodeName != "ortho") ) {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            if(children[i].nodeName == "perspective") {

                // Get id of current view
                var perspViewId = this.reader.getString(children[i], 'id');
                if (perspViewId == null)
                    return "no ID defined for perspective view";

                // Checks for repeated IDs.
                if (perspViews[perspViewId] != null)
                    return "ID must be unique for each view (conflict: ID = " + perspViewId + ")";

                // Get rest of values from <view>
                var near = this.reader.getFloat(children[i], 'near');
                if( (near == null) || (isNaN(near)) ) {
                    near = 0.1;

                    this.onXMLMinorError("unable to parse value for near; assuming 'near = 0.1'");
                }

                var far = this.reader.getFloat(children[i], 'far');
                if( (far == null) || (isNaN(far)) ) {
                    far = 500;

                    this.onXMLMinorError("unable to parse value for far; assuming 'far = 500'");
                }

                var angle = this.reader.getFloat(children[i], 'angle');
                if( (angle == null) || (isNaN(angle)) ) {
                    angle = 0;

                    this.onXMLMinorError("unable to parse value for angle; assuming 'angle = 0'");
                }

                // Get children of perpective view
                grandChildren = children[i].children;

                grandChildrenNodeNames = [];
                for (var j = 0; j < grandChildren.length; j++) {
                    grandChildrenNodeNames.push(grandChildren[j].nodeName);
                }

                if(grandChildrenNodeNames.length != 2) {
                    return "perspective view must have 2 child elements (conflict: nChildren = " + grandChildrenNodeNames.length + ")";
                }

                // Gets indices of each element.
                var fromIndex = grandChildrenNodeNames.indexOf("from");
                var toIndex = grandChildrenNodeNames.indexOf("to");

                // Verifying existance of <from> and <to> elements
                if(fromIndex == -1) {
                    return "element <from> not found"
                }

                else if(toIndex == -1) {
                    return "element <to> not found"
                }

                // Getting x/y/z values from <from>
                var fromX = this.reader.getFloat(grandChildren[fromIndex], 'x');
                if((fromX == null) || (isNaN(fromX))) {
                    return "unable to parse x-coodinate from the <from> element of <perspective>"
                }

                var fromY = this.reader.getFloat(grandChildren[fromIndex], 'y');
                if((fromY == null) || (isNaN(fromY))) {
                    return "unable to parse y-coodinate from the <from> element of <perspective>"
                }

                var fromZ = this.reader.getFloat(grandChildren[fromIndex], 'z');
                if((fromZ == null) || (isNaN(fromZ))) {
                    return "unable to parse z-coodinate from the <from> element of <perspective>"
                }

                // Getting x/y/z values from <to>
                var toX = this.reader.getFloat(grandChildren[toIndex], 'x');
                if((toX == null) || (isNaN(toX))) {
                    return "unable to parse x-coodinate from the <to> element of <perspective>"
                }

                var toY = this.reader.getFloat(grandChildren[toIndex], 'y');
                if((toY == null) || (isNaN(toY))) {
                    return "unable to parse y-coodinate from the <to> element of <perspective>"
                }

                var toZ = this.reader.getFloat(grandChildren[toIndex], 'z');
                if((toZ == null) || (isNaN(toZ))) {
                    return "unable to parse z-coodinate from the <to> element of <perspective>"
                }


                // Pushing perspective view array to general view array
                perspViews[perspViewId] = [near, far, angle, fromX, fromY, fromZ, toX, toY, toZ];

                this.views[0] = perspViews;
            }

            if(children[i].nodeName == "ortho") {

                // Get id of current view
                var orthoViewId = this.reader.getString(children[i], 'id');
                if (orthoViewId == null)
                    return "no ID defined for perspective view";

                // Checks for repeated IDs.
                if (orthoViews[orthoViewId] != null)
                    return "ID must be unique for each view (conflict: ID = " + orthoViewId + ")";

                var near = this.reader.getFloat(children[i], 'near');
                if( (near == null) || (isNaN(near)) ) {
                    near = 0.1;

                    this.onXMLMinorError("unable to parse value for near; assuming 'near = 0.1'");
                }

                var far = this.reader.getFloat(children[i], 'far');
                if( (far == null) || (isNaN(far)) ) {
                    far = 500;

                    this.onXMLMinorError("unable to parse value for far; assuming 'far = 500'");
                }

                var left = this.reader.getFloat(children[i], 'left');
                if( (left == null) || (isNaN(left)) ) {
                    left = 0;

                    this.onXMLMinorError("unable to parse value for left; assuming 'left = 0'");
                }

                var right = this.reader.getFloat(children[i], 'right');
                if( (right == null) || (isNaN(right)) ) {
                    right = 0;

                    this.onXMLMinorError("unable to parse value for right; assuming 'right = 0'");
                }

                var top = this.reader.getFloat(children[i], 'top');
                if( (top == null) || (isNaN(top)) ) {
                    top = 50;

                    this.onXMLMinorError("unable to parse value for top; assuming 'top = 50'");
                }

                var bottom = this.reader.getFloat(children[i], 'bottom');
                if( (bottom == null) || (isNaN(bottom)) ) {
                    bottom = 0;

                    this.onXMLMinorError("unable to parse value for bottom; assuming 'bottom = 0'");
                }

                orthoViews[orthoViewId] = [near, far ,left, right, top, bottom];

                this.views[1] = orthoViews;
            }
        }

        if( (Object.keys(this.views[0]).length) + (Object.keys(this.views[1]).length) < 1 )
            return "at least one view (perspective or ortho) must be defined";

        this.log("Parsed views");

        return null;
    }

    /**
     * Parses the <ambient> block.
     * @param {ambient block element} ambientNode
     */
    parseAmbient(ambientNode) {

        var children = ambientNode.children;

        var nodeNames = [];

        this.ambient = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        // Verifying existance of <ambient> children
        var ambientIndex = nodeNames.indexOf("ambient");
        if(ambientIndex == -1)
            return "tag <ambient> from <ambient> missing";

        var backgroundIndex = nodeNames.indexOf("background");
        if(backgroundIndex == -1)
            return "tag <background> from <ambient> missing;"

        //DEBUG: console.log(textures);

        // Getting <ambient> values
        var ambientR = this.reader.getFloat(children[ambientIndex], 'r');
        if( (ambientR == null) || (isNaN(ambientR)) ) {
            ambientR = 0.2;

            this.onXMLMinorError("unable to parse <ambient> value for r; assuming 'r = 0.2'");
        }

        var ambientG = this.reader.getFloat(children[ambientIndex], 'g');
        if( (ambientG == null) || (isNaN(ambientG)) ) {
            ambientG = 0.2;

            this.onXMLMinorError("unable to parse <ambient> value for g; assuming 'g = 0.2'");
        }

        var ambientB = this.reader.getFloat(children[ambientIndex], 'b');
        if( (ambientB == null) || (isNaN(ambientB)) ) {
            ambientB = 0.2;

            this.onXMLMinorError("unable to parse <ambient> value for b; assuming 'b = 0.2'");
        }

        var ambientA = this.reader.getFloat(children[ambientIndex], 'a');
        if( (ambientA == null) || (isNaN(ambientA)) ) {
            ambientA = 1;

            this.onXMLMinorError("unable to parse <ambient> value for r; assuming 'r = 1'");
        }


        // Getting <background> values
        var backgroundR = this.reader.getFloat(children[backgroundIndex], 'r');
        if( (backgroundR == null) || (isNaN(backgroundR)) ) {
            backgroundR = 0.0;

            this.onXMLMinorError("unable to parse <background> value for r; assuming 'r = 0.0'");
        }

        var backgroundG = this.reader.getFloat(children[backgroundIndex], 'g');
        if( (backgroundG == null) || (isNaN(backgroundG)) ) {
            backgroundG = 0.0;

            this.onXMLMinorError("unable to parse <background> value for g; assuming 'g = 0.0'");
        }

        var backgroundB = this.reader.getFloat(children[backgroundIndex], 'b');
        if( (backgroundB == null) || (isNaN(backgroundB)) ) {
            backgroundB = 0.0;

            this.onXMLMinorError("unable to parse <background> value for b; assuming 'b = 0.0'");
        }

        var backgroundA = this.reader.getFloat(children[backgroundIndex], 'a');
        if( (backgroundA == null) || (isNaN(backgroundA)) ) {
            backgroundA = 1;

            this.onXMLMinorError("unable to parse <background> value for r; assuming 'r = 1'");
        }

        this.log("Parsed ambient");
        return null;
    }

    /**
     * Parses the <lights> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        var children = lightsNode.children;

        this.lights = [];        //  [[omni] [spot]]
        var omniLights = [];     //  [[enabled x y z w r g b a r g b a r g b a]]
        var spotLights = [];     //  [[enabled angle exponent x y z w x y z r g b a r g b a r g b a]]

        var grandChildren = [];
        var grandChildrenNodeNames = [];


        if(children.length < 1) {
            return "at least one omni or spot light must be defined";
        }

        for(var i = 0; i < children.length; i++) {

            if( (children[i].nodeName != "omni") && (children[i].nodeName != "spot") ) {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            if(children[i].nodeName == "omni") {

                // Get id of current light
                var omniLightId = this.reader.getString(children[i], 'id');
                if (omniLightId == null)
                    return "no ID defined for omni light";

                // Checks for repeated IDs.
                if (omniLights[omniLightId] != null)
                    return "ID must be unique for each light (conflict: ID = " + omniLightId + ")";

                // Get rest of values from <omni>
                var enabled = this.reader.getFloat(children[i], 'enabled');
                if( (enabled == null) || (isNaN(enabled)) || (enabled < 0) || (enabled > 1)) {
                    enabled = 1;

                    this.onXMLMinorError("unable to parse <omni> value for enabled; assuming 'enabled = 1'");
                }

                // Get children of perpective view
                grandChildren = children[i].children;

                grandChildrenNodeNames = [];
                for (var j = 0; j < grandChildren.length; j++) {
                    grandChildrenNodeNames.push(grandChildren[j].nodeName);
                }

                if(grandChildrenNodeNames.length != 4) {
                    return "omni light must have 4 child elements (conflict: nChildren = " + grandChildrenNodeNames.length + ")";
                }

                // Gets indices of each element.
                var locationIndex = grandChildrenNodeNames.indexOf("location");
                var ambientIndex = grandChildrenNodeNames.indexOf("ambient");
                var diffuseIndex = grandChildrenNodeNames.indexOf("diffuse");
                var specularIndex = grandChildrenNodeNames.indexOf("specular");

                // Verifying existance of <omni> children
                if(locationIndex == -1) {
                    return "element <location> from <omni> not found"
                }

                else if(ambientIndex == -1) {
                    return "element <ambient> from <omni> not found"
                }

                else if(diffuseIndex == -1) {
                    return "element <diffuse> from <omni> not found"
                }

                else if(specularIndex == -1) {
                    return "element <specular> from <omni> not found"
                }

                // Getting x/y/z/w values from <location>
                var locationX = this.reader.getFloat(grandChildren[locationIndex], 'x');
                if((locationX == null) || (isNaN(locationX))) {
                    return "unable to parse x-coodinate from the <location> element of <omni>"
                }

                var locationY = this.reader.getFloat(grandChildren[locationIndex], 'y');
                if((locationY == null) || (isNaN(locationY))) {
                    return "unable to parse y-coodinate from the <location> element of <omni>"
                }

                var locationZ = this.reader.getFloat(grandChildren[locationIndex], 'z');
                if((locationZ == null) || (isNaN(locationZ))) {
                    return "unable to parse z-coodinate from the <location> element of <omni>"
                }

                var locationW = this.reader.getFloat(grandChildren[locationIndex], 'w');
                if((locationW == null) || (isNaN(locationW))) {
                    return "unable to parse w-coodinate from the <location> element of <omni>"
                }

                // Getting r/g/b/a values from <ambient>
                var ambientR = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                if((ambientR == null) || (isNaN(ambientR))) {
                    return "unable to parse r-coodinate from the <ambient> element of <omni>"
                }

                var ambientG = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                if((ambientG == null) || (isNaN(ambientG))) {
                    return "unable to parse g-coodinate from the <ambient> element of <omni>"
                }

                var ambientB = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                if((ambientB == null) || (isNaN(ambientB))) {
                    return "unable to parse b-coodinate from the <ambient> element of <omni>"
                }

                var ambientA = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if((ambientA == null) || (isNaN(ambientA))) {
                    return "unable to parse a-coodinate from the <ambient> element of <omni>"
                }

                // Getting r/g/b/a values from <diffuse>
                var diffuseR = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
                if((diffuseR == null) || (isNaN(diffuseR))) {
                    return "unable to parse r-coodinate from the <diffuse> element of <omni>"
                }

                var diffuseG = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
                if((diffuseG == null) || (isNaN(diffuseG))) {
                    return "unable to parse g-coodinate from the <diffuse> element of <omni>"
                }

                var diffuseB = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
                if((diffuseB == null) || (isNaN(diffuseB))) {
                    return "unable to parse b-coodinate from the <diffuse> element of <omni>"
                }

                var diffuseA = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
                if((diffuseA == null) || (isNaN(diffuseA))) {
                    return "unable to parse a-coodinate from the <diffuse> element of <omni>"
                }

                // Getting r/g/b/a values from <specular>
                var specularR = this.reader.getFloat(grandChildren[specularIndex], 'r');
                if((specularR == null) || (isNaN(specularR))) {
                    return "unable to parse r-coodinate from the <specular> element of <omni>"
                }

                var specularG = this.reader.getFloat(grandChildren[specularIndex], 'g');
                if((specularG == null) || (isNaN(specularG))) {
                    return "unable to parse g-coodinate from the <specular> element of <omni>"
                }

                var specularB = this.reader.getFloat(grandChildren[specularIndex], 'b');
                if((specularB == null) || (isNaN(specularB))) {
                    return "unable to parse b-coodinate from the <specular> element of <omni>"
                }

                var specularA = this.reader.getFloat(grandChildren[specularIndex], 'a');
                if((specularA == null) || (isNaN(specularA))) {
                    return "unable to parse a-coodinate from the <specular> element of <omni>"
                }


                // Pushing perspective view array to general view array
                omniLights[omniLightId] = [enabled, locationX, locationY, locationZ, locationW, ambientR, ambientG, ambientB, ambientA, diffuseR, diffuseG, diffuseB, diffuseA, specularR, specularG, specularB, specularA];

                this.lights[0] = omniLights;
            }

            else if(children[i].nodeName == "spot") {
                grandChildrenNodeNames
                // Get id of current light
                var spotLightId = this.reader.getString(children[i], 'id');
                if (spotLightId == null)
                    return "no ID defined for spot light";

                // Checks for repeated IDs.
                if (spotLights[spotLightId] != null)
                    return "ID must be unique for each light (conflict: ID = " + spotLightId + ")";

                // Get rest of values from <spot>
                var enabled = this.reader.getFloat(children[i], 'enabled');
                if( (enabled == null) || (isNaN(enabled)) || (enabled != 0) || (enabled != 1)) {
                    enabled = 1;

                    this.onXMLMinorError("unable to parse <spot> value for enabled; assuming 'enabled = 1'");
                }

                var angle = this.reader.getFloat(children[i], 'angle');
                if( (angle == null) || (isNaN(angle)) ) {
                    angle = 0;

                    this.onXMLMinorError("unable to parse <angle> value for enabled; assuming 'angle = 1'");
                }

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if( (exponent == null) || (isNaN(exponent)) ) {
                    exponent = 1;

                    this.onXMLMinorError("unable to parse <exponent> value for enabled; assuming 'exponent = 1'");
                }

                // Get children of perpective view
                grandChildren = children[i].children;

                grandChildrenNodeNames = [];
                for (var j = 0; j < grandChildren.length; j++) {
                    grandChildrenNodeNames.push(grandChildren[j].nodeName);
                }

                if(grandChildrenNodeNames.length != 5) {
                    return "spot light must have 5 child elements (conflict: nChildren = " + grandChildrenNodeNames.length + ")";
                }

                // Gets indices of each element.
                var locationIndex = grandChildrenNodeNames.indexOf("location");
                var targetIndex = grandChildrenNodeNames.indexOf("target");
                var ambientIndex = grandChildrenNodeNames.indexOf("ambient");
                var diffuseIndex = grandChildrenNodeNames.indexOf("diffuse");
                var specularIndex = grandChildrenNodeNames.indexOf("specular");

                // Verifying existance of <spot> children
                if(locationIndex == -1) {
                    return "element <location> from <spot> not found"
                }

                else if(targetIndex == -1) {
                    return "element <atrget> from <spot> not found"
                }

                else if(ambientIndex == -1) {
                    return "element <ambient> from <spot> not found"
                }

                else if(diffuseIndex == -1) {
                    return "element <diffuse> from <spot> not found"
                }

                else if(specularIndex == -1) {
                    return "element <specular> from <spot> not found"
                }

                // Getting x/y/z/w values from <location>
                var locationX = this.reader.getFloat(grandChildren[locationIndex], 'x');

                if((locationX == null) || (isNaN(locationX))) {
                    return "unable to parse x-coodinate from the <location> element of <spot>"
                }

                var locationY = this.reader.getFloat(grandChildren[locationIndex], 'y');

                if((locationY == null) || (isNaN(locationY))) {
                    return "unable to parse y-coodinate from the <location> element of <spot>"
                }

                var locationZ = this.reader.getFloat(grandChildren[locationIndex], 'z');

                if((locationZ == null) || (isNaN(locationZ))) {
                    return "unable to parse z-coodinate from the <location> element of <spot>"
                }

                var locationW = this.reader.getFloat(grandChildren[locationIndex], 'w');

                if((locationW == null) || (isNaN(locationW))) {
                    return "unable to parse w-coodinate from the <location> element of <spot>"
                }

                // Getting x/y/z values from <target>
                var targetX = this.reader.getFloat(grandChildren[targetIndex], 'x');

                if((targetX == null) || (isNaN(targetX))) {
                    return "unable to parse x-coodinate from the <target> element of <spot>"
                }

                var targetY = this.reader.getFloat(grandChildren[targetIndex], 'y');

                if((targetY == null) || (isNaN(targetY))) {
                    return "unable to parse y-coodinate from the <target> element of <spot>"
                }

                var targetZ = this.reader.getFloat(grandChildren[targetIndex], 'z');

                if((targetZ == null) || (isNaN(targetZ))) {
                    return "unable to parse z-coodinate from the <target> element of <spot>"
                }

                // Getting r/g/b/a values from <ambient>
                var ambientR = this.reader.getFloat(grandChildren[ambientIndex], 'r');

                if((ambientR == null) || (isNaN(ambientR))) {
                    return "unable to parse r-coodinate from the <ambient> element of <spot>"
                }

                var ambientG = this.reader.getFloat(grandChildren[ambientIndex], 'g');

                if((ambientG == null) || (isNaN(ambientG))) {
                    return "unable to parse g-coodinate from the <ambient> element of <spot>"
                }

                var ambientB = this.reader.getFloat(grandChildren[ambientIndex], 'b');

                if((ambientB == null) || (isNaN(ambientB))) {
                    return "unable to parse b-coodinate from the <ambient> element of <spot>"
                }

                var ambientA = this.reader.getFloat(grandChildren[ambientIndex], 'a');

                if((ambientA == null) || (isNaN(ambientA))) {
                    return "unable to parse a-coodinate from the <ambient> element of <spot>"
                }

                // Getting r/g/b/a values from <diffuse>
                var diffuseR = this.reader.getFloat(grandChildren[diffuseIndex], 'r');

                if((diffuseR == null) || (isNaN(diffuseR))) {
                    return "unable to parse r-coodinate from the <diffuse> element of <spot>"
                }

                var diffuseG = this.reader.getFloat(grandChildren[diffuseIndex], 'g');

                if((diffuseG == null) || (isNaN(diffuseG))) {
                    return "unable to parse g-coodinate from the <diffuse> element of <spot>"
                }

                var diffuseB = this.reader.getFloat(grandChildren[diffuseIndex], 'b');

                if((diffuseB == null) || (isNaN(diffuseB))) {
                    return "unable to parse b-coodinate from the <diffuse> element of <spot>"
                }

                var diffuseA = this.reader.getFloat(grandChildren[diffuseIndex], 'a');

                if((diffuseA == null) || (isNaN(diffuseA))) {
                    return "unable to parse a-coodinate from the <diffuse> element of <spot>"
                }

                // Getting r/g/b/a values from <specular>
                var specularR = this.reader.getFloat(grandChildren[specularIndex], 'r');

                if((specularR == null) || (isNaN(specularR))) {
                    return "unable to parse r-coodinate from the <specular> element of <spot>"
                }

                var specularG = this.reader.getFloat(grandChildren[specularIndex], 'g');

                if((specularG == null) || (isNaN(specularG))) {
                    return "unable to parse g-coodinate from the <specular> element of <spot>"
                }

                var specularB = this.reader.getFloat(grandChildren[specularIndex], 'b');

                if((specularB == null) || (isNaN(specularB))) {
                    return "unable to parse b-coodinate from the <specular> element of <spot>"
                }

                var specularA = this.reader.getFloat(grandChildren[specularIndex], 'a');

                if((specularA == null) || (isNaN(specularA))) {
                    return "unable to parse a-coodinate from the <specular> element of <spot>"
                }


                // Pushing perspective view array to general lights array
                spotLights[spotLightId] = [enabled, angle, exponent, locationX, locationY, locationZ, locationW, targetX, targetY,targetZ, ambientR, ambientG, ambientB, ambientA, diffuseR, diffuseG, diffuseB, diffuseA, specularR, specularG, specularB, specularA];

                this.lights[1] = spotLights;
            }
        }


        if ( Object.keys(this.lights).length < 1)
            return "at least one light (omni or spot) must be defined";


        this.log("Parsed lights");
        return null;

    }

    /**
     * Parses the <textures> block.
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        var children = texturesNode.children;

        this.textures = [];


        if(children.length < 1) {
            return "at least one texture must be defined";
        }

        for(var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag name <" + children[i].nodeName + ">");
                continue;
            }

            // Retrieves texture ID.
            var textureId = this.reader.getString(children[i], 'id');
            if (textureId == null)
                return "failed to parse texture ID";

            // Checks if ID is valid.
            if (this.textures[textureId] != null)
                return "texture ID must unique (conflict with ID = " + textureId + ")";

            // Gets texture location
            var filePath = this.reader.getString(children[i], 'file');
            if (filePath == null)
                return "file path undefined for texture with ID = " + textureId;

            var texture = new CGFtexture(this.scene, "./scenes/" + filePath);

            this.textures[textureId] = texture;
        }

        if(Object.keys(this.textures).length < 1)
            return "at least one texture must be defined";

        this.log("Parsed textures");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {

        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var grandChildrenNodeNames = [];

        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag name <" + children[i].nodeName + ">");
                continue;
            }

            // Get ID of current material
            var materialId = this.reader.getString(children[i], 'id');
            if (materialId == null)
                return "material with invalid ID";

            // Check for repeated IDs
            if (this.materials[materialId] != null)
                return "ID must be unique for each material (conflict: ID = " + materialId + ")";

            // Get shininess
            var shininess = this.reader.getString(children[i], 'shininess');
            if( shininess == null || isNaN(shininess) ) {
                shininess = 1;

                this.onXMLMinorError("unable to parse <material> value for shininess; assuming 'shininess = 1'");
            }

            // Get grandsons
            grandChildren = children[i].children;

            grandChildrenNodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                grandChildrenNodeNames.push(grandChildren[j].nodeName);
            }

            if(grandChildrenNodeNames.length != 4) {
                return "material must have 4 child elements (conflict: nChildren = " + grandChildrenNodeNames.length + ")";
            }

            // Gets indices of each element.
            var emissionIndex = grandChildrenNodeNames.indexOf("emission");
            var ambientIndex = grandChildrenNodeNames.indexOf("ambient");
            var diffuseIndex = grandChildrenNodeNames.indexOf("diffuse");
            var specularIndex = grandChildrenNodeNames.indexOf("specular");

            // Verifying existance of <material> children
            if(emissionIndex == -1) {
                return "element <emission> from <material> not found"
            }

            else if(ambientIndex == -1) {
                return "element <ambient> from <material> not found"
            }

            else if(diffuseIndex == -1) {
                return "element <diffuse> from <material> not found"
            }

            else if(specularIndex == -1) {
                return "element <specular> from <material> not found"
            }

            // Getting r/g/b/a values from <emission>
            var emissionR = this.reader.getFloat(grandChildren[emissionIndex], 'r');
            if((emissionR == null) || (isNaN(emissionR))) {
                return "unable to parse r-coodinate from the <emission> element of <material>"
            }

            var emissionG = this.reader.getFloat(grandChildren[emissionIndex], 'g');
            if((emissionG == null) || (isNaN(emissionG))) {
                return "unable to parse g-coodinate from the <emission> element of <material>"
            }

            var emissionB = this.reader.getFloat(grandChildren[emissionIndex], 'b');
            if((emissionB == null) || (isNaN(emissionB))) {
                return "unable to parse b-coodinate from the <emission> element of <material>"
            }

            var emissionA = this.reader.getFloat(grandChildren[emissionIndex], 'a');
            if((emissionA == null) || (isNaN(emissionA))) {
                return "unable to parse a-coodinate from the <emission> element of <material>"
            }


            // Getting r/g/b/a values from <ambient>
            var ambientR = this.reader.getFloat(grandChildren[ambientIndex], 'r');
            if((ambientR == null) || (isNaN(ambientR))) {
                return "unable to parse r-coodinate from the <ambient> element of <material>"
            }

            var ambientG = this.reader.getFloat(grandChildren[ambientIndex], 'g');
            if((ambientG == null) || (isNaN(ambientG))) {
                return "unable to parse g-coodinate from the <ambient> element of <material>"
            }

            var ambientB = this.reader.getFloat(grandChildren[ambientIndex], 'b');
            if((ambientB == null) || (isNaN(ambientB))) {
                return "unable to parse b-coodinate from the <ambient> element of <material>"
            }

            var ambientA = this.reader.getFloat(grandChildren[ambientIndex], 'r');
            if((ambientA == null) || (isNaN(ambientA))) {
                return "unable to parse a-coodinate from the <ambient> element of <material>"
            }


            // Getting r/g/b/a values from <diffuse>
            var diffuseR = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
            if((diffuseR == null) || (isNaN(diffuseR))) {
                return "unable to parse r-coodinate from the <diffuse> element of <material>"
            }

            var diffuseG = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
            if((diffuseG == null) || (isNaN(diffuseG))) {
                return "unable to parse g-coodinate from the <diffuse> element of <material>"
            }

            var diffuseB = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
            if((diffuseB == null) || (isNaN(diffuseB))) {
                return "unable to parse b-coodinate from the <diffuse> element of <material>"
            }

            var diffuseA = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
            if((diffuseA == null) || (isNaN(diffuseA))) {
                return "unable to parse a-coodinate from the <diffuse> element of <material>"
            }


            // Getting r/g/b/a values from <emission>
            var specularR = this.reader.getFloat(grandChildren[specularIndex], 'r');
            if((specularR == null) || (isNaN(specularR))) {
                return "unable to parse r-coodinate from the <specular> element of <material>"
            }

            var specularG = this.reader.getFloat(grandChildren[specularIndex], 'g');
            if((specularG == null) || (isNaN(specularG))) {
                return "unable to parse g-coodinate from the <specular> element of <material>"
            }

            var specularB = this.reader.getFloat(grandChildren[specularIndex], 'b');
            if((specularB == null) || (isNaN(specularB))) {
                return "unable to parse b-coodinate from the <specular> element of <material>"
            }

            var specularA = this.reader.getFloat(grandChildren[specularIndex], 'a');
            if((specularA == null) || (isNaN(specularA))) {
                return "unable to parse a-coodinate from the <specular> element of <material>"
            }

            var material = new CGFappearance(this.scene);

            material.setShininess(shininess);

            material.setEmission(emissionR, emissionG, emissionB, emissionA);

            material.setAmbient(ambientR, ambientG, ambientB, ambientA);

            material.setDiffuse(diffuseR, diffuseG, diffuseB, diffuseA);

            material.setSpecular(specularR, specularG, specularB, specularA);

            this.materials[materialId] = material;
        }

        if( Object.keys(this.materials).length < 1 )
            return "at least one material must be defined";

        this.log("Parsed materials");
        return null;
    }


    /**
     * Parses the <transformations> node.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {

        var children = transformationsNode.children;

        this.transformations = mat4.create();
        mat4.identity(this.transformations);

        var hasTransformation = false;
        var didTransform;

        var grandChildren = [];
        var grandChildrenNodeNames = [];

        if(children.length < 1)
            return "at least one transformation block is required";

        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag name <" + children[i].nodeName + ">");
                continue;
            }

            // Get ID of current material
            var transformationId = this.reader.getString(children[i], 'id');
            if (transformationId == null)
                return "transformation with invalid ID";

            // Check for repeated IDs
            if (this.transformations[transformationId] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationId + ")";

            hasTransformation = true;

            // Get grandsons
            grandChildren = children[i].children;

            grandChildrenNodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                grandChildrenNodeNames.push(grandChildren[j].nodeName);
            }

            if(grandChildrenNodeNames.length < 1) {
                return "transformation must have at least 1 child element (conflict: nChildren = " + grandChildrenNodeNames.length + ")";
            }

            didTransform = false;

            for (var j = 0; j < grandChildren.length; j++) {

                if( (grandChildren[j].nodeName != "translate") && (grandChildren[j].nodeName != "rotate") &&
                (grandChildren[j].nodeName != "scale") ) {
                    this.onXMLMinorError("unknown tag name <" + grandChildren[j].nodeName + ">");
                    continue;
                }

                if(grandChildren[j].nodeName == "translate") {

                    // Get x/y/z coordinates from translate transformation
                    var x = this.reader.getFloat(grandChildren[j], 'x');
                    if( (x == null) || (isNaN(x)) ) {
                        return "unable to parse x-coodinate from the <translate> element of <transformation>";
                    }

                    var y = this.reader.getFloat(grandChildren[j], 'y');
                    if( (y == null) || (isNaN(y)) ) {
                        return "unable to parse y-coodinate from the <translate> element of <transformation>";
                    }

                    var y = this.reader.getFloat(grandChildren[j], 'y');
                    if( (y == null) || (isNaN(y)) ) {
                        return "unable to parse y-coodinate from the <translate> element of <transformation>";
                    }

                    mat4.translate(this.transformations, this.transformations, [x, y, z]);

                    didTransform = true;
                }

                else if(grandChildren[j].nodeName == "rotate") {

                    // Get axis/angle values from rotation transformation
                    var axis = this.reader.getItem(grandChildren[j], 'axis', ['x', 'y', 'z']);
                    if( axis == null ) {
                        return "unable to parse axis value from the <rotate> element of <transformation>";
                    }

                    var axisVector;
                    if(axis == 'x')
                        axisVector = [1, 0, 0];
                    else if(axis == 'y')
                        axisVector = [0, 1, 0];
                    else if(axis == 'z')
                        axisVector = [0, 0, 1];


                    var angle = this.reader.getFloat(grandChildren[j], 'angle');
                    if( angle == null ) {
                        return "unable to parse angle value from the <rotate> element of <transformation>";
                    }


                    mat4.rotate(this.transformations, this.transformations, DEGREE_TO_RAD*angle, axisVector);

                    didTransform = true;

                }

                else if(grandChildren[j].nodeName == "scale") {

                    // Get x/y/z coordinates from scale transformation
                    var x = this.reader.getFloat(grandChildren[j], 'x');
                    if( (x == null) || (isNaN(x)) ) {
                        return "unable to parse x-coodinate from the <scale> element of <transformation>";
                    }

                    var y = this.reader.getFloat(grandChildren[j], 'y');
                    if( (y == null) || (isNaN(y)) ) {
                        return "unable to parse y-coodinate from the <scale> element of <transformation>";
                    }

                    var z = this.reader.getFloat(grandChildren[j], 'z');
                    if( (z == null) || (isNaN(z)) ) {
                        return "unable to parse z-coodinate from the <scale> element of <transformation>";
                    }

                    mat4.scale(this.transformations, this.transformations, [x, y, z]);

                    didTransform = true;
                }
            }

            if( !didTransform ) {
                return "at least one transformation should exist within each <transformation> block";
            }
        }

        if( !hasTransformation ) {
            return "at least one transformation block should exist";
        }

        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {

        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        if(children.length < 1) {
            return "at least one primitive must be defined";
        }

        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag name <" + children[i].nodeName + ">");
                continue;
            }

            // Get ID of current primitive
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "primitive with invalid ID";

            // Check for repeated IDs
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            // Get grandsons
            grandChildren = children[i].children;
            if(grandChildren.length != 1) {
                return "primitive must have 1 child element (conflict: nChildren = " + grandChildren.length + ")";
            }

            //check which primitive
            if(grandChildren[0].nodeName == "rectangle") {

                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if( (x1 == null) || (isNaN(x1)) ) {
                    return "value for x1 in <rectangle> of <primitive> is invalid";
                }

                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if( (y1 == null) || (isNaN(y1)) ) {
                    return "value for y1 in <rectangle> of <primitive> is invalid";
                }

                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if( (x2 == null) || (isNaN(x2)) ) {
                    return "value for x2 in <rectangle> of <primitive> is invalid";
                }

                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if( (y2 == null) || (isNaN(y2)) ) {
                    return "value for y2 in <rectangle> of <primitive> is invalid";
                }

                var primitive = new MyQuad(this.scene, x1, y1, x2, y2);

                this.primitives[primitiveId] = primitive;
            }

        }
        if(Object.keys(this.primitives).length < 1) {
            return "at least one primitive should exist";
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {

        var children = componentsNode.children;

        var hasTransformation = false;
        var hasMaterials = false;
        var hasTexture = false;
        var hasChildren = false;

        var grandChildren = [];

        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag name <" + children[i].nodeName + ">");
                continue;
            }

            // Get ID of current primitive
            var componentId = this.reader.getString(children[i], 'id');
            if (componentId == null)
                return "component with invalid ID";

            // Check for repeated IDs
            if (this.nodes[componentId] != null)
                return "ID must be unique for each component (conflict: ID = " + componentId + ")";

            this.nodes[componentId] = new MyNode(componentId);

            // Get grandsons
            grandChildren = children[i].children;

            if(grandChildren.length < 4) {
                return "component must have at least 4 child element (conflict: nChildren = " + grandChildren.length + ")";
            }

            var grandGrandChildren = [];

            for (var j = 0; j < grandChildren.length; j++) {

                if( (grandChildren[j].nodeName != "transformation") && (grandChildren[j].nodeName != "materials") && (grandChildren[j].nodeName != "texture") && (grandChildren[j].nodeName != "children") ) {

                    this.onXMLMinorError("unknown tag name <" + grandChildren[j].nodeName + ">");
                    continue;
                }

                if( grandChildren[j].nodeName == "transformation" ) {

                     // Get grandsons
                    grandGrandChildren = grandChildren[j].children;

					//na minha opiniao nao e preciso isto
                    /*if(grandGrandChildren.length < 1) {
                        return "<transformation> of <component> must have at least 1 child element (conflict: nChildren = " + grandGrandChildren.length + ")";
                    }*/

                    for (var k = 0; k < grandGrandChildren.length; k++) {

                        if( (grandGrandChildren[k].nodeName != "transformationref") && (grandGrandChildren[k].nodeName != "translate") && (grandGrandChildren[k].nodeName != "rotate") && (grandGrandChildren[k].nodeName != "scale") ) {

                            this.onXMLMinorError("unknown tag name <" + grandGrandChildren[k].nodeName + ">");
                            continue;
                        }

                        if( grandGrandChildren[k].nodeName == "transformationRef" ) {

                             // Get ID of current transformationref
                            var transRefId = this.reader.getFloat(grandGrandChildren[k], 'id');
                            if (transRefId == null)
                                return "transformationRef with invalid ID";

                            // Check if ID exists
                            if (this.transformations[transRefId] == null)
                                return "ID must exist for existing transformation";


                            this.nodes[componentId].matTransfRef = transRefId;

                            hasTransformation = true;
                        }

                        if(grandGrandChildren[k].nodeName == "translate") {

                            // Get x/y/z coordinates from translate transformation
                            var x = this.reader.getFloat(grandGrandChildren[k], 'x');
                            if( (x == null) || (isNaN(x)) ) {
                                return "unable to parse x-coodinate from the <translate> element of <transformation>";
                            }

                            var y = this.reader.getFloat(grandGrandChildren[k], 'y');
                            if( (y == null) || (isNaN(y)) ) {
                                return "unable to parse y-coodinate from the <translate> element of <transformation>";
                            }

                            var y = this.reader.getFloat(grandGrandChildren[k], 'y');
                            if( (y == null) || (isNaN(y)) ) {
                                return "unable to parse y-coodinate from the <translate> element of <transformation>";
                            }

                            mat4.translate(this.nodes[componentId].matTransf, this.nodes[componentId].matTransf, [x, y, z]);

                            hasTransformation = true;
                        }

                        else if(grandGrandChildren[k].nodeName == "rotate") {

                            // Get axis/angle values from rotation transformation
                            var axis = this.reader.getItem(grandGrandChildren[k], 'axis', ['x', 'y', 'z']);
                            if( axis == null ) {
                                return "unable to parse axis value from the <rotate> element of <transformation>";
                            }

                            var axisVector;
                            if(axis == 'x')
                                axisVector = [1, 0, 0];
                            else if(axis == 'y')
                                axisVector = [0, 1, 0];
                            else if(axis == 'z')
                                axisVector = [0, 0, 1];


                            var angle = this.reader.getFloat(grandGrandChildren[k], 'angle');
                            if( angle == null ) {
                                return "unable to parse angle value from the <rotate> element of <transformation>";
                            }


                            mat4.rotate(this.nodes[componentId], this.nodes[componentId], DEGREE_TO_RAD*angle, axisVector);

                            hasTransformation = true;
                        }

                        else if(grandGrandChildren[k].nodeName == "scale") {

                            // Get x/y/z coordinates from scale transformation
                            var x = this.reader.getFloat(grandGrandChildren[k], 'x');
                            if( (x == null) || (isNaN(x)) ) {
                                return "unable to parse x-coodinate from the <scale> element of <transformation>";
                            }

                            var y = this.reader.getFloat(grandGrandChildren[k], 'y');
                            if( (y == null) || (isNaN(y)) ) {
                                return "unable to parse y-coodinate from the <scale> element of <transformation>";
                            }

                            var z = this.reader.getFloat(grandGrandChildren[k], 'z');
                            if( (z == null) || (isNaN(z)) ) {
                                return "unable to parse z-coodinate from the <scale> element of <transformation>";
                            }

                            mat4.scale(this.nodes[componentId], this.nodes[componentId], [x, y, z]);

                            hasTransformation = true;
                        }
                    }
                }

                if( grandChildren[j].nodeName == "materials" ) {

                    // Get grandsons
                    grandGrandChildren = grandChildren[j].children;

                    if(grandGrandChildren.length < 1) {
                        return "<material> of <materials> must have at least 1 child element (conflict: nChildren = " + grandGrandChildren.length + ")";
                    }

                    for (var k = 0; k < grandGrandChildren.length; k++) {

                        if( grandGrandChildren[k].nodeName != "material") {

                            this.onXMLMinorError("unknown tag name <" + grandGrandChildren[k].nodeName + ">");
                            continue;
                        }

                        if( grandGrandChildren[k].nodeName == "material") {

                             // Get ID of current material
                             var materialId = this.reader.getString(grandGrandChildren[k], 'id');
                             if(materialId == null)
                                 return "material with invalid ID";

                             // Check if ID exists
                             if(this.materials[materialId] == null && materialId != "inherit")
								 return "ID must match to existing material";

                            this.nodes[componentId].material = materialId;
                        }
                    }
                }

                if( grandChildren[j].nodeName == "texture" ) {

                    // Get ID of current texture
                    var textureId = this.reader.getString(grandChildren[j], 'id');
                    if(textureId == null)
                        return "texture with invalid ID";

                    // Check if ID exists
                    if(this.textures[textureId] == null && textureId != "inherit" && textureId != "none")
                        return "ID must match to existing texture";

                    this.nodes[componentId].texture = textureId;
                }

                if( grandChildren[j].nodeName == "children" ) {

                    // Get grandsons
                    grandGrandChildren = grandChildren[j].children;

                    if(grandGrandChildren.length < 1) {
                        return "<children> of <components> must have at least 1 child element (conflict: nChildren = " + grandGrandChildren.length + ")";
                    }

                    for (var k = 0; k < grandGrandChildren.length; k++) {

                        if( (grandGrandChildren[k].nodeName != "componentref") && (grandGrandChildren[k].nodeName != "primitiveref") ) {

                            this.onXMLMinorError("unknown tag name <" + grandGrandChildren[k].nodeName + ">");
                            continue;
                        }

                        if(grandGrandChildren[k].nodeName == "primitiveref") {
                            // Get ID of current texture
                            var primitiveRefId = this.reader.getString(grandGrandChildren[k], 'id');
                            if(primitiveRefId == null)
                                return "texture with invalid ID";

                            // Check if ID exists
                            if(this.primitives[primitiveRefId] == null)
                                return "ID must match to existing primitive";

                            this.nodes[componentId].insertPrimitive(this.primitives[primitiveRefId]);
                        }
                    }
                }
            }

        }

        this.log("Parsed components");
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
    onXMLMinorError(message) {
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
		//DEBUG: console.log(this.nodes);

        for (let i = 0; i < this.nodes.length; i++) {
            this.scene.pushMatrix();
            for(let j=0; j<this.nodes[i].primitives[j].length; j++)
                this.nodes[i].primitives[j].display;
            this.scene.popMatrix();
        }
    }
}
