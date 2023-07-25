var vertexShaderSource = `#version 300 es

in vec2 a_position;
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
  
  } 
  `;

var fragmentShaderSource = `#version 300 es

precision highp float;
  
uniform vec4 u_color[7];
uniform int u_index; 
out vec4 outColor;
  
  void main() {
    outColor = u_color[u_index];
  }
  `;

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));  
  gl.deleteShader(shader);
  return undefined;
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));  // eslint-disable-line
  gl.deleteProgram(program);
  return undefined;
}


function main() {

  // Retrieve Canvas / Set Context
  var canvas = document.querySelector("#webgl");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }
  


  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  var program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);
  

  var a_position_location = gl.getAttribLocation(program, "a_position");
  var u_scale_location = gl.getUniformLocation(program, "u_scale");
  var u_rotation_location = gl.getUniformLocation(program, "u_rotation");
  var u_translation_location = gl.getUniformLocation(program, "u_translation");
  var u_color_location = gl.getUniformLocation(program, "u_color");
  var u_index_location = gl.getUniformLocation(program, "u_index");
  

 
  var c_coords = Circle(gl, .08, [0.0, 0.26]);
  var c_coords1 = Circle(gl, .079, [0.0, 0.26]);
  var c_coords2 = Circle(gl, .054, [0.0, 0.26]);
  var c_coords3 = Circle(gl, .054, [0.0, 0.26]);
  var c_coords4 = Circle(gl, .0315, [0.0, 0.26]);
  var c_coords5 = Circle(gl, .0315, [0.0, 0.26]);
  var c_coords6 = Circle(gl, .0107, [0.0, 0.26]);
  var c_coords7 = Circle(gl, .0107, [0.0, 0.26]);
  var all_data = gen_data_forbuff(c_coords, c_coords1, c_coords2, c_coords3, c_coords4, c_coords5, c_coords6, c_coords7);

  

  gl.enableVertexAttribArray(a_position_location);


  var scene_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, scene_buffer);
  gen_scene_data(gl);


  var animation_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, animation_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(all_data), gl.STATIC_DRAW);
 


  gl.bindBuffer(gl.ARRAY_BUFFER, scene_buffer);
  gl.vertexAttribPointer(a_position_location, 2, gl.FLOAT, false, 0, 0);


  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.uniform4fv(u_color_location,   [
    0.0, 0.0, 0.0, 0.8, //Dark     - Gray   = [0]
    0.0, 0.0, 0.0, 0.5, //Light    - Gray   = [1]
    0.0, 0.0, 0.0, 0.4, //Lightest - Gray   = [2]
    1.0, 0.0, 0.0, 1.0, //         - Red    = [3]
    0.0, 0.0, 0.0, 0.0, //         - White  = [4]
    0.0, 0.0, 0.0, 1.0, //         - Black  = [5]
    0.0, 1.0, 0.0, 1.0, //         - Green  = [6]
  ])
  
  
  gl.uniform2f(u_scale_location, 1.0, 1.0);
  gl.uniform2f(u_rotation_location, 0.0, 1.0);
  gl.uniform2f(u_translation_location, 0.0, 0.0);
 


  gl.uniform1i(u_index_location, 1);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  gl.uniform1i(u_index_location, 2);
  gl.drawArrays(gl.TRIANGLES, 6, 9);
  gl.uniform1i(u_index_location, 3);
  gl.drawArrays(gl.LINES, 15, 10);


  gl.bindBuffer(gl.ARRAY_BUFFER, animation_buffer);
  gl.vertexAttribPointer(a_position_location, 2, gl.FLOAT, false, 0, 0);

  
  
  gl.uniform1i(u_index_location, 5);
  gl.drawArrays(gl.LINE_LOOP, 0, 360);  
  
  gl.uniform1i(u_index_location, 3);
  gl.drawArrays(gl.TRIANGLE_FAN, 360, 360);
  
  gl.uniform1i(u_index_location, 5);
  gl.drawArrays(gl.LINE_LOOP, 720, 360);
  
  gl.uniform1i(u_index_location, 4);
  gl.drawArrays(gl.TRIANGLE_FAN, 1080, 360);
  
  gl.uniform1i(u_index_location, 5);
  gl.drawArrays(gl.LINE_LOOP, 1440, 360);

  gl.uniform1i(u_index_location, 3);
  gl.drawArrays(gl.TRIANGLE_FAN, 1800, 360);
  
  gl.uniform1i(u_index_location, 5);
  gl.drawArrays(gl.LINE_LOOP, 2160, 360);
  
  gl.uniform1i(u_index_location, 6);
  gl.drawArrays(gl.TRIANGLE_FAN, 2520, 360);
  

}


function gen_scene_data(gl) {
  
  var data =
  [-0.3, -0.2,    -0.3,  0.2,    0.3, -0.2, //  First Triangle  - TARGET PLATFORM
    0.3, -0.2,     0.3,  0.2,   -0.3,  0.2, //  Second Triagnle - TARGET PLATFORM
   -1.0, -1.0,    -0.3, -0.2,    1.0, -1.0, //  First Triangle  - SHOOTING LANE
    1.0, -1.0,     0.3, -0.2,   -1.0, -1.0, //  Second Triangle - SHOOTING LANE 
   -0.3, -0.2,     0.3, -0.2,    0.0, -0.4, //  Third Triangle  - SHOOTING LANE
   -1.0,  1.0,    -0.3,  0.6,               //  Background Line - SHOOTING LANE - TOP LEFT
    1.0,  1.0,     0.3,  0.6,               //  Background Line - SHOOTING LANE - TOP RIGHT
    0.3,  0.6,    -0.3,  0.6,               //  Background Line - SHOOTING LANE - TOP MIDDLE
   -0.3,  0.6,    -0.3, -0.2,               //  Background Line - SHOOTING LANE - BOTTOM LEFT
    0.3,  0.6,     0.3, -0.2,               //  Background Line - SHOOTING LANE - BOTTOM RIGHT
  
  ];
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  return;
}

function Circle(gl, radius, origin) {
  
  var angle = 0;
  var x;
  var y;
  var c_coordinates = [];

   while (angle < 361) {
    if(angle == 360) {
        return c_coordinates;
    }  
    else if(angle == 0) {
         x = origin[0] + radius;
         y = origin[1];
         c_coordinates.push(x);
         c_coordinates.push(y);
         angle = angle + 1;
      }

      else if(angle == 90) {
         x = origin[0];
         y = origin[1] + radius;
         c_coordinates.push(x);
         c_coordinates.push(y);
         angle = angle + 1;
      }

      else if(angle == 180) {
         x = origin[0] - radius;
         y = origin[1];
         c_coordinates.push(x);
         c_coordinates.push(y);
         angle = angle + 1;
      }

      else if(angle == 270) {
         x = origin[0];
         y = origin[1] - radius;
         c_coordinates.push(x);
         c_coordinates.push(y);
         angle = angle + 1;
      }

      else {
         x = origin[0] + (radius * (Math.cos(angle)));
         y = origin[1] + (radius * (Math.sin(angle)));
         c_coordinates.push(x);
         c_coordinates.push(y);
         angle = angle + 1;
      }
    }
}


function gen_data_forbuff(data, data_1, data_2, data_3, data_4, data_5, data_6, data_7) {
  let all_geom = [];
  for (i = 0; i < data.length; i++) {
      all_geom[i] = data[i];
  }

  var j = all_geom.length;
  var i = 0
  while (i < data_1.length) {
      all_geom[j] = data_1[i];
      i += 1
      j += 1
  }

  var j = all_geom.length;
  var i = 0;
  while (i < data_2.length) {
      all_geom[j] = data_2[i];
      i += 1;
      j += 1;
  }

  var j = all_geom.length;
  var i = 0;
  while (i < data_3.length) {
    all_geom[j] = data_3[i];
    i += 1;
    j += 1;
}
var j = all_geom.length;
var i = 0;
while (i < data_4.length) {
  all_geom[j] = data_4[i];
  i += 1;
  j += 1;
}
var j = all_geom.length;
var i = 0;
while (i < data_5.length) {
  all_geom[j] = data_5[i];
  i += 1;
  j += 1;
}
var j = all_geom.length;
var i = 0;
while (i < data_6.length) {
  all_geom[j] = data_6[i];
  i += 1;
  j += 1;
}
var j = all_geom.length;
var i = 0;
while (i < data_7.length) {
  all_geom[j] = data_7[i];
  i += 1;
  j += 1;
}
  return all_geom;
}

/*
function animate() {


}
*/