function LinearAnimation(id, span, controlPoints) {
    Animation.call(this, id, span, 'linear');


    this.controlPoints = controlPoints;

    this.velocity = this.distance() / this.span;
    this.matrix = mat4.create();
    this.lastIterator = 0;

    this.timeFunction();
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.timeFunction = function() {
    this.timePerPath = new Array();

    for (var i = 1; i < this.controlPoints.length; i++) {
        if (i != 1)
            this.timePerPath[i - 1] = Math.sqrt(Math.pow(this.controlPoints[i][0] - this.controlPoints[i - 1][0], 2) + Math.pow(this.controlPoints[i][1] - this.controlPoints[i - 1][1], 2) + Math.pow(this.controlPoints[i][2] - this.controlPoints[i - 1][2], 2)) / this.velocity + this.timePerPath[i - 2];
        else this.timePerPath[i - 1] = Math.sqrt(Math.pow(this.controlPoints[i][0] - this.controlPoints[i - 1][0], 2) + Math.pow(this.controlPoints[i][1] - this.controlPoints[i - 1][1], 2) + Math.pow(this.controlPoints[i][2] - this.controlPoints[i - 1][2], 2)) / this.velocity;
    }
}

LinearAnimation.prototype.distance = function() {
    var distance = 0;
    this.translations = new Array();
    this.rotations = new Array();
    this.rotations[0] = 0;
    for (var i = 1; i < this.controlPoints.length; i++) {
        distance += Math.sqrt(Math.pow(this.controlPoints[i][0] - this.controlPoints[i - 1][0], 2) + Math.pow(this.controlPoints[i][1] - this.controlPoints[i - 1][1], 2) + Math.pow(this.controlPoints[i][2] - this.controlPoints[i - 1][2], 2));
        this.translations[i - 1] = vec3.fromValues(this.controlPoints[i][0] - this.controlPoints[i - 1][0], this.controlPoints[i][1] - this.controlPoints[i - 1][1], this.controlPoints[i][2] - this.controlPoints[i - 1][2]);
        this.rotations[i] = Math.atan2(this.controlPoints[i][0], this.controlPoints[i][2]) - Math.atan2(this.controlPoints[i - 1][0], this.controlPoints[i - 1][2]);
    }
    console.log(this.translations);
    return distance;
}

LinearAnimation.prototype.callMatrix = function(t) {

    var matrix = mat4.create();
    for (var i = 0; i < this.timePerPath.length; i++) {
        if (t < this.timePerPath[i]) {
            break;
        }
    }

    if (i != this.lastIterator) {
        mat4.translate(this.matrix, this.matrix, vec3.fromValues(this.translations[i - 1][0], this.translations[i - 1][1], this.translations[i - 1][2]));
        this.lastIterator = i;
    }

    if (i != this.timePerPath.length) {
        if (i == 0)
            mat4.translate(matrix, this.matrix, vec3.fromValues(this.translations[i][0] * (t / this.timePerPath[i]), this.translations[i][1] * (t / this.timePerPath[i]), this.translations[i][2] * (t / this.timePerPath[i])));
        else
            mat4.translate(matrix, this.matrix, vec3.fromValues(this.translations[i][0] * ((t - this.timePerPath[i - 1]) / (this.timePerPath[i] - this.timePerPath[i - 1])), this.translations[i][1] * ((t - this.timePerPath[i - 1]) / (this.timePerPath[i] - this.timePerPath[i - 1])), this.translations[i][2] * ((t - this.timePerPath[i - 1]) / (this.timePerPath[i] - this.timePerPath[i - 1]))));

        mat4.rotate(matrix, matrix, this.rotations[i], [0, 1, 0]);
    } else matrix = this.matrix;
    return matrix;

}
