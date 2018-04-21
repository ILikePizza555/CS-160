/**
 * @typedef {Object} GLGeometry
 * @prop {Number[]} verticies
 * @prop {Number[]} indices
 */

/**
 * Represents a point in 3D space
 */
export class Point {
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} [z=0] 
     */
    constructor(x, y, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toArray() {
        return [this.x, this.y, this.z];
    }
}

/**
 * Represents a triangle
 */
export class Triangle {
    /**
     * @param {Point} p1 
     * @param {Point} p2 
     * @param {Point} p3 
     */
    constructor(p1, p2, p3) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }

    /**
     * Returns the triangle as an object containing array of verticies and and array indices. 
     * @param {Number} [offset=0]
     * @returns {GLGeometry}
     */
    numerize(offset = 0) {
        return {
            verticies: [this.p1, this.p2, this.p3].map(v => v.toArray()).reduce((a, c) => a.concat(c)),
            indices: [0, 1, 2].map(v => v + offset)
        };
    }
}

export class Quad {
    constructor(p1, p2, p3, p4) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.p4 = p4;
    }

    /**
     * Returns this quad as an array of triangles
     * @returns {Triangle[]}
     */
    trianglize() {
        return[new Triangle(this.p1, this.p2, this.p3), new Triangle(this.p1, this.p4, this.p3)];
    }

    /**
     * @param {Number} offset
     * @returns {GLGeometry}
     */
    numerize(offset = 0) {
        return {
            verticies: [this.p1, this.p2, this.p3, this.p4].map(v => v.toArray()).reduce((a, c) => a.concat(c)),
            indices: [0, 1, 2, 0, 3, 2].map(v => v + offset)
        };
    }
}