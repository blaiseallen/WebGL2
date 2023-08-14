/*

    --VERTEX SHADER SOURCE-- 

    - One attribute "a_position"
    - Three uniforms "u_translation, u_rotation, u_scale"
    - All of which are vec 2
    
    - "a_position"
        - Takes an the positions binded to the "ARRAY_BUFFER" object for any particular buffer that
          has been created and binded
        - All position data is stored in its own buffer; this is not the most efficent method but I 
          was having issues with the "vertexAttribPointer()" method, the offset and data set 
          attribute were not working properly, I watched countless videos, read documentation and 
          reference guides, and even completed a free WebGL2 course, but to no avail; so for the time
          being I cut my loses and did what I could
        
    - "u_translation, u_rotation, u_scale"
        - All of these values simply manipulate the a_position value for each vertice in a given buffer
          when set by the corresponding uniform function

*/

          
const vertexShaderSource = `#version 300 es

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

  --FRAGMENT SHADER SOURCE--

  - Two Uniforms "u_color" & "u_index"
  
  - "u_color"
    - Is a uniform of vec4 matricies, there exactly 11 vec4's corresponding to color values that I used
      throughout the scene of the 2D proof of concept, it works in conjunction with the "u_index" uniform
      to set color values based on the setter functions and draw calls 

  - "u_index"
    - Takes a int as an index value which sets the color value for a given set or subset of vertices within 
      a buffer to establish the color of the objects being drawn

*/
const fragmentShaderSource = `#version 300 es

precision highp float;
  
uniform vec4 u_color[11];
uniform int u_index; 
out vec4 outColor;
  
  void main() {
    outColor = u_color[u_index];
  }
  `;
 
// Global variables I use to compute my target animations
var target_size = .08;
var target_origin_x = 0.0;
var x_trans_direction = "right";
var x_bound_left = -0.3;
var x_bound_right = 0.3;

// Global variables that have not yet been initialized due to issue that are explained in the file to submitted in conjunction with this one
var outter_red;
var white;
var inner_red;
var bulls_eye;

  
//main program of which is not called until the call back function below does so
function webglprogram(data) { 
const canvas = document.querySelector("#webgl");
const gl = canvas.getContext("webgl2");  
    
  
// this is all shader initialization code
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
 
// WebGl2 methods for getting the location of my attribute and unifrom variables
const a_position_location = gl.getAttribLocation(program, "a_position");
const u_scale_location = gl.getUniformLocation(program, "u_scale");
const u_rotation_location = gl.getUniformLocation(program, "u_rotation");
const u_translation_location = gl.getUniformLocation(program, "u_translation");
const u_color_location = gl.getUniformLocation(program, "u_color");
const u_index_location = gl.getUniformLocation(program, "u_index");  

// initializes the "u_color" uniform variable with the 11 different matrices that correspond to color values
gl.uniform4fv(u_color_location, [
    0.0, 0.0, 0.0, 0.3, //Lightest - Gray   = [0]
    0.0, 0.0, 0.0, 0.4, //         - Gray   = [1]
    0.0, 0.0, 0.0, 0.5, //         - Gray   = [2]
    0.0, 0.0, 0.0, 0.6, //         - Gray   = [3]
    0.0, 0.0, 0.0, 0.7, //         - Gray   = [4]
    0.0, 0.0, 0.0, 0.8, //Darkest  - Gray   = [5]
    1.0, 0.0, 0.0, 1.0, //         - Red    = [6]
    0.0, 0.0, 0.0, 0.0, //         - White  = [7]
    0.0, 0.0, 0.0, 1.0, //         - Black  = [8]
    0.0, 1.0, 0.0, 1.0, //         - Green  = [9]
    0.4, 0.0, 0.6, 1.0, //         - Purple = [10]
]);

// Simple clear color & clear method call, i.e. clears the canvas
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// create, binds, & sets data, for the scene buffer which binds all of my 2D scene data to the "ARRAY_BUFFER" object to drawn promptly after
var scene_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, scene_buffer);
gen_scene_data(gl);
gl.enableVertexAttribArray(a_position_location);
gl.vertexAttribPointer(a_position_location, 2, gl.FLOAT, false, 0, 0);

// multiple draw calls to draw the various components of my 2D scene store in the "scene_buffer"
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
// ^^^ various draw calls very inefficent but I made do with the time I had and the other problems I was experiencing 


// create, binds, & sets data, for the target buffer which stores the vertices for my target
var target_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, target_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
gl.enableVertexAttribArray(a_position_location);
gl.vertexAttribPointer(a_position_location, 2, gl.FLOAT, false, 0, 0);

// draws target, again inefficent and some what redudant, redundancy in particular with the resetting of the uniforms corresponding to the scale, rotation, and translation values
gl.uniform2f(u_scale_location, 1.0, 1.0);
gl.uniform2f(u_rotation_location, 0.0, 1.0);
gl.uniform2f(u_translation_location, 0.0, 0.0);
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


// animation function which animates my target in a given direction based on global variables that establish bounds for the target animation
function animate_target() {
 
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  // --SCENE--
  gl.bindBuffer(gl.ARRAY_BUFFER, scene_buffer);
  gl.enableVertexAttribArray(a_position_location);
  gl.vertexAttribPointer(a_position_location, 2, gl.FLOAT, false, 0, 0);
  
  // have to redraw scene each time the requestanimationframe() method is called and the canvas is cleared
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
  
  
  // have to bind to array buffer once again to draw my target animations
  // --TARGET--
  gl.bindBuffer(gl.ARRAY_BUFFER, target_buffer);
  gl.vertexAttribPointer(a_position_location, 2, gl.FLOAT, false, 0, 0);

  // translates target to the right by .0015 each time the animation function is called and the check is true
  if (target_origin_x + (target_size/2) < x_bound_right && x_trans_direction == "right") {
   
    gl.uniform2f(u_translation_location, target_origin_x, 0.0);
    target_origin_x += 0.0015;
  

  }
  // changes direction of the target translation to the left
  if (target_origin_x + (target_size/2) >= x_bound_right && x_trans_direction == "right") {
    
    x_trans_direction = "left";

  
  }

  // translates target to the left by .0015 each time the animation function is called and the check is true
  if (target_origin_x - (target_size/2) > x_bound_left && x_trans_direction == "left") {
    
    gl.uniform2f(u_translation_location, target_origin_x, 0.0);
    target_origin_x -= 0.0015;




  }
  // changes the direction  of the target translation back to right
  if (target_origin_x - (target_size/2) <= x_bound_left && x_trans_direction == "left") {

    x_trans_direction = "right";


  }
// draws target
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

// recursive call 
requestAnimationFrame(animate_target);
}
// initial request animation frame call 
requestAnimationFrame(animate_target);
// event listener that calls a function when the "mousemove" event is sensed on the canvas element 
canvas.addEventListener("mousemove", function (e) { shoot(e, "noshoot", canvas, gl, a_position_location, u_scale_location, u_rotation_location, u_translation_location, u_index_location)});
// event listener that calls a function when the "mousedown" event is sensed on the canvas element 
canvas.addEventListener("mousedown", function (e) { shoot(e, "shoot", canvas, gl, a_position_location, u_scale_location, u_rotation_location, u_translation_location, u_index_location)})

}



//--OBJECT FUNCTION CALLS: creates circles for target 
var c_coords = Circle(.08, [0.0, 0.26]);
var c_coords1 = Circle(.079, [0.0, 0.26]);
var c_coords2 = Circle(.054, [0.0, 0.26]);
var c_coords3 = Circle(.054, [0.0, 0.26]);
var c_coords4 = Circle(.0315, [0.0, 0.26]);
var c_coords5 = Circle(.0315, [0.0, 0.26]);
var c_coords6 = Circle(.0107, [0.0, 0.26]);
var c_coords7 = Circle(.0107, [0.0, 0.26]);
// initial call to the caller function that puts all of the vetice data for the targets in one buffer
data([c_coords, c_coords1, c_coords2, c_coords3, c_coords4, c_coords5, c_coords6, c_coords7], null, 0);

// dummy function for generating scene data, very inefficent there are webgl2 methods provide for creating a buffer of all the unique verices into one buffer, and using an attribute to iterate over the data so that the drawcalls work more efficently 
function gen_scene_data(gl) {
    var data =
    [-0.3, -0.2,    -0.3,  0.2,    0.3, -0.2, //  First Triangle  - TARGET PLATFORM
      0.3, -0.2,     0.3,  0.2,   -0.3,  0.2, //  Second Triagnle - TARGET PLATFORM
     -0.3, -0.2,     0.3, -0.2,   -0.35, 0.0,
      0.35, 0.0,    -0.35,-0.2,    0.35,-0.2,
     -0.35, 0.0,    -0.3, 0.05,    0.35, 0.0,
      0.3, 0.05,    -0.35,-0.2,   -0.35, 0.0,
      0.35,-0.2,     0.35, 0.0,    -0.3,0.05,
      0.3,  0.05,   -0.26,0.22,    0.26,0.22,
    -0.26, 0.22,     -0.3,0.2,     0.26,0.22,  //32 (32,33) and 35 (35,36)
      0.3,  0.2,      0.3,0.2,     0.3, 0.05,  //-.35, -0.2, 0.35, -0.2
     -0.3,  0.2,     -0.3,0.05,
     -1.0, -1.0,    -0.35, -0.2,    1.0, -1.0, //  First Triangle  - SHOOTING LANE
      1.0, -1.0,     0.35, -0.2,   -1.0, -1.0, //  Second Triangle - SHOOTING LANE 
     -0.35, -0.2,     0.35, -0.2,    0.0, -0.41, //  Third Triangle  - SHOOTING LANE
     -1.0,  1.0,    -0.26,  0.6,               //  Background Line - SHOOTING LANE - TOP LEFT
      1.0,  1.0,     0.26,  0.6,               //  Background Line - SHOOTING LANE - TOP RIGHT
      0.26,  0.6,    -0.26,  0.6,               //  Background Line - SHOOTING LANE - TOP MIDDLE
     -0.26,  0.6,    -0.26,  0.22,               //  Background Line - SHOOTING LANE - BOTTOM LEFT
      0.26,  0.6,     0.26,  0.22,               //  Background Line - SHOOTING LANE - BOTTOM RIGHT
     -1.0,  -1.0,    -1.0,   1.0,
     -0.26,  0.6,     -1.0, -1.0,
     -0.26,  0.6,     -0.26,  -0.2, 
      1.0, -1.0,      1.0, 1.0,  
      0.26, 0.6,      1.0, -1.0,
      0.26, 0.6,      0.26,  -0.2, 
     -1.0,-1.0,     -0.35, -0.2, 
     -0.26, -0.2,    1.0, -1.0,
      0.35, -0.2,    0.26,-0.2,
    ];
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return;
  }

// caller function
function data(out_data, in_data, j) {
    gen_data_forbuff(out_data, in_data, data, j);  
}

// call back function -- again puts all the data for the targets into a single buffer 
function gen_data_forbuff(data_sets, data, callback, j) {
    if (data == null && j < data_sets.length) {
        var data = [];
        for (i = 0; i < data_sets[j].length; i++) {
            data[i] = data_sets[j][i];
        }
        j += 1;
        callback(data_sets, data, j)
    }
    if (data != null && j < data_sets.length) {
        for (i = 0; i < data_sets[j].length; i++) {
            data[data.length] = data_sets[j][i];
        }
        j += 1;
        callback(data_sets, data, j)
    }
    if (data != null && j == data_sets.length) {
        webglprogram(data);
    }
}

// ui event function, when mouse is sensed on canvas it draws the optic, and when click is sensed it determines if a user has clicked or "shot" the target
function shoot(e, shoot, canvas, gl, a_position_location, u_scale_location, u_rotation_location, u_translation_location, u_index_location) {
  
  var hit_or_miss = null;

  var cross_hairsx = (((e.clientX / canvas.width) * 2 -1) - .02);
  var cross_hairsy = ((((e.clientY / canvas.height) * 2 -1) * -1) + .02);
 



  var dot = box(.040, .020, [cross_hairsx, cross_hairsy]);
  var ring = Circle(.030, [cross_hairsx, cross_hairsy]);
  

  var crosshairs_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, crosshairs_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dot), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(a_position_location);
  gl.vertexAttribPointer(a_position_location, 2, gl.FLOAT, false, 0, 0);
  

  gl.uniform2f(u_translation_location, 0.0, 0.0);
  gl.uniform2f(u_scale_location, 1.0, 1.0);
  gl.uniform2f(u_rotation_location, 0.0, 1.0);
  gl.uniform1i(u_index_location, 10);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);


  var scope_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, scope_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ring), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(a_position_location);
  gl.vertexAttribPointer(a_position_location, 2, gl.FLOAT, false, 0, 0);
  

  gl.uniform1i(u_index_location, 8);
  gl.drawArrays(gl.LINE_LOOP, 0, 71);
  
  if (shoot == "shoot") {
    var click_distance = Math.sqrt(((target_origin_x - cross_hairsx)**2)+((.026 - cross_hairsy)**2));
    var target_distance = Math.sqrt(((target_origin_x - c_coords1[0])**2)+((.026 - c_coords1[1])**2));
    if (click_distance <= target_distance){
      hit_or_miss = "HIT!!!";
      console.log(hit_or_miss);
      return;
    }
    else{
      hit_or_miss == "MISS!!!"
      console.log(hit_or_miss);
      return;
    }
  }


}

// generates a shape that serves as apart of the optic 
function box(height, width, origin){
  const data = [];

   var y = height/2
   var x = width/2;

   var c1_x = origin[0];
   var c1_y = origin[1] + y;
   var c2_x = origin[0] - x;
   var c2_y = origin[1];
   var c3_x = origin[0];
   var c3_y = origin[1] - y;
   var c4_x = origin[0]; 
   var c4_y = origin[1] + y;
   var c5_x = origin[0] + x;
   var c5_y = origin[1];
   var c6_x = origin[0];
   var c6_y = origin[1] - y;


   data.push(c1_x, c1_y, c2_x, c2_y, c3_x, c3_y, c4_x, c4_y, c5_x, c5_y, c6_x, c6_y);
   return data;
}

// generates circle dat used for creating the target and the optic
function Circle(radius, origin) {
    var i = 0;
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

