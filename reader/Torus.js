/**
 * Torus
 * @constructor
 */
function Torus(scene, id, inner, outer, slices, loops) {
    CGFobject.call(this, scene);
    this.id = id;
    this.inner = inner;
    this.outer = outer;
    this.slices = slices;
    this.loops = loops;
};

Torus.prototype = Object.create(CGFobject.prototype);
Torus.prototype.constructor = Torus;
