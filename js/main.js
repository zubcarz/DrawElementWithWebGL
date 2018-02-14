"use strict";

var gl;

var cubeRotation = 0.0;
var scale = 0.25;
var isMouseDown = false;
var xPosition = 0.0;
var yPosition = 0.0;

var zPosition = 6;
var angleView = 45;


//UI
var xLabel = document.getElementById("x_position");
var yLabel = document.getElementById("y_position");
var xNode = document.createTextNode("");
var yNode = document.createTextNode("");
xLabel.appendChild(xNode);
yLabel.appendChild(yNode);

var widthLabel = document.getElementById("width_canvas");
var heightLabel = document.getElementById("height_canvas");
var widthLabelNode = document.createTextNode("");
var heightLabelNode = document.createTextNode("");
widthLabel.appendChild(widthLabelNode);
heightLabel.appendChild(heightLabelNode);

var zLabel = document.getElementById("z_position");
var fieldOfViewLabel = document.getElementById("field_of_view");
var zLabelNode = document.createTextNode("");
var fieldOfViewLabelNode = document.createTextNode("");
zLabel.appendChild(zLabelNode);
fieldOfViewLabel.appendChild(fieldOfViewLabelNode);


var zSlider = document.getElementById("z_range");
var fSlider = document.getElementById("f_range");

const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec4 vColor;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

const fsSource = `
 varying lowp vec4 vColor;
    void main() {
        gl_FragColor = vColor;
    }
  `;

//Start Shaders
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}

// creates a shader of the given type, uploads the source and
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

//Obtener eh inicializar el contexto
function initWebGL(canvas) {
    gl = null;
    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch(e) {}
    if (!gl) {
        alert("Imposible inicializar WebGL. Tu navegador puede no soportarlo.");
        gl = null;
    }
    return gl;
}

function initBuffers(gl) {

    // Create a buffer for the cube's vertex positions.
    const positionBuffer = gl.createBuffer();
    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Now create an array of positions for the cube.

    var positions  = [

        ///// Top Pyramid //////
        // Front face
        -0.5, 0.5,  0.5,
        0.5, 0.5,  0.5,
        1.0,  1.5,  1.0,
        -1.0,  1.5,  1.0,

        // Back face
        -0.5, 0.5, -0.5,
        -1.0,  1.5, -1.0,
        1.0,  1.5, -1.0,
        0.5, 0.5, -0.5,

        //Top pyramid
        -1.0,  1.5, -1.0,
        -1.0,  1.5,  1.0,
        1.0,  1.5,  1.0,
        1.0,  1.5, -1.0,

        // Bottom face
        -1.0, -1.5, -1.0,
        1.0, -1.5, -1.0,
        1.0, -1.5,  1.0,
        -1.0, -1.5,  1.0,

        // Right face
        0.5, 0.5, -0.5,
        1.0,  1.5, -1.0,
        1.0,  1.5,  1.0,
        0.5, 0.5,  0.5,

        // Left face
        -0.5, 0.5, -0.5,
        -0.5, 0.5,  0.5,
        -1.0,  1.5,  1.0,
        -1.0,  1.5, -1.0,

        ////// Cube ////////

        // Front face
        -0.5, -0.5,  0.5, //24
        0.5, -0.5,  0.5, //25
        0.5,  0.5,  0.5, //26
        -0.5,  0.5,  0.5, //27

        // Back face
        -0.5, -0.5, -0.5,
        -0.5,  0.5, -0.5,
        0.5,  0.5, -0.5,
        0.5, -0.5, -0.5,

        // Right face
        0.5, -0.5, -0.5,
        0.5,  0.5, -0.5,
        0.5,  0.5,  0.5,
        0.5, -0.5,  0.5,

        // Left face
        -0.5, -0.5, -0.5,
        -0.5, -0.5,  0.5,
        -0.5,  0.5,  0.5,
        -0.5,  0.5, -0.5,

        ///// Down Pyramid //////
        // Front
        -1.0, -1.5,  1.0,
        1.0, -1.5,  1.0,
        0.5,  -0.5,  0.5,
        -0.5, -0.5,  0.5,

        // Back
        -1.0, -1.5, -1.0,
        -0.5,  -0.5, -0.5,
        0.5,  -0.5, -0.5,
        1.0, -1.5, -1.0,

        // Right face
        1.0, -1.5, -1.0,
        0.5,  -0.5, -0.5,
        0.5,  -0.5,  0.5,
        1.0, -1.5,  1.0,

        // Left face
        -1.0, -1.5, -1.0,
        -1.0, -1.5,  1.0,
        -0.5,  -0.5,  0.5,
        -0.5,  -0.5, -0.5

    ];

    positions = scaleArray(positions, scale);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const faceColors = [
        // Pyramid Color
        [123/255,  156/255,  187/255,  1.0],    // Front face: white
        [61/255,  87/255,  111/255,  1.0],    // Back face: red
        [0.0,  0.0,  0.0,  1.0],    // Top face: green
        [0.0,  0.0,  0.0,  1.0],    // Bottom face: blue
        [187/255,  142/255,  66/255,  1.0],    // Right face: yellow
        [111/255,  92/255,  61/255,  1.0],    // Left face: purple
        // Cube Color
        [111/255,  92/255,  61/255,  1.0],   // Front face
        [187/255,  142/255,  66/255,  1.0],  // Back face
        [123/255,  156/255,  187/255,  1.0],   // Right face
        [61/255,  87/255,  111/255,  1.0],  // Left  face
        // Pyramid Color
        [61/255,  87/255,  111/255,  1.0],  // Front face
        [123/255,  156/255,  187/255,  1.0],   // Back face
        [111/255,  92/255,  61/255,  1.0],   // Right face
        [123/255,  156/255,  187/255,  1.0],  // Left  face
    ];

    // Convert the array of colors into a table for all the vertices.

    var colors = [];

    for (var j = 0; j < faceColors.length; ++j) {
        const c = faceColors[j];

        // Repeat each color four times for the four vertices of the face
        colors = colors.concat(c, c, c, c);
    }

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);


    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

// Este arrelgo define cada cara como 2 triángulos utilizando
// los índices dentro de cada arreglo de vértices
// para especificar cada posición en los tríangulos.

    var indices  = [
        // Pyramid UP
        0,  1,  2,      0,  2,  3,    // Front
        4,  5,  6,      4,  6,  7,    // Back
        16, 17, 18,     16, 18, 19,   // Right
        20, 21, 22,     20, 22, 23,    // left
        // Cube
        24, 25, 26,     24, 26, 27,     //  Front
        28, 29, 30,     28, 30, 31,     //  Back
        32, 33, 34,     32, 34, 35,     // Right
        36, 37, 38,     36, 38, 39,      // Left
        // Pyramid Down
        40, 41, 42,     40, 42, 43,     //  Front
        44, 45, 46,     44, 46, 47,     //  Back
        48, 49, 50,     48, 50, 51,     // Right
        52, 53, 54,     52, 54, 55,     // Left
        // Top and Button
        8,  9,  10,     8,  10, 11,   // Up
        12, 13, 14,     12, 14, 15,   // Down

    ];

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices ), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        color: colorBuffer,
        indices: indexBuffer
    };
}

function drawScene(gl, programInfo, buffers, deltaTime) {

    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create a perspective matrix, a special matrix .
    const fieldOfView = angleView * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();

    // start drawing the square.
    mat4.translate(modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        [xPosition,yPosition, -zPosition]);  // amount to translate

    mat4.rotate(modelViewMatrix,  // destination matrix
        modelViewMatrix,  // matrix to rotate
        cubeRotation,   // amount to rotate in radians
        [0, 0, -1]);       // axis to rotate around

    mat4.rotate(modelViewMatrix,  // destination matrix
        modelViewMatrix,  // matrix to rotate
        cubeRotation * .7,// amount to rotate in radians
        [0, 1, 0]);       // axis to rotate around (X)


    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
        const numComponents = 3;  // pull out 2 values per iteration
        const type = gl.FLOAT;    // the data in the buffer is 32bit floats
        const normalize = false;  // don't normalize
        const stride = 0;         // how many bytes to get from one set of values to the next
                                  // 0 = use type and numComponents above
        const offset = 0;         // how many bytes inside the buffer to start from
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition);
    }

    // into the vertexColor attribute.
    {
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexColor);
    }

    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);

    // Set the shader uniforms
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);
    {
        const vertexCount = 84;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

    cubeRotation += deltaTime;

}

function start() {
    var canvas = document.getElementById("canvas");

    //Canvas events
    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;

    gl = initWebGL(canvas);
    if (gl) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Establecer el color base en negro, totalmente opaco
        gl.enable(gl.DEPTH_TEST);                               // Habilitar prueba de profundidad
        gl.depthFunc(gl.LEQUAL);                                // Objetos cercanos opacan objetos lejanos
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // Limpiar el buffer de color asi como el de profundidad
    }

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    // Info to ShaderProgram
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
    };

    // objects we'll be drawing.
    const buffers = initBuffers(gl);

    // Draw the scene
    var then = 0;

    //put labels in UI
    zLabelNode.nodeValue = zPosition.toFixed(2);
    fieldOfViewLabelNode.nodeValue = angleView.toFixed(2);

    // Draw the scene repeatedly
    function render(now) {
        now *= 0.001;  // convert to seconds
        resize(gl);
        updateCanvasSize();
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const deltaTime = now - then;
        then = now;

        drawScene(gl, programInfo, buffers, deltaTime);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function scaleArray(array, scale){
    var count = 0;
    array.forEach(function(element) {
        array[count] = element * scale;
        count++;
    });
    return array;
}

function handleMouseDown(event) {
    isMouseDown = true;
}

function handleMouseUp(event) {
    isMouseDown = false;
}

function handleMouseMove(event) {
    if (!isMouseDown ) {
        return;
    }
    translateElement(event.clientX, event.clientY);

}

function resize(gl) {

    var realToCSSPixels = window.devicePixelRatio;
    var displayWidth  = Math.floor(gl.canvas.clientWidth  * realToCSSPixels);
    var displayHeight = Math.floor(gl.canvas.clientHeight * realToCSSPixels);

    // Check if the canvas is not the same size.
    if (gl.canvas.width  !== displayWidth ||
        gl.canvas.height !== displayHeight) {

        // Make the canvas the same size
        gl.canvas.width  = displayWidth;
        gl.canvas.height = displayHeight;

        // Center translate
        translateElement(gl.canvas.width / 2, gl.canvas.height / 2);
    }
}

function translateElement(posX, posY ) {

    if( (posX > 0  && posX < gl.canvas.width) && (posY>0  && posY  < gl.canvas.height)){

        var correctionY = zPosition * Math.tan(angleView/2 * Math.PI/180);

        xPosition =  (2  * (posX / gl.canvas.width ) - 1)  * 3.9;
        yPosition =   (2 * (-posY / gl.canvas.height) + 1) * correctionY;

        xNode.nodeValue = xPosition.toFixed(2);
        yNode.nodeValue = yPosition.toFixed(2);
    }
}

function updateCanvasSize() {
    heightLabelNode.nodeValue = gl.canvas.height.toFixed(2);
    widthLabelNode.nodeValue = gl.canvas.width.toFixed(2);
}

fSlider.oninput = function() {
    angleView = this.value;
    fieldOfViewLabelNode.nodeValue = this.value;
    translateElement(gl.canvas.width / 2, gl.canvas.height / 2);
}

zSlider.oninput = function() {
    zPosition = this.value;
    zLabelNode.nodeValue = this.value;
    translateElement(gl.canvas.width / 2, gl.canvas.height / 2);
}

//Program
start();
