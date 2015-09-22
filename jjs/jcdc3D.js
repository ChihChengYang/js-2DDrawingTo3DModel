 

var CDC={};

CDC.Floor=function(){
    this.Create = function(objname, Wsize, Hsize, textureFile, pos){
        var nFloorX = Wsize, nFloorY = 0.1, nFloorZ = Hsize;
        var boxGeoFloor     = new THREE.BoxGeometry( nFloorX, nFloorY, nFloorZ );
        var texFloor        = THREE.ImageUtils.loadTexture( textureFile );
        texFloor.wrapS = texFloor.wrapT = THREE.RepeatWrapping;
        texFloor.repeat.set( 32, 32 );
        //texFloor.needsUpdate  = true;
        var matFloor        = new THREE.MeshBasicMaterial( { map: texFloor } );
        var meshfloor       = new THREE.Mesh( boxGeoFloor , matFloor ); 
        meshfloor.name      = objname;
        meshfloor.position.set(pos.x, pos.y, pos.z);
        return meshfloor;
    };
};        
//=========================================================
//
//
//=========================================================
var jcdc3D = (function() {


function create(width, height) {
 
    var container, stats;
    var camera, controls, scene, renderer;
    var clock = new THREE.Clock();
    var raycaster = new THREE.Raycaster();
  //  var projector = new THREE.Projector();
    var directionVector = new THREE.Vector3();
    var SCREEN_HEIGHT;// = window.innerHeight;
    var SCREEN_WIDTH;// = window.innerWidth;
    var offsetX = 0;
    var offsetY = 0;
    var clickInfo = {
        x: 0,
        y: 0,
        userHasClicked: false
    };


    scene = new THREE.Scene();   
 
    container = document.getElementById( 'cdc2' );        
    SCREEN_WIDTH = width;//container.offsetWidth;
    SCREEN_HEIGHT = height;//container.offsetHeight;   

    var gSquareSize = SCREEN_WIDTH;

    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.setClearColor(0x000000, 1.0);
    container.appendChild( renderer.domElement );
 
    camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 10000);
    camera.position.set(0,400,0);
    camera.lookAt(scene.position);
    scene.add(camera);

 console.log(  "SCREEN_WIDTH~ " ,SCREEN_WIDTH,SCREEN_HEIGHT );

    window.addEventListener('resize', function() {
        // var WIDTH = canvas.clientWidth ,
        //   HEIGHT =canvas.clientHeight ;
         
        var WIDTH = SCREEN_WIDTH,
        HEIGHT = SCREEN_HEIGHT;
        renderer.setViewport(0, 0, WIDTH, HEIGHT);
      // renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
 
        // animate();
    }); 


    
    renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );        
 
    var pointLight = new THREE.PointLight( 0xf0f0f0, 1, 100 );
    pointLight.position.set( 0, 50, 0 );
    scene.add( pointLight );

    var light = new THREE.PointLight(0xfffff3, 0.8);
    light.position.set(-100,200,100);
    scene.add(light);
    var sphereSize = 1;
    var pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
    scene.add( pointLightHelper );
    var light2 = new THREE.PointLight(0xd7f0ff, 0.2);
    light2.position.set(200,200,100);
    scene.add(light2);
    var sphereSize = 1;
    var pointLightHelper2 = new THREE.PointLightHelper( light2, sphereSize );
    scene.add( pointLightHelper2 );
    var light3 = new THREE.PointLight(0xFFFFFF, 0.5);
    light3.position.set(150,200,-100);
    scene.add(light3);
    var sphereSize = 1;
    var pointLightHelper3 = new THREE.PointLightHelper( light3, sphereSize );
    scene.add( pointLightHelper3 );
 
   /* hit point marker */
    marker = new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshLambertMaterial({ color: 0xff0000 }));
    scene.add(marker);
 
   //build floor
    var cdcMeshsInfo=[];
    var objCntr         = new THREE.Object3D();
    scene.add( objCntr );
    FloorW  = gSquareSize,   FloorL  = gSquareSize;
    AddFloor(FloorW, FloorL,  '/imgs/floor.jpg');

    controls = new THREE.OrbitControls(camera, renderer.domElement);
 //   controls.addEventListener( 'change', updateControls );
    controls.maxPolarAngle = Math.PI/2; 

    animate();
 
//----------------------------------------------------------------------------
//
//----------------------------------------------------------------------------  
function set3dObjects(jsonStr){
 
    var loaderArray = [];
    var jsonObj = JSON.parse(jsonStr); 
    
    for ( i =  jsonObj.Wall.length - 1; i >= 0 ; i -- ) {
     
        var r = angle(jsonObj.Wall[i].x1, jsonObj.Wall[i].y1, jsonObj.Wall[i].x2, jsonObj.Wall[i].y2);
        var l = distance(jsonObj.Wall[i].x1, jsonObj.Wall[i].y1, jsonObj.Wall[i].x2, jsonObj.Wall[i].y2); 
        var cx = (jsonObj.Wall[i].x1+jsonObj.Wall[i].x2)/2;
        var cy = (jsonObj.Wall[i].y1+jsonObj.Wall[i].y2)/2 ;
        var to3Pos =  To3D( cx, cy );

        coordinate2dTo3d(to3Pos.x, to3Pos.z, r, l) 
    }
} 

function AddFloor(floorW, floorL, meshtexture){
 
    //var nFloorX   = 40, nFloorZ = 40;
    var Cfloor  = new CDC.Floor();
    var floorpos    = new THREE.Vector3(0, 0, 0);
    var meshfloor   = Cfloor.Create("floor", floorW, floorL, meshtexture, floorpos);
    var boxFloor    = new THREE.Box3().setFromObject( meshfloor );
    meshfloor.name  ='floor'// MeshNameEnum.floor;
    objCntr.add( meshfloor );
    cdcMeshsInfo.push(meshfloor);
 
}
 
function To3D(x,y) {

    var x = (1 + x) - gSquareSize / 2;
    var z = (1 + y) - gSquareSize / 2;  
 
    return new THREE.Vector3(x, 0, z);
}
 

function angle(cx, cy, ex, ey) {

    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  //if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
}

function distance(cx, cy, ex, ey){

    return Math.sqrt(Math.pow(cx - ex, 2) + Math.pow(cy - ey, 2));
}

function  coordinate2dTo3d(x, z, r, l) {

    var wallHeight = 10;
    var cube = new THREE.BoxGeometry(l, wallHeight, 1);
    var materials = [
        new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('/imgs/conwall.jpg')}),   
    ];
    
    materials[0].map.minFilter = THREE.LinearFilter;

    var wall = new THREE.Mesh(cube, materials[0]); 
    wall.rotation.y =  -r * Math.PI / 180;
  
    wall.position.x = x;
    wall.position.y = wallHeight/2;  
    wall.position.z = z;
    scene.add(wall);

}
 
function onDocumentMouseDown(event) {
    
    event.preventDefault();
 
    var mouse3D = new THREE.Vector3( ( event.clientX - offsetX ) / SCREEN_WIDTH * 2 - 1,
                            -( event.clientY - offsetY ) / SCREEN_HEIGHT * 2 + 1,
                            0.5 );
 
   // projector.unprojectVector( mouse3D, camera );  
    mouse3D.unproject( camera );
                                                  
    mouse3D.sub( camera.position );
    mouse3D.normalize();
 
 
    var rayCaster = new THREE.Raycaster( camera.position, mouse3D );   
 
    var intersects = rayCaster.intersectObjects(scene.children, true);
  
    // Change color if hit block
    if ( intersects.length > 0 ) {
        // console.log(intersects[0].point.x);
        // console.log(intersects[0].point.y);
        // console.log(intersects[0].point.z);
        // console.log(  intersects[0].object.name  );
       // intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
        marker.position.x = intersects[0].point.x;
        marker.position.y = intersects[0].point.y;
        marker.position.z = intersects[0].point.z;
    } 

    render();
    requestAnimationFrame( animate );
//----------------------------------------
  
    clickInfo.x = (event.clientX / SCREEN_WIDTH) * 2 -1;
    clickInfo.y = -(event.clientY / SCREEN_HEIGHT) * 2 + 1;
    clickInfo.userHasClicked = true;        

    render();
    requestAnimationFrame( animate );
}

function onDocumentMouseMove(event) {
    clickInfo.x = (event.clientX / SCREEN_WIDTH) * 2 -1;
    clickInfo.y = -(event.clientY / SCREEN_HEIGHT) * 2 + 1;
}

function render() {       
    renderer.render( scene, camera );
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();

} 
//-----------------------------------
    this.init = function() { 

    };

    this.set3dObjects = function(jsonStr) {
        
        set3dObjects(jsonStr);    

    };
 
//----------------------------------- 


}//create(width, height) 

return {
    editor:function(width, height) {
        var c = new create(width, height);
        return c;
    }
}

}());


 


