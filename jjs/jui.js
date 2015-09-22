//=========================================================
//
//
//=========================================================
$(function() {
  
    $("#wall").button({
        icons: {
            primary: "ui-icon-closethick"
        },
        text: true,
        label: 'Wall'
    });
  /*   
    $("#door").button({
        icons: {
            primary: "ui-icon-closethick"
        },
        text: true,
        label: 'Door'
    });
*/
    $("#save").button({
        icons: {
            primary: "ui-icon-closethick"
        },
        text: true,
        label: 'Save'
    });

    $("#load").button({
        icons: {
            primary: "ui-icon-closethick"
        },
        text: true,
        label: 'Load'
    });

    $("#2D").button({
        icons: {
            primary: "ui-icon-closethick"
        },
        text: true, 
        label: '2D'
    }); 

    $("#3D").button({
        icons: {
            primary: "ui-icon-closethick"
        },
        text: true,//false,
        label: '3D'
    });    

});  

$(document).ready(function () {
 
    var j_cdc = new jcdc.editor( 400, 400 ); 
 
 //---------------------------------------------------------------------------------
    $("#cdc_controls").mousewheel(function (event, delta, deltaX, deltaY) {
        var offset = $("#canvas").offset(), // position of the canvas on the page
           // centerX = event.pageX - offset.left, // x coordinate of the center of zoom 
           // centerY = event.pageY - offset.top, // y coordinate of the center of zoom 
        zoomStep = Math.pow(1.3, deltaY); // user-friendly zoom step
    
        j_cdc.setCanvasScaleMouseWheel(delta, event.pageX, event.pageY );

        event.stopPropagation();
        event.preventDefault();
 
    }); 
 
    $( "#cdc_controls" ).dblclick(function() {

    }); 
//---------------------------------------------------------------------------------  
    $("#wall").click(function(){ 
        j_cdc.addObject(objectType.JOINT);        
    });

    $("#door").click(function(){
 
    }); 
 
    $("#save").click(function(){
        j_cdc.saveObjects();    
    });

    $("#load").click(function(){
        j_cdc.loadObjects();
    });
 
    $("#2D").click(function(){ 
        $("#cdc_controls").css('display','');
        $("#cdc2").css('display','none');   
    });
    
    $("#3D").click(function(){
        $("#cdc2").css('display','');
        $("#cdc_controls").css('display','none');  
        j_cdc.show3D();
    });

});