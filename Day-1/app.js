// Vertex shader source code
var vertexShaderText = 
[
    'precision mediump float;',
    '',
    'attribute vec2 vertPosition;',  // 2D position attribute
    'attribute vec3 vertColor;',     // Color attribute
    'varying vec3 fragColor;',       // Varying variable to pass color to fragment shader
    'uniform float screenWidth;',    // Uniform variable for screen width
    '',
    'void main()',
    '{',
    '   fragColor = vertColor;',      // Assign color to varying variable
    '   gl_Position = vec4(vertPosition, 0.0, 1.0);',  // Set the final position
    '}',
].join('\n');

// Fragment shader source code
var fragmentShaderText=
[
    'precision mediump float;',
    '',
    'varying vec3 fragColor;',   // Varying variable to receive color from vertex shader
    'void main()',
    '{',
    '   gl_FragColor = vec4(fragColor, 1.0);',  // Set the final fragment color
    '}'
].join('\n');

// Function to initialize the WebGL context and draw a colored triangle
var InitDemo = function(){
    console.log("This is my first step for WebGL");

    // Get the canvas element
    var canvas= document.getElementById('game-surface')

    // Initialize WebGL
    var gl = canvas.getContext('webgl')

    // Check for WebGL support, fallback to experimental WebGL if necessary
    if (!gl){
        console.log('WebGL NotSupported without experimental');
        gl = canvas.getContext('experimental-webgl');
    }

    // If WebGL is still not supported, show an alert
    if (!gl){
        alert('WebGL Not supported in your browser')
    }

    // Set the clear color for the canvas
    gl.clearColor(0.75,0.85,0.8,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create vertex and fragment shaders
    var vertexShader= gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader= gl.createShader(gl.FRAGMENT_SHADER);

    // Load shader source code
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    // Compile vertex shader
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader,gl.COMPILE_STATUS)){
        console.error('ERROR compiling VERTEXSHADER', gl.getShaderInfoLog(vertexShader));
        return;
    }

    // Compile fragment shader
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader,gl.COMPILE_STATUS)){
        console.error('ERROR compiling FRAGMENTSHADER', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    // Create a shader program, attach shaders, and link the program
    var program = gl.createProgram()
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    // Check if the program linked successfully
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        console.error("ERROR Linking Program!", gl.getProgramInfoLog(program));
        return;
    }

    // Validate the program
    gl.validateProgram(program);
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
        console.error('ERROR Validating Program', gl.getProgramInfoLog(program));
        return;
    }

    // Define vertices and colors for a triangle
    var triangleVertices = 
    [   
         0.0, 0.5,     1.0, 1.0, 0.0,  // Vertex 1: position (x, y), color (R, G, B)
        -0.5, -0.5,    0.7, 0.0, 1.0,  // Vertex 2: position (x, y), color (R, G, B)
         0.5, -0.5,    0.1, 1.0, 0.6,  // Vertex 3: position (x, y), color (R, G, B)
    ];

    // Create a buffer and populate it with triangle vertices data
    var triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    // Get attribute locations for position and color
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

    // Specify vertex attribute pointers
    gl.vertexAttribPointer(
        positionAttribLocation,
        2,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    gl.vertexAttribPointer(
        colorAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT
    );

    // Enable vertex attribute arrays
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    // Use the shader program
    gl.useProgram(program);

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3);
};
