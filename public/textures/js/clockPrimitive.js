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

var clock = new Object();
clock.position = positions;
clock.indices = indices;