/**
 * @typedef {Object} GLGeometry
 * @prop {Point[]} verticies
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

/** Normal to XY plane */
const NORM_XY = new Point(0, 0, 1);
/** Normal to ZX plane */
const NORM_ZX = new Point(0, 1, 0);
/** Normal to ZY plane */
const NORM_ZY = new Point(1, 0, 0);
const ZERO = new Point(0, 0 ,0);

export {NORM_XY, NORM_ZX, NORM_ZY, ZERO};

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
    toGeometry(offset = 0) {
        return {
            verticies: [this.p1, this.p2, this.p3],
            indices: [0, 1, 2].map(v => v + offset)
        };
    }
}

export class Quad {

    /**
     * Constructs a quad either 4 points
     * @param {Point} bottomLeft
     * @param {Point} topLeft
     * @param {Point} bottomRight
     * @param {Point} topRight
     */
    constructor(bottomLeft, topLeft, bottomRight, topRight) {
        this.bottomLeft = bottomLeft;
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
        this.topRight = topRight;
    }

    /**
     * @param {Number} offset
     * @returns {GLGeometry}
     */
    toGeometry(offset = 0) {
        return {
            verticies: [this.bottomLeft, this.topLeft, this.bottomRight, this.topRight],
            indices: [0, 2, 3, 0, // Bottom-left triangle
                      0, 1, 3, 0] // Top-right triangle
                      .map(v => v + offset)
        };
    }
}

export class Circle {
    /**
     * 
     * @param {Point} center The center of the circle
     * @param {Number} radius The radius of the circle
     * @param {Number} sides The number of sides of a circle
     */
    constructor(center, radius = 0.1, sides = 12) {
        /** @type {Point} center */
        this.center = center;
        /** @type {Point[]} _verticies */
        this._verticies = [];

        const angle = 2 / sides * Math.PI;
        for (let i = 0; i <= sides; i++) {
            const x = Math.cos(i * angle) * radius;
            const y = Math.sin(i * angle) * radius;

            this._verticies.push(new Point(center.x + x, center.y + y, center.z));
        }
    }


    toGeometry(offset=0) {
        return {
            verticies: this._verticies,
            indices: [...Array(this._verticies.length).keys()].map(v => v + offset).concat(0)
        };
    }
}

export class Cylinder {
    constructor(radius = 0.1, sides = 12) {
        this.quads = [];

        const angle = 2 / sides * Math.PI;
        for(let i = 0; i < sides; i++) {
            const x1 = Math.cos(i * angle) * radius;
            const z1 = Math.sin(i * angle) * radius;

            const x2 = Math.cos((i+1) * angle) * radius;
            const z2 = Math.sin((i+1) * angle) * radius;

            this.quads.push(new Quad(
                new Point(x1, -0.2, z1), // Bottom-left
                new Point(x1, 0, z1),    // Top-left
                new Point(x2, -0.2, z2), // Bottom-right
                new Point(x2, 0, z2)     // Top-right
            ));
        }
    }

    toGeometry(offset=0) {
        const rv = {
            verticies: [],
            indices: []
        };

        for(let i = 1; i < this.quads.length; i += 2) {
            const q1 = this.quads[i-1];
            const q2 = this.quads[i];

            // q1 and q2 share an edge, so we filter the duplicate vericies
            // This is done by selecting the left edge of both quads.
            rv.verticies.push(q1.bottomLeft, q1.topLeft, q2.bottomLeft, q2.topLeft);
            rv.indices.push(...[1, 0, 2, 3, 2, 3].map(v => v + Math.floor(i / 2) * 4));
        }

        return rv;
    }
}