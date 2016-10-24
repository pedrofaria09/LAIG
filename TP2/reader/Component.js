function Component(id) {
    this.id = id;
    this.transformations = null;
    this.materials = [];
    this.textures = null;
    this.childrenComponents = null;
    this.childrenPrimitives = null;
    this.texture = null;
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

Component.prototype.setTextures = function(texture) {
    this.texture = texture;
};

Component.prototype.setChildrenComponents = function(children) {
    this.childrenComponents = children;
};

Component.prototype.setChildrenPrimitives = function(children) {
    this.childrenPrimitives = children;
};
