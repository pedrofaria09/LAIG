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
    error = this.parseAnimations(rootElement);
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
 * Check if is a number
 */
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}
/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseGlobals = function(rootElement) {
    //falta o root q nao sei oque é
    elem = rootElement.getElementsByTagName('scene');

    if (elem == null || elem.length == 0) {
        return "list element is missing.";
        return -1;
    }

    if (elem.length > 1) {
        console.warn("You must have only one element on scene tag.");
        return -1;
    }

    if (!isNaN(elem[0].attributes[0].nodeValue)) {
        console.warn("On root, you should put a string");
        return -1;
    }

    if (!isNumber(elem[0].attributes[1].nodeValue)) {
        console.warn("On axis_length, you should put a number");
        return -1;
    }

    if (elem[0].attributes.length != 2) {
        console.warn("You should have 2 attributes on scene");
        return -1;
    }
    this.root = elem[0].attributes[0].nodeValue;
    this.axis = new CGFaxis(this.scene, elem[0].attributes[1].nodeValue);

}

MySceneGraph.prototype.parseAnimations = function(rootElement) {
    elem = rootElement.getElementsByTagName('animations');

    if (elem == null || elem.length == 0) {
        return "list element is missing.";
        return -1;
    }

    nnodes = elem[0].children.length;
    this.animationsList = new Array();
    isNotEqual = true;

    if (nnodes == 0) {
        console.warn("You should have one or more Animations");
        return -1;
    }

    for (var x = 0; x < nnodes; x++) {
        var matrixLinear = [];
        for (var a = 0; a < this.animationsList.length; a++) {
            if (this.viewsList[a] == elem[0].children[x].attributes[0].nodeValue) {
                isNotEqual = false;
                console.warn("You have two id's or more id's equal in animations->" + elem[0].children[x].attributes[0].nodeValue);
                return -1;
            }
        }
        if (isNotEqual) {
            if (!isNumber(elem[0].children[x].attributes[1].nodeValue)) {
                console.warn("You must have a number on animations->id" + elem[0].children[x].id + "->" + elem[0].children[x].attributes[1].nodeName);
                return -1;
            }
            //TODO TIRAR COMENTARIO DA LINHA ABAIXO APOS CONSTRUIR O CONSTRUTOR!!!!
            //this.animationsList[x] = new Animation(elem[0].children[x].attributes[0].nodeValue, parseFloat(elem[0].children[x].attributes[1].nodeValue), elem[0].children[x].attributes[2].nodeValue)
            if (elem[0].children[x].attributes[2].nodeValue == "linear") {
                if (elem[0].children[x].attributes.length != 3) {
                    console.warn("You must 3 attributes on animations->" + elem[0].children[x].id);
                    return -1;
                }
                for (var j = 0; j < elem[0].children[x].children.length; j++) {
                    matrixLinear[j] = [];
                    for (var k = 0; k < elem[0].children[x].children[j].attributes.length; k++) {
                        if (!isNumber(elem[0].children[x].children[j].attributes[k].nodeValue)) {
                            console.warn("You must have a number on animations->id" + elem[0].children[x].id + "->" + elem[0].children[x].children[j].attributes[k].nodeName);
                            return -1;
                        }
                        matrixLinear[j].push(parseFloat(elem[0].children[x].children[j].attributes[k].nodeValue));
                    }

                }
                this.animationsList[x] = new LinearAnimation(elem[0].children[x].attributes[0].nodeValue, parseFloat(elem[0].children[x].attributes[1].nodeValue), matrixLinear);
            } else if (elem[0].children[x].attributes[2].nodeValue == "circular") {
                if (elem[0].children[x].attributes.length != 9) {
                    console.warn("You must 9 attributes on animations->" + elem[0].children[x].id);
                    return -1;
                }
                if (!isNumber(elem[0].children[x].attributes[1].nodeValue) ||
                    !isNumber(elem[0].children[x].attributes[3].nodeValue) ||
                    !isNumber(elem[0].children[x].attributes[4].nodeValue) ||
                    !isNumber(elem[0].children[x].attributes[5].nodeValue) ||
                    !isNumber(elem[0].children[x].attributes[6].nodeValue) ||
                    !isNumber(elem[0].children[x].attributes[7].nodeValue) ||
                    !isNumber(elem[0].children[x].attributes[8].nodeValue)) {
                    console.warn("You must enter a valid number on animations->id" + elem[0].children[x].id + "->(centerx OR centery OR centerz OR radius OR startang OR rotang)");
                    return -1;
                }
                span = parseFloat(elem[0].children[x].attributes[1].nodeValue);
                centerx = parseFloat(elem[0].children[x].attributes[3].nodeValue);
                centery = parseFloat(elem[0].children[x].attributes[4].nodeValue);
                centerz = parseFloat(elem[0].children[x].attributes[5].nodeValue);
                radius = parseFloat(elem[0].children[x].attributes[6].nodeValue);
                startang = parseFloat(elem[0].children[x].attributes[7].nodeValue);
                rotang = parseFloat(elem[0].children[x].attributes[8].nodeValue);
                this.animationsList[x] = new CircularAnimation(elem[0].children[x].attributes[0].nodeValue, span, centerx, centery, centerz, radius, startang, rotang);
            } else {
                console.warn("You must enter a valid type of movement (linear or circular) on animations->" + elem[0].children[x].id) + "->type";
                return -1;
            }
        }
        isNotEqual = true;
    }
};


MySceneGraph.prototype.parseViews = function(rootElement) {
    elem = rootElement.getElementsByTagName('views');
    if (elem == null || elem.length == 0) {
        return "list element is missing.";
        return -1;
    }

    nnodes = elem[0].children.length;
    temp = new Array();
    target = new Array();
    pos = new Array();
    this.viewsList = new Array();
    isNotEqual = true;

    if (nnodes == 0) {
        console.warn("You should have one or more views");
        return -1;
    }
    this.idView = elem[0].attributes[0].nodeValue;
    for (var x = 0; x < nnodes; x++) {
        for (var a = 0; a < this.viewsList.length; a++) {
            if (this.viewsList[a][0] == elem[0].children[x].attributes[0].nodeValue) {
                isNotEqual = false;
                console.warn("You have two id's or more id's equal in views->perspective");
                return -1;
            }
        }
        if (isNotEqual) {
            if (this.idView != "default") {
                if (this.idView == elem[0].children[x].attributes[0].nodeValue) {
                    this.idView = x;
                }
            }
            for (var y = 0; y < elem[0].children[x].children.length; y++) {
                for (var w = 0; w < elem[0].children[x].children[y].attributes.length; w++) {
                    if (!isNumber(elem[0].children[x].children[y].attributes[w].nodeValue)) {
                        console.warn("You must enter a valid number in views->perspective->" + elem[0].children[x].id + "->" + elem[0].children[x].children[y].nodeName + "->" + elem[0].children[x].children[y].attributes[w].nodeName);
                        return -1;
                    }
                    if (elem[0].children[x].attributes[0].nodeValue == "") {
                        console.warn("You must enter a valid id in views->perspective->id");
                        return -1;
                    }
                    if (w > 0)
                        if (!isNumber(elem[0].children[x].attributes[w].nodeValue)) {
                            console.warn("You must enter a valid id in views->perspective->" + elem[0].children[x].attributes[w].nodeName);
                            return -1;
                        }
                    if (elem[0].children[x].attributes.length != 4) {
                        console.warn("You must have 4 attributes on views->perspective");
                        return -1;
                    }
                    if (elem[0].children[x].children[y].attributes.length != 3) {
                        console.warn("You must have 3 attributes on views->perspective->" + elem[0].children[x].id + "->" + elem[0].children[x].children[y].nodeName);
                        return -1;
                    }
                    if (elem[0].children[x].children.length != 2) {
                        console.warn("You must have 2 attributes on views->perspective->" + elem[0].children[x].id + "->" + elem[0].children[x].nodeName);
                        return -1;
                    }
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
            this.viewsList[x] = new CGFcamera(parseFloat(elem[0].children[x].attributes[3].nodeValue), parseFloat(elem[0].children[x].attributes[1].nodeValue), parseFloat(elem[0].children[x].attributes[2].nodeValue), pos, target);
            this.viewsList[x][0] = elem[0].children[x].attributes[0].nodeValue;
        }
        isNotEqual = true;
    }
};



MySceneGraph.prototype.parseIllumination = function(rootElement) {
    elem = rootElement.getElementsByTagName('illumination');
    if (elem == null || elem.length == 0) {
        return "list element is missing.";
        return -1;
    }
    backg = new Array(),
        amb = new Array();

    if (elem[0].attributes.length != 2) {
        console.warn("You must have 2 attributes on illumination tag");
        return -1;
    }

    for (var x = 0; x < elem[0].attributes.length; x++) {
        if (!isNumber(elem[0].attributes[x].nodeValue)) {
            console.warn("On illumination->" + elem[0].attributes[x].nodeName + " should be a boolean");
            return -1;
        }
    }

    for (var x = 0; x < elem[0].children.length; x++) {
        if (elem[0].children.length != 2) {
            console.warn("You must have 2 elements on illumination");
        }
        if (elem[0].children[x].attributes.length != 4) {
            console.warn("You must have 4 attributes in illumination->" + elem[0].children[x].nodeName);
            return -1;
        }
        for (var y = 0; y < elem[0].children[x].attributes.length; y++) {
            if (!isNumber(elem[0].children[x].attributes[y].nodeValue)) {
                console.warn("You must enter a valid number in illumination->" + elem[0].children[x].nodeName + "->" + elem[0].children[x].attributes[y].nodeName);
                return -1;
            }
        }
    }

    //TODO VER DEPOIS!!!!!!
    for (var g = 0; g < 4; g++)
        backg.push(parseFloat(elem[0].children[1].attributes[g].nodeValue));
    this.background = backg;

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
    activatedLight = false;
    var target = [];

    if (elem == null || elem.length == 0) {
        return "list element is missing.";
        return -1;
    }

    if (nnodes == 0) {
        console.warn("You must have at last 1 omni or 1 spot light ");
        return -1;
    }

    for (x = 0; x < nnodes; x++) {
        for (a = 0; a < this.lightsList.length; a++) {
            if (this.lightsList[a].id == elem[0].children[x].id) {
                isNotEqual = false;
                console.warn("You have 2 or more ids equals on lights: " + elem[0].children[a].id);
                return -1;
            }
        }
        if (isNotEqual) {
            this.scene.lights[x] = new CGFlight(this.scene, x);
            //criar luz
            if (elem[0].children[x].tagName == "omni") {
                for (y = 0; y < elem[0].children[x].children.length; y++) {
                    for (w = 0; w < elem[0].children[x].children[y].attributes.length; w++) {
                        if (!isNumber(elem[0].children[x].children[y].attributes[w].nodeValue)) {
                            console.warn("You must enter a valid number in lights->" + elem[0].children[x].id + "->" + elem[0].children[x].children[y].nodeName + "->" + elem[0].children[x].children[y].attributes[w].nodeName);
                            return -1;
                        }
                        if (elem[0].children[x].attributes[0].nodeValue == "") {
                            console.warn("You must enter a valid id in lights->id");
                            return -1;
                        }
                        if (!isNumber(elem[0].children[x].attributes[1].nodeValue)) {
                            console.warn("You must enter a valid boolean in lights->" + elem[0].children[x].tagName + "->" + elem[0].children[x].id + "->" + elem[0].children[x].attributes[1].nodeName);
                            return -1;
                        }
                        if (elem[0].children[x].attributes.length != 2) {
                            console.warn("You must have 2 attributes in lights->" + elem[0].children[x].tagName + "->" + elem[0].children[x].id);
                            return -1
                        }
                        if (elem[0].children[x].children.length != 4) {
                            console.warn("You must have 4 children's in lights->" + elem[0].children[x].tagName + "->" + elem[0].children[x].id);
                            return -1
                        }
                        if (elem[0].children[x].children[y].attributes.length != 4) {
                            console.warn("You must have 4 attributes in lights->" + elem[0].children[x].tagName + "->" + elem[0].children[x].id + "->" + elem[0].children[x].children[y].tagName);
                            return -1
                        }
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
                        if (!isNumber(elem[0].children[x].children[y].attributes[w].nodeValue)) {
                            console.warn("You must enter a valid number in lights->" + elem[0].children[x].id + "->" + elem[0].children[x].children[y].nodeName + "->" + elem[0].children[x].children[y].attributes[w].nodeName);
                            return -1;
                        }
                        if (elem[0].children[x].attributes[0].nodeValue == "") {
                            console.warn("You must enter a valid id in lights->id");
                            return -1;
                        }
                        if ((w > 0) && (!isNumber(elem[0].children[x].attributes[w].nodeValue))) {
                            console.warn("You must enter a valid number in lights->" + elem[0].children[x].tagName + "->" + elem[0].children[x].id + "->" + elem[0].children[x].attributes[w].nodeName);
                            return -1;
                        }
                        if (elem[0].children[x].attributes.length != 4) {
                            console.warn("You must have 4 attributes in lights->" + elem[0].children[x].tagName + "->" + elem[0].children[x].id);
                            return -1
                        }
                        if (elem[0].children[x].children.length != 5) {
                            console.warn("You must have 5 children's in lights->" + elem[0].children[x].tagName);
                            return -1
                        }
                        if ((y != 0 && y != 1) && elem[0].children[x].children[y].attributes.length != 4) {
                            console.warn("You must have 4 attributes in lights->" + elem[0].children[x].tagName + "->" + elem[0].children[x].id + "->" + elem[0].children[x].children[y].tagName);
                            return -1
                        }
                        if ((y == 0 || y == 1) && elem[0].children[x].children[y].attributes.length != 3) {
                            console.warn("You must have 3 attributes in lights->" + elem[0].children[x].tagName + "->" + elem[0].children[x].id + "->" + elem[0].children[x].children[y].tagName);
                            return -1
                        }
                        temp[w] = parseFloat(elem[0].children[x].children[y].attributes[w].nodeValue);
                    }
                    switch (y) {
                        case 0:
                            target = temp.slice();
                            break;
                        case 1:
                            this.scene.lights[x].setPosition(temp[0], temp[1], temp[2], 1);
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
                this.scene.lights[x].setSpotDirection(target[0] - this.scene.lights[x].position[0], target[1] - this.scene.lights[x].position[1], target[2] - this.scene.lights[x].position[2]);
                this.scene.lights[x].setSpotCutOff(parseFloat(elem[0].children[x].attributes[2].nodeValue) * Math.PI / 180);
                this.scene.lights[x].setSpotExponent(parseFloat(elem[0].children[x].attributes[3].nodeValue));
            }
            if (elem[0].children[x].attributes[1].nodeValue == 1) {
                this.scene.lights[x].enable();
                this.scene.lights[x].setVisible(true);
                activatedLight = true;
            }
            this.lightsList.push(new Light(elem[0].children[x].attributes[0].nodeValue, activatedLight, x));

        }


        isNotEqual = true;
        activatedLight = false;
    }

    console.log(this.scene.lights);
};


MySceneGraph.prototype.parseMaterials = function(rootElement) {
    elem = rootElement.getElementsByTagName('materials');
    if (elem == null || elem.length == 0) {
        return "list Materials element is missing.";
    }
    nnodes = elem[0].children.length;
    temp = new Array();
    this.materialsList = new Array();
    isNotEqual = true;
    if (nnodes == 0) {
        console.warn("You must have at last 1 Material ");
        return -1;
    }
    for (x = 0; x < nnodes; x++) {
        for (a = 0; a < this.materialsList.length; a++) {
            if (this.materialsList[a].id == elem[0].children[x].attributes[0].nodeValue) {
                isNotEqual = false;
                console.warn("You have 2 or more ids equals on Materials with id: " + elem[0].children[a].id);
                return -1;
            }
        }
        if (isNotEqual) {
            this.materialsList[x] = new Material(this.scene, elem[0].children[x].attributes[0].nodeValue, x);
            for (y = 0; y < elem[0].children[x].children.length; y++) {
                for (w = 0; w < elem[0].children[x].children[y].attributes.length; w++) {
                    if (!isNumber(elem[0].children[x].children[y].attributes[w].nodeValue)) {
                        console.warn("You must enter a valid number in material->" + elem[0].children[x].id + "->" + elem[0].children[x].children[y].nodeName + "->" + elem[0].children[x].children[y].attributes[w].nodeName);
                        return -1;
                    }
                    if (elem[0].children[x].attributes[0].nodeValue == "") {
                        console.warn("You must enter a valid id in material->id->" + elem[0].children[x].id);
                        return -1;
                    }
                    if (elem[0].children[x].children.length != 5) {
                        console.warn("You must have 5 children's in material->" + elem[0].children[x].id);
                        return -1
                    }
                    if ((y != 4) && elem[0].children[x].children[y].attributes.length != 4) {
                        console.warn("You must have 4 attributes in material->" + elem[0].children[x].id + "->" + elem[0].children[x].children[y].tagName);
                        return -1
                    }
                    if ((y == 4) && elem[0].children[x].children[y].attributes.length != 1) {
                        console.warn("You must have 1 attributes in material->" + elem[0].children[x].id + "->" + elem[0].children[x].children[y].tagName);
                        return -1
                    }
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
    if (nrTextures == 0) {
        console.warn("You must have at last 1 texture ");
        return -1;
    }
    tempText = new Array();
    this.textureList = new Array();
    this.CGFtextureList = [];
    for (var i = 0; i < nrTextures; i++) {
        for (var a = 0; a < this.textureList.length; a++) {
            if (this.textureList[a].id == elem[0].children[i].attributes[0].nodeValue) {
                isNotEqual = false;
                console.warn("You have 2 or more ids equals on lights with id: " + elem[0].children[a].id);
                return -1;
            }
        }
        if (isNotEqual) {
            for (var g = 0; g < elem[0].children[i].attributes.length; g++) {
                if (elem[0].children[i].attributes.length != 4) {
                    console.warn("You must have 4 attributes in textures->" + elem[0].children[i].tagName + "->" + elem[0].children[i].id);
                    return -1
                }
                if (g < 2) {
                    if (elem[0].children[i].attributes[g].nodeValue == "") {
                        console.warn("You must have an string on textures->" + elem[0].children[i].tagName + "->" + elem[0].children[i].attributes[g].nodeName + "->" + elem[0].children[i].id);
                        return -1
                    }
                    tempText.push(elem[0].children[i].attributes[g].nodeValue);
                }
                if (g >= 2) {
                    if (!isNumber(elem[0].children[i].attributes[g].nodeValue)) {
                        console.warn("You must have an number on textures->" + elem[0].children[i].tagName + "->" + elem[0].children[i].id + "->" + elem[0].children[i].attributes[g].nodeName);
                        return -1
                    }
                    tempText.push(parseFloat(elem[0].children[i].attributes[g].nodeValue));
                }
            }
            this.CGFtextureList[i] = new CGFtexture(this.scene, tempText[1]);
            this.textureList[i] = new Texture(this.scene, tempText[0], tempText[2], tempText[3]);
            tempText = [];
        }
        isNotEqual = true;
    }

};



MySceneGraph.prototype.parseTransformations = function(rootElement) {
    elem = rootElement.getElementsByTagName('transformations');

    nnodes = elem[0].children.length;

    if (elem == null || elem.length == 0) {
        return "list Transformations element is missing.";
    }
    if (nnodes == 0) {
        console.warn("You must have at last 1 Transfomation block ");
        return -1;
    }
    temp = new Array();
    this.transformationsListId = new Array();
    this.transformationsList = new Array();
    isNotEqual = true;
    for (x = 0; x < nnodes; x++) {
        matrix = mat4.create();
        for (a = 0; a < this.transformationsListId.length; a++) {
            if (this.transformationsListId[a] == elem[0].children[x].attributes[0].nodeValue) {
                isNotEqual = false;
                console.warn("You have 2 or more ids equals on materials with id: " + elem[0].children[a].id);
                return -1;
            }
        }
        if (elem[0].children[x].children.length == 0) {
            console.warn("You must have at last 1 transformation in material->" + elem[0].children[x].id);
            return -1;
        }
        if (isNotEqual) {
            this.transformationsListId[x] = elem[0].children[x].attributes[0].nodeValue;
            for (y = 0; y < elem[0].children[x].children.length; y++) {

                for (w = 0; w < elem[0].children[x].children[y].attributes.length; w++) {

                    if (elem[0].children[x].children[y].nodeName != "rotate") {
                        if (!isNumber(elem[0].children[x].children[y].attributes[w].nodeValue)) {
                            console.warn("You must enter a valid number in material->" + elem[0].children[x].id + "->" + elem[0].children[x].children[y].nodeName + "->" + elem[0].children[x].children[y].attributes[w].nodeName);
                            return -1;
                        }
                        if (elem[0].children[x].children[y].attributes.length != 3) {
                            console.warn("You must have 3 attributes in material->" + elem[0].children[x].id + "->" + elem[0].children[x].children[y].tagName);
                            return -1
                        }

                    } else {
                        if (elem[0].children[x].children[y].attributes.length != 2) {
                            console.warn("You must have 2 attributes in material->" + elem[0].children[x].id + "->" + elem[0].children[x].children[y].tagName);
                            return -1
                        }
                        if (!isLetter(elem[0].children[x].children[y].attributes[0].nodeValue)) {
                            console.warn("You must have a char(x, y or z) in material->" + elem[0].children[x].id + "->" + elem[0].children[x].children[y].tagName + "->" + elem[0].children[x].children[y].attributes[1].nodeName);
                            return -1
                        }
                        if (!isNumber(elem[0].children[x].children[y].attributes[1].nodeValue)) {
                            console.warn("You must have an angle in material->" + elem[0].children[x].id + "->" + elem[0].children[x].children[y].tagName + "->" + elem[0].children[x].children[y].attributes[1].nodeName);
                            return -1
                        }
                    }

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
    matrixLinear = [];
    for (var i = 0; i < nrPrimitives; i++) {
        if (elem[0].children[i].children.length != 1) {
            valid = false;
            console.warn("Error, must have 1 tag per primitive in id: " + elem[0].children[i].id);
            return -1;

        }
        for (a = 0; a < this.priList.length; a++) {
            if (this.priList[a].id == elem[0].children[i].attributes[0].nodeValue) {
                isNotEqual = false;
                console.warn("You have 2 or more ids equals on primitives with id: " + elem[0].children[a].id);
                return -1;
            }
        }
        if (valid && isNotEqual) {
            for (j = 0; j < elem[0].children[i].children.length; j++) {
                for (k = 0; k < elem[0].children[i].children[j].attributes.length; k++) {
                    if (elem[0].children[i].children[j].nodeName == "rectangle" && elem[0].children[i].children[j].attributes.length != 4) {
                        console.warn("You must enter 4 values in primitive->" + elem[0].children[i].id + "->" + elem[0].children[i].children[j].nodeName);
                        return -1;
                    }
                    if (elem[0].children[i].children[j].nodeName == "triangle" && elem[0].children[i].children[j].attributes.length != 9) {
                        console.warn("You must enter 9 values in primitive->" + elem[0].children[i].id + "->" + elem[0].children[i].children[j].nodeName);
                        return -1;
                    }
                    if (elem[0].children[i].children[j].nodeName == "cylinder" && elem[0].children[i].children[j].attributes.length != 5) {
                        console.warn("You must enter 5 values in primitive->" + elem[0].children[i].id + "->" + elem[0].children[i].children[j].nodeName);
                        return -1;
                    }
                    if (elem[0].children[i].children[j].nodeName == "sphere" && elem[0].children[i].children[j].attributes.length != 3) {
                        console.warn("You must enter 3 values in primitive->" + elem[0].children[i].id + "->" + elem[0].children[i].children[j].nodeName);
                        return -1;
                    }
                    if (elem[0].children[i].children[j].nodeName == "torus" && elem[0].children[i].children[j].attributes.length != 4) {
                        console.warn("You must enter 4 values in primitive->" + elem[0].children[i].id + "->" + elem[0].children[i].children[j].nodeName);
                        return -1;
                    }
                    /*if (!isNumber(elem[0].children[i].children[j].attributes[k].nodeValue)) {
                        console.warn("You must enter a valid number in primitive->" + elem[0].children[i].id + "->" + elem[0].children[i].children[j].nodeName + "->" + elem[0].children[i].children[j].attributes[k].nodeName);
                        return -1;
                    }*/
                }
            }
            switch (elem[0].children[i].children[0].nodeName) {
                case "rectangle":
                    x1 = parseFloat(elem[0].children[i].children[0].attributes[0].nodeValue);
                    y1 = parseFloat(elem[0].children[i].children[0].attributes[1].nodeValue);
                    x2 = parseFloat(elem[0].children[i].children[0].attributes[2].nodeValue);
                    y2 = parseFloat(elem[0].children[i].children[0].attributes[3].nodeValue);
                    this.priList[i] = new Rectangle(this.scene, elem[0].children[i].attributes[0].nodeValue, x1, y1, x2, y2);
                    break;
                case "triangle":
                    x1 = parseFloat(elem[0].children[i].children[0].attributes[0].nodeValue);
                    y1 = parseFloat(elem[0].children[i].children[0].attributes[1].nodeValue);
                    z1 = parseFloat(elem[0].children[i].children[0].attributes[2].nodeValue);
                    x2 = parseFloat(elem[0].children[i].children[0].attributes[3].nodeValue);
                    y2 = parseFloat(elem[0].children[i].children[0].attributes[4].nodeValue);
                    z2 = parseFloat(elem[0].children[i].children[0].attributes[5].nodeValue);
                    x3 = parseFloat(elem[0].children[i].children[0].attributes[6].nodeValue);
                    y3 = parseFloat(elem[0].children[i].children[0].attributes[7].nodeValue);
                    z3 = parseFloat(elem[0].children[i].children[0].attributes[8].nodeValue);
                    this.priList[i] = new Triangle(this.scene, elem[0].children[i].attributes[0].nodeValue, x1, y1, z1, x2, y2, z2, x3, y3, z3);
                    break;
                case "cylinder":
                    base = parseFloat(elem[0].children[i].children[0].attributes[0].nodeValue);
                    topo = parseFloat(elem[0].children[i].children[0].attributes[1].nodeValue);
                    height = parseFloat(elem[0].children[i].children[0].attributes[2].nodeValue);
                    slices = parseFloat(elem[0].children[i].children[0].attributes[3].nodeValue);
                    stacks = parseFloat(elem[0].children[i].children[0].attributes[4].nodeValue);
                    this.priList[i] = new MyCylinder(this.scene, elem[0].children[i].attributes[0].nodeValue, base, topo, height, slices, stacks);
                    break;
                case "sphere":
                    radius = parseFloat(elem[0].children[i].children[0].attributes[0].nodeValue);
                    slices = parseFloat(elem[0].children[i].children[0].attributes[1].nodeValue);
                    stacks = parseFloat(elem[0].children[i].children[0].attributes[2].nodeValue);
                    this.priList[i] = new Sphere(this.scene, elem[0].children[i].attributes[0].nodeValue, radius, slices, stacks);
                    break;
                case "torus":
                    inner = parseFloat(elem[0].children[i].children[0].attributes[0].nodeValue);
                    outer = parseFloat(elem[0].children[i].children[0].attributes[1].nodeValue);
                    slices = parseFloat(elem[0].children[i].children[0].attributes[2].nodeValue);
                    loops = parseFloat(elem[0].children[i].children[0].attributes[3].nodeValue);
                    this.priList[i] = new Torus(this.scene, elem[0].children[i].attributes[0].nodeValue, inner, outer, slices, loops);
                    break;
                case "plane":
                  dimX = parseFloat(elem[0].children[i].children[0].attributes[0].nodeValue);
                  dimY = parseFloat(elem[0].children[i].children[0].attributes[1].nodeValue);
                  partsX = parseFloat(elem[0].children[i].children[0].attributes[2].nodeValue);
                  partsY = parseFloat(elem[0].children[i].children[0].attributes[3].nodeValue);
                  this.priList[i] = new Plane(this.scene, elem[0].children[i].attributes[0].nodeValue, dimX, dimY, partsX, partsY);
                  break;
                case "peca":
                  var x = parseFloat(elem[0].children[i].children[0].attributes[0].nodeValue);
                  var y = parseFloat(elem[0].children[i].children[0].attributes[1].nodeValue);
                  this.priList[i] = new Peca(this.scene, elem[0].children[i].attributes[0].nodeValue, x,y);
                  break;
                case "patch":
                if (elem[0].children[i].children[0].attributes.length != 4) {
                    console.warn("You must have 4 attributes on patch->" + elem[0].children[i].id);
                    return -1;
                }

                for (var j = 0; j < elem[0].children[i].children[0].children.length; j++) {
                    if(elem[0].children[i].children[0].children[j].attributes.length != 3) {
                        console.warn("You must have 3 attributes on patch->" + elem[0].children[i].id + "->controlpoint Nr:"+ (j+1));
                        return -1;
                    }
                    matrixLinear[j] = [];
                    for (var k = 0; k < elem[0].children[i].children[0].children[j].attributes.length; k++) {
                        if (!isNumber(elem[0].children[i].children[0].children[j].attributes[k].nodeValue)) {
                            console.warn("You must have a number on patch->id" + elem[0].children[x].id + "->" + elem[0].children[x].children[0].children[j].attributes[k].nodeName);
                            return -1;
                        }
                        matrixLinear[j].push(parseFloat(elem[0].children[i].children[0].children[j].attributes[k].nodeValue));
                    }
                    matrixLinear[j].push(1);
                }
                orderU = parseFloat(elem[0].children[i].children[0].attributes[0].nodeValue);
                orderV = parseFloat(elem[0].children[i].children[0].attributes[1].nodeValue);
                partsU = parseFloat(elem[0].children[i].children[0].attributes[2].nodeValue);
                partsV = parseFloat(elem[0].children[i].children[0].attributes[3].nodeValue);

                this.priList[i] = new Patch(this.scene, elem[0].children[i].attributes[0].nodeValue, orderU, orderV, partsU, partsV, matrixLinear);
                //console.log(matrixLinear);
                break;
                case 'chessboard':
                    var colors = new Array();
                    for(var h=0;h<4;h++){
                      colors[h]=[];
                      for(var j=0;j<4;j++){
                        colors[h][j]=parseFloat(elem[0].children[i].children[0].children[h].attributes[j].nodeValue);

                      }
                    }

                    this.priList[i] = new ChessBoard(this.scene,elem[0].children[i].attributes[0].nodeValue,parseFloat(elem[0].children[i].children[0].attributes[0].nodeValue),parseFloat(elem[0].children[i].children[0].attributes[1].nodeValue),this.getCGFTextureById(elem[0].children[i].children[0].attributes[2].nodeValue),colors);
                    break;
                case 'vehicle':
                    this.priList[i] = new Vehicle(this.scene,elem[0].children[i].attributes[0].nodeValue);
                    break;
                default:
            }
        }
        valid = true;
        isNotEqual = true;
    }
    //console.log(this.priList);
};



MySceneGraph.prototype.parseComponents = function(rootElement) {
    elem = rootElement.getElementsByTagName('components');
    nnodes = elem[0].children.length;
    temp = new Array();
    this.componentsList = new Array();
    console.log(elem);
    //texture = new Array();
    isNotEqual = true;
    for (var x = 0; x < nnodes; x++) {
        childrenComponents = new Array();
        childrenComponents = new Array();
        childrenPrimitives = new Array();
        listMaterial = new Array();

        for (a = 0; a < this.componentsList.length; a++) {
            if (this.componentsList[a].id == elem[0].children[x].attributes[0].nodeValue) {
                isNotEqual = false;
                console.warn("You have 2 or more ids equals on components with id: " + elem[0].children[a].id);
                return -1;
            }
        }
        if (isNotEqual) {
            if (elem[0].children[x].id == "") {
                console.warn("You must enter a sring on components->id->" + elem[0].children[x].id);
                return -1;
            }
            if (elem[0].children[x].children[0].tagName != "transformation") {
                console.warn("You must have transformation block on components->id->" + elem[0].children[x].id);
                return -1;
            }
            if (elem[0].children[x].children[1].tagName != "materials") {
                console.warn("You must have materials block on components->id->" + elem[0].children[x].id);
                return -1;
            } else {
                if (elem[0].children[x].children[1].children.length == 0) {
                    console.warn("You must have at last 1 material element on components->id->" + elem[0].children[x].id);
                    return -1;
                }
                for (var g = 0; g < elem[0].children[x].children[1].children.length; g++) {
                    if (elem[0].children[x].children[1].children[g].id == "") {
                        console.warn("You must have a valid name on components->id->" + elem[0].children[x].id + "->material->" + elem[0].children[x].children[1].children[g].id);
                        return -1
                    }
                }
            }
            if (elem[0].children[x].children[2].tagName != "texture") {
                console.warn("You must have texture block on components->id->" + elem[0].children[x].id);
                return -1;
            } else if (!isNaN(elem[0].children[x].children[2].id)) {
                console.warn("You must have a valid name on components->id->" + elem[0].children[x].id + "->texture->" + elem[0].children[x].children[2].id);
                return -1
            }
            if (elem[0].children[x].children[3].tagName != "children") {
                console.warn("You must have children block on components->id->" + elem[0].children[x].id);
                return -1;
            }

            if (elem[0].children[x].children[0].length == 0) {
                console.warn("You must have at last 1 element on components->id->" + elem[0].children[x].id + "->" + elem[0].children[x].children[0].nodeName);
                return -1;
            }

            this.componentsList[x] = new Component(elem[0].children[x].attributes[0].nodeValue);
            if (elem[0].children[x].children[0].children[0].tagName == 'transformationref') {
                if (elem[0].children[x].children[0].children[0].id == "") {
                    console.warn("You must enter a sring on components->id->" + elem[0].children[x].id + "->" + elem[0].children[x].children[0].children[0].nodeName);
                    return -1;
                }
                if (elem[0].children[x].children[0].children.length != 1) {
                    console.warn("You must must have only 1 element on components->id->" + elem[0].children[x].id + "->" + elem[0].children[x].children[0].nodeName);
                    return -1;
                }
                transformationref = this.getTransformationById(elem[0].children[x].children[0].children[0].attributes[0].nodeValue);
                this.componentsList[x].setTransformations(transformationref);
            } else {
                matrix = mat4.create();
                for (var i = 0; i < elem[0].children[x].children[0].children.length; i++) {

                    for (var j = 0; j < elem[0].children[x].children[0].children[i].attributes.length; j++) {
                        if (!isNaN(elem[0].children[x].children[0].children[i].attributes[j].nodeValue))
                            temp[j] = parseFloat(elem[0].children[x].children[0].children[i].attributes[j].nodeValue);
                        else
                            temp[j] = elem[0].children[x].children[0].children[i].attributes[j].nodeValue;
                    }
                    switch (elem[0].children[x].children[0].children[i].tagName) {
                        case 'translate':
                            if (elem[0].children[x].children[0].children[i].attributes.length != 3) {
                                console.warn("You must have 3 attributes (x-y-z) on components->id->" + elem[0].children[x].id + "->transformation->translate");
                                return -1
                            }
                            for (var g = 0; g < elem[0].children[x].children[0].children[i].attributes.length; g++) {
                                if (!isNumber(elem[0].children[x].children[0].children[i].attributes[g].nodeValue)) {
                                    console.warn("You must have a valid number on components->id->" + elem[0].children[x].id + "->transformation->translate->" + elem[0].children[x].children[0].children[i].attributes[g].nodeName);
                                    return -1
                                }
                            }
                            mat4.translate(matrix, matrix, temp.slice());
                            break;
                        case 'rotate':
                            if (elem[0].children[x].children[0].children[i].attributes.length != 2) {
                                console.warn("You must have 2 attributes (axis-angle) on components->id->" + elem[0].children[x].id + "->transformation->rotate");
                                return -1
                            }
                            if (elem[0].children[x].children[0].children[i].attributes[0].nodeValue == "") {
                                console.warn("You must have a valid letter (x, y or z) on components->id->" + elem[0].children[x].id + "->transformation->translate->axis");
                                return -1
                            }
                            if ((elem[0].children[x].children[0].children[i].attributes[1].nodeValue < (-360)) || (elem[0].children[x].children[0].children[i].attributes[1].nodeValue > 360)) {
                                console.warn("You must have a valid angle (-360 to 360) on components->id->" + elem[0].children[x].id + "->transformation->translate->angle");
                                return -1
                            }
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
                            if (elem[0].children[x].children[0].children[i].attributes.length != 3) {
                                console.warn("You must have 3 attributes (x-y-z) on components->id->" + elem[0].children[x].id + "->transformation->scale");
                                return -1
                            }
                            for (var g = 0; g < elem[0].children[x].children[0].children[i].attributes.length; g++) {
                                if (!isNumber(elem[0].children[x].children[0].children[i].attributes[g].nodeValue)) {
                                    console.warn("You must have a valid number on components->id->" + elem[0].children[x].id + "->transformation->scale->" + elem[0].children[x].children[0].children[i].attributes[g].nodeName);
                                    return -1
                                }
                            }
                            mat4.scale(matrix, matrix, temp.slice());
                            break;
                    }
                }

                this.componentsList[x].setTransformations(matrix);
            }

            for (var i = 0; i < elem[0].children[x].children[1].children.length; i++) {
                if (elem[0].children[x].children[1].children[i].attributes[0].nodeValue == 'inherit')
                    listMaterial[i] = elem[0].children[x].children[1].children[i].attributes[0].nodeValue;
                else {

                    listMaterial[i] = this.getMaterialById(elem[0].children[x].children[1].children[i].attributes[0].nodeValue);

                }
            }
            this.componentsList[x].setMaterials(listMaterial);
            var texture;
            if (elem[0].children[x].children[2].attributes[0].nodeValue == 'inherit' || elem[0].children[x].children[2].attributes[0].nodeValue == 'none') {
                CGFtexture = elem[0].children[x].children[2].attributes[0].nodeValue;
                texture = elem[0].children[x].children[2].attributes[0].nodeValue;
            } else {

                CGFtexture = this.getCGFTextureById(elem[0].children[x].children[2].attributes[0].nodeValue);
                texture = this.getTextureById(elem[0].children[x].children[2].attributes[0].nodeValue);
            }
            this.componentsList[x].setCGFTextures(CGFtexture);
            this.componentsList[x].setTextures(texture);
            if (elem[0].children[x].children[3].children.length == 0) {
                console.warn("You must have at last 1 componentref or primitiveref element on components->id->" + elem[0].children[x].id + "->children");
                return -1;
            }
            for (var i = 0; i < elem[0].children[x].children[3].children.length; i++) {

                if (!isNaN(elem[0].children[x].children[3].children[i].id)) {
                    console.warn("You must have a valid name on components->id->" + elem[0].children[x].id + "->children->" + elem[0].children[x].children[3].children[i].id);
                    return -1
                }
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

        var animations = new Array();
        if (elem[0].children[x].getElementsByTagName('animation').length > 0) {
            //console.log(elem[0].children[x].getElementsByTagName('animation'));
            for (var j = 0; j < elem[0].children[x].getElementsByTagName('animation')[0].children.length; j++) {
                //console.log(elem[0].children[x].getElementsByTagName('animation')[0].children[j].attributes[0].nodeValue);
                animations[j] = this.getAnimationById(elem[0].children[x].getElementsByTagName('animation')[0].children[j].attributes[0].nodeValue);
            }
            this.componentsList[x].setAnimations(animations);
        }

        if(elem[0].children[x].getElementsByTagName('pickme').length>0){
            this.componentsList[x].pickme=true;
        }


        childrenPrimitives = [];
        childrenComponents = [];
        isNotEqual = true;


    }
    console.log(  this.componentsList);
}

MySceneGraph.prototype.getTransformationById = function(id) {
    for (var i = 0; i < this.transformationsListId.length; i++) {
        if (this.transformationsListId[i] == id) {
            return this.transformationsList[i];
        }
    }
}
MySceneGraph.prototype.getCGFTextureById = function(id) {
    for (var i = 0; i < this.textureList.length; i++) {
        if (this.textureList[i].id == id) {
            return this.CGFtextureList[i];
        }
    }
}

MySceneGraph.prototype.getTextureById = function(id) {
    for (var i = 0; i < this.textureList.length; i++) {
        if (this.textureList[i].id == id) {
            return this.textureList[i];
        }
    }
}
MySceneGraph.prototype.getMaterialById = function(id) {
    for (var i = 0; i < this.materialsList.length; i++) {
        if (this.materialsList[i].id == id) {
            return this.materialsList[i];
        }
    }
}
MySceneGraph.prototype.getPrimitiveById = function(id) {
    for (var i = 0; i < this.priList.length; i++) {
        if (this.priList[i].id == id) {
            return this.priList[i];
        }
    }
}
MySceneGraph.prototype.getComponentById = function(id) {
    for (var i = 0; i < this.componentsList.length; i++) {
        if (this.componentsList[i].id == id) {
            return this.componentsList[i];
        }
    }
}
MySceneGraph.prototype.getAnimationById = function(id) {
        //console.log(id)
        for (var i = 0; i < this.animationsList.length; i++) {
            //console.log(this.animationsList[i].id);
            if (this.animationsList[i].id == id) {
                return this.animationsList[i];
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
