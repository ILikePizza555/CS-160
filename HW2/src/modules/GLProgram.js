"use strict";

import {Point, Triangle} from "./Geometry";

/**
 * Creates a WebGL context from the HTML5 canvas.
 * 
 * @param {String|HTMLCanvasElement} canvas
 * @return {WebGLRenderingContext}
 */
export function createOpenGlContext(canvas) {
    if(typeof canvas === "string") {
        canvas = document.querySelector(canvas);
    }

    const context = canvas.getContext("webgl");
    if(!context) {
        throw "Unable to initialize webgl.";
    }
    return context;
}

/**
* @typedef {Object} VertexBufferConfig
* @prop {String} name
* @prop {Number} size
*/

/**
* @typedef {Object} GLProgramConfig
* @prop {String} vertexShader A string containing the vertex shader this program should use
* @prop {String} fragmentShader A string containing the fragment shader this program will use
* @prop {String[]} [attributes] An array of strings containing the names of attributes this program will use
* @prop {String[]} [uniforms] An array of strings containing the names of uniforns this program will use
* @prop {VertexBufferConfig} [vertexBuffer]
* @prop {Boolean} indexBuffer
*/

/**
 * @typedef {GLProgramConfig} UrlGLProgramConfig
 * @prop {String} vertexShaderUrl
 * @prop {String} fragmentShaderUrl
 */

export class GLProgram {
    /**
     * Constructs a GLProgram from the given parameters
     * @param {WebGLRenderingContext} context 
     * @param {GLProgramConfig} config
     */
    constructor(context, config) {
        this.context = context;

        // Compile the shaders
        this.vertexShader = this._compileShader(this.context.VERTEX_SHADER, config.vertexShader);
        this.fragmentShader = this._compileShader(this.context.FRAGMENT_SHADER, config.fragmentShader);

        // Create the webgl program (State)
        /** @type {WebGLProgram} glProg */
        this.glProg = this.context.createProgram();
        if(!this.glProg) {
            throw "Error creating a WebGLProgram";
        }

        // Attach the shaders
        this.context.attachShader(this.glProg, this.vertexShader);
        this.context.attachShader(this.glProg, this.fragmentShader);

        // Link the program
        this.context.linkProgram(this.glProg);
        if(!this.context.getProgramParameter(this.glProg, this.context.LINK_STATUS)) {
            throw "Failed to link program";
        }

        if(config.attributes) {
            // Load the attributes
            this._attributeLocations = {};
            for(let a of config.attributes) {
                this._attributeLocations[a] = this.context.getAttribLocation(this.glProg, a);
            }
        }

        if(config.uniforms) {
            // Load the uniforms
            this._uniformLocations = {};
            for(let u of config.uniforms) {
                this._uniformLocations[u] = this.context.getUniformLocation(this.glProg, u);
            }
        }

        if(config.vertexBuffer) {
            if(typeof config.vertexBuffer !== "object") {
                throw new TypeError("Parameter `vertexBuffer` must be an object!");
            }

            if(this._attributeLocations === undefined || this._attributeLocations[config.vertexBuffer.name] === undefined) {
                throw new TypeError("Attribute for vertex buffer must be defined in `attributes`.");
            }

            this._vertexBuffer = this.context.createBuffer();
            if(!this._vertexBuffer) {
                throw "Failed to create vertex buffer";
            }

            // Get the attribute index
            const bufferAttribute = this._attributeLocations[config.vertexBuffer.attributeName];

            // Configure the attribute to the vertex buffer
            this.context.bindBuffer(this.context.ARRAY_BUFFER, this._vertexBuffer);
            this.context.vertexAttribPointer(bufferAttribute, config.vertexBuffer.size, this.context.FLOAT, false, 0, 0);
            this.context.enableVertexAttribArray(bufferAttribute);
        }

        if(config.vbo) {
            this._indexBuffer = this.context.createBuffer();
            if(!this._indexBuffer) {
                throw "Failed to create vertex buffer";
            }

            this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        }

        console.log("Successfully created GLProgram");
    }

    /**
     * Compiles a shader
     * @param {Number} type 
     * @param {String} source 
     * 
     * @returns {WebGLShader}
     */
    _compileShader(type, source) {
        const shader = this.context.createShader(type);
        if (!shader) {
            throw "Unable to create shader.";
        }

        this.context.shaderSource(shader, source);
        this.context.compileShader(shader);

        if(!this.context.getShaderParameter(shader, this.context.COMPILE_STATUS)) {
            throw "Unable to compile shader: " + this.context.getShaderInfoLog(shader);
        }

        return shader;
    }

    /**
     * Writes the points to the vertex buffer. Throws an exception if there is no vertex buffer.
     * @param {Point[]} points 
     */
    writePointsToVertexBuffer(points) {
        if(!this._vertexBuffer) {
            throw TypeError("No vertex buffer has been defined.");
        }

        this.context.bufferData(this.context.ARRAY_BUFFER,
                                new Float32Array(points.map(p => p.toArray()).reduce((a, c) => a.concat(c))),
                                this.context.STATIC_DRAW);
    }

    /**
     * Writes to the index buffer. Throws an exception if there is no index buffer.
     * @param {Uint16Array} indices 
     */
    writeToIndexBuffer(indices) {
        if(!this._indexBuffer) {
            throw TypeError("No index buffer has been defined");
        }

        this.context.bufferData(this.context.ELEMENT_ARRAY_BUFFER, indices, this.context.STATIC_DRAW);
    }

    setProgram() {
        this.context.useProgram(this.glProg);
    }

    /**
     * Builds a GLProgram from shaders loaded through a url. The configuration is exactly the same,
     * except the values for the shaders are replaced with URLs. The URLs will then resolve and a
     * promise will be returned.
     * 
     * @param {WebGLRenderingContext} context
     * @param {GLProgramConfig} config
     * 
     * @returns {Promise}
     */
    static fromUrls(context, config) {
        return Promise.all([fetch(config.vertexShaderUrl), fetch(config.fragmentShaderUrl)])
            .then(function verifyFetch([vertexResponse, fragmentResponse]) {
                if(!vertexResponse.ok) {
                    throw Error("fetch returned " + vertexResponse.status + " for " + config.vertexShaderUrl);
                }

                if(!fragmentResponse.ok) {
                    throw Error("fetch returned " + fragmentResponse.status + " for " + config.fragmentShaderUrl);
                }

                return Promise.all([vertexResponse.text(), fragmentResponse.text()]);
            })
            .then(function([vertexShaderText, fragmentShaderText]) {
                /** @type {GLProgramConfig} config */
                const newConfig = config;
                newConfig.vertexShader = vertexShaderText;
                newConfig.fragmentShader = fragmentShaderText;

                return new GLProgram(context, newConfig);
            });
    }
}