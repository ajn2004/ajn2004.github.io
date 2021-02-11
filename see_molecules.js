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

function test_threes(){
    
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

        // Movement Controls
        function keyboardMovement(event){
            // Implement basic WASD controls
            // The camera is oriented towards the -z' axis

            step_size = 0.05;
            var a = new THREE.Euler(camera.rotation.x,camera.rotation.y,camera.rotation.z,'XYZ');
            var o = new THREE.Vector3(0,0, -step_size); // original orientation vector for camera
            
            
            if ( event.keyCode == 87){
                // Moving 'forward'
                var b = new THREE.Vector3(0, 0, -step_size); // step 'along -zprime'
                movement = b.applyEuler(a);
                camera.position.x += movement.x;
                camera.position.y += movement.y;
                camera.position.z += movement.z;
                
            } else if ( event.keyCode == 83){
                // Moving 'backward'
                var b = new THREE.Vector3(0, 0, +step_size); // step 'along -zprime'
                movement = b.applyEuler(a);
                camera.position.x += movement.x;
                camera.position.y += movement.y;
                camera.position.z += movement.z;
                
            } else if ( event.keyCode == 65){
                // Strafe left
                var b = new THREE.Vector3(-step_size, 0, 0); // step 'along -zprime'
                movement = b.applyEuler(a);
                camera.position.x += movement.x;
                camera.position.y += movement.y;
                camera.position.z += movement.z;
                
            } else if ( event.keyCode == 68){
                // Strafe right
                var b = new THREE.Vector3(step_size, 0, 0); // step 'along -zprime'
                movement = b.applyEuler(a);
                camera.position.x += movement.x;
                camera.position.y += movement.y;
                camera.position.z += movement.z;
                
            } else if ( event.keyCode == 32){
                // move 'up'
                var b = new THREE.Vector3(0, step_size, 0); // step 'along -zprime'
                movement = b.applyEuler(a);
                camera.position.x += movement.x;
                camera.position.y += movement.y;
                camera.position.z += movement.z;
                
            } else if ( event.keyCode == 88){
                // move 'down'
                var b = new THREE.Vector3(0, -step_size, 0); // step 'along -zprime'
                movement = b.applyEuler(a);
                camera.position.x += movement.x;
                camera.position.y += movement.y;
                camera.position.z += movement.z;
                 
            } else if ( event.keyCode == 81){
                // look at origin and orient
               
                camera.lookAt(0,0,0);
                disp(camera.rotation)
                 
            } else if ( event.keyCode == 82){
                // reset
                var b = new THREE.Vector3(0, -step_size, 0); // step 'along -zprime'
                movement = b.applyEuler(a);
                camera.position.x = 0;
                camera.position.y = 0;
                camera.position.z = 10;
                camera.rotation.x = 0;
                camera.rotation.y = 0;
                camera.rotation.z = 0;
                orange_mesh.rotation.x = 0;
                orange_mesh.rotation.y = 0;
                orange_mesh.rotation.z = 0;
                 
            } else{
                disp(event.keyCode)    
            }
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
                object_y = final_mesh.rotation.y;
                object_x = final_mesh.rotation.x;
                object_z = final_mesh.rotation.z;
                window.addEventListener("mousemove", objectRotation);   
            }
            
        }
        function cameraRotation(event){
            // handles camera rotation
            // rotate camera by a difference between  mouse drag
            camera.rotation.y = camera_y + (mouse_x - event.x)*0.005;
            camera.rotation.x = camera_x + (mouse_y - event.y)*0.005;
           
        }
        function objectRotation(event){
            // handles object rotation
            // rotate object by a difference between  mouse drag
            var b = new THREE.Vector3(0 , (mouse_x - event.x)*0.01 , (mouse_y - event.y)*0.01);
            // Now we want to determine how to rotate along the y_prime and z_prime axes
            // The prime frame is the on where the x-axis runs from the origin to the camera, and the y-axis sits in the object's x-y plane
            // spherical coords inform our choices of axes
            var radial = Math.sqrt(camera.position.x*camera.position.x+ camera.position.y*camera.position.y + camera.position.z*camera.position.z);
            var phi = Math.acos(camera.position.z/radial); 
            // to get to the prime frame from the object frame, we will rotate theta in z followed by phi rotation in y_prime
            var theta = Math.atan2(camera.position.y,camera.position.x);
            
            var a = new THREE.Euler(0 ,-phi, -theta, 'ZYX')
            var rotation = b.applyEuler(a);
            orange_mesh.rotation.x = object_x + rotation.x;
            orange_mesh.rotation.y = object_y + rotation.y;
            orange_mesh.rotation.z = object_z + rotation.z;
            /*
            orange_mesh.rotation.y = object_y + (mouse_x - event.x)*0.01;
            orange_mesh.rotation.x = object_x + (mouse_y - event.y)*0.01;
            */
        }
        function removeMouseUp(event){
            window.removeEventListener("mousemove",cameraRotation);
            window.removeEventListener("mousemove",objectRotation);
        }
        window.addEventListener("keydown", keyboardMovement);
        window.addEventListener("mousedown", mouseAction);
        window.addEventListener("mouseup", removeMouseUp);