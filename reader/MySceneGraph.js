function MySceneGraph(filename, scene) {
    this.loadedOk = null;
    // Establish bidirectional references between scene and graph
    this.scene = scene;
    scene.graph = this;
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
MySceneGraph.prototype.onXMLReady = function() {
    console.log("XML Loading finished.");
    var rootElement = this.reader.xmlDoc.documentElement;
    error = this.parseGlobals(rootElement);
    error = this.parseIllumination(rootElement);
    error = this.parseLights(rootElement);
    error = this.parseTextures(rootElement);
    error = this.parseMaterials(rootElement);
    error = this.parseViews(rootElement);
    error = this.parseTransformations(rootElement);
    error = this.parsePrimitives(rootElement);
    error = this.parseComponents(rootElement);
    if (error != null) {
        this.onXMLError(error);
        return;
    }
    this.loadedOk = true;
    // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
    this.scene.onGraphLoaded();
};
/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseGlobals = function(rootElement) {
    //falta o root q nao sei oque é
    elem = rootElement.getElementsByTagName('scene');
    if (elem == null || elem.length == 0) {
        return "list element is missing.";
    }
    this.axis = new CGFaxis(this.scene, elem[0].attributes[1].nodeValue);
}
MySceneGraph.prototype.parseViews = function(rootElement) {
    elem = rootElement.getElementsByTagName('views');
    if (elem == null || elem.length == 0) {
        return "list element is missing.";
    }
    nnodes = elem[0].children.length;
    temp = new Array();
    target = new Array();
    pos = new Array();
    this.viewsList = new Array();
    isNotEqual = true;
    for (x = 0; x < nnodes; x++) {
        for (a = 0; a < this.viewsList.length; a++) {
            if (this.viewsList[a].id == elem[0].children[x].attributes[0].nodeValue) {
                isNotEqual = false;
            }
        }
        if (isNotEqual) {
            for (y = 0; y < elem[0].children[x].children.length; y++) {
                for (w = 0; w < elem[0].children[x].children[y].attributes.length; w++) {
                    temp[w] = parseFloat(elem[0].children[x].children[y].attributes[w].nodeValue);
                }
                switch (y) {
                    case 0:
                        pos = temp.slice();
                        break;
                    case 1:
                        target = temp.slice();
                        break;
                }
            }
            this.viewsList[x] = new CGFcamera(elem[0].children[x].attributes[3].nodeValue, elem[0].children[x].attributes[1].nodeValue, elem[0].children[x].attributes[2].nodeValue, pos, target);
        }
        isNotEqual = true;
    }
};
MySceneGraph.prototype.parseIllumination = function(rootElement) {
    elem = rootElement.getElementsByTagName('illumination');
    if (elem == null || elem.length == 0) {
        return "list element is missing.";
    }
    backg = new Array(),
        amb = new Array();
    //nao funciona corretamente
    for (var g = 0; g < 4; g++)
        backg.push(parseFloat(elem[0].children[1].attributes[g].nodeValue));
    this.background = backg;
    //nenhum função vai buscar o ambiente
    for (var g = 0; g < 4; g++)
        amb.push(parseFloat(elem[0].children[0].attributes[g].nodeValue));
    this.ambient = amb;
};
MySceneGraph.prototype.parseLights = function(rootElement) {
    elem = rootElement.getElementsByTagName('lights');
    nnodes = elem[0].children.length;
    temp = new Array();
    this.lightsList = new Array();
    isNotEqual = true;
    for (x = 0; x < nnodes; x++) {
        for (a = 0; a < this.lightsList.length; a++) {
            if (this.lightsList[a].id == elem[0].children[x].attributes[0].nodeValue) {
                isNotEqual = false;
            }
        }
        if (isNotEqual) {
            this.scene.lights[x] = new CGFlight(this.scene, x);
            //criar luz
            if (elem[0].children[x].tagName == "omni") {
                for (y = 0; y < elem[0].children[x].children.length; y++) {
                    for (w = 0; w < elem[0].children[x].children[y].attributes.length; w++) {
                        temp[w] = parseFloat(elem[0].children[x].children[y].attributes[w].nodeValue);
                    }
                    switch (y) {
                        case 0:
                            this.scene.lights[x].setPosition(temp[0], temp[1], temp[2], temp[3]);
                            break;
                        case 1:
                            this.scene.lights[x].setAmbient(temp[0], temp[1], temp[2], temp[3]);
                            break;
                        case 2:
                            this.scene.lights[x].setDiffuse(temp[0], temp[1], temp[2], temp[3]);
                            break;
                        case 3:
                            this.scene.lights[x].setSpecular(temp[0], temp[1], temp[2], temp[3]);
                            break;
                    }
                }
            } else {
                for (var y = 0; y < elem[0].children[x].children.length; y++) {
                    for (var w = 0; w < elem[0].children[x].children[y].attributes.length; w++) {
                        temp[w] = parseFloat(elem[0].children[x].children[y].attributes[w].nodeValue);
                    }
                    switch (y) {
                        case 0:
                            this.scene.lights[x].setSpotDirection(temp[0], temp[1], temp[2]);
                            break;
                        case 1:
                            this.scene.lights[x].setPosition(temp[0], temp[1], temp[2], temp[3]);
                            break;
                        case 2:
                            this.scene.lights[x].setAmbient(temp[0], temp[1], temp[2], temp[3]);
                            break;
                        case 3:
                            this.scene.lights[x].setDiffuse(temp[0], temp[1], temp[2], temp[3]);
                            break;
                        case 4:
                            this.scene.lights[x].setSpecular(temp[0], temp[1], temp[2], temp[3]);
                            break;
                    }
                }
                this.scene.lights[x].setSpotCutOff(elem[0].children[x].attributes[2].nodeValue);
                this.scene.lights[x].setSpotExponent(elem[0].children[x].attributes[3].nodeValue);
            }
            if (elem[0].children[x].attributes[1].nodeValue == 1) {
                this.scene.lights[x].enable();
                this.scene.lights[x].setVisible(true);
            }
            this.lightsList.push(new Light(elem[0].children[x].attributes[0].nodeValue, x));
        }
        isNotEqual = true;
    }
};
MySceneGraph.prototype.parseMaterials = function(rootElement) {
    elem = rootElement.getElementsByTagName('materials');
    nnodes = elem[0].children.length;
    temp = new Array();
    this.materialsList = new Array();
    isNotEqual = true;
    for (x = 0; x < nnodes; x++) {
        for (a = 0; a < this.materialsList.length; a++) {
            if (this.materialsList[a].id == elem[0].children[x].attributes[0].nodeValue) {
                isNotEqual = false;
            }
        }
        if (isNotEqual) {
            this.materialsList[x] = new Material(this.scene, elem[0].children[x].attributes[0].nodeValue, x);
            for (y = 0; y < elem[0].children[x].children.length; y++) {
                for (w = 0; w < elem[0].children[x].children[y].attributes.length; w++) {
                    temp[w] = parseFloat(elem[0].children[x].children[y].attributes[w].nodeValue);
                }
                switch (y) {
                    case 0:
                        this.materialsList[x].setEmission(temp[0], temp[1], temp[2], temp[3]);
                        break;
                    case 1:
                        this.materialsList[x].setAmbient(temp[0], temp[1], temp[2], temp[3]);
                        break;
                    case 2:
                        this.materialsList[x].setDiffuse(temp[0], temp[1], temp[2], temp[3]);
                        break;
                    case 3:
                        this.materialsList[x].setSpecular(temp[0], temp[1], temp[2], temp[3]);
                        break;
                    case 4:
                        this.materialsList[x].setShininess(temp[0]);
                        break;
                }
            }
        }
        isNotEqual = true;
    }
};
MySceneGraph.prototype.parseTextures = function(rootElement) {
    elem = rootElement.getElementsByTagName('textures');
    if (elem == null || elem.length == 0) {
        return "list texture element is missing.";
    }
    isNotEqual = true;
    nrTextures = elem[0].children.length;
    tempText = new Array();
    this.textureList = new Array();
    for (var i = 0; i < nrTextures; i++) {
        for (var g = 0; g < elem[0].children[i].attributes.length; g++) {
            if (g < 2)
                tempText.push(elem[0].children[i].attributes[g].nodeValue);
            if (g >= 2)
                tempText.push(parseFloat(elem[0].children[i].attributes[g].nodeValue));
        }
        this.textureList[i] = new Texture(this.scene, tempText[0], tempText[2], tempText[3]);
        this.textureList[i].loadTexture(tempText[1]);
        tempText = [];
    }
};
MySceneGraph.prototype.parseTransformations = function(rootElement) {
    elem = rootElement.getElementsByTagName('transformations');
    nnodes = elem[0].children.length;
    temp = new Array();
    this.transformationsListId = new Array();
    this.transformationsList = new Array();
    isNotEqual = true;
    for (x = 0; x < nnodes; x++) {
        matrix = mat4.create();
        for (a = 0; a < this.transformationsListId.length; a++) {
            if (this.transformationsListId[a] == elem[0].children[x].attributes[0].nodeValue) {
                isNotEqual = false;
            }
        }
        if (isNotEqual) {
            this.transformationsListId[x] = elem[0].children[x].attributes[0].nodeValue;
            for (y = 0; y < elem[0].children[x].children.length; y++) {
                for (w = 0; w < elem[0].children[x].children[y].attributes.length; w++) {
                    if (!isNaN(elem[0].children[x].children[y].attributes[w].nodeValue))
                        temp[w] = parseFloat(elem[0].children[x].children[y].attributes[w].nodeValue);
                    else {
                        temp[w] = elem[0].children[x].children[y].attributes[w].nodeValue;
                    }
                }
                switch (elem[0].children[x].children[y].tagName) {
                    case "translate":
                        mat4.translate(matrix, matrix, temp.slice());
                        break;
                    case "rotate":
                        switch (temp[0]) {
                            case "x":
                                mat4.rotate(matrix, matrix, temp[1] * Math.PI / 180, [1, 0, 0]);
                                break;
                            case "y":
                                mat4.rotate(matrix, matrix, temp[1] * Math.PI / 180, [0, 1, 0]);
                                break;
                            case "z":
                                mat4.rotate(matrix, matrix, temp[1] * Math.PI / 180, [0, 0, 1]);
                                break;
                        }
                        break;
                    case "scale":
                        mat4.scale(matrix, matrix, temp.slice());
                        break;
                }
            }
            this.transformationsList[x] = matrix;
        }
        isNotEqual = true;
    }
};
MySceneGraph.prototype.parsePrimitives = function(rootElement) {
    var elem = rootElement.getElementsByTagName('primitives');
    if (elem == null || elem.length == 0) {
        return "list primitives element is missing.";
    }
    nrPrimitives = elem[0].children.length;
    valid = true;
    isNotEqual = true;
    this.priList = new Array();
    for (var i = 0; i < nrPrimitives; i++) {
        if (elem[0].children[i].children.length > 1) {
            return "Error, must have 1 tag per primitive";
            valid = false;
        }
        for (a = 0; a < this.priList.length; a++) {
            if (this.priList[a].id == elem[0].children[i].attributes[0].nodeValue) {
                isNotEqual = false;
            }
        }
        if (valid && isNotEqual) {
            switch (elem[0].children[i].children[0].nodeName) {
                case "rectangle":
                    x1 = elem[0].children[i].children[0].attributes[0].nodeValue;
                    y1 = elem[0].children[i].children[0].attributes[1].nodeValue;
                    x2 = elem[0].children[i].children[0].attributes[2].nodeValue;
                    y2 = elem[0].children[i].children[0].attributes[3].nodeValue;
                    this.priList[i] = new Rectangle(this.scene, elem[0].children[i].attributes[0].nodeValue, x1, y1, x2, y2);
                    break;
                case "triangle":
                    x1 = elem[0].children[i].children[0].attributes[0].nodeValue;
                    y1 = elem[0].children[i].children[0].attributes[1].nodeValue;
                    z1 = elem[0].children[i].children[0].attributes[2].nodeValue;
                    x2 = elem[0].children[i].children[0].attributes[3].nodeValue;
                    y2 = elem[0].children[i].children[0].attributes[4].nodeValue;
                    z2 = elem[0].children[i].children[0].attributes[5].nodeValue;
                    x3 = elem[0].children[i].children[0].attributes[6].nodeValue;
                    y3 = elem[0].children[i].children[0].attributes[7].nodeValue;
                    z3 = elem[0].children[i].children[0].attributes[8].nodeValue;
                    this.priList[i] = new Triangle(this.scene, elem[0].children[i].attributes[0].nodeValue, x1, y1, z1, x2, y2, z2, x3, y3, z3);
                    break;
                case "cylinder":
                    base = elem[0].children[i].children[0].attributes[0].nodeValue;
                    topo = elem[0].children[i].children[0].attributes[1].nodeValue;
                    height = elem[0].children[i].children[0].attributes[2].nodeValue;
                    slices = elem[0].children[i].children[0].attributes[3].nodeValue;
                    stacks = elem[0].children[i].children[0].attributes[4].nodeValue;
                    this.priList[i] = new Cylinder(this.scene, elem[0].children[i].attributes[0].nodeValue, base, topo, height, slices, stacks);
                    break;
                case "sphere":
                    radius = elem[0].children[i].children[0].attributes[0].nodeValue;
                    slices = elem[0].children[i].children[0].attributes[1].nodeValue;
                    stacks = elem[0].children[i].children[0].attributes[2].nodeValue;
                    this.priList[i] = new Sphere(this.scene, elem[0].children[i].attributes[0].nodeValue, radius, slices, stacks);
                    break;
                case "torus":
                    inner = elem[0].children[i].children[0].attributes[0].nodeValue;
                    outer = elem[0].children[i].children[0].attributes[1].nodeValue;
                    slices = elem[0].children[i].children[0].attributes[2].nodeValue;
                    loops = elem[0].children[i].children[0].attributes[3].nodeValue;
                    this.priList[i] = new Torus(this.scene, elem[0].children[i].attributes[0].nodeValue, inner, outer, slices, loops);
                    break;
                default:
            }
        }
        valid = true;
        isNotEqual = true;
    }
};
MySceneGraph.prototype.parseComponents = function(rootElement) {
    elem = rootElement.getElementsByTagName('components');
    nnodes = elem[0].children.length;
    temp = new Array();
    this.componentsList = new Array();
    listMaterial = new Array();
    //texture = new Array();
    childrenComponents = new Array();
    childrenPrimitives = new Array();
    isNotEqual = true;
    for (x = 0; x < nnodes; x++) {
        for (a = 0; a < this.componentsList.length; a++) {
            if (this.componentsList[a].id == elem[0].children[x].attributes[0].nodeValue) {
                isNotEqual = false;
            }
        }
        if (isNotEqual) {

            this.componentsList[x] = new Component(elem[0].children[x].attributes[0].nodeValue);
    //console.log(elem[0].children[x].children[0].children);
            if (elem[0].children[x].children[0].children[0].tagName == 'transformationref') {

                transformationref = this.getTransformationById(elem[0].children[x].children[0].children[0].attributes[0].nodeValue);
                this.componentsList[x].setTransformations(transformationref);
            } else {
                matrix = mat4.create();
                for (i = 0; i < elem[0].children[x].children[0].children.length; i++) {

                    for (j = 0; j < elem[0].children[x].children[0].children[i].attributes.length; j++) {
                        if (!isNaN(elem[0].children[x].children[0].children[i].attributes[j].nodeValue))
                            temp[j] = parseFloat(elem[0].children[x].children[0].children[i].attributes[j].nodeValue);
                        else
                            temp[j] = elem[0].children[x].children[0].children[i].attributes[j].nodeValue;
                    }
                    switch (elem[0].children[x].children[0].children[i].tagName) {
                        case 'translate':
                            mat4.translate(matrix, matrix, temp.slice());
                            break;
                        case 'rotate':
                            switch (temp[0]) {
                                case "x":
                                    mat4.rotate(matrix, matrix, temp[1] * Math.PI / 180, [1, 0, 0]);
                                    break;
                                case "y":
                                    mat4.rotate(matrix, matrix, temp[1] * Math.PI / 180, [0, 1, 0]);
                                    break;
                                case "z":
                                    mat4.rotate(matrix, matrix, temp[1] * Math.PI / 180, [0, 0, 1]);
                                    break;
                            }
                            break;
                        case 'scale':
                            mat4.scale(matrix, matrix, temp.slice());
                            break;
                    }
                }

                this.componentsList[x].setTransformations(matrix);
            }
            for (i = 0; i < elem[0].children[x].children[1].children.length; i++) {
                if (elem[0].children[x].children[1].children[i].attributes[0].nodeValue == 'inherit')
                    listMaterial[i] = elem[0].children[x].children[1].children[i].attributes[0].nodeValue;
                else
                    listMaterial[i] = this.getMaterialById(elem[0].children[x].children[1].children[i].attributes[0].nodeValue);
            }
            this.componentsList[x].setMaterials(listMaterial);
            var texture;
            if (elem[0].children[x].children[2].attributes[0].nodeValue == 'inherit' || elem[0].children[x].children[2].attributes[0].nodeValue == 'none')
                texture = elem[0].children[x].children[2].attributes[0].nodeValue;
            else {
                texture = this.getTextureById(elem[0].children[x].children[2].attributes[0].nodeValue);
            }
            this.componentsList[x].setTextures(texture);
            for (i = 0; i < elem[0].children[x].children[3].children.length; i++) {
                if (elem[0].children[x].children[3].children[i].tagName == 'componentref')
                    childrenComponents.push(elem[0].children[x].children[3].children[i].attributes[0].nodeValue);
                else if (elem[0].children[x].children[3].children[i].tagName == 'primitiveref')
                    childrenPrimitives.push(this.getPrimitiveById(elem[0].children[x].children[3].children[i].attributes[0].nodeValue));
            }
            if (childrenComponents.length > 0) {
                this.componentsList[x].setChildrenComponents(childrenComponents.slice());
            }
            if (childrenPrimitives.length > 0) {
                this.componentsList[x].setChildrenPrimitives(childrenPrimitives.slice());
            }
        }
        childrenPrimitives = [];
        childrenComponents = [];
        isNotEqual = true;
    }
    console.log(this.componentsList);
}
MySceneGraph.prototype.getTransformationById = function(id) {
    for (i = 0; i < this.transformationsListId.length; i++) {
        if (this.transformationsListId[i] == id) {
            return this.transformationsList[i];
        }
    }
}
MySceneGraph.prototype.getTextureById = function(id) {
    for (i = 0; i < this.textureList.length; i++) {
        if (this.textureList[i].id == id) {
            return this.textureList[i];
        }
    }
}
MySceneGraph.prototype.getMaterialById = function(id) {
    for (i = 0; i < this.materialsList.length; i++) {
        if (this.materialsList[i].id == id) {
            return this.materialsList[i];
        }
    }
}
MySceneGraph.prototype.getPrimitiveById = function(id) {
    for (i = 0; i < this.priList.length; i++) {
        if (this.priList[i].id == id) {
            return this.priList[i];
        }
    }
}
MySceneGraph.prototype.getComponentById = function(id) {
        for (i = 0; i < this.componentsList.length; i++) {
            if (this.componentsList[i].id == id) {
                return this.componentsList[i];
            }
        }
    }
    /*
     * Callback to be executed on any read error
     */
MySceneGraph.prototype.onXMLError = function(message) {
    console.error("XML Loading Error: " + message);
    this.loadedOk = false;
};
