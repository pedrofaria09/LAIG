/**
 * Material
 * @constructor
 */
function Material(scene, id, pos) {
    CGFappearance.call(this, scene);
    this.id = id;
    this.pos = pos;
};

Material.prototype = Object.create(CGFappearance.prototype);
Material.prototype.constructor = Material;