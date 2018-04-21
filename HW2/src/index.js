import {GLProgram, createOpenGlContext} from "./modules/GLProgram";

import vertexShader from "./shaders/vert.glsl";
import fragShader from "./shaders/frag.glsl";

const context = createOpenGlContext("#canvas");

GLProgram.fromUrls(context, vertexShader, fragShader)
    .then(function(prog) {
        "use strict";
        context.clearColor(0.0, 0.0, 0.0, 1.0);
        context.clear(context.COLOR_BUFFER_BIT);
    });