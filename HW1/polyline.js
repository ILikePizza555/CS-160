"use strict";

const VSHADER_SOURCE = `
    attribute vec4 a_Position;

    void main() {
        gl_Position = a_Position;
        gl_PointSize = 10.0;
    }
`

const FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
`

main(setup());

/**
 * The context object that setup() returns
 * @typedef {Object} Setup~Context
 * @property {Node} canvas - The object representing the canvas
 * @property {WebGLRenderingContext} gl - The WebGl rendering context
 */

 /**
  * @typedef {Object} Point
  * @property {Number} x
  * @property {Number} y
  */

/**
 * Sets up the WebGL program
 * @returns {Setup~Context}
 */
function setup() {
    const canvas = document.querySelector("#canvas");
    /** @type {WebGLRenderingContext} */
    const gl = canvas.getContext("webgl");

    if(!gl) {
        console.error("[Setup] Unable to initialize WebGL.");
        alert("Unable to initialize WebGL.");
        return;
    }

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error("[Setup] Unable to initialize shaders");
        return;
    }

    // Get the location of the position attribute
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0) {
        console.error("Failed to get location of a_Position");
        return;
    }
    
    //Create a vetex buffer
    const g_vertexBuffer = gl.createBuffer();
    if (!g_vertexBuffer) {
        console.error("Failed to create vertex buffer.")
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBuffer);

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    /** @type {Point[]} */
    var g_points = [];
    canvas.addEventListener("click", function canvasClickHandler(e) {
        const rect = e.target.getBoundingClientRect();

        const x = ((e.clientX - rect.left) - canvas.height/2)/(canvas.height/2);
        const y = (canvas.width/2 - (e.clientY - rect.top))/(canvas.width/2);
        console.log("Click: x: " + x + " y: " + y);

        g_points.push({"x": x, "y": y});

        gl.clear(gl.COLOR_BUFFER_BIT);

        const verts = new Float32Array(g_points.map((v, i, a) => [v.x, v.y]).reduce((acc, cv, ci, a) => acc.concat(cv)));
        gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

        gl.drawArrays(gl.POINTS, 0, g_points.length);
        gl.drawArrays(gl.LINE_STRIP, 0, g_points.length);
    });

    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    return {
        canvas: canvas,
        gl: gl
    };
}

/**
 * Main program
 * @param {Setup~Context} context 
 */
function main(context) {
    if (!context) {
        console.error("[Main] Recieved no context, exiting.");
        return;
    }
}