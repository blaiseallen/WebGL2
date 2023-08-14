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
/*
The vertex shader above is set up with one attribute to take in vertcie 
positions & three uniforms to take in scale, rotation, and translation
values; all variables are vec2's and accept floats only;
*/
var fragmentShaderSource = `#version 300 es

precision highp float;
  
uniform vec4 u_color[7];
uniform int u_index; 
out vec4 outColor;
  
  void main() {
    outColor = u_color[u_index];
  }
  `;
/*
The fragment shader above is up with two uniforms, one uniform takes in an
array of vec4's, those vec4's correspond to color values displayed within
the canvas, and the other uniform takes a single integer, which is used
to denote what color a given vertex should be rasterized as
*/
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



var target_size = .08;
var target_origin_x = 0.0;
var x_trans_direction = "right";
var x_bound_left = -0.3;
var x_bound_right = 0.3;
var i = 0;


function main() {

  // Retrieves the Canvas & Sets the Context
  var canvas = document.querySelector("#webgl");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }
  


  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  var program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);
  
  //gl method for retrieving the location of the attribute variable that iterates over the vertex data
  var a_position_location = gl.getAttribLocation(program, "a_position");
  //gl method for retrieving the location of the uniform variable that denotes scale values for a given vertex/shape
  var u_scale_location = gl.getUniformLocation(program, "u_scale");
  //gl method for retrieving the location of the uniform variable that denotes rotation values for a given vertex/shape
  var u_rotation_location = gl.getUniformLocation(program, "u_rotation");
  //gl method for retrieving the location of the uniform variable that denotes translation values for a given vertex/shape
  var u_translation_location = gl.getUniformLocation(program, "u_translation");
  //gl method for retrieving the location of the uniform variable that denotes a series of vec4's that correspond to color values for a given vertex/shape
  var u_color_location = gl.getUniformLocation(program, "u_color");
  //gl method for retrieving the location of the uniform variable that denotes an integer value stating which vec4 a particular vertex or shape should be rasterized as
  var u_index_location = gl.getUniformLocation(program, "u_index");
  

  //Multiple function calls to the Circle function which creates numerous circles of varying sizes 
  var c_coords = Circle(gl, .08, [0.0, 0.26]);
  var c_coords1 = Circle(gl, .079, [0.0, 0.26]);
  var c_coords2 = Circle(gl, .054, [0.0, 0.26]);
  var c_coords3 = Circle(gl, .054, [0.0, 0.26]);
  var c_coords4 = Circle(gl, .0315, [0.0, 0.26]);
  var c_coords5 = Circle(gl, .0315, [0.0, 0.26]);
  var c_coords6 = Circle(gl, .0107, [0.0, 0.26]);
  var c_coords7 = Circle(gl, .0107, [0.0, 0.26]);
  //a call to a dummy function which puts a bunch of vertex data into a single buffer
  var all_data = gen_data_forbuff(c_coords, c_coords1, c_coords2, c_coords3, c_coords4, c_coords5, c_coords6, c_coords7);

  
  //a special webgl2 method that enables are attirbute to have an array that stores various attributes in relation to our vertex data
  gl.enableVertexAttribArray(a_position_location);

  //the following lines create a buffer for binding to the WebGL2 bindpoint, this buffer stores the main vertices that make up the 2D scene
  var scene_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, scene_buffer);
  //another dummy function that puts all of the vertices that make up the 2d scene in one buffer 
  gen_scene_data(gl);

  //the following lines create a buffer for binding to the same WebGL2 bindpoint, being that you can only use a particular bind point once
  //for binding a buffer at a given time, this buffer stores the vertex data that will be animated separately from the scene vertices 
  var target_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, target_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(all_data), gl.STATIC_DRAW);
 

  //prepares the scene buffer, and tells the vertex shader how to pull data out of that buffer once executed 
  gl.bindBuffer(gl.ARRAY_BUFFER, scene_buffer);
  gl.vertexAttribPointer(a_position_location, 2, gl.FLOAT, false, 0, 0);

  //Clears the canvas, and color/depth buffer before drawing 
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //sets the u_color uniform variable to 7 different vec4 values corresponding to the colors labeled below
  gl.uniform4fv(u_color_location,   [
    0.0, 0.0, 0.0, 0.8, //Dark     - Gray   = [0]
    0.0, 0.0, 0.0, 0.5, //Light    - Gray   = [1]
    0.0, 0.0, 0.0, 0.4, //Lightest - Gray   = [2]
    1.0, 0.0, 0.0, 1.0, //         - Red    = [3]
    0.0, 0.0, 0.0, 0.0, //         - White  = [4]
    0.0, 0.0, 0.0, 1.0, //         - Black  = [5]
    0.0, 1.0, 0.0, 1.0, //         - Green  = [6]
  ])
  
  //sets scaled to 1 for all vertices in the canvas, stating every vetex or primitive shape should be rendered to its current size/specf.
  gl.uniform2f(u_scale_location, 1.0, 1.0);
  //set the rotational values for all vertices present within the canvas, essentially sets the scene at a head-on point of view and faces it right side up
  gl.uniform2f(u_rotation_location, 0.0, 1.0);
  //sets the translational values for all vertices present within the canvas, essentially states that all vertices should remain in their "hard-coded" positions within the canvas
  gl.uniform2f(u_translation_location, 0.0, 0.0);
 

  //creates target platform in center of canvas
  gl.uniform1i(u_index_location, 1);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  //creates floor of shooting range in the center/bottom of the canvas
  gl.uniform1i(u_index_location, 2);
  gl.drawArrays(gl.TRIANGLES, 6, 9);
  //creates wall/ceiling like appearence of shooting range, both at the top left and top right of the canvas
  gl.uniform1i(u_index_location, 3);
  gl.drawArrays(gl.LINES, 15, 10);

  //Binds the buffer again and states how the a_position attribute variable should have its attributes pulled out of the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, target_buffer);
  gl.vertexAttribPointer(a_position_location, 2, gl.FLOAT, false, 0, 0);

  
  //creates outside border of target using the circle function and savy use of drawing method
  gl.uniform1i(u_index_location, 5);
  gl.drawArrays(gl.LINE_LOOP, 0, 360);  
  
  //creates outside red ring of target using the circle function and savy use of drawing method
  gl.uniform1i(u_index_location, 3);
  gl.drawArrays(gl.TRIANGLE_FAN, 360, 360);
  
  //creates 2nd outside border
  gl.uniform1i(u_index_location, 5);
  gl.drawArrays(gl.LINE_LOOP, 720, 360);
  
  //creates 2nd outside ring, i.e. white ring 
  gl.uniform1i(u_index_location, 4);
  gl.drawArrays(gl.TRIANGLE_FAN, 1080, 360);
  
  //creates second from the inside border
  gl.uniform1i(u_index_location, 5);
  gl.drawArrays(gl.LINE_LOOP, 1440, 360);

  //creates second from the inside ring, i.e. red
  gl.uniform1i(u_index_location, 3);
  gl.drawArrays(gl.TRIANGLE_FAN, 1800, 360);
  
  //creates center border of target
  gl.uniform1i(u_index_location, 5);
  gl.drawArrays(gl.LINE_LOOP, 2160, 360);
  
  //creates center ring of target, i.e. green 
  gl.uniform1i(u_index_location, 6);
  gl.drawArrays(gl.TRIANGLE_FAN, 2520, 360);
  
  window.requestAnimationFrame(animate_target);

  function animate_target() {
   
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // --SCENE--
    gl.bindBuffer(gl.ARRAY_BUFFER, scene_buffer);
    gl.vertexAttribPointer(a_position_location, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(u_color_location,   [
      0.0, 0.0, 0.0, 0.8, //Dark     - Gray   = [0]
      0.0, 0.0, 0.0, 0.5, //Light    - Gray   = [1]
      0.0, 0.0, 0.0, 0.4, //Lightest - Gray   = [2]
      1.0, 0.0, 0.0, 1.0, //         - Red    = [3]
      0.0, 0.0, 0.0, 0.0, //         - White  = [4]
      0.0, 0.0, 0.0, 1.0, //         - Black  = [5]
      0.0, 1.0, 0.0, 1.0, //         - Green  = [6]
    ]);
    gl.uniform2f(u_scale_location, 1.0, 1.0);
    gl.uniform2f(u_rotation_location, 0.0, 1.0);
    gl.uniform2f(u_translation_location, 0.0, 0.0);
    gl.uniform1i(u_index_location, 1);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.uniform1i(u_index_location, 2);
    gl.drawArrays(gl.TRIANGLES, 6, 9);
    gl.uniform1i(u_index_location, 3);
    gl.drawArrays(gl.LINES, 15, 10);
    
    
    
    // --TARGET--
    gl.bindBuffer(gl.ARRAY_BUFFER, target_buffer);
    gl.vertexAttribPointer(a_position_location, 2, gl.FLOAT, false, 0, 0);
  
    
    if (target_origin_x + (target_size/2) < x_bound_right && x_trans_direction == "right") {
    
      gl.uniform2f(u_scale_location, 1.0, 1.0);
      gl.uniform2f(u_rotation_location, 0.0, 1.0);
      gl.uniform2f(u_translation_location, 0.01, 0.0);
      target_origin_x += 0.01;
      console.log("first if");
    }

    if (target_origin_x + (target_size/2) >= x_bound_right && x_trans_direction == "right") {
      
      x_trans_direction = "left";
      console.log("second if");
    
    }


    if (target_origin_x - (target_size/2) > x_bound_left && x_trans_direction == "left") {
      
      gl.uniform2f(u_scale_location, 1.0, 1.0);
      gl.uniform2f(u_rotation_location, 0.0, 1.0);
      gl.uniform2f(u_translation_location, -0.01, 0.0);
      target_origin_x -= 0.01;
      console.log("third if");


    }

    if (target_origin_x - (target_size/2) <= x_bound_left && x_trans_direction == "left") {

      x_trans_direction = "right";
      console.log("fourth if");

    }

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
    requestAnimationFrame(animate_target);
   
  }

}

//the first dummy function for creating all of the primitives shapes that make up the 2d scene, & puts them in a single buffer
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

//circle function that can create a circle of any dimension, by providing the radius, and point of origin you wish the circle to have, as well as the webgl rendering context
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

//second dummy function that takes all of target vertices and puts them into a single buffer 
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






















animate_target();

function animate_target() {
 
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  // --SCENE--
  gl.bindBuffer(gl.ARRAY_BUFFER, scene_buffer);
  gl.enableVertexAttribArray(a_position_location);
  gl.vertexAttribPointer(a_position_location, 2, gl.FLOAT, false, 0, 0);
  
  
  gl.uniform2f(u_scale_location, 1.0, 1.0);
  gl.uniform2f(u_rotation_location, 0.0, 1.0);
  gl.uniform2f(u_translation_location, 0.0, 0.0);
  gl.uniform1i(u_index_location, 1);
  gl.drawArrays(gl.TRIANGLES, 47, 3);
  gl.drawArrays(gl.TRIANGLES, 48, 3);
  gl.drawArrays(gl.TRIANGLES, 32, 9);
  gl.uniform1i(u_index_location, 0);
  gl.drawArrays(gl.TRIANGLES, 51, 3);
  gl.drawArrays(gl.TRIANGLES, 54, 3);
  gl.drawArrays(gl.TRIANGLES, 57, 3);
  gl.drawArrays(gl.TRIANGLES, 60, 3);
  gl.uniform1i(u_index_location, 3);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  gl.drawArrays(gl.TRIANGLES, 8, 3);
  gl.drawArrays(gl.TRIANGLES, 9, 3);
  gl.uniform1i(u_index_location, 5);
  gl.drawArrays(gl.TRIANGLES, 41, 3);
  gl.drawArrays(gl.TRIANGLES, 42, 4);
  gl.drawArrays(gl.TRIANGLES, 12, 3);
  gl.drawArrays(gl.TRIANGLES, 13, 3);
  gl.drawArrays(gl.TRIANGLES, 24, 3);
  gl.drawArrays(gl.TRIANGLES, 25, 3);
  gl.uniform1i(u_index_location, 1);
  gl.drawArrays(gl.TRIANGLES, 63, 3);
  gl.drawArrays(gl.TRIANGLES, 66, 3);
  gl.uniform1i(u_index_location, 8);
  gl.drawArrays(gl.LINES, 4, 2);
  gl.drawArrays(gl.LINES, 6, 2);
  gl.drawArrays(gl.LINES, 8, 26);
  gl.drawArrays(gl.LINES, 32, 2);
  gl.drawArrays(gl.LINES, 35, 2);
  gl.drawArrays(gl.LINES, 41, 10);
  
  
  
  // --TARGET--
  gl.bindBuffer(gl.ARRAY_BUFFER, target_buffer);
  gl.vertexAttribPointer(a_position_location, 2, gl.FLOAT, false, 0, 0);

  if (target_origin_x + (target_size/2) < x_bound_right && x_trans_direction == "right") {
   
    gl.uniform2f(u_translation_location, target_origin_x, 0.0);
    target_origin_x += 0.01;
    console.log("first if");
  }

  if (target_origin_x + (target_size/2) >= x_bound_right && x_trans_direction == "right") {
    
    x_trans_direction = "left";
    console.log("second if");
  
  }


  if (target_origin_x - (target_size/2) > x_bound_left && x_trans_direction == "left") {
    
    gl.uniform2f(u_translation_location, target_origin_x, 0.0);
    target_origin_x -= 0.01;
    console.log("third if");


  }

  if (target_origin_x - (target_size/2) <= x_bound_left && x_trans_direction == "left") {

    x_trans_direction = "right";
    console.log("fourth if");

  }

gl.uniform2f(u_scale_location, 1.0, 1.0);
gl.uniform2f(u_rotation_location, 0.0, 1.0);
gl.uniform1i(u_index_location, 8);
gl.drawArrays(gl.LINE_LOOP, 0, 360);  
gl.uniform1i(u_index_location, 6);
gl.drawArrays(gl.TRIANGLE_FAN, 360, 360);
gl.uniform1i(u_index_location, 8);
gl.drawArrays(gl.LINE_LOOP, 720, 360);
gl.uniform1i(u_index_location, 7);
gl.drawArrays(gl.TRIANGLE_FAN, 1080, 360);
gl.uniform1i(u_index_location, 8);
gl.drawArrays(gl.LINE_LOOP, 1440, 360);
gl.uniform1i(u_index_location, 6);
gl.drawArrays(gl.TRIANGLE_FAN, 1800, 360);  
gl.uniform1i(u_index_location, 8);
gl.drawArrays(gl.LINE_LOOP, 2160, 360);  
gl.uniform1i(u_index_location, 9);
gl.drawArrays(gl.TRIANGLE_FAN, 2520, 360);


requestAnimationFrame(animate_target);
}
