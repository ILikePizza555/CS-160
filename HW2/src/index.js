import {GLProgram, createOpenGlContext} from "./modules/GLProgram";
import {Point, Triangle, Quad, ZERO} from "./modules/Geometry";

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

    const cube = [
        Quad.newXYQuad(ZERO, 0.2, 0.2),
        Quad.newXZQuad(new Point(0.1, -0.1, 0.1), 0.2, 0.2),
        Quad.newXZQuad(new Point(0.1, 0.1, 0.1), 0.2, 0.2)
    ];

    const n = cube.map(v => v.toGeometry()).reduce(function(a, c) {
        c.indices.map(v => v + a.verticies.length - 1);
        return {
            verticies: a.verticies.concat(c.verticies),
            indices: a.indices.concat(c.indices)
        };
    });

    prog.writeToVertexBuffer(n.verticies);
    prog.writeToIndexBuffer(n.indices);

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