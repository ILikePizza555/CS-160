import {GLProgram} from "./modules/GLProgram";

import vertexShader from "./shaders/vert.glsl";
import fragShader from "./shaders/frag.glsl";

GLProgram.fromUrls("#canvas", vertexShader, fragShader)
    .then(function(prog) {
        "use strict";
        prog.setClearColor(0.0, 0.0, 0.0, 1.0);
    });