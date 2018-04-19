"use strict";

class GLProgram {
    /**
     * Constructs a GLProgram from the given parameters
     * @param {String|Element} canvas 
     * @param {String} vertexShader 
     * @param {String} fragmentShader 
     */
    constructor(canvas, vertexShader, fragmentShader) {
        /** @type {Element} canvas */
        if(typeof canvas === "string") {
            this.canvas = document.querySelector(canvas);
        } else {
            this.canvas = canvas;
        }

        /** @type {WebGLRenderingContext} context */
        this.context = this.canvas.getContext("webgl");
        if(!this.context) {
            throw "Unable to initialize webgl.";
        }

        // Compile the shaders
        this.vertexShader = this._compileShader(this.context.VERTEX_SHADER, vertexShader);
        this.fragmentShader = this._compileShader(this.context.FRAGMENT_SHADER, fragmentShader);

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
        if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw "Failed to link program";
        }
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
     * Builds a GLProgram from shaders loaded through the web. The resulting GLProgram is returned as promise.
     * 
     * @param {HTMLCanvasElement} canvas 
     * @param {String} vertexShaderUrl 
     * @param {String} fragmentShaderUrl 
     * 
     * @returns {Promise}
     */
    static fromUrls(canvas, vertexShaderUrl, fragmentShaderUrl) {
        return Promise.all(fetch(vertexShaderUrl), fetch(fragmentShaderUrl))
                      .then(values => new GLProgram(canvas, values[0], values[1]));
    }
}