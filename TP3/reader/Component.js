function Component(id) {
    this.id = id;
    this.transformations = null;
    this.materials = [];
    this.textures = null;
    this.childrenComponents = null;
    this.childrenPrimitives = null;
    this.texture = null;
    this.pickme = false;
    this.objectVisible = true;
    this.animations = new Array();
}

Component.prototype.setTransformations = function(transformation) {
    this.transformations = transformation;
};

Component.prototype.setMaterials = function(materials) {
    this.materials = materials;
};

Component.prototype.setCGFTextures = function(textures) {
    this.textures = textures;
};

Component.prototype.removeLastAnimation = function() {
    this.animations.pop();
};

Component.prototype.setTextures = function(texture) {
    this.texture = texture;
};

Component.prototype.setChildrenComponents = function(children) {
    this.childrenComponents = children;
};

Component.prototype.addAnimation = function(ani) {
    this.animations.push(ani);
};

Component.prototype.setChildrenPrimitives = function(children) {
    this.childrenPrimitives = children;
    for (var i = 0; i < children.length; i++) {
        if (children[i] instanceof Peca || children[i] instanceof Wall) {
            children[i].setComponent(this);
        }
    }
};

Component.prototype.setAnimations = function(animations) {
    this.animations = animations;
};