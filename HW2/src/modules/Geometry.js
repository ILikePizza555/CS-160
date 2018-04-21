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
     * @typedef {Object} QuadConstructor
     * @prop {Point} center
     * @prop {Number} width
     * @prop {Number} height
     */

    /**
     * Constructs a quad either given a center point, width, and height, or a list of points.
     * @param {QuadConstructor|Point[]} points
     */
    constructor(points) {
        if(points instanceof Array) {
            this.p1 = points[0];
            this.p2 = points[1];
            this.p2 = points[2];
            this.p3 = points[3];
            return;
        }

        if(points instanceof Object) {
            const center = points.center;
            const w = points.width / 2;
            const h = points.height / 2;

            this.p1 = new Point(center.x - w, center.y - h, center.z);
            this.p2 = new Point(center.x - w, center.y + h, center.z);
            this.p3 = new Point(center.x + w, center.y + h, center.z);
            this.p4 = new Point(center.x + w, center.y - h, center.z);
        }
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
    toGeometry(offset = 0) {
        return {
            verticies: [this.p1, this.p2, this.p3, this.p4],
            indices: [0, 1, 2, 0, 3, 2].map(v => v + offset)
        };
    }
}