"use strict";

var vertexShaderSource = `#version 300 es

in vec2 a_position;
 

void main() {



  gl_Position = vec4(a_position, 0.0, 1.0);
  
  } 
  `;
  

var fragmentShaderSource = `#version 300 es

precision highp float;
  
uniform vec4 u_color[5];
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
  var u_color_location = gl.getUniformLocation(program, "u_color");
  var u_index_location = gl.getUniformLocation(program, "u_index");

  
  var c_coords1 = Circle(gl, .1, [0.0, 0.26]);
  var c_coords2 = Circle(gl, .053, [0.0, 0.26]);
  var c_coords3 = Circle(gl, .0215, [0.0, 0.26]);
  var all_data = gen_data_forbuff(c_coords1, c_coords2, c_coords3);

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
    0.0, 0.0, 0.0, 0.8, //Dark     - Gray
    0.0, 0.0, 0.0, 0.5, //Light    - Gray
    0.0, 0.0, 0.0, 0.4, //Lightest - Gray
    1.0, 0.0, 0.0, 1.0, //         - Red
    0.0, 0.0, 0.0, 0.0, //         - White
  ])
  

  gl.uniform1i(u_index_location, 1);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  gl.uniform1i(u_index_location, 2);
  gl.drawArrays(gl.TRIANGLES, 6, 9);
  gl.uniform1i(u_index_location, 3);
  gl.drawArrays(gl.LINES, 15, 10);

  gl.bindBuffer(gl.ARRAY_BUFFER, animation_buffer);
  gl.vertexAttribPointer(a_position_location, 2, gl.FLOAT, false, 0, 0);


  gl.uniform1i(u_index_location, 3);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 360);
  gl.uniform1i(u_index_location, 4);
  gl.drawArrays(gl.TRIANGLE_FAN, 360, 360);
  gl.uniform1i(u_index_location, 3);
  gl.drawArrays(gl.TRIANGLE_FAN, 720, 360);

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


function gen_data_forbuff(data_1, data_2, data_3) {
  let all_geom = [];
  for (i = 0; i < data_1.length; i++) {
      all_geom[i] = data_1[i];
  }

  var j = all_geom.length;
  var i = 0
  while (i < data_2.length) {
      all_geom[j] = data_2[i];
      i += 1
      j += 1
  }

  var j = all_geom.length;
  var i = 0;
  while (i < data_3.length) {
      all_geom[j] = data_3[i];
      i += 1;
      j += 1;
  }
  return all_geom;
}

