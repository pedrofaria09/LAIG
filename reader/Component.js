function Component(id) {
    this.id = id;
	this.transformations = null;
	this.materials = [];
	this.textures = [];
	this.childrenComponents = null;
	this.childrenPrimitives = null;
}

Component.prototype.setTransformations = function(transformation)
{
	this.transformations = transformation;
};

Component.prototype.setMaterials = function(materials)
{
	this.materials = materials;
};

Component.prototype.setTextures = function(textures)
{
	this.textures = textures;
};

Component.prototype.setChildrenComponents = function(children)
{
	this.childrenComponents = children;
};

Component.prototype.setChildrenPrimitives = function(children)
{
	this.childrenPrimitives = children;
};