 

        
//=========================================================
//
//
//=========================================================
var objectType = function(){
return {
    'NONE': "NONE",
    'JOINT':"JOINT",
    'JOINT_Line':"JOINT_Line",
    'WALL':"WALL",
    'DOOR':"DOOR", 
    'AREA': "AREA"
    }
}();


var jcdc = (function() {


var g3Dscene = true;

function create(width, height ) {

//-----------------------------------
    var j_cdc3D = null;
    
    if(g3Dscene){
 
        j_cdc3D = new jcdc3D.editor(width, height );
    }
//-----------------------------------

    var can  = document.getElementsByTagName('canvas')[0];
    can.width  = width;
    can.height = height;

//----------------------------------- 
    var element = $('#canvas'), 
   // var canvas = new fabric.Canvas('canvas');
    canvas = new fabric.Canvas(element.get(0), {
        selection: false, // disable groups selection
        scale: 1, // set default scale
 
        moveCursor: 'default', // reset mouse cursor - they are not used by us
        hoverCursor: 'default'
    });
 
    canvas.hoverCursor = 'pointer';

//-----------    
    var gMaxLevel = 5;
//-----------    
    var obj = 0;
    var gGridGroup=0;
    var gAddType =  objectType.NONE;
//-----------
    var gMakeWallMousePoints = []; 
    var gMakeWallRadius = 12;
//-----------  
    var gBKImage;
    var gBKImgPathName = '/imgs/g.png';  
    var bkImageLeft = 100;
    var bkImageTop = 100; 
//-----------  
    var gJointLine = null;   
    var gJoint = 0; 
    var gJointCount = 0; 
    var gText = 0;     
//-----------    
    var gOffsetX =   8;  
    var gOffsetY =  8;       
//-----------
    var zoomScale = 1.0;
    var mouseDownOutsideObject = false;
    var mouseXStart = [], mouseYStart = [];
    var mouseXOrig = 0, mouseYOrig = 0;
//-----------------------------------
    var idCount = 0;
 

    $('*').contextmenu( function() {
        return false;
    });
 

//-----------------------------------
//
//-----------------------------------
 
//----------------- 
    var slider,sliderAmount;
    var dialog;    
 
    dialog = $( "#dialog-form" ).dialog({
      autoOpen: false,
      height: 300,
      width: 350,
      modal: true,
 
      buttons: {         
        'Remove': function() {
           
            var target = $(this).data('target');
            delJointLine(target);
            
            $(this).dialog('close');
        },
       // "Create an account": addUser,
        'Ok': function() {
            var target = $(this).data('target');
 
            target.hi = slider.slider("option", "value");
            dialog.dialog( "close" );
        }
      }, 
      open: function() {
        $('.ui-widget-overlay').addClass('custom-overlay');
      },
      close: function() {
       // form[ 0 ].reset();
        //allFields.removeClass( "ui-state-error" );
      }
    });
//-----------------    
    slider = $( "#slider-horizontal" ).slider({
      orientation: "horizontal",
      range: "min",
      min: 0,
      max: 1000,
       value: 60,
      width: 100,
      slide: function( event, ui ) {
          $( "#height-amount" ).val( ui.value );
      }
    });

    sliderAmount =  $( "#height-amount" );
//-----------------    

//-----------------------------------
//
//-----------------------------------
canvas.on('mouse:down', function(options) {
 
    switch (event.which) {
        case 1: //'Left Mouse button pressed
            objectsOps( options );

            break;
        case 2: //'Middle Mouse button pressed
            break;
        case 3: //'Right Mouse button pressed
            
            if(options.target.name =='jointLine'){
                slider.slider( 'value',  options.target.hi);
                sliderAmount.val( options.target.hi);  
                dialog.dialog( "open" ).data('target', options.target);
            }

            break;
        default:
          //  alert('........!');
    }
 
});

canvas.on('mouse:up', function(options) {
 
    switch (event.which) {
        case 1: //'Left Mouse button pressed
            scaleMouseUp();

            break;
        case 2: //'Middle Mouse button pressed
 
            break;
        case 3: //'Right Mouse button pressed
 
            break;
        default:
          //  alert('.........!');
    }

});

 
canvas.on('mouse:move', function(options) {
  
    switch (gAddType) {
        
        case objectType.JOINT_Line:
            decideJointLine( options.e.clientX-gOffsetX, options.e.clientY-gOffsetY);
        break;      
        default:
            scaleMouseMove(options.e.pageX,options.e.pageY,gOffsetX,gOffsetY);

    }                 

});

canvas.on('mouse:over', function(e) {
   // e.target.setFill('red');
 //   canvas.renderAll();
});


canvas.observe("object:moving", function(e){ 
});
 
//-----------------------------------
//
//-----------------------------------   
 
function objectsOps( options ){

    var overlapJointX=0,overlapJointY=0;

    if (options.target) {

        if(options.target.name =='joint'){
        //--------------------------------------
            if(options.target.id == idCount-3){       
 
                if(options.target.line1 == null){    
                    canvas.remove(options.target.line2.text1);
                    canvas.remove(options.target.line2);
                    canvas.remove( options.target ); 
                }else{
                    canvas.remove(options.target.line2.text1);
                    canvas.remove(options.target.line2);
                    options.target.line2 = null;
                }
        //------------------------------    
                gAddType = objectType.NONE;
                gJointLine = null;
                removeFakeLines();

                return;
            }  
        //--------------------------------------
 
            overlapJointX = options.target.left;
            overlapJointY = options.target.top;
 
        }
          
    }     
 
    switch (gAddType) {
        
        case objectType.JOINT:          
               
            addJointLine(options.e.clientX-gOffsetX , options.e.clientY-gOffsetY, false);
            gAddType = objectType.JOINT_Line;

            break;           
            
        case objectType.JOINT_Line:
              
            if(overlapJointX==0 && overlapJointY==0){    
                addJointLine(options.e.clientX-gOffsetX , options.e.clientY-gOffsetY, true);
            }else{
                addJointLine(overlapJointX , overlapJointY, true);
            }

            break;    
           
        case objectType.WALL:
               
        
            break;
            
        case objectType.DOOR:
                var objects = canvas.getObjects();
                for (var i in objects) {
                    var obj =  objects[i];
                    if ( obj.name == 'joint' ){
   
                    }
                }

            break;
        
        default:
            scaleMouseDown( options.e.offsetX, options.e.offsetY);

    }       
 
}

//-----------------------------------
//
//----------------------------------- 

function delJointLine(target){
 
    if(target.joint2!=null){ 
        if(target.joint2.line2 == null){        
            canvas.remove(target.joint2);            
        }    
        target.joint1.line2  = null;
    }

    if(target.joint1!=null){
        if(target.joint1.line1 == null){
             canvas.remove(target.joint1);
        }
        target.joint2.line1  = null;
    }

    canvas.remove(target.text1);
    canvas.remove(target);
}

function addJointLine(cx , cy , flag){


    joint =  makeJoint(cx, cy, "joint" , idCount++); 

    text =  makeText(joint.left,  joint.top , "null" ,  idCount++);
    text.set({ 'left': joint.left, 'top': joint.top });

    jointLine = makeJointLine(joint.left,  joint.top , "jointLine", idCount++);

    if(flag){
        gJointLine.joint2 = joint;
        gJointCount = gJointCount + 1;
    }else{
        gJointCount = 0;
    }
      
    canvas.add(text);  
    canvas.add(jointLine);
    canvas.add(joint); 
    
   // canvas.sendBackwards(text);

//----------------------------
    gJoint = joint;
    gJoint.line1 = gJointLine;//null; 
    gJoint.line2 = jointLine;
//----------------------------
    gJointLine = jointLine;
    gJointLine.text1 = text;
    gJointLine.joint1 = joint;
    gJointLine.joint2 = null;
    gJointLine.hi = 50;
//----------------------------
     
    canvas.renderAll();
       
                      
}

function checkCrossLine(cx , cy){
    var objects = canvas.getObjects();
    for (var i in objects) {
         var obj =  objects[i];
        if ( obj.name  == 'joint' &&  obj.id != gJointLine.joint1.id ) {
            if( Math.abs(obj.left - cx) == 0){
                 canvas.add(makeFakeLine(cx , cy , obj.left, obj.top, 'fakeLine'  , -1 ));
            }
            if( Math.abs(obj.top - cy) == 0){
                 canvas.add(makeFakeLine(cx , cy , obj.left, obj.top, 'fakeLine'  , -1 ));
            }
        }
    
    }
}

function removeFakeLines(){
    
    var objects = canvas.getObjects();
    for (var i in objects) {
        var obj =  objects[i];
        if ( obj.id == -1 ) {
            canvas.remove(obj);
        }
    }
     canvas.renderAll();
}

function decideJointLine(cxx , cyy){    
 
    var c = 0, l = 0, t = 0;    
    cx = cxx; cy = cyy;
    var obj = gJointLine.joint1;  
 
    l =  obj.left;
    t =  obj.top;
    c = Math.atan2( cy - obj.top, cx - obj.left) * 180 / Math.PI;

    gJointLine.set({ 'x1':  obj.left, 'y1':obj.top, 
                'x2': cx   , 'y2': cy   ,  originX : "center",  originY : "center"});

  
    if(c==0 || c==-90 || c==180 || c==90 ){ 
        gJointLine.set(  {stroke: 'rgba(255,0,0, 0.5)' } );
    }else{
        gJointLine.set(  {stroke: 'rgba(27,32,36, 0.5)' });
    }
//--------------------------
    x =  (gJointLine.x1 + gJointLine.x2) / 2;
    y =  (gJointLine.y1 + gJointLine.y2) / 2;
    d = Math.sqrt((gJointLine.x1 - gJointLine.x2)*(gJointLine.x1 - gJointLine.x2) + 
                (gJointLine.y1 - gJointLine.y2)* (gJointLine.y1 - gJointLine.y2)).toFixed(2).toString();

    if(d<5){
        gJointLine.text1.setVisible(false);
    }else{
        gJointLine.text1.setVisible(true);
        gJointLine.text1.set( { text: d , left: x, top: y,  originX : "center",  originY : "center"} );
    }
//--------------------------
                        
    gJointLine.setCoords();
    gJointLine.text1.setCoords();
  
//-------------------------- 
    removeFakeLines();

    checkCrossLine(cx , cy);
//--------------------------
 
    canvas.renderAll();
} 
//-----------------------------------


function makeText(circleLeft, circleTop , name , id){
 
    var t = new fabric.IText("Hello world !", {
        backgroundColor: 'rgba(255,255,255,0.25)',
        fill: '#000000',
        fontSize: 12,
        top : 3,
        text: name,
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
        selectable: false
    });
    t["id"] = id;
 
    return t;
}

function makeJoint(circleLeft, circleTop , name , id){
    
    var strokeW = 1;
    
    var c1 = new fabric.Circle({
        left: circleLeft,
        top: circleTop ,//- gMakeWallRadius*2,
        strokeWidth: strokeW,
        radius: 10,//gMakeWallRadius,
       // type : ctype ,
        fill: 'rgba(255,255,255,0.5)',//'rgba(255,255,255,0.2)',
        stroke: 'rgba( 55, 55, 55,0.5)' ,
        originX : "center",
        originY : "center"

    });
    c1.hasControls =  false;
    c1.hasBorders =  false;
    //c1.selectable = false;
    c1.lockMovementX = c1.lockMovementY  = true;
    c1.name = name;
    
    c1["zoomScale"] = 1;

    c1["id"] = id;
//-----------------                           
    c1.scaleX = c1.zoomScale * zoomScale;
    c1.scaleY = c1.zoomScale * zoomScale;
//-----------------
    c1.perPixelTargetFind = true;
  
    return c1;
} 

function makeJointLine(circleLeft, circleTop , name  , id ){
    var strokeW = 5;
    
    var l =  new fabric.Line( [  circleLeft , circleTop   , circleLeft+gMakeWallRadius+50  , circleTop  ], {
    //   fill: 'rgba(255,0,0,0.5)',
       stroke: 'rgba(27,32,36, 0.5)',
       strokeWidth: strokeW,
       originX : "center",
       originY : "center"     
    }); 
    l.hasControls =  false; 
  //  l.lockMovementX = l.lockMovementY  = true;
  
    l["zoomScale"] = 1;
    l.scaleX = l.zoomScale * zoomScale;
    l.scaleY = l.zoomScale * zoomScale;

    l["id"] = id;
   
    l.perPixelTargetFind = true;

    l.name = name;

    return l;
}

function makeFakeLine(cx1, cy1 , cx2, cy2, name  , id ){
    var strokeW = 5;
    
    var l =  new fabric.Line( [  cx1, cy1 , cx2, cy2  ], { 
       stroke: 'rgba(0,32,0, 0.5)',
       strokeWidth: strokeW     
    }); 
    l.hasControls =  false;  
 
    l["id"] = id;

    l.name = name;
 

    return l;
}


//======================================================================

function addBackgroundImage( pathName  ){
 
 
    var ca  = document.getElementsByTagName('canvas')[0];
   // Add a background
    var background = new fabric.Rect({
        left: 0,
        top: 0,
        stroke: 'White',
        width: ca.width,
        height: ca.height,
        scaleX: 1,
        scaleY: 1,
        selectable: false,
        zoomScale: 1,
        isBackground: true
    });

    canvas.add(background);
              
    fabric.util.loadImage(pathName, function (img) {
        background.setPatternFill({
            source: img,
            repeat: 'repeat'
        });      

        canvas.renderAll();
    });
 
}
  
//=============================================================  
 
function getBackground() {
    var objects = canvas.getObjects();
    for (var i = 0; i < objects.length; i++) {
        if (objects[i].isBackground == true) {
            return objects[i];
        }
    }
    return undefined;
}

function isWithinBackground() {
    
    var background = getBackground();
    if (mouseXOrig < background.left
        || mouseXOrig > background.left + (background.width * zoomScale)
        || mouseYOrig < background.top
        || mouseYOrig > background.top + (background.height * zoomScale)) {
        return false;
    }
    return true;
}

function scaleMouseDown(x,y){
    mouseXOrig = x;//e.offsetX;
    mouseYOrig = y;//e.offsetY;

    // Ignore if mouse is not on background
    //var background = isWithinBackground();
    if (isWithinBackground()==false) {
        return;
    }

    var activeObject = canvas.getActiveObject();
    if (activeObject != undefined) {
        canvas.bringToFront(activeObject);
        return;
    }

    mouseDownOutsideObject = true;

    var objects = canvas.getObjects();
    for (var i = 0; i < objects.length; i++) {
        mouseXStart[i] = objects[i].left;
        mouseYStart[i] = objects[i].top;
    }
 
}

function scaleMouseUp(){ 
    mouseDownOutsideObject = false;
    getBackground().selectable = false;
    mouseXStart = [], mouseYStart = [];
}

function scaleMouseMove(pageX,pageY,offsetLeft,offsetTop){
    
    if (mouseDownOutsideObject) {
 
        var background = getBackground();
        background.selectable = true;
        var mouseXNew = pageX - offsetLeft;
        var mouseYNew = pageY - offsetTop;
        var mouseXDelta = (mouseXNew - mouseXOrig);
        var mouseYDelta = (mouseYNew - mouseYOrig);

        var borderWidth = 200;

        if (background.getLeft() + mouseXDelta <= borderWidth
            && background.getTop() + mouseYDelta <= borderWidth
            && background.getLeft() + background.getWidth() + mouseXDelta >= canvas.getWidth() - borderWidth
            && background.getTop() + background.getHeight() + mouseYDelta >= canvas.getHeight() - borderWidth) 
        {
            var objects = canvas.getObjects();
            for (var i = 0; i < objects.length; i++) {
                objects[i].setLeft(mouseXDelta + mouseXStart[i]);
                objects[i].setTop(mouseYDelta + mouseYStart[i]);              
                objects[i].setCoords();
            }
            canvas.renderAll();
        }
       background.selectable = false;
    }

}

function scaleMouseWheel(delta, pageX, pageY){
     // Ignore if mouse is not on background
    var background = getBackground();
//------------------------- 
    var scaleFactor = 1.1;
    var change = (delta > 0) ? scaleFactor : (1 / scaleFactor);

    // Limit zooming out
    var newZoomScale = zoomScale * change;
    if (newZoomScale < 1) {
        return;
    }
    zoomScale = newZoomScale;

    var backgroundWidthOrig = (background.width * background.scaleX);
    var backgroundHeightOrig = (background.height * background.scaleY);
 
    // Scale objects
    var objects = canvas.getObjects();
    for (var i in objects) {
        var obj = objects[i];
 
        if (obj.zoomScale != undefined) {
            obj.scaleX = obj.zoomScale * zoomScale;
            obj.scaleY = obj.zoomScale * zoomScale;
        }

        obj.left = obj.left * change;
        obj.top = obj.top * change;
        obj.setCoords();
      
    }   
 
    canvas.renderAll();

  
}

function set3dObjects(){
 
    if(g3Dscene && j_cdc3D!=null){

        var obj = { "Wall": [] , "Door": []};    
        var j=0;
        var objects = canvas.getObjects();
        for (var i in objects) {
            var object =  objects[i];
            if ( object.name  == 'jointLine'  ) {
                obj['Wall'].push({ "id":j, "x1":object.x1, "y1":object.y1, "x2":object.x2, "y2":object.y2, "h":object.hi });
                j = j+1; 
            }    
        }
 
        jsonStr = JSON.stringify(obj);

        j_cdc3D.set3dObjects(jsonStr);

        return true;      
    }    
    return false;    
}

//=============================================================

//-----------------------------------
    this.init = function() {
        addBackgroundImage( gBKImgPathName );

    };

  
    this.addObject = function(objType) {  
        
        gMakeWallMousePoints = [];

        // change mouse pointer
        switch (objType) {
            case objectType.JOINT:
              
                gAddType = objectType.JOINT;
            break;         
         
            case objectType.WALL:
               
                gAddType = objectType.WALL;
            break;
            
            case objectType.DOOR:
 
            break;       
         
            default:
                gAddType = objectType.NONE;
        }       
 
    };

     
    this.saveObjects = function() {
 
        var dataToStore = JSON.stringify(canvas);
        localStorage.setItem('someData', dataToStore); 
    };
    
    this.loadObjects = function() {
 
        var localData = localStorage.getItem('someData');  
        canvas.loadFromJSON(localData, canvas.renderAll.bind(canvas));
    };
 
 
    this.setCanvasScaleMouseWheel = function (delta, pageX, pageY){
        scaleMouseWheel(delta, pageX, pageY);
 
    }

    this.show2D = function() {

    }

    this.show3D = function() {
        return set3dObjects();
    }

}//create(width, height) 

return {
    editor:function(width, height ) {
        var c = new create(width, height );
        c.init();
        return c;
    }
}

}());

  