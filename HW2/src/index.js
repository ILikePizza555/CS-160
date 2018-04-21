import {GLProgram, createOpenGlContext} from "./modules/GLProgram";
import {Point, Triangle, Quad} from "./modules/Geometry";

import vertexShader from "./shaders/vert.glsl";
import fragShader from "./shaders/frag.glsl";

const context = createOpenGlContext("#canvas");

const glProgramConfig = {
    "vertexShaderUrl": vertexShader,
    "fragmentShaderUrl": fragShader,
    "attributes": ["a_Position"],
    "uniforms": [],
    "vertexBuffer": {
        "size": 3,
        "name": "a_Position"
    },
    "vbo": true
};

/**
 * @param {GLProgram} prog 
 */
function onLoad(prog) {
    "use strict";
    prog.setProgram();

    const quad = new Quad({center: new Point(0, 0), width: 0.2, height: 0.2});
    const n = quad.numerize();

    prog.writePointsToVertexBuffer(n.verticies);
    prog.writeToIndexBuffer(new Uint16Array(n.indices));

    context.clearColor(0.0, 0.0, 0.0, 1.0);
    context.clear(context.COLOR_BUFFER_BIT);

    context.drawElements(context.LINE_STRIP, 6, context.UNSIGNED_SHORT, 0);
}

GLProgram.fromUrls(context, glProgramConfig)
         .then(onLoad)
         .catch(function errorHandler(e) {
                    alert(e);
                    throw e;
                });