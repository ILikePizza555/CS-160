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
     * Constructs a quad either given a center point, width, and height, or a list of points.
     * @param {Point} p1
     * @param {Point} p2
     * @param {Point} p3
     * @param {Point} p4
     */
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
    toGeometry(offset = 0) {
        return {
            verticies: [this.p1, this.p2, this.p3, this.p4],
            indices: [0, 1, 2, 0, 3, 2].map(v => v + offset)
        };
    }

    /**
     * Constructs a quad normal to the XY plane with the given properties
     * @param {Point} center 
     * @param {Number} width 
     * @param {Number} height 
     */
    static newXYQuad(center, width, height) {
        const w = width / 2;
        const h = height / 2;

        return new Quad(new Point(center.x - w, center.y - h, center.z),
                        new Point(center.x - w, center.y + h, center.z),
                        new Point(center.x + w, center.y + h, center.z),
                        new Point(center.x + w, center.y - h, center.z));
    }

    /**
     * Constructs a quad normal to the YZ plane with the given properties
     * @param {Point} center 
     * @param {Number} width 
     * @param {Number} height 
     */
    static newYZQuad(center, width, height) {
        const w = width / 2;
        const h = height / 2;

        return new Quad(new Point(center.x, center.y - h, center.z - w),
                        new Point(center.x, center.y + h, center.z - w),
                        new Point(center.x, center.y + h, center.z + w),
                        new Point(center.x, center.y - h, center.z + w));
    }

    static newXZQuad(center, width, height) {
        const w = width / 2;
        const h = height / 2;

        return new Quad(new Point(center.x - w, center.y, center.z - h),
                        new Point(center.x - w, center.y, center.z + h),
                        new Point(center.x + w, center.y, center.z + h),
                        new Point(center.x + w, center.y, center.z - h));
    }
}