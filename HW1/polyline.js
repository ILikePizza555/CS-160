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

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0) {
        console.error("Failed to get location of a_Position");
        return;
    }
    gl.vertexAttrib3f(a_Position, 0.0, 0.5, 0.0);

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

    context.gl.drawArrays(context.gl.POINTS, 0, 1);
}