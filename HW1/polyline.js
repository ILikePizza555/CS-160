main(setup());

function setup() {
    const canvas = document.querySelector("#canvas");
    const gl = canvas.getContext("webgl");

    if(!gl) {
        console.error("[Setup] Unable to initialize WebGL.");
        alert("Unable to initialize WebGL.");
        return;
    }

    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    return {
        canvas: canvas,
        gl: gl
    }
}

function main(context) {
    if (!context) {
        console.error("[Main] Recieved no context, exiting.")
        return
    }
}