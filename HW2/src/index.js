import {GLProgram, createOpenGlContext} from "./modules/GLProgram";
import {Point, Triangle, Quad, ZERO, Circle, Cylinder} from "./modules/Geometry";

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

    const c = new Cylinder(0.5, 12);
    const n = c.toGeometry();

    prog.writeToVertexBuffer(n.verticies);
    prog.writeToIndexBuffer(n.indices);

    context.clearColor(0.0, 0.0, 0.0, 1.0);
    context.clear(context.COLOR_BUFFER_BIT);

    context.drawElements(context.LINE_STRIP, n.verticies.length, context.UNSIGNED_SHORT, 0);
}

GLProgram.fromUrls(context, glProgramConfig)
         .then(onLoad)
         .catch(function errorHandler(e) {
                    alert(e);
                    throw e;
                });