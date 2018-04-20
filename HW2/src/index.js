"use strict";
import {GLProgram} from "./modules/GLProgram";

GLProgram.fromUrls("#canvas", "shaders/vert.glsl", "shaders/frag.glsl")
    .then(function(prog) {
        prog.setClearColor(0.0, 0.0, 0.0, 1.0);
    });