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


  var c_coords = Circle(.08, [0.0, 0.26]);



  function gen_data_forbuff(data, original, callback, j) {
    var c_coords1 = Circle(.08, [0.0, 0.26]);
    var c_coords2 = Circle(.045, [0.0, 0.26]);
    var c_coords3 = Circle(.045, [0.0, 0.26]);
    var c_coords4 = Circle(.0215, [0.0, 0.26]);
    var c_coords5 = Circle(.0215, [0.0, 0.26]);
    var c_coords6 = Circle(.01075, [0.0, 0.26]);
    out_data = [c_coords1, c_coords2, c_coords3, c_coords4, c_coords5, c_coords6];


    if (original.length == 0 && j != out_data.length && data.length != 0) {
        for (i = 0; i < data.length; i++) {
            original[i] = data[i];
        }
        j+=1;
        callback(out_data[j], original, j);
    }

    if (original.length != 0 && j != out_data.length && data.length != 0){
        for (i=0; i<data.length; i++) {
            original[original.length] = data[i];
        }
        j+=1;
        callback(out_data[j], original, j);
    }

    else{
        console.log(original);
        return original;
    }

}



 function data(out_data, in_data, j) {

    gen_data_forbuff(out_data, in_data, data, j);
        
}


gen_data_forbuff(c_coords, [], data, 0);