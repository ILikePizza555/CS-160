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
    }
}
/**
 * @param {GLProgram} prog 
 */
function onLoad(prog) {
    "use strict";
    prog.setProgram();
    prog.writePointsToVertexBuffer([new Point(-0.1, 0), new Point(0.1, 0), new Point(0, 0.1)]);

    context.clearColor(0.0, 0.0, 0.0, 1.0);
    context.clear(context.COLOR_BUFFER_BIT);

    context.drawArrays(context.POINTS, 0, 3);
}

GLProgram.fromUrls(context, glProgramConfig).then(onLoad).catch(r => alert(r));