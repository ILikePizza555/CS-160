import {GLProgram, Point, createOpenGlContext} from "./modules/GLProgram";

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
    "indexBuffer": true
};

/**
 * @param {GLProgram} prog 
 */
function onLoad(prog) {
    "use strict";
    prog.setProgram();
    prog.writePointsToVertexBuffer([
        new Point(-0.1, -0.1), //Bottom-left
        new Point(-0.1, 0.1),  //Top-left
        new Point(0.1, 0.1),   //Top-right
        new Point(0.1, -0.1)   //Bottom-right
    ]);

    prog.writeToIndexBuffer(new Uint16Array([
        0, 1, 2,
        0, 3, 2
    ]));

    context.clearColor(0.0, 0.0, 0.0, 1.0);
    context.clear(context.COLOR_BUFFER_BIT);

    context.drawElements(context.LINE_STRIP, 6, context.UNSIGNED_SHORT, 0);
}

GLProgram.fromUrls(context, glProgramConfig).then(onLoad).catch(r => alert(r));