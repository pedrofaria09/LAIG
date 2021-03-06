function XMLscene(app) {
    this.xmlFile = 1;
    CGFscene.call(this);
    this.app = app;
    this.app.setInterface(null);
    this.cameraTarget = null;
    this.typeOfGame = null;
    this.pecas = new Array();
    this.walls = new Array();
    this.dificulty = null;
    this.typeOfGameParser = null;
    this.dificultyParser = null;
    this.player1Name = 'Player1';
    this.player2Name = 'Player2';
    this.player1Vitories = 0;
    this.player2Vitories = 0;
    this.tempoJogado = null;
    this.auxiliarTempo = null;
    this.componentesObjetos = new Array();
    var myGraph = new MySceneGraph('sceneone.xml', this);
	this.interface=null;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;



XMLscene.prototype.playMovie = function() {
    if (this.game != null && this.game.State == 4) {
        this.game.movieIndex = 0;
        this.game.resetBoard();
        for (var i = 0; i < this.pecas.length; i++) {
            this.pecas[i].reset();
        }
        for (var i = 0; i < this.walls.length; i++) {
            this.walls[i].reset();
        }
        var scene = this;
        this.game.movieTime = setInterval(function() {
            scene.game.showMovie(scene.game);
        }, 2000);
    }
}

XMLscene.prototype.undo = function() {
    this.game.undo();
}

XMLscene.prototype.startGame = function() {
    if (this.player1Name != "" && this.player2Name != "" && (this.player1Name != this.player2Name) && (this.typeOfGameParser == "Human vs Human" || (this.typeOfGameParser != null && this.typeOfGameParser != "Human vs Human" && this.dificultyParser != null))) {
        this.dificulty = this.dificultyParser;
        this.typeOfGame = this.typeOfGameParser;
        this.game = new Game(this);
        this.hud = new Hud(this);
        for (var i = 0; i < this.pecas.length; i++) {
            this.pecas[i].reset();
        }
        for (var i = 0; i < this.walls.length; i++) {
            this.walls[i].reset();
        }
        if(this.typeOfGame=="CPU vs CPU"){
          this.game.stateMachine(null);
        }
    } else if (this.player1Name == this.player2Name)
        alert('Os nomes nao podem ser iguais');
    else alert('Os campos devem estar devidamente preenchidos');
}

XMLscene.prototype.changeScene = function() {
    this.xmlFile++;
    if (this.xmlFile > 2)
        this.xmlFile = 1;
    switch (this.xmlFile) {
        case 1:
            var myGraph = new MySceneGraph('sceneone.xml', this);
            break;
        case 2:
            var myGraph = new MySceneGraph('scenetwo.xml', this);
            break;
    }
}

XMLscene.prototype.init = function(application) {
    CGFscene.prototype.init.call(this, application);


    this.initCameras();

    this.initLights();
    this.enableTextures(true);
    this.time = null;

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);


    this.setUpdatePeriod(100);

    this.materialIndice = 0;
    this.materialsComponents = new Array();

    this.pickmeId = 1;
};

XMLscene.prototype.initLights = function() {};

XMLscene.prototype.initCameras = function() {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function() {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
};

// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function() {

    if (this.pecas.length > 4) {
        for (var i = 4; i < 8; i++) {

            this.pecas[i].x = this.pecas[i - 4].x;
            this.pecas[i].y = this.pecas[i - 4].y;
            this.pecas[i].realx = this.pecas[i - 4].realx;
            this.pecas[i].realy = this.pecas[i - 4].realy;
            this.pecas[i].component.animations = this.pecas[i - 4].component.animations;
        }
        this.pecas.splice(0, 4);
    }
    if (this.walls.length > 32) {
        for (var i = 32; i < 64; i++) {
            this.walls[i].x = this.walls[i - 32].x;
            this.walls[i].y = this.walls[i - 32].y;
            this.walls[i].placed = this.walls[i - 32].placed;
            this.walls[i].component.animations = this.walls[i - 32].component.animations;
        }
		this.walls.splice(0,32);
    }
	
    this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);
    this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

    if (this.graph.idView == "default")
        this.updateCamera(0);
    else
        this.updateCamera(this.graph.idView);

    this.initiateMaterials();

    this.nrLuzes = this.graph.lightsList.length;

    for (j = 1; j <= this.graph.lightsList.length; j++) {
        this.ative = this.graph.lightsList[(j - 1)].activated;
        this["luz" + j] = this.ative;
    }
	if(this.interface==null){
		this.interface = new MyInterface();
		this.app.setInterface(this.interface);
		this.interface.setActiveCamera(this.camera);
	}
 };

XMLscene.prototype.initiateMaterials = function(i) {

    for (var i = 0; i < this.graph.componentsList.length; i++) {
        this.materialsComponents[this.graph.componentsList[i].id] = 0;
    }
}

XMLscene.prototype.updateCamera = function(i) {
    if (i >= this.graph.viewsList.length) {
        i = 0;
    }
    if (i != null) {
        this.cameraTarget = {
            'position': this.graph.viewsList[i].position,
            'target': this.graph.viewsList[i].target,
            'times': 1
        };
        this.camera.far = this.graph.viewsList[i].far;
        this.camera.near = this.graph.viewsList[i].near;
        this.camera.fov = this.graph.viewsList[i].fov;
    } else if (this.cameraTarget != null) {
        var array = vec4.create();
        vec4.subtract(array, this.cameraTarget['position'], this.camera.position)
        vec4.multiply(array, array, vec4.fromValues(this.cameraTarget['times'] / 100, this.cameraTarget['times'] / 100, this.cameraTarget['times'] / 100, 1))
        vec4.add(array, array, this.camera.position);
        this.camera.setPosition(array);

        var array = vec4.create();
        vec4.subtract(array, this.cameraTarget['target'], this.camera.target)
        vec4.multiply(array, array, vec4.fromValues(this.cameraTarget['times'] / 100, this.cameraTarget['times'] / 100, this.cameraTarget['times'] / 100, 1))
        vec4.add(array, array, this.camera.target);
        this.camera.setTarget(array);

        var arrayTeste = vec4.create();
        vec4.subtract(arrayTeste, this.cameraTarget['position'], this.camera.position);
        if (JSON.stringify(arrayTeste) == JSON.stringify((vec4.fromValues(0, 0, 0, 0)))) {
            this.cameraTarget = null;
        } else this.cameraTarget['times']++;
    }


    return i;
}

XMLscene.prototype.update = function(t) {
    t = t / 1000;
    if (this.graph.loadedOk) {
        if (this.time == null) {
            this.timer = t;
            this.time = 0.0001;
        } else {
            this.time = (t - this.timer);
        }
    }

    if (this.game != null && this.game.State != 4) {
        if (this.auxiliarTempo == null) {
            this.tempoJogado = 0;
            this.auxiliarTempo = t;
        } else {
            this.tempoJogado = t - this.auxiliarTempo;
        }
        this.game.hasGameEnded();
    }

}

XMLscene.prototype.updateMaterials = function() {

    for (var i = 0; i < this.graph.componentsList.length; i++) {
        if (this.graph.componentsList[i].materials.length == this.materialsComponents[this.graph.componentsList[i].id] + 1) {
            this.materialsComponents[this.graph.componentsList[i].id] = 0;
        } else {
            this.materialsComponents[this.graph.componentsList[i].id] = this.materialsComponents[this.graph.componentsList[i].id] + 1;
        }
    }
}

XMLscene.prototype.logPicking = function() {
    if (this.pickMode == false) {
        if (this.pickResults != null && this.pickResults.length > 0) {
            for (var i = 0; i < this.pickResults.length; i++) {
                var obj = this.pickResults[i][0];
                if (obj) {
                    if (this.game != null) {
                        var customId = this.pickResults[i][1];
                        if (customId > 154 && (this.game.SelectedWall == null && this.game.SelectedPeca == 0))
                            this.game.SelectedObj = obj;
                        this.game.stateMachine(customId);
                        console.log("Picked object: " + obj + ", with pick id " + customId);
                    }

                }
            }
            this.pickResults.splice(0, this.pickResults.length);
        }
    }
}

XMLscene.prototype.paintSelected = function() {
    if (this.game.SelectedPick != 154)
        var ret = new Rectangle(this, null, Math.floor(this.game.SelectedPick / 14) / 11, (this.game.SelectedPick % 14 - 1) / 14, (Math.floor(this.game.SelectedPick / 14) + 1) / 11, (this.game.SelectedPick % 14) / 14);
    else var ret = new Rectangle(this, null, Math.floor((this.game.SelectedPick - 1) / 14) / 11, ((this.game.SelectedPick - 1) % 14) / 14, (Math.floor(this.game.SelectedPick / 14)) / 11, ((this.game.SelectedPick - 1) % 14 + 1) / 14);
    var material = new Material(this, null, null);
    material.setDiffuse(1,1,0);
    this.pushMatrix();
      this.rotate(-90*Math.PI/180,1,0,0);
      this.translate(0, 0, 0.05);
      this.scale(20, 20, 1);

      material.apply();
        ret.display();
    this.popMatrix();
}

XMLscene.prototype.display = function() {
    // ---- BEGIN Background, camera and axis setup

    

    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();

    //HUD
    this.updateHUD();

    //Update components of type of players
    this.updateVisibilityObjects();

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

	this.logPicking();
    this.clearPickRegistration();
	
    if (this.graph.loadedOk) {
        this.updateCamera(null);
        this.pickmeId = 1;
          if (this.game!=null && this.game.SelectedPick != 0) {
          this.paintSelected();
            }
        this.updateLights();

        this.graph.axis.display();

        this.processaGrafo(this.graph.root, null, null);

    }
};

XMLscene.prototype.updateVisibilityObjects = function() {
    for (var i = 0; i < this.componentesObjetos.length; i++) {
        this.componentesObjetos[i].objectVisible = false;
    }

    for (var i = 0; i < this.componentesObjetos.length; i++) {
        if (this.typeOfGame == "Human vs Human") {
            if (this.componentesObjetos[i].id == "human1" || this.componentesObjetos[i].id == "human2") {
                this.componentesObjetos[i].objectVisible = true;
            }
        } else if (this.typeOfGame == "Human vs CPU") {
            if (this.componentesObjetos[i].id == "human1")
                this.componentesObjetos[i].objectVisible = true;
            if (this.componentesObjetos[i].id == "easyRobot2" && this.dificulty == "Random")
                this.componentesObjetos[i].objectVisible = true;
            else if (this.componentesObjetos[i].id == "hardRobot2" && this.dificulty == "Impossible")
                this.componentesObjetos[i].objectVisible = true;
        } else if (this.typeOfGame == "CPU vs CPU") {
            if (this.componentesObjetos[i].id == "easyRobot2" && this.dificulty == "Random")
                this.componentesObjetos[i].objectVisible = true;
            else if (this.componentesObjetos[i].id == "hardRobot2" && this.dificulty == "Impossible")
                this.componentesObjetos[i].objectVisible = true;
            if (this.componentesObjetos[i].id == "easyRobot1" && this.dificulty == "Random")
                this.componentesObjetos[i].objectVisible = true;
            else if (this.componentesObjetos[i].id == "hardRobot1" && this.dificulty == "Impossible")
                this.componentesObjetos[i].objectVisible = true;
        }
    }
}

XMLscene.prototype.updateHUD = function() {
    if (this.game != null) {
        var timePlayed = "Time:_" + parseInt(this.tempoJogado);

        var player1 = this.player1Name.toString();
        if (this.player1Name == '')
            player1 = "Player_1";
        if (this.game.turn == 1) {
            player1 += "_-TURN";
        }
        var player1Pieces = "-Walls:_" + this.game.player1WallsLeft;
        var player1Vitories = "-Score:_" + this.player1Vitories;

        var player2 = this.player2Name.toString();
        if (this.player2Name == '')
            player2 = "Player_2";
        if (this.game.turn == 2) {
            player2 += "_-TURN";
        }
        var player2Pieces = "-Walls:_" + this.game.player2WallsLeft;
        var player2Vitories = "-Score:_" + this.player2Vitories;

        this.hud.display([timePlayed, "", player1, player1Pieces, player1Vitories, "", player2, player2Pieces, player2Vitories]);
    }

}

XMLscene.prototype.processaGrafo = function(nodeName, texture, materialFather) {
    var material = null;
    var compTexture = null;
    if (nodeName != null) {
        var node = this.graph.componentsList[this.getRootPos(nodeName)];
        if (node.materials != "inherit") {
            material = node.materials[this.materialsComponents[node.id]];
        } else material = materialFather;


        if (node.textures == 'none') {
            material.setTexture(null);
            compTexture = null;
        } else if (node.textures == 'inherit') {
            compTexture = texture;
            material.setTexture(texture);
        } else {
            material.setTexture(node.textures);
            compTexture = node.textures;
        }
        material.apply();

        if (this.pickMode && node.pickme) {
            this.registerForPick(this.pickmeId, node);
            this.pickmeId++;
        }


        this.multMatrix(node.transformations);
        if (node.animations.length > 0) {
            this.callAnimations(node.animations, this.time);
        }
        if (node.childrenPrimitives != null) {
            if ((node.texture.length_s != 1 || node.texture.length_t != 1) && node.texture != "none" && !(node.childrenPrimitives[0] instanceof Sphere || node.childrenPrimitives[0] instanceof Patch || node.childrenPrimitives[0] instanceof Plane || node.childrenPrimitives[0] instanceof Vehicle)) {

                node.childrenPrimitives[0].updateTexture(node.texture.length_s, node.texture.length_t);
            }
            node.childrenPrimitives[0].display();

            if ((node.texture.length_s != 1 || node.texture.length_t != 1) && node.texture != "none" && !(node.childrenPrimitives[0] instanceof Sphere || node.childrenPrimitives[0] instanceof Patch || node.childrenPrimitives[0] instanceof Plane || node.childrenPrimitives[0] instanceof Vehicle)) {
                node.childrenPrimitives[0].updateTexture(1, 1);
            }

        }

        if (node.childrenComponents != null && node.objectVisible == true) {
            for (var i = 0; i < node.childrenComponents.length; i++) {
                this.pushMatrix();

                this.processaGrafo(node.childrenComponents[i], compTexture, material);
                this.popMatrix();
            }
        }

    }
    return 0;
};

//buscar posição do root no vetor de componentes

XMLscene.prototype.getRootPos = function(nodeName) {
    //console.log(this.graph.componentsList);
    for (z = 0; z < this.graph.componentsList.length; z++) {
        if (this.graph.componentsList[z].id == nodeName) {
            return z;
        }
    }
    return -1;
}

XMLscene.prototype.callAnimations = function(animations, time) {
    var counter = 0;
    for (var i = 0; i < animations.length; i++) {
        counter += animations[i].span;
        if (counter > time) {
            if (i != 0)
                var timer = time - this.countTimer(animations, i);
            else var timer = time;
            this.multMatrix(animations[i].callMatrix(timer));
            break;
        } else {
            this.multMatrix(animations[i].callMatrix(time));
        }
		
    }
}

XMLscene.prototype.countTimer = function(animations, num) {
    var counter = 0;
    for (var i = 0; i < num; i++) {
        counter += animations[i].span;
    }
    return counter;
}

XMLscene.prototype.updateLights = function() {
    for (var i = 1; i <= this.nrLuzes; i++) {
        if (this[("luz" + i)]) {

            this.lights[i - 1].setVisible(true);
            this.lights[i - 1].enable();
        } else {
            this.lights[i - 1].setVisible(false);
            this.lights[i - 1].disable();
        }
        this.lights[i - 1].update();
    }
}
