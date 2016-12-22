function XMLscene(app) {
    CGFscene.call(this);
    this.app = app;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function(application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    //relativo ao jogo///////////////////////////7
    this.turn=1;
    this.SelectedPick=0;
    this.SelectedPeca=0;
    this.State=0;
    this.SelectedObj=null;
    this.board=[['c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c'],
	['b','b','b','b','b','b','b','b','b','b','b'],
	['c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c'],
	['b','b','b','b','b','b','b','b','b','b','b'],
	['c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c'],
  ['b','b','b','b','b','b','b','b','b','b','b'],
	['c','a','c','a','c','a','r','a','c','a','c','a','c','a','r','a','c','a','c','a','c'],
	['b','b','b','b','b','b','b','b','b','b','b'],
	['c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c'],
	['b','b','b','b','b','b','b','b','b','b','b'],
	['c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c'],
	['b','b','b','b','b','b','b','b','b','b','b'],
	['c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c'],
	['b','b','b','b','b','b','b','b','b','b','b'],
	['c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c'],
	['b','b','b','b','b','b','b','b','b','b','b'],
	['c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c'],
	['b','b','b','b','b','b','b','b','b','b','b'],
	['c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c'],
	['b','b','b','b','b','b','b','b','b','b','b'],
	['c','a','c','a','c','a','e','a','c','a','c','a','c','a','e','a','c','a','c','a','c'],
	['b','b','b','b','b','b','b','b','b','b','b'],
	['c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c'],
	['b','b','b','b','b','b','b','b','b','b','b'],
	['c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c'],
	['b','b','b','b','b','b','b','b','b','b','b'],
	['c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c','a','c']];
    /////////////////////////////////////////////////

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

    //this.axis=new CGFaxis(this);
};

XMLscene.prototype.initLights = function() {
    //this.lights[0].setPosition(2, 3, 3, 1);
    //this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    //this.lights[0].update();
};

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

    var myInterface = new MyInterface();
    this.app.setInterface(myInterface);
    myInterface.setActiveCamera(this.camera);
};


XMLscene.prototype.initiateMaterials = function(i) {

    for (var i = 0; i < this.graph.componentsList.length; i++) {
        this.materialsComponents[this.graph.componentsList[i].id] = 0;
    }
}

XMLscene.prototype.pickingBoard = function(i) {



var material= new Material(this,null,null);
    for (var i = 0; i < 11; i++) {
        for(var j=0;j<14;j++){
          var ret = new Rectangle(this,null,i/11,j/14,(i+1)/11,(j+1)/14);
          if(this.pickMode){
              this.registerForPick(this.pickmeId, ret);
              this.pickmeId++;
          }
          material.apply();
          ret.display();
        }
    }
}

XMLscene.prototype.updateCamera = function(i) {
    if (i >= this.graph.viewsList.length) {
        i = 0;
    }

    this.camera.setPosition(this.graph.viewsList[i].position);
    this.camera.setTarget(this.graph.viewsList[i].target);
    this.camera.far = this.graph.viewsList[i].far;
    this.camera.near = this.graph.viewsList[i].near;
    this.camera.fov = this.graph.viewsList[i].fov;

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
                    this.SelectedObj=obj;
                    var customId = this.pickResults[i][1];
                    this.stateMachine(customId);
                    console.log("Picked object: " + obj + ", with pick id " + customId);
                }
            }
            this.pickResults.splice(0, this.pickResults.length);
        }
    }
}

XMLscene.prototype.paintSelected = function() {
  if(this.SelectedPick!=154)
  var ret = new Rectangle(this,null,Math.floor(this.SelectedPick/14)/11,(this.SelectedPick%14-1)/14,(Math.floor(this.SelectedPick/14)+1)/11,(this.SelectedPick%14)/14);
  else  var ret = new Rectangle(this,null,Math.floor((this.SelectedPick-1)/14)/11,((this.SelectedPick-1)%14)/14,(Math.floor(this.SelectedPick/14))/11,((this.SelectedPick-1)%14+1)/14);
  var material= new Material(this,null,null);
  material.apply();
  ret.display();
}

XMLscene.prototype.display = function() {
    // ---- BEGIN Background, camera and axis setup

    this.logPicking();
    this.clearPickRegistration();

    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Draw axis
    //this.graph.axis.display();

    //this.setDefaultAppearance();

    // ---- END Background, camera and axis setup

    // it is important that things depending on the proper loading of the graph
    // only get executed after the graph has loaded correctly.
    // This is one possible way to do it


    if (this.graph.loadedOk) {
        this.pickmeId = 1;

      /*  this.pushMatrix();
          this.translate(0,0,0.009);
          this.scale(20,20,1);
          if(this.SelectedPick!=0){
            this.paintSelected();
          }
        this.popMatrix();*/

        this.updateLights();

        this.graph.axis.display();

        this.processaGrafo(this.graph.root, null, null);

    }
};

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

        if(this.pickMode && node.pickme){
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

        if (node.childrenComponents != null) {
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
    for (i = 0; i < animations.length; i++) {
        counter += animations[i].span;
        if (counter > time) {
            if (i != 0)
                var timer = time - this.countTimer(animations, i);
            else var timer = time;
            timer
            this.multMatrix(animations[i].callMatrix(timer));
            break;
        } else {
            this.multMatrix(animations[i].callMatrix(time));
        }
    }
}

XMLscene.prototype.countTimer = function(animations, num) {
    var counter = 0;
    for (i = 0; i < num; i++) {
        counter += animations[i].span;
    }
    return counter;
}

XMLscene.prototype.stateMachine = function(pick) {
  var xmlscene=this;
    switch(this.State){
      case 0:
      console.log();
            if(pick>154)
              {
                var pos=this.coordsToPosition([this.SelectedObj.childrenPrimitives[0].y,this.SelectedObj.childrenPrimitives[0].x]);
                this.boardToString();
                this.sendMessage('/checkChosenPawn./'+this.turn+'./'+this.boardToString()+'./['+pos.toString()+']',function (data){
                    if(data.currentTarget.responseText=="ok"){
                      console.log();
                      xmlscene.changeSelected(pick-154);
                      xmlscene.changeState(1);
                    }

               });

              }
            break;
    }
}

XMLscene.prototype.changeSelected = function(ind) {
  this.SelectedPeca=ind;
}

XMLscene.prototype.changeState = function(ind) {
  this.State=ind;
}

XMLscene.prototype.coordsToPosition = function(coords) {
    return [15-Math.ceil(coords[0]/20*14),Math.ceil(coords[1]/20*11)];
}

XMLscene.prototype.sendMessage = function(string,onSuccess,onError) {
  var requestPort = 8081
  var request = new XMLHttpRequest();
  request.open('GET', 'http://localhost:'+requestPort+string, true);

  request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
  request.onerror = onError || function(){console.log("Error waiting for response");};

  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.send();
}



XMLscene.prototype.boardToString = function() {
    var string="[";
    for(var i=0;i<this.board.length;i++){
      if(i!=this.board.length-1)
        string+='['+this.board[i].toString()+'],'
      else string+='['+this.board[i].toString()+']'
    }
    string+=']';

    return string;
}

XMLscene.prototype.updateLights = function() {
    for (i = 1; i <= this.nrLuzes; i++) {
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