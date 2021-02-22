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

function runPython(){

    
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
    camera.position.x += movement.x;
    camera.position.y += movement.y;
    camera.position.z += movement.z;}
}
// Movement Controls
function keyboardMovement(event){
    // Implement basic WASD controls
    // The camera is oriented towards the -z' axi
    step_size = 0.05;// Step 50 nm at a time
    var a = new THREE.Euler(camera.rotation.x,camera.rotation.y,camera.rotation.z,'XYZ');
    var o = new THREE.Vector3(0,0, -step_size); // original orientation vector for camera
    
    
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
        red_mesh.rotation.x = 0;
        red_mesh.rotation.y = 0;
        red_mesh.rotation.z = 0
         
    } else{
        disp(event.keyCode)    
    }
}
function camera_reset(){
    camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 10;
        camera.rotation.x = 0;
        camera.rotation.y = 0;
        camera.rotation.z = 0;
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
function cameraRotation(event){
    // handles camera rotation
    // rotate camera by a difference between  mouse drag
    camera.rotation.y = camera_y + (mouse_x - event.x)*0.005;
    camera.rotation.x = camera_x + (mouse_y - event.y)*0.005;
   
}
function objectRotation(event){
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

function disp(object){
    console.log(object);
}

// window listeners for navigation
window.addEventListener("keydown", keyboardMovement);
window.addEventListener("mousedown", mouseAction);
window.addEventListener("mouseup", removeMouseUp);

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
    fileext = file[0].name.substring(file[0].name.length - 4, file[0].name.length);
    if (fileext == "json"){
        fr = uploadFile(file)
    }else{

    }
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

function build_new_json_scene(results){
        // Red color
        red_mesh = build_new_geometry(results.red.x, results.red.y, results.red.z,0.02);
        try{// try to assign legened information
            
            document.getElementById('red_legend_text').innerHTML = results.red.tag;
        }
        catch(err){}
        scene.add(red_mesh)
        disp(scene.children)
             // orange color
        orange_mesh = build_new_geometry(results.orange.x, results.orange.y, results.orange.z,0.025);
        scene.add(orange_mesh)
        try{// try to assign legened information
            
            document.getElementById('orange_legend_text').innerHTML = results.orange.tag;
        }
        catch(err){}
        
        try{// try to assign info
            
            document.getElementById('description').innerHTML = results.info;
        }
        catch(err){}
        
        document.getElementById('title').innerHTML = "";
        
        
} 

function build_new_geometry(x,y,z, radius)
        {// function to build a geomtry and return the mesh
            var final_geometry = new THREE.Geometry();
            disp(x)
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