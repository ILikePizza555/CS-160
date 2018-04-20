"use strict";

class GLProgram {
    /**
     * Constructs a GLProgram from the given parameters
     * @param {String|HTMLCanvasElement} canvas 
     * @param {String} vertexShader 
     * @param {String} fragmentShader 
     * @param {String[]} attribs Names of the attributes
     * @param {String[]} uniforms Names of the uniforms
     */
    constructor(canvas, vertexShader, fragmentShader, attribs = [], uniforms = []) {
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
        if(!this.context.getProgramParameter(this.glProg, this.context.LINK_STATUS)) {
            throw "Failed to link program";
        }

        // Load the attributes
        this._attributeLocations = {};
        for(let a of attribs) {
            this._attributeLocations[a] = this.context.getAttribLocation(this.glProg, a);
        }

        // Load the uniforms
        this._uniformLocations = {};
        for(let u of uniforms) {
            this._uniformLocations[u] = this.context.getUniformLocation(this.glProg, u);
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
     * Sets the clear color of the canvas
     * @param {Number[]} color 
     */
    setClearColor(...color) {
        this.context.clearColor(...color);
    }

    /**
     * Clears the canvas
     */
    clear() {
        this.context.clear();
    }

    /**
     * Builds a GLProgram from shaders loaded through the web. The resulting GLProgram is returned as promise.
     * 
     * @param {String|HTMLCanvasElement} canvas 
     * @param {String} vertexShaderUrl 
     * @param {String} fragmentShaderUrl 
     * 
     * @returns {Promise}
     */
    static fromUrls(canvas, vertexShaderUrl, fragmentShaderUrl, ...args) {
        return Promise.all(fetch(vertexShaderUrl), fetch(fragmentShaderUrl))
                      .then(values => new GLProgram(canvas, values[0], values[1], ...args));
    }
}