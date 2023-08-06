vertexShaderSource = `#version 300 es
in vec2 a_position;
in vec4 a_color;
out vec4 color;
uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_scale;


void main() {
  // Scale the positon
  vec2 scaledPosition = a_position * u_scale;

  // Rotate the position
  vec2 rotatedPosition = vec2(
     scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,
     scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x);

  // Add in the translation
  gl_Position = vec4(rotatedPosition + u_translation, 0, 1);

  // Varrying to set Color data
  color = a_color;
  
  } 
  `;

fragmentShaderSource = `#version 300 es
precision highp float;

in vec4 color;
out vec4 outColor;
  
  void main() {
    outColor = color;
  }
  `;

const canvas = document.querySelector('#webgl');
const gl = canvas.getContext('webgl2');

const program = gl.createProgram();

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);
gl.attachShader(program, vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);
gl.useProgram(program);

const apositionlocation = gl.getAttribLocation(program, "a_position");
const acolorlocation = gl.getAttribLocation(program, "a_color");
const uscalelocation = gl.getUniformLocation(program, "u_scale");
const urotationlocation = gl.getUniformLocation(program, "u_rotation");
const utranslationlocation = gl.getUniformLocation(program, "u_translation");

const data = new Float32Array([
    0.3, 0.2,    0.6, 0.2,    0.45, 0.8,    0.5,    0.0,   0.5,   1.0, 
   -0.3, 0.2,   -0.6, 0.2,   -0.45, 0.8,    0.1,    0.0,   0.5,   1.0, 
   -0.3,-0.2,    0.3,-0.2,    0.0, -0.8,    0.5,    0.0,   0.5,   1.0,
    0.0, 0.0,    0.0, 0.0,    0.0,  0.0,    0.0,    0.0,   0.0,   0.0, //>>>> This Row does nothing 
    0.0, 0.0,    0.0, 0.0,    0.0,  0.0,    0.0,    0.0,   0.0,   0.0, //>>>> This Row does nothing 
    0.0, 0.0,    0.0, 0.0,    0.0,  0.0,    0.5,    0.0,   0.5,   1.0, 
    0.0, 0.0,    0.0, 0.0,    0.0,  0.0,    0.1,    0.0,   0.5,   1.0, 
    0.0, 0.0,    0.0, 0.0,    0.0,  0.0,    0.5,    0.0,   0.5,   1.0, 
    0.0, 0.0,    0.0, 0.0,    0.0,  0.0,    0.0,    0.0,   0.0,   0.0, //>>>> This Row does nothing 
    0.0, 0.0,    0.0, 0.0,    0.0,  0.0,    0.0,    0.0,   0.0,   0.0, //>>>> This Row does nothing 
    0.0, 0.0,    0.0, 0.0,    0.0,  0.0,    0.2,    0.76,   0.2,  1.0, 
    0.0, 0.0,    0.0, 0.0,    0.0,  0.0,    0.1,    0.0,   0.86,  1.0, 
    0.0, 0.0,    0.0, 0.0,    0.0,  0.0,    0.44,   0.0,   0.22,  1.0, 

]);

gl.enableVertexAttribArray(apositionlocation);
gl.enableVertexAttribArray(acolorlocation);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

//can set default values using vertexattrib method and do component testing by turning off or disabling a attribute
gl.vertexAttrib2f(apositionlocation, 0.0, 0.0);
gl.vertexAttrib4f(acolorlocation, 1.0, 0.0, 0.0, 1.0);

gl.vertexAttribPointer(apositionlocation, 2, gl.FLOAT, false, 0, 0);
gl.vertexAttribPointer(acolorlocation, 4, gl.FLOAT, false, 10*4, 6*4);

gl.uniform2f(uscalelocation, 1.0, 1.0);
gl.uniform2f(urotationlocation, 0.0, 1.0);
gl.uniform2f(utranslationlocation, 0.0, 0.0);


gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);
gl.drawArrays(gl.TRIANGLE_FAN, 5, 3);
gl.drawArrays(gl.TRIANGLE_FAN, 10, 3);


/*

Ok so; drawArrays() takes the following paramaters, (draw_type, first_index / offset, count),
the vertex-attribute-array is treating the data in the buffer in this manner, first index is 0
which contains the first two floats, i.e. point (0.3, 0.2) above, that should mean that the next
two remain points in the first triangle should lye in indexes 1 and 2 thus why the first parameter
is set to 0 and the count is set to 3. 

From what I gathered its treating the 4 color values as one vector of values stored in a single index,
because if you change the drawArrays() call to something like start from indicie 3 and draw the next 
3 points, including index 3, you'll get some funky output; what I dont understand is why I cannot get
my colors to render on the other two triangles properly, this is close as I can get it, and everytime
I change the vertexAtrribPointer for apositionlocation to the correct stride i.e. 10*4, meaning there
are 10 components multiplied by 4 bytes between the first set of vertices for triangle 1 and the second
set of vertices for triangle 2 I get a single triangle, I also realized that a single vec4 of color values 
is used for each vertice of a particular triangle

PLEASE HELP ME UNDERSTAND THESE BS POINTERS!!!!


*/




