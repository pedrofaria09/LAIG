/**
 * Sphere
 * @constructor
 */
function Sphere(scene, id, radius, slices, stacks) {
    CGFobject.call(this, scene);
    this.id = id;
    this.radius = radius;
    this.slices = slices;
    this.stacks = stacks;
};

Sphere.prototype = Object.create(CGFobject.prototype);
Sphere.prototype.constructor = Sphere;
