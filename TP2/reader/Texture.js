/**
 * Texture
 * @constructor
 */
function Texture(scene, id, length_s, length_t) {
    CGFappearance.call(this, scene);
    this.id = id;
    this.length_s = length_s;
    this.length_t = length_t;
};

Texture.prototype = Object.create(CGFappearance.prototype);
Texture.prototype.constructor = Texture;
