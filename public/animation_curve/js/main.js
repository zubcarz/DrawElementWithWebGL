"use strict";

var gl;
var dContext;
var options = {
    valueNames: [ 'PointName', 'xCoordinate', 'yCoordinate' ]
};

var pointList = new List('points', options);
var maxPoints = 13;
var timeAnimation = 0.1;// seconds
var isPlayAnimation = false;
var currentSegment = 0;
var currentParameter = 0;
var segments;
var deltaTimeAnimation;
var elapseTime = 0;

var cubeRotation = 0.0;
var scale = 0.25;
var isMouseDown = false;
var pointSize = 2;

var xPosition = 0.0;
var yPosition = 0.0;
var zPosition = 6;
var angleView = 45;
var bezierParameter = 0.0;
var bezierPointsAnimation = 10;
var referencesPoints  = [];

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
var bezierLabel = document.getElementById("bezier_point");
var timeAnimationLabel = document.getElementById("time_animation");
var bezierPointsLabel = document.getElementById("bezier_points_animation");

var zLabelNode = document.createTextNode("");
var fieldOfViewLabelNode = document.createTextNode("");
var bezierLabelNode = document.createTextNode("");
var timeAnimationNode = document.createTextNode("");
var bezierPointsNode = document.createTextNode("");

zLabel.appendChild(zLabelNode);
fieldOfViewLabel.appendChild(fieldOfViewLabelNode);
bezierLabel.appendChild(bezierLabelNode);
timeAnimationLabel.appendChild(timeAnimationNode);
bezierPointsLabel.appendChild(bezierPointsNode);

var zSlider = document.getElementById("z_range");
var fSlider = document.getElementById("f_range");
var bezierSlider = document.getElementById("bezier_range");
var timeSlider = document.getElementById("time_animation_range");
var bezierPointsSlider = document.getElementById("bezier_points_range");

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
        dContext = document.getElementById("canvas2D").getContext("2d");
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

    //
    if (isPlayAnimation){
        if(elapseTime > deltaTimeAnimation) {
            if (currentParameter > 0 && currentParameter < 1 && !isNaN(currentParameter) && currentParameter != null) {
                var vectorList = [referencesPoints[3 * currentSegment], referencesPoints[1 + (3 * currentSegment)], referencesPoints[2 + (3 * currentSegment)], referencesPoints[3 + (3 * currentSegment)]];
                if (vectorList[0] != null && vectorList[1] != null && vectorList[2] != null && vectorList[3] != null) {
                    var bezierPoint = getBezierCube(vectorList, currentParameter);
                    xPosition = bezierPoint[0];
                    yPosition = bezierPoint[1];
                }
            }
            currentParameter += 1/bezierPointsAnimation;

            if (currentParameter > 1) {
                currentParameter = 0;
                currentSegment += 1;
            }

            if (currentSegment >= segments) {
              stopAnimation();
            }
            elapseTime = 0;
        }else {
            elapseTime += deltaTime;
        }
    }

}

function start() {
    var canvas = document.getElementById("canvas");
    var canvas2D = document.getElementById("canvas2D");

    //Canvas events
    canvas2D.onmousedown = handleMouseDown;
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
    bezierLabelNode.nodeValue = bezierParameter.toFixed(2);
    timeAnimationNode.nodeValue = timeAnimation + "(s)";
    bezierPointsNode.nodeValue = bezierPointsAnimation;

    // Draw the scene repeatedly
    function render(now) {
        now *= 0.001;  // convert to seconds
        resize(gl);
        resize(dContext);
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
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    AddPoint(x, y);
}

function handleMouseUp(event) {
    isMouseDown = false;
}

function handleMouseMove(event) {
    if (!isMouseDown ) {
        return;
    }
    var wordPosition = canvasToWord(event.clientX, event.clientY);
    xNode.nodeValue = wordPosition.x.toFixed(2);
    yNode.nodeValue = wordPosition.y.toFixed(2);
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
        var wordPosition = canvasToWord(gl.canvas.width / 2, gl.canvas.height / 2);
        xNode.nodeValue = wordPosition.x.toFixed(2);
        yNode.nodeValue = wordPosition.y.toFixed(2);

    }
}

function canvasToWord(posX, posY ) {

    if( (posX > 0  && posX < gl.canvas.width) && (posY>0  && posY  < gl.canvas.height)){

        var correctionY = zPosition * Math.tan(angleView/2 * Math.PI/180);
        var correctionX = gl.canvas.width * correctionY / gl.canvas.height;

        var newXPosition =  (2  * (posX / gl.canvas.width ) - 1)  * correctionX;
        var newYPosition =  (2 * (-posY / gl.canvas.height) + 1) * correctionY;

        var result = {
            x : newXPosition,
            y : newYPosition
        };

        return result;
    }
}

function clearPoints(isReset) {
    dContext.clearRect(0, 0, canvas.width, canvas.height);
    pointList.remove();
    if(isReset) {
        referencesPoints = [];
    }
}

function AddPoint(x,y){
    var wordPosition = canvasToWord(x,y);
    if(x != null && y != null && wordPosition.x != null && wordPosition.y != null) {
        if (referencesPoints.length < maxPoints) {
            referencesPoints.push([x, y, wordPosition.x, wordPosition.y]);
            drawPoint(x, y);
            pointList.add({
                PointName:  "Point " + referencesPoints.length ,
                xCoordinate: wordPosition.x.toFixed(2),
                yCoordinate: wordPosition.y.toFixed(2)
            });
        } else {
            referencesPoints.shift();
            clearPoints(false);
            referencesPoints.push([x, y, wordPosition.x, wordPosition.y]);
            for (var i = 0; i < referencesPoints.length; i++) {
                drawPoint(referencesPoints[i][0], referencesPoints[i][1]);
                pointList.add({
                    PointName:  "Point " + i ,
                    xCoordinate: referencesPoints[i][2].toFixed(2),
                    yCoordinate: referencesPoints[i][3].toFixed(2)
                });
            }
        }
    }
}

function drawLines(){
    if(referencesPoints.length > 2) {
        for (var i = 0; i < referencesPoints.length -1 ; i++) {
            dContext.beginPath();
            dContext.strokeStyle="#234E61";
            dContext.moveTo(referencesPoints[i][0], referencesPoints[i][1]);
            dContext.lineTo(referencesPoints[i + 1][0], referencesPoints[i + 1][1]);
            dContext.stroke();
        }
    }
}

function drawPoint(x,y){
    segments = getCountSegment();
    dContext.fillStyle = "#d3d3d3";
    dContext.beginPath();
    dContext.arc(x, y, pointSize, 0, Math.PI * 2, true);
    dContext.fill();
}

//parameter between 0 and 1
function playAnimation() {
    if(referencesPoints.length >= 4 && isPlayAnimation == false){
        console.log("start animation");
        var pointsTransition = segments * bezierPointsAnimation;
        deltaTimeAnimation = timeAnimation / pointsTransition;
        isPlayAnimation = true;
    }
}

function stopAnimation(){
    currentSegment = 0;
    currentParameter = 0;
    isPlayAnimation = false;
    console.log("end Animation");
}

function getBezierCube(vectorList , parameter){
        var ax, bx, cx;
        var ay, by, cy;
        var parameterSquared, parameterCubed;
        var result = [0, 0];

        /* calculate the curve point at parameter value t */
        parameterSquared = parameter * parameter;
        parameterCubed = parameterSquared * parameter;

        /* cálculo de los coeficientes polinomiales */
        cx = 3.0 * (vectorList[1][2] - vectorList[0][2]);
        bx = 3.0 * (vectorList[2][2] - vectorList[1][2]) - cx;
        ax = vectorList[3][2] - vectorList[0][2] - cx - bx;

        cy = 3.0 * (vectorList[1][3] - vectorList[0][3]);
        by = 3.0 * (vectorList[2][3] - vectorList[1][3]) - cy;
        ay = vectorList[3][3] - vectorList[0][3] - cy - by;

        result[0] = (ax * parameterCubed) + (bx * parameterSquared) + (cx * parameter) + vectorList[0][2];
        result[1] = (ay * parameterCubed) + (by * parameterSquared) + (cy * parameter) + vectorList[0][3];
        return result;
}

function updateCanvasSize() {
    heightLabelNode.nodeValue = gl.canvas.height.toFixed(2);
    widthLabelNode.nodeValue = gl.canvas.width.toFixed(2);
};

fSlider.oninput = function() {
    angleView = this.value;
    fieldOfViewLabelNode.nodeValue = this.value;
    var wordPosition = canvasToWord(gl.canvas.width / 2, gl.canvas.height / 2);
    xNode.nodeValue = wordPosition.x.toFixed(2);
    yNode.nodeValue = wordPosition.y.toFixed(2);
};

zSlider.oninput = function() {
    zPosition = this.value;
    zLabelNode.nodeValue = this.value;
    var wordPosition = canvasToWord(gl.canvas.width / 2, gl.canvas.height / 2);
    xNode.nodeValue = wordPosition.x.toFixed(2);
    yNode.nodeValue = wordPosition.y.toFixed(2);
};

function getCountSegment(){
    var segments;
    if( referencesPoints.length <= 4){
        segments = 1;
    }else{
        segments =Math.floor( (referencesPoints.length - 4) /3) + 1;
    }
    return segments;
}

bezierSlider.oninput = function() {
    if(segments >= 1) {
    var currentSegment = 0;

        for (var i = 0; i < segments; i++) {
            var start = bezierSlider.max / segments * [i];
            var end = bezierSlider.max / segments +  bezierSlider.max / segments * [i];
            console.log("start - > " + start);

            var m = 1 / (end - start);
            var b = (1 / 2) - (m * (end + start) / 2);
            bezierParameter = m * this.value + b;
            if(this.value > start && this.value < end) {
                currentSegment = i;
                break;
            }
        }

        if (bezierParameter > 0 && bezierParameter < 1 && !isNaN(bezierParameter) && bezierParameter != null) {
            var vectorList = [referencesPoints[3 * currentSegment], referencesPoints[1 + (3 * currentSegment)], referencesPoints[2 + (3 * currentSegment)], referencesPoints[3 + (3 * currentSegment)]];
            var bezierPoint = getBezierCube(vectorList, bezierParameter);
            xPosition = bezierPoint[0];
            yPosition = bezierPoint[1];
        }

    }else{
        bezierParameter = this.value/100;
    }
    bezierLabelNode.nodeValue = bezierParameter.toFixed(2);
    console.log(bezierParameter);


};

timeSlider.oninput = function() {
    timeAnimation = this.value * 0.599 + 0.1    ;
    timeAnimationNode.nodeValue = timeAnimation.toFixed(2) + "(s)";
};

bezierPointsSlider.oninput = function() {
    bezierPointsAnimation = this.value ;
    bezierPointsNode.nodeValue = bezierPointsAnimation;
};


//Program
start();
