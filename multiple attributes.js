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

const apositonlocation = gl.getAttribLocation(program, "a_position");
const acolorlocation = gl.getAttribLocation(program, "a_color");
const uscalelocation = gl.getUniformLocation(program, "u_scale");
const urotationlocation = gl.getUniformLocation(program, "u_rotation");
const utranslationlocation = gl.getUniformLocation(program, "u_translation");

const data = [
          /*--VETICES--*/                                               /*--COLORS--*/
    0.3, 0.2,    0.6, 0.2,    0.45, 0.8,   /*--First  Triangle--*/   0.5,  0.0,  0.5,  1.0, /*--Purple--*/
   -0.3, 0.2,   -0.6, 0.3,   -0.45, 0.8,   /*--Second Triangle--*/   0.5,  0.0,  0.5,  1.0, /*--Purple--*/
   -0.3,-0.2,    0.3,-0.3,    0.0, -0.8,   /*--Third  Triangle--*/   0.42, 0.0,  0.66, 1.0, /*--Blueish Purple--*/

];

gl.enableVertexAttribArray(apositonlocation);
gl.enableVertexAttribArray(acolorlocation);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);


gl.vertexAttribPointer(apositonlocation, 2, gl.FLOAT, false, 0, 0);
gl.vertexAttribPointer(acolorlocation, 4, gl.FLOAT, false, 0, 6*4);

gl.uniform2f(uscalelocation, 1.0, 1.0);
gl.uniform2f(urotationlocation, 0.0, 1.0);
gl.uniform2f(utranslationlocation, 0.0, 0.0);


gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.drawArrays(gl.TRIANGLES, 0, 3);