function XMLscene() {
    CGFscene.call(this);
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

    //this.axis=new CGFaxis(this);
};

XMLscene.prototype.initLights = function() {
    //this.lights[0].setPosition(2, 3, 3, 1);
    //this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    //this.lights[0].update();
};

XMLscene.prototype.initCameras = function() {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
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
    //this.lights[0].setVisible(true);
    //this.lights[0].enable();
};

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

    this.setDefaultAppearance();

    // ---- END Background, camera and axis setup

    // it is important that things depending on the proper loading of the graph
    // only get executed after the graph has loaded correctly.
    // This is one possible way to do it
    if (this.graph.loadedOk) {
        for (i = 0; i < this.lights.length; i++)
            this.lights[i].update();
        this.graph.axis.display();
        //myquad= new Rectangle(this,1,0,1,0,1);
        //console.log(this.graph.componentsList[0].textures);

        //this.graph.componentsList[0].textures.apply();
        //this.graph.componentsList[0].childrenPrimitives[0].display();
        this.processaGrafo('root');
    }
};

XMLscene.prototype.processaGrafo = function(nodeName) {
    var material = null;

    if (nodeName != null) {
        var node = this.graph.componentsList[this.getRootPos(nodeName)];
        if (node.materials != null)
            material = node.materials[0];
        if (material != null)
            material.apply();
        this.multMatrix(node.transformations);
        if (node.childrenPrimitives != null) {
            //console.log(nodeName + ' entrei');
            node.childrenPrimitives[0].display();
        }
        if (node.childrenComponents != null) {
            for (var i = 0; i < node.childrenComponents.length; i++) {
                this.pushMatrix();
                material.apply();
                this.processaGrafo(node.childrenComponents[i]);
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
