function XMLscene(app) {
    CGFscene.call(this);
    this.app = app;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function(application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();
    this.enableTextures(true);

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);





    this.materialIndice = 0;
    this.materialsComponents = new Array();

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

XMLscene.prototype.updateMaterials = function() {

    for (var i = 0; i < this.graph.componentsList.length; i++) {
        if (this.graph.componentsList[i].materials.length == this.materialsComponents[this.graph.componentsList[i].id] + 1) {
            this.materialsComponents[this.graph.componentsList[i].id] = 0;
        } else {
            this.materialsComponents[this.graph.componentsList[i].id] = this.materialsComponents[this.graph.componentsList[i].id] + 1;
        }
    }
}

XMLscene.prototype.display = function() {
    // ---- BEGIN Background, camera and axis setup

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

        this.updateLights();

        this.graph.axis.display();
        
        this.processaGrafo(this.graph.root,null,null);
		
    }
};

XMLscene.prototype.processaGrafo = function(nodeName,texture,materialFather) {
    var material = null;
	var compTexture = null;
    if (nodeName != null) {
        var node = this.graph.componentsList[this.getRootPos(nodeName)];
        if (node.materials != "inherit") {
            material = node.materials[this.materialsComponents[node.id]];
        }
		else material=materialFather;

	
			if(node.textures == 'none'){
				material.setTexture(null);
				compTexture=null;
			}
			else if(node.textures == 'inherit'){
				compTexture=texture;
				material.setTexture(texture);
			}
			else{
				material.setTexture(node.textures);
				compTexture=node.textures;
			}
			material.apply();
		
		
        this.multMatrix(node.transformations);
        if (node.childrenPrimitives != null) {
           if((node.texture.length_s !=1||node.texture.length_t!=1 ) && node.texture!="none"){
			  
			    node.childrenPrimitives[0].updateTexture(node.texture.length_s,node.texture.length_t);
		   }
            node.childrenPrimitives[0].display();
			
			if((node.texture.length_s !=1||node.texture.length_t!=1 )&& node.texture!="none"){
			   node.childrenPrimitives[0].updateTexture(1,1);	
		   }
			
        }
        if (node.childrenComponents != null) {
            for (var i = 0; i < node.childrenComponents.length; i++) {
                this.pushMatrix();
            
                this.processaGrafo(node.childrenComponents[i],compTexture,material);
                this.popMatrix();
            }
        }

    }
    return 0;
};

//buscar posição do root no vetor de componentes
XMLscene.prototype.getRootPos = function(nodeName) {
    for (z = 0; z < this.graph.componentsList.length; z++) {
        if (this.graph.componentsList[z].id == nodeName) {
            return z;
        }
    }
    return -1;
}

XMLscene.prototype.updateLights = function() {
    for (i = 1; i <= this.nrLuzes; i++) {
        if (this[("luz" + i)]) {
        	
            this.lights[i-1].setVisible(true);
            this.lights[i-1].enable();
        } else {
            this.lights[i-1].setVisible(false);
            this.lights[i-1].disable();
        }
        this.lights[i-1].update();
    }
}
