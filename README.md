 
Convert a 2D drawing into a 3D Model

================ 
Usage
================

 
###  Usage
 
    Reference index.html to include some javascript files as below:
    
        fabric.js
		three.js
		jquery.js
		...
		jcdc3D.js <3D Model>
        jcdc.js <2D draw>
        jui.js <Main UI>
		
	# 1. Create the editor function
	    var j_cdc = new jcdc.editor( 400, 400 )	
	
	# 2. Add 2D drawing object (It is only line usage now)
	    j_cdc.addObject(objectType.JOINT);    
    
    # 3. Convert a 2D drawing into a 3D Model
        j_cdc.show3D();	
		
###  Demo
	
	![Image](https://cloud.githubusercontent.com/assets/11268557/10010384/452be6c0-611d-11e5-8e73-d29d20f9bbd5.png "2D")
	
	![Image](https://cloud.githubusercontent.com/assets/11268557/10010387/53dd14e6-611d-11e5-88dd-483038d4c51f.png "3D")
	
	


 