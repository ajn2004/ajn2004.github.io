function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                //alert(allText);
            }
        }
    }
    rawFile.send(null);
    return rawFile.responseText
}

function toggle_red(){
    // write the code to display red localizations only
    // This is accomplished simply by removing and adding loaded meshes to the scene
    if (red_on == 0){
    scene.add(red_mesh);
    red_on = 1;
    document.getElementById('red_button_text').innerHTML = 'Hide Red Localizations';
    }else{
        red_on = 0
        scene.remove(red_mesh);
        document.getElementById('red_button_text').innerHTML = 'Show Red Localizations';
    }

}
function toggle_orange(){
    // write the code to display orange localizations only
    
    if (orange_on == 0){
    scene.add(orange_mesh);
    orange_on = 1;
    document.getElementById('orange_button_text').innerHTML = 'Hide Orange Localizations';
    }else{
        orange_on = 0
        scene.remove(orange_mesh);
        document.getElementById('orange_button_text').innerHTML = 'Show Orange Localizations';
    }
}

function toggle_scale(){
    // scale_on represents whether a scale is present on the scene
    
    
    if (!scale_on){
        // no scale present, build one
    scene.add(dash_x);
    scene.add(dash_y);
    scene.add(dash_z);
    center_scale();

    }else{
        // scale is present, remove it
        scene.remove(dash_x);
        scene.remove(dash_y);
        scene.remove(dash_z);
        
    }
    scale_on = !scale_on;
}
function show_both_colors(){
    // just reset everything by clearing scene and adding both meshes
    clear_scene();
    scene.add(red_mesh);
    scene.add(orange_mesh);
    orange_on = 1;
    document.getElementById('orange_button_text').innerHTML = 'Hide Orange Localizations';
    red_on = 1;
    document.getElementById('red_button_text').innerHTML = 'Hide Red Localizations';
}


function parse_data(all_text){
    lines = all_text.split("\n");
    
    var length = Object.keys(lines).length;
    
    var orange_x = new Array(length);
    var orange_y = new Array(length);
    var orange_z = new Array(length);
    for(i=0; i< length; i++){
        // parse data to arrays
        data = lines[i].split(',');
        
        orange_x[i] = parseFloat(data[0]);
        orange_y[i] = parseFloat(data[1]);
        orange_z[i] = parseFloat(data[2]);
    }
    
    return [orange_x, orange_y, orange_z];
}


function update_position(movement){
    // make radial vector
    var R = Math.sqrt((camera.position.x + movement.x)*(camera.position.x + movement.x) +(camera.position.y + movement.y)*(camera.position.y + movement.y) +(camera.position.z + movement.z)*(camera.position.z + movement.z))
    
    if (R < 15){ // if radius is less than 15, update movement, this prevents zooming out infinitely far
    camera.position.add(movement);
    }
}
// Movement Controls
function keyboardMovement(event){
    // Implement basic WASD controls
    // The camera is oriented towards the -z' axi
    
    var a = new THREE.Euler(camera.rotation.x,camera.rotation.y,camera.rotation.z,'XYZ');
    
    if(event.altKey){
        alt_keycodes(event);
    } else if(event.ctrlKey){
        ctrl_keycodes(event);
    } else{
        keycodes(event);
    }
}

function center_scale(){
    // Center scale to field of view
    if(toggle_scale_movement){
    dash_x.position.set(camera.position.x + camera.view.x*2, camera.position.y + camera.view.y*2,camera.position.z + camera.view.z*2 )
    dash_y.position.set(camera.position.x + camera.view.x*2, camera.position.y + camera.view.y*2,camera.position.z + camera.view.z*2 )
    dash_z.position.set(camera.position.x + camera.view.x*2, camera.position.y + camera.view.y*2,camera.position.z + camera.view.z*2 )
    }
    
}

function alt_keycodes(event){// behavior for alt modified keys
    var a = new THREE.Euler(camera.rotation.x,camera.rotation.y,camera.rotation.z,'XYZ');
    var b = new THREE.Vector3() // application vector
    var step_size = 0.01; 
    if(event.keyCode == 51){
        // forward thruster
         b.z = -step_size; // step 'along -zprime'
         camera.velocity.add(b.applyEuler(a));
         
    } else if(event.keyCode == 54){
        // upward thruster
        b.z = step_size;
        camera.velocity.add(b.applyEuler(a));
        
    }else if(event.keyCode == 50){
        // upward thruster
        b.y = step_size;
        camera.velocity.add(b.applyEuler(a));
        
    } else if(event.keyCode == 53){
        // downward thruster
        b.y = -step_size;
        camera.velocity.add(b.applyEuler(a));
        
    }else if(event.keyCode == 49){
        // upward thruster
        b.x = -step_size;
        camera.velocity.add(b.applyEuler(a));
        
    } else if(event.keyCode == 52){
        // downward thruster
        b.x = step_size;
        camera.velocity.add(b.applyEuler(a));
        
    } else if(event.keyCode == 18){
    } else{ // if unbound display keycode
        disp(event.keyCode)    
    }
}

function ctrl_keycodes(event){// behavior for ctrl modified keys
    // Orbital controls to orbit the scale
    // our R vector is the vector that goes from the scale to our camera which defines it as
    // R camera_position - scale_position
    
    var a = new THREE.Euler(camera.rotation.x,camera.rotation.y,camera.rotation.z,'XYZ');
    var b = new THREE.Vector3() // application vector
    var step_size = 0.1; 
    if(event.keyCode == 51){
        // increment omega 3 
        disp(event)
         b.z = -step_size; // step 'along -zprime'
         camera.omega.add(b.applyEuler(a));
    } else if(event.keyCode == 54){
        // decrement omega 3
        b.z = step_size;
        camera.omega.add(b.applyEuler(a));
        
    } else if(event.keyCode == 50){
        // increment omega 2
        b.y = -step_size;
        camera.omega.add(b.applyEuler(a));
        
    }  else if(event.keyCode == 53){
        // decrement omega 2
        b.y = step_size;
        camera.omega.add(b.applyEuler(a));
        
    } else if(event.keyCode == 49){
        // increment omega 1
        b.x = -step_size;
        camera.omega.add(b.applyEuler(a));
        
    } else if(event.keyCode == 52){
        // decrement omega 1
        b.x = step_size;
        camera.omega.add(b.applyEuler(a));
        
    } else if(event.keyCode == 17){
    } else{ // if unbound display keycode
        disp(event.keyCode)    
    }
    
}

function keycodes(event){// Behavior for non modified keys
    var a = new THREE.Euler(camera.rotation.x,camera.rotation.y,camera.rotation.z,'XYZ');
    var step_size = 0.05;
    if ( event.keyCode == 87){
        // Moving 'forward'
        var b = new THREE.Vector3(0, 0, -step_size); // step 'along -zprime'
        movement = b.applyEuler(a);
        
        update_position(movement);
        
    } else if ( event.keyCode == 83){
        // Moving 'backward'
        var b = new THREE.Vector3(0, 0, +step_size); // step 'along -zprime'
        movement = b.applyEuler(a);
        update_position(movement);
        
    } else if ( event.keyCode == 65){
        // Strafe left
        var b = new THREE.Vector3(-step_size, 0, 0); // step 'along -zprime'
        movement = b.applyEuler(a);
        update_position(movement);
        
    } else if ( event.keyCode == 68){
        // Strafe right
        var b = new THREE.Vector3(step_size, 0, 0); // step 'along -zprime'
        movement = b.applyEuler(a);
        update_position(movement);
        
    } else if ( event.keyCode == 32){
        // move 'up'
        var b = new THREE.Vector3(0, step_size, 0); // step 'along -zprime'
        movement = b.applyEuler(a);
        update_position(movement);
        
    } else if ( event.keyCode == 88){
        // move 'down'
        var b = new THREE.Vector3(0, -step_size, 0); // step 'along -zprime'
        movement = b.applyEuler(a);
        update_position(movement);
         
    } else if ( event.keyCode == 53){
        // toggle scale movement
        toggle_scale_movement = !toggle_scale_movement
         
    }else if ( event.keyCode == 52){
        // toggle scale movement
        toggle_scale();
         
    } else if (event.keyCode == 51 || event.keyCode == 81){
        // q or 3 should rotate view
        var qm = new THREE.Quaternion();
        qm.setFromAxisAngle(camera.view,Math.PI/30)
        camera_quarternion_rotation(qm)
         
    } else if ( event.keyCode == 69 || event.keyCode == 54){
        // e or 6 should unrotate
       
        var qm = new THREE.Quaternion();
        qm.setFromAxisAngle(camera.view,-Math.PI/30)
        camera_quarternion_rotation(qm)
       
         
    }else if ( event.keyCode == 49){
        // 1 allows for a red toggle
        toggle_red()
    }   else if ( event.keyCode == 50){
        // 2 allows for a red toggle
        toggle_orange()
    } else if ( event.keyCode == 82){
        // reset
        
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 10;
        reset_rotation(camera)
        camera.quaternion = new THREE.Quaternion(0,0,0,1)
        camera.view = new THREE.Vector3(0,0,-1);
        camera.left = new THREE.Vector3(1,0,0);
        camera.up_q = new THREE.Vector3(0,1,0);
        camera.velocity = new THREE.Vector3(0,0,0);

        reset_rotation(red_mesh)
        reset_rotation(orange_mesh)
        reset_rotation(dash_x)
        reset_rotation(dash_y)
        reset_rotation(dash_z)
    } else{
        disp(event.keyCode)    
    }
}
function reset_rotation(object){
    object.rotation.x = 0;
    object.rotation.y = 0;
    object.rotation.z = 0;
}
function camera_reset(){
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 10;
        camera.rotation.x = 0;
        camera.rotation.y = 0;
        camera.rotation.z = 0;
        camera.quaternion.z = 0;
        camera.quaternion.w = 1;
}



function mouseAction(event){
    // Rotational controls
    mouse_x = event.x;
    mouse_y = event.y;
    if (event.button == 2){
        // Left Click rotates object
        camera_y = camera.rotation.y;
        camera_x = camera.rotation.x;
        window.addEventListener("mousemove", cameraRotation); 
    } else if (event.button == 0){
        // Right click rotates camera
        object_y = red_mesh.rotation.y;
        object_x = red_mesh.rotation.x;
        object_z = red_mesh.rotation.z;
        window.addEventListener("mousemove", objectRotation);   
    }
    
}

function camera_quarternion_rotation(qm){
    // Rotates camera by qm and adjusts positional vectors accordingly
    qms = qm.clone()
    camera.applyQuaternion(qm);
    camera.left.applyQuaternion(qm);
    camera.view.applyQuaternion(qm);
    camera.up_q.applyQuaternion(qm);
    camera.velocity.applyQuaternion(qm);
    camera.acceleration.applyQuaternion(qm);
    center_scale()    
}

function cameraRotation(event){
    // handles camera rotation
    // rotate camera by a difference between  mouse drag
    // determine euler

    // View vector keeps track of intersection of camera view axis and a unit circle centered around the camera
    // plan of attack is to change mouse events into theta and phi events
    // up and view define third axis through cross product
    // We can always rotate around the 'up' and 'left' axis to get our
    // yaw and pitch. So the trick then becomes defining them by keeping track
    // From there camera.rotateOnAxis()
    //camera.left = camera.view;
    //camera.left.cross(camera.up);


    // yaw rotation
    // We are rotating vectors left and view about up
    var angle_step = 0.02;
    var angle = (mouse_x - event.x)*angle_step;
    var up_rot = new THREE.Quaternion()
    up_rot.setFromAxisAngle(camera.up_q, angle/2);
    var left_rot = new THREE.Quaternion()
    
    
    camera_quarternion_rotation(up_rot)
    var angle = (mouse_y - event.y)*angle_step;
    left_rot.setFromAxisAngle(camera.left, angle/2);   
    camera_quarternion_rotation(left_rot)
    

    mouse_x = event.x;
    mouse_y = event.y;
    
    
    
    
   
}

function objectRotation(event){
    // handles object rotation
    // rotate object by a difference between  mouse drag
    // We want to determine the proper axes of rotation by
    // Cross view with 
    var angle_step = 0.02;
    var up_rot = new THREE.Quaternion();
    var left_rot = new THREE.Quaternion();
    
    var angle = -(mouse_x - event.x)*angle_step;
    up_rot.setFromAxisAngle(camera.up_q, angle/2)
    red_mesh.applyQuaternion(up_rot);
    orange_mesh.applyQuaternion(up_rot);
    dash_x.applyQuaternion(up_rot);
    dash_y.applyQuaternion(up_rot);
    dash_z.applyQuaternion(up_rot);
    
    var angle = -(mouse_y - event.y)*angle_step;
    left_rot.setFromAxisAngle(camera.left, angle/2)
    red_mesh.applyQuaternion(left_rot);
    orange_mesh.applyQuaternion(left_rot);
    dash_x.applyQuaternion(left_rot);
    dash_y.applyQuaternion(left_rot);
    dash_z.applyQuaternion(left_rot);
    if(!toggle_scale_movement){
        // in the event toggle_scale_movement is false, cross should rotate w/ scenery
        dash_x.position.applyQuaternion(up_rot);
        dash_x.position.applyQuaternion(left_rot);
        dash_y.position.applyQuaternion(up_rot);
        dash_y.position.applyQuaternion(left_rot);
        dash_z.position.applyQuaternion(up_rot);
        dash_z.position.applyQuaternion(left_rot);
    }
    mouse_x = event.x;
    mouse_y = event.y;
   
}
function objectTranslation(event){
    // handles object rotation
    // rotate object by a difference between  mouse drag
    var b = new THREE.Vector3((mouse_y - event.y)*0.01 ,(mouse_x - event.x)*0.01,   0);
   
    var rotation = b;
    red_mesh.rotation.x = object_x - rotation.x;
    red_mesh.rotation.y = object_y - rotation.y;
    red_mesh.rotation.z = object_z - rotation.z
    orange_mesh.rotation.x = object_x - rotation.x;
    orange_mesh.rotation.y = object_y - rotation.y;
    orange_mesh.rotation.z = object_z - rotation.z;
    
    
   
}
function removeMouseUp(event){
    window.removeEventListener("mousemove",cameraRotation);
    window.removeEventListener("mousemove",objectRotation);
    
}

function scrollZoom(event){
        
         // Moving 'forward'
         if(event.altKey){
 // rotate in view in the left hand curl direction
            var angle = event.deltaY*0.001;
            var qm = new THREE.Quaternion();
            qm.setFromAxisAngle(camera.view,angle/2)
            camera_quarternion_rotation(qm)
         }else{
            var step_size = -0.005*event.deltaY;
            var a = new THREE.Euler(camera.rotation.x,camera.rotation.y,camera.rotation.z,'XYZ');
            var b = new THREE.Vector3(0, 0, -step_size); // step 'along -zprime'
            movement = b.applyEuler(a);
            
            update_position(movement);
         }
}

function disp(object){
    console.log(object);
}

// window listeners for navigation
window.addEventListener("keydown", keyboardMovement);
window.addEventListener("mousedown", mouseAction);
window.addEventListener("mouseup", removeMouseUp);
window.addEventListener("mousewheel", scrollZoom);
window.addEventListener("dragover", function(e){
    e.preventDefault();
})
window.addEventListener("drop", function(e){
    e.preventDefault();
})

// Drag and drop functionality


function preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
   }

function highlight(e){
    dropArea.classList.add('highlight')
}
function unhighlight(e){
    dropArea.classList.remove('highlight')
}

function handleDrop(e){
    let dt = e.dataTransfer
    let file = dt.files
    // assume the user will only drop json files
    try{
        fileext = file[0].name.substring(file[0].name.length - 4, file[0].name.length);
        if (fileext == "json"){
            fr = uploadFile(file)
        }else{

        }
    }
    catch(err){}

}

async function uploadFile(file){
    var fr = new FileReader();
    fr.readAsText(file.item(0))
    fr.onload = function(e) { 
    var result = JSON.parse(e.target.result);
    var formatted = JSON.stringify(result, null, 2);
    clear_scene();
    build_new_json_scene(result);
    }
    
}

function local_json_load(file){
    fetch(file).then(response=>{return response.json();}).then(result => build_new_json_scene(result))
}

function build_new_json_scene(results){
        // Red color
        red_mesh = build_new_geometry(results.red.x, results.red.y, results.red.z,0.02);
        try{// try to assign legened information
            
            document.getElementById('red_legend_text').innerHTML = results.red.tag;
        }
        catch(err){}
        scene.add(red_mesh)
        
             // orange color
        orange_mesh = build_new_geometry(results.orange.x, results.orange.y, results.orange.z,0.025);
        scene.add(orange_mesh)
        try{// try to assign legened information
            
            document.getElementById('orange_legend_text').innerHTML = results.orange.tag;
        }
        catch(err){}
        
        try{// try to assign info
            
            document.getElementById('description').innerHTML = results.info;
            document.getElementById('title').innerHTML = results.title;
        }
        catch(err){}
        
        
        
        
} 

function build_new_geometry(x,y,z, radius)
        {// function to build a geomtry and return the mesh
            var final_geometry = new THREE.Geometry();
            for (i=0; i<x.length; i++)
            {// loop over all molecules and add them to the geometry
                
                var geometry = new THREE.SphereGeometry( radius,circle_size,circle_size);
            //var material = new THREE.MeshLambertMaterial({color : 0xFFCC00});
            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x[i], y[i], z[i]);
            mesh.updateMatrix();
            final_geometry.merge(mesh.geometry, mesh.matrix);
            }
            if(radius == 0.025){// 0.025 is radius of a vesicle meaning orange
                
                var material = new THREE.MeshLambertMaterial({color : 0xc6ff00});
                return new THREE.Mesh(final_geometry, material)
            }else{
                
                var material = new THREE.MeshLambertMaterial({color : 0xff2b00});
                return new THREE.Mesh(final_geometry, material)
            }
        }