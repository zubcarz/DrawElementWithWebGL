"use strict";

const red = [245/255, 153/255, 132/255, 1];
const blue = [125/255, 149/255, 179/255, 1];
const purple = [84/255, 64/255, 128/255, 1];
const yellow = [245/255, 233/255, 112/255, 1];
const green = [7/255, 140/255, 78/255, 1];
const orange = [224/255, 80/255, 36/255, 1];
const grey = [0.6, 0.6, 0.6, 1];
const distanceToCenter = 10;
const distanceAxis = 5;

var activeAnimation = false;

var canvas;
var gl;
var objectsRelations;
var layers;

var baseSpeed = 0.01;
var speedRotationLayer1 = 0;
var speedRotationLayer2 = 0;
var speedRotationLayer3 = 0;
var speedRotationLayer4 = 0;

var viewProjectionMatrix;

var speed1Label = document.getElementById("speed_node_1");
var speed1Node = document.createTextNode("");
speed1Label.appendChild(speed1Node);
var speed1Slider = document.getElementById("speed_node_1_range");

var speed2Label = document.getElementById("speed_node_2");
var speed2Node = document.createTextNode("");
speed2Label.appendChild(speed2Node);
var speed2Slider = document.getElementById("speed_node_2_range");

var speed3Label = document.getElementById("speed_node_3");
var speed3Node = document.createTextNode("");
speed3Label.appendChild(speed3Node);
var speed3Slider = document.getElementById("speed_node_3_range");

var speed4Label = document.getElementById("speed_node_4");
var speed4Node = document.createTextNode("");
speed4Label.appendChild(speed4Node);
var speed4Slider = document.getElementById("speed_node_4_range");



var Node = function() {
    this.children = [];
    this.localMatrix = m4.identity();
    this.worldMatrix = m4.identity();
};

Node.prototype.setParent = function(parent) {
    // remove us from our parent
    if (this.parent) {
        var ndx = this.parent.children.indexOf(this);
        if (ndx >= 0) {
            this.parent.children.splice(ndx, 1);
        }
    }
    // Add us to our new parent
    if (parent) {
        parent.children.push(this);
    }
    this.parent = parent;
};

Node.prototype.updateWorldMatrix = function(parentWorldMatrix) {
    if (parentWorldMatrix) {
        // a matrix was passed in so do the math
        m4.multiply(parentWorldMatrix, this.localMatrix, this.worldMatrix);
    } else {
        // no matrix was passed in so just copy local to world
        m4.copy(this.localMatrix, this.worldMatrix);
    }
    // now process all the children
    var worldMatrix = this.worldMatrix
    this.children.forEach(function(child) {
        child.updateWorldMatrix(worldMatrix);
    });
};



function main() {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    var createFlattenedVertices = function(gl, vertices) {
        var last;
        return webglUtils.createBufferInfoFromArrays(
            gl,
            primitives.makeRandomVertexColors(
                primitives.deindexVertices(vertices),
                {
                    vertsPerColor: 1,
                    rand: function(ndx, channel) {
                        if (channel == 0) {
                            last = 128 + Math.random() * 128 | 0;
                        }
                        return channel < 3 ? last : 255;
                    }
                })
        );
    };

    var sphereBufferInfo = createFlattenedVertices(gl, primitives.createSphereVertices(1, 6, 6));
    // setup GLSL program
    var programInfo = webglUtils.createProgramInfo(gl, ["3d-vertex-shader", "3d-fragment-shader"]);

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }
    function emod(x, n) {
        return x >= 0 ? (x % n) : ((n - (-x % n)) % n);
    };

    // Let's make all the nodes
    var baseMobilNode = new Node();
    baseMobilNode.localMatrix = m4.translation(0, 0, 10);
    var mobilLayer1 = new Node();
    mobilLayer1.localMatrix = m4.translation(0, 0, -distanceAxis);
    var mobilLayer1_1 = new Node();
    mobilLayer1_1.localMatrix = m4.translation(0, 0, -distanceAxis);
    var mobilLayer1_2 = new Node();
    mobilLayer1_2.localMatrix = m4.translation(0, 0, -distanceAxis);


    var nB1 = new Node();
    nB1.localMatrix = m4.scaling(1, 1, 1);
    nB1.drawInfo = {
        uniforms: {
            u_colorOffset: green,
            u_colorMult:   [0.4, 0.4, 0, 1],
        },
        programInfo: programInfo,
        bufferInfo: sphereBufferInfo,
    };

    var nB1_1 = new Node();
    nB1_1.localMatrix = m4.scaling(1, 1, 1);
    nB1_1.drawInfo = {
        uniforms: {
            u_colorOffset: red,
            u_colorMult:   [0.4, 0.4, 0, 1]
        },
        programInfo: programInfo,
        bufferInfo: sphereBufferInfo
    };

    var nB1_2 = new Node();
    nB1_2.localMatrix = m4.scaling(1, 1, 1);
    nB1_2.localMatrix = m4.translation(distanceToCenter, 0, 0);
    nB1_2.drawInfo = {
        uniforms: {
            u_colorOffset: red,
            u_colorMult:   [0.4, 0.4, 0, 1]
        },
        programInfo: programInfo,
        bufferInfo: sphereBufferInfo
    };

    var nB1_3 = new Node();
    nB1_3.localMatrix = m4.scaling(1, 1, 1);
    nB1_3.localMatrix = m4.translation(-distanceToCenter, 0, 0);
    nB1_3.drawInfo = {
        uniforms: {
            u_colorOffset: red,
            u_colorMult:   [0.4, 0.4, 0, 1]
        },
        programInfo: programInfo,
        bufferInfo: sphereBufferInfo
    };

    var nB1_4 = new Node();
    nB1_4.localMatrix = m4.scaling(1, 1, 1);
    nB1_4.localMatrix = m4.translation(0, distanceToCenter , 0);
    nB1_4.drawInfo = {
        uniforms: {
            u_colorOffset: red,
            u_colorMult:   [0.4, 0.4, 0, 1]
        },
        programInfo: programInfo,
        bufferInfo: sphereBufferInfo
    };

    var nB1_5 = new Node();
    nB1_5.localMatrix = m4.scaling(1, 1, 1);
    nB1_5.localMatrix = m4.translation(0, -distanceToCenter, 0);
    nB1_5.drawInfo = {
        uniforms: {
            u_colorOffset: red,
            u_colorMult:   [0.4, 0.4, 0, 1],
        },
        programInfo: programInfo,
        bufferInfo: sphereBufferInfo,
    };

    var nB1_2_1 = new Node();
    nB1_2_1.localMatrix = m4.scaling(1, 1, 1);
    nB1_2_1.drawInfo = {
        uniforms: {
            u_colorOffset: grey,  // gray
            u_colorMult:   [0.1, 0.1, 0.1, 1],
        },
        programInfo: programInfo,
        bufferInfo: sphereBufferInfo,
    };

    var nB1_2_2 = new Node();
    nB1_2_2.localMatrix = m4.scaling(1, 1, 1);
    nB1_2_2.localMatrix = m4.translation(distanceToCenter/2, 0, -distanceToCenter/2);
    nB1_2_2.drawInfo = {
        uniforms: {
            u_colorOffset: red,  // gray
            u_colorMult:   [0.1, 0.1, 0.1, 1],
        },
        programInfo: programInfo,
        bufferInfo: sphereBufferInfo,
    };

    var nB1_2_3 = new Node();
    nB1_2_3.localMatrix = m4.scaling(1, 1, 1);
    nB1_2_3.localMatrix = m4.translation(-distanceToCenter/2, 0, -distanceToCenter/2);
    nB1_2_3.drawInfo = {
        uniforms: {
            u_colorOffset: red,  // gray
            u_colorMult:   [0.1, 0.1, 0.1, 1],
        },
        programInfo: programInfo,
        bufferInfo: sphereBufferInfo,
    };


    var nB1_3_1 = new Node();
    nB1_3_1.localMatrix = m4.scaling(1, 1, 1);
    nB1_3_1.drawInfo = {
        uniforms: {
            u_colorOffset: grey,  // gray
            u_colorMult:   [0.1, 0.1, 0.1, 1],
        },
        programInfo: programInfo,
        bufferInfo: sphereBufferInfo,
    };

    var nB1_3_2 = new Node();
    nB1_3_2.localMatrix = m4.scaling(1, 1, 1);
    nB1_3_2.localMatrix = m4.translation(distanceToCenter/2, 0, -distanceToCenter/2);
    nB1_3_2.drawInfo = {
        uniforms: {
            u_colorOffset: red,  // gray
            u_colorMult:   [0.1, 0.1, 0.1, 1],
        },
        programInfo: programInfo,
        bufferInfo: sphereBufferInfo,
    };

    var nB1_3_3 = new Node();
    nB1_3_3.localMatrix = m4.scaling(1, 1, 1);
    nB1_3_3.localMatrix = m4.translation(-distanceToCenter/2, 0, -distanceToCenter/2);
    nB1_3_3.drawInfo = {
        uniforms: {
            u_colorOffset: red,  // gray
            u_colorMult:   [0.1, 0.1, 0.1, 1],
        },
        programInfo: programInfo,
        bufferInfo: sphereBufferInfo,
    };

    // connect objects
    nB1.setParent(baseMobilNode);
    mobilLayer1.setParent(baseMobilNode);
    nB1_1.setParent(mobilLayer1);
    nB1_2.setParent(mobilLayer1);
    nB1_3.setParent(mobilLayer1);
    nB1_4.setParent(mobilLayer1);
    nB1_5.setParent(mobilLayer1);

    mobilLayer1_1.setParent(nB1_3);
    nB1_2_1.setParent(mobilLayer1_1);
    nB1_2_2.setParent(mobilLayer1_1);
    nB1_2_3.setParent(mobilLayer1_1);

    mobilLayer1_2.setParent(nB1_2);
    nB1_3_1.setParent(mobilLayer1_2);
    nB1_3_2.setParent(mobilLayer1_2);
    nB1_3_3.setParent(mobilLayer1_2);

    var objects = [
        nB1,
        nB1_1,
        nB1_2,
        nB1_3,
        nB1_4,
        nB1_5,
        nB1_2_1,
        nB1_2_2,
        nB1_2_3,
        nB1_3_1,
        nB1_3_2,
        nB1_3_3
    ];

    var objectsToDraw = [
        nB1.drawInfo,
        nB1_1.drawInfo,
        nB1_2.drawInfo,
        nB1_3.drawInfo,
        nB1_4.drawInfo,
        nB1_5.drawInfo,
        nB1_2_1.drawInfo,
        nB1_2_1.drawInfo,
        nB1_2_2.drawInfo,
        nB1_2_3.drawInfo,
        nB1_3_1.drawInfo,
        nB1_3_2.drawInfo,
        nB1_3_3.drawInfo,
    ];

    layers = {
        layer0 :  baseMobilNode,
        layer1 :  mobilLayer1,
        layer2 : mobilLayer1_1,
        layer3 : mobilLayer1_2
    };

    objectsRelations = {
        object :  objects,
        objectToDraw :  objectsToDraw,
    };
    changeViewMatrix( [0, -40, 0]);
    requestAnimationFrame(drawScene);
}

// Draw the scene.
function drawScene( time) {
    time *= 0.0005;

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // Clear the canvas AND the depth buffer.
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



    // update the local matrices for each object.
    if (activeAnimation) {
        m4.multiply(m4.zRotation(baseSpeed), layers.layer0.localMatrix, layers.layer0.localMatrix);
        m4.multiply(m4.zRotation(2 * baseSpeed), layers.layer1.localMatrix, layers.layer1.localMatrix);
        m4.multiply(m4.zRotation(3 * baseSpeed), layers.layer2.localMatrix, layers.layer2.localMatrix);
        m4.multiply(m4.zRotation(3 * baseSpeed), layers.layer3.localMatrix, layers.layer3.localMatrix);
    }else{
        m4.multiply(m4.zRotation(speedRotationLayer1), layers.layer0.localMatrix, layers.layer0.localMatrix);
        m4.multiply(m4.zRotation(speedRotationLayer2), layers.layer1.localMatrix, layers.layer1.localMatrix);
        m4.multiply(m4.zRotation(speedRotationLayer3), layers.layer2.localMatrix, layers.layer2.localMatrix);
        m4.multiply(m4.zRotation(speedRotationLayer4), layers.layer3.localMatrix, layers.layer3.localMatrix);
    }

    // spin the earth
    /*m4.multiply(m4.yRotation(0.05), nB1_1.localMatrix, nB1_1.localMatrix);
    m4.multiply(m4.yRotation(0.05), nB1_2.localMatrix, nB1_2.localMatrix);
    m4.multiply(m4.yRotation(0.05), nB1_3.localMatrix, nB1_3.localMatrix);
    m4.multiply(m4.yRotation(0.05), nB1_4.localMatrix, nB1_4.localMatrix);
    m4.multiply(m4.yRotation(0.05), nB1_5.localMatrix, nB1_5.localMatrix);
    // spin the moon
    m4.multiply(m4.yRotation(-0.01), moonNode.localMatrix, moonNode.localMatrix);*/

    // Update all world matrices in the scene graph
    layers.layer0.updateWorldMatrix();

    // Compute all the matrices for rendering
    objectsRelations.object.forEach(function (object) {
        object.drawInfo.uniforms.u_matrix = m4.multiply(viewProjectionMatrix, object.worldMatrix);
    });

    // ------ Draw the objects --------

    var lastUsedProgramInfo = null;
    var lastUsedBufferInfo = null;

    objectsRelations.objectToDraw.forEach(function (object) {
        var programInfo = object.programInfo;
        var bufferInfo = object.bufferInfo;
        var bindBuffers = false;

        if (programInfo !== lastUsedProgramInfo) {
            lastUsedProgramInfo = programInfo;
            gl.useProgram(programInfo.program);
            bindBuffers = true;
        }

        // Setup all the needed attributes.
        if (bindBuffers || bufferInfo !== lastUsedBufferInfo) {
            lastUsedBufferInfo = bufferInfo;
            webglUtils.setBuffersAndAttributes(gl, programInfo, bufferInfo);
        }
        // Set the uniforms.
        webglUtils.setUniforms(programInfo, object.uniforms);
        // Draw
        gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numElements);
    });
    requestAnimationFrame(drawScene);
}

function changeViewMatrix(cameraPosition){
    console.log(cameraPosition);

    // Compute the projection matrix
    var fieldOfViewRadians = degToRad(60);
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

    // Compute the camera's matrix using look at.
    var target = [0, 0, 0];
    var up = [0, 0, 1];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);
    viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
}

function activeFrontCamera(){
    changeViewMatrix ([0, -40, 0]);
    requestAnimationFrame(drawScene);
}

function activeIsometric() {
    changeViewMatrix([-13.5, -12.6, 20.5]);
    requestAnimationFrame(drawScene);
}

function degToRad(d) {
    return d * Math.PI / 180;
}

//Sliders
speed1Slider.oninput = function() {
    speedRotationLayer1 = this.value/1000 ;
    speed1Label.nodeValue = this.value/1000;
};

speed2Slider.oninput = function() {
    speedRotationLayer2 = this.value/1000 ;
    speed2Label.nodeValue = this.value/1000;
};

speed3Slider.oninput = function() {
    speedRotationLayer3 = this.value/1000 ;
    speed3Label.nodeValue = this.value/1000;
};

speed4Slider.oninput = function() {
    speedRotationLayer4 = this.value/1000 ;
    speed4Label.nodeValue = this.value/1000;
};

function setSliders(value){
    speed1Slider.value = value;
    speed2Slider.value = value;
    speed3Slider.value = value;
    speed4Slider.value = value;

    speedRotationLayer1 = value;
    speedRotationLayer2 = value;
    speedRotationLayer3 = value;
    speedRotationLayer4 = value;
}

function activeAnimationAction(){
    activeAnimation = document.getElementById("activeAnimation").checked;
    setSliders(0);
}

//Start program
main();