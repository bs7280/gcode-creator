//Saving the last mouse x and y position for use later when drawing a point that is being moved.
var lastMouseX = 0;
var lastMouseY = 0;

//this is for highlighting the moused over point
var lastSelectedPoint_polygon = 0; //this is for changing color on moused over points (polygon id)
var lastSelectedPoint_point = 0; //this is for changing color on moused over points (point id)

//coordinates for a drawing the point over the center of a line. If they are both -1
//then the draw method will not draw it. These get set to actual values when the mouse is
//hovered over a midsection of a point.
var lineSplitPointX = -1; //default to -1 if there is no point
var lineSplitPointY = -1; //if not -1 for both, then a dot will be drawn at that point

//Variables for the center point that is last moused over. If the values are not -1
//then in the drawing section of the code, there will be a middle point drawn at these coordinates.
var centerPointX = -1;
var centerPointY = -1;

//These variables refer to the point, on a specific polygon, that is being dragged.
//currently there is a boolean variable to tell if it is being moved or not, but it can probably be 
var draggingPoint = false;
var dragedPointPolygonId = 0;
var dragedPointPointId = 0;

//Variables for dragging the entire polygon
var draggingPolygon = false;
var dragedPolygonId = 0;
var dragStartX = 0;
var dragStartY = 0;
var dragOffsetX = 0;
var dragOffsetY = 0;
					//The x and y position of where the dragging was initially started. While dragging is going on
					//the points and lines will be drawn according to an offset, and once the dragging has stopped
					//the changes will be saved to the shapes[][] array.
					
//for adding points 
var addingPointsMode = false; //changes the value of the button, etc...
var pointsToAdd = new Array();

//for moving the polygons (toggling the mode on and off)
var movingPolygonsMode = false;

//For deleting polygons
var deletingPolygonsMode = false;

//for converting a linear connection between two points to a curved connection
var createArcMode = false;

//All code that deals with any sort of clicking on the canvas goes through this method
//at some point. The general basis of the code is this:
//if we are currently adding points to a polygon, then all registered clicks get added to the new polygons points
//else if, we are deleting polygons, then any registered click on the center of a polygon will result in that polygon getting deleted.
//if not, then any other click 
function onclick(e) {	
	//This gets and saves the current x position of the 
	var xpos = e.pageX - canvas.offsetLeft;//the xposition on the page adjusted for the horizontal offset of the canvas
	var ypos = e.pageY - canvas.offsetTop; //the yposition on the page adjusted for the vertical offset of the canvas
	
	//Checks if the user is currently trying to add points to a brand new polygon
	if(addingPointsMode == true) {
		//This code will add the x and y position to the array holding the information for the new polygon
		onClick_addingPointsMode(xpos, ypos);
	}
	//checks if the user is in the mode that deletes polygons when their center is clicked
	else if(deletingPolygonsMode == true) {
		//this will check if the coordinates are on teh center of a polygon
		//and if they are the polygon will be deleted from the array.
		onClick_deletingPolygonsMode(xpos, ypos);
	}
	//checks if the user is trying to create a curve at a line bisection
	else if(createArcMode == true) {
		//this code will update the array of point information to have 
		//a curved interpolation at the appropriate point.
		onClick_createArcMode(xpos, ypos);
	} 
	//check if user is moving polygons
	else {
		//this handle all appropriate code for moving a polygon
		onClick_movingPolygonsMode(xpos, ypos);
	}
}

//-------------------------------------------------//
//--Methods for handling specific cases of clicks--//
//-------------------------------------------------//

//These below methods are all used strictly in the onClick method above.
//these methods were created to clean up the code and make it much more simple
//in appearance, but has basically the same functionality. In every specific
//case where the code needs to handle some sort of clicking, e.g. moving a 
//polygon or adding a point, all the code for going through with the action is
//in one of the below methods, and is called above. 


//Method for Handling the process of adding points. The method takes in
//the x and y coodinates of where the click was, and adds those coordinates
//to an array containing all of the points that are going to be added to a new 
//polygon. This method is only called when the user is in "add points mode" and
//the user clicks on the screen.
function onClick_addingPointsMode(x,y) {
	pointsToAdd[pointsToAdd.length] = new Array();
	pointsToAdd[pointsToAdd.length - 1][0] = x; //storing x position
	pointsToAdd[pointsToAdd.length - 1][1] = y; //storing y position
	pointsToAdd[pointsToAdd.length - 1][2] = false; //boolean for drawing moved points
	pointsToAdd[pointsToAdd.length - 1][3] = 1; //stores the cut type (linear, curve, etc...)
}

//This below method is only used in the onClick() method above. It
//is used to provide a cleaner way of handling the code for deleting a polygon.
function onClick_deletingPolygonsMode(x,y) {
	//checking if the clicked location is on the center of any of the points.
	//the "center" is calculated the same way you would calculate the center of
	//gravity if all the points were objects of equal mass at the coordinates 
	//it will return -1 as the value of the first data slot in the returned data
	//array, and possibly more than the first spot, but I am not sure.
	var onCenterResults = isOnCenter(x, y);
	
	//if the onCenter results from above has -1 as the first value, then the 
	//clicked coordinates are too far from any centers.
	if(onCenterResults[0] != -1) {
		//creates an array of the polygons indexed before the one to be deleted
		//and the one after the one to be deleted.
		var pointID = onCenterResults[3];
		var before = shapes.slice(0,pointID);
		var after = shapes.slice(pointID + 1, shapes.length);
		
		//concats the two before/after arrays, effectively deleting the one clicked on
		var newShapes = before.concat(after);
		
		//outputs information to console. Was used mostly during initial creation.
		console.log(makeString(newShapes));
		console.log(makeString(before));
		console.log(makeString(after));
		
		//replacing the old array containing point data with the new one that does not contain the
		//polygon that was just delteded.
		shapes = newShapes;
	}
}

//The below method handles all actions required to check if a user clicked on a bisecting line
//and change the stored point data to have a curved interpolation rather than a linear interpolation.
//this is only called from the onclick method and when the user is trying to create arcs.
function onClick_createArcMode(x,y) {
	//Checking if the clicked coordinates are bisecting a line.
	var lineSplitResult = isLineSplit(x, y);
	
	//if the results do not return -1, then a point was clicked.
	if(lineSplitResult[0] != -1) {
			//Variables from the lineSplitResults refferencing 
			var polygonID = lineSplitResult[4];
			var pointID = lineSplitResult[3]; //the mid point is bewteen this and the next point
											  //next might be a smaller number though.
											  
			//This sets the stored point/polygon location to have a curve at the specified location
			setPointData(polygonID, pointID, 3, 2); //Setting the selected polygon at the given location
													//to have a curved interpolation rather than a linear one.
	}
}

function onClick_movingPolygonsMode(x,y) {
	//Checking if you have clicked on a lineSplitPoint
	var lineSplitResult = isLineSplit(x, y);
	if(lineSplitResult[0] != -1) {
		var polygonID = lineSplitResult[4];
		var pointID = lineSplitResult[3]; //the mid point is bewteen this and the next point
										  //next might be a smaller number though.
										  
		//creating a new coordinate point
		var newCoordinate = new Array();
		newCoordinate[0] = lineSplitResult[0];
		newCoordinate[1] = lineSplitResult[1];
		newCoordinate[2] = false;
		
		var before = shapes[polygonID].slice(0,pointID + 1);
		var after = shapes[polygonID].slice(pointID + 1, shapes[polygonID].length);
		
		var newPolygon = before.concat([newCoordinate]).concat(after);
		
		shapes[polygonID] = newPolygon;
	}
}


function onmousedown(e) {
	//isPointCoordinate(,);
	var xpos = e.pageX - canvas.offsetLeft;
	var ypos = e.pageY - canvas.offsetTop;
	
	var result = isPointCoordinate(xpos, ypos);
	var onCenterResult = isOnCenter(xpos, ypos);
	
	if(movingPolygonsMode == true && onCenterResult[0] != -1) {
		//Dragging the center of a polygon
		draggingPolygon = true; //Specifing that a polygon is being dragged
		dragedPolygonId = onCenterResult[3]; //setting the polygon id that is being dragged
		dragStartX = xpos; //setting the dragging origin to the current mouse position
		dragStartY = ypos; //for both x and y
		dragOffsetX = 0;
		dragOffsetY = 0;
	}
	else if(result[0] != -1) {
		//dragging a point
		draggingPoint = true;
		dragedPointPolygonId = result[0];
		dragedPointPointId = result[1];
	}
}

function onmouseup(e) {
	if(draggingPolygon == true) {
		//Updating all the points in the moved polygon
		for(i = 0; i < shapes[dragedPolygonId].length; i++) {
			shapes[dragedPolygonId][i][0] += dragOffsetX;
			shapes[dragedPolygonId][i][1] += dragOffsetY;
		}
		
		//reseting the offsets to 0
		dragOffsetX = 0;
		dragOffsetY = 0;
		draggingPolygon = false;
	}

	draggingPoint = false;
	draggingPolygon = false;
}

function onmousemove(e) {
	var mouseX, mouseY;

	//Getting the X and Y mouse position and accointing for any offsets
	//from the position of the canvas. X and Y positions are based off of
	//the top left corner of the canvas being (0,0)
	if(e.offsetX) {
		mouseX = e.offsetX;
		mouseY = e.offsetY;
	}
	else if(e.layerX) {
		mouseX = e.layerX;
		mouseY = e.layerY;
	}

	/* do something with mouseX/mouseY */
	lastMouseX = mouseX;
	lastMouseY = mouseY
	if(addingPointsMode == true) {
		//
	} else {
		if (draggingPolygon == true) {
			//Dragging an entire shape around
			dragOffsetX = mouseX - dragStartX; //changing the xOffset, so that the polygon can be drawn accordingly while it is moving
			dragOffsetY = mouseY - dragStartY; //same as above except in the y direction
		}
		else if(draggingPoint == true) {
			//Dragging a point around and setting the point position to be equal to the mouse position.
			shapes[dragedPointPolygonId][dragedPointPointId][0] = mouseX;
			shapes[dragedPointPolygonId][dragedPointPointId][1] = mouseY;
		} else {
			var isOnCenterResults = isOnCenter(mouseX, mouseY);
			var clickResults = isPointCoordinate(mouseX, mouseY);
			var splitLineResults = isLineSplit(mouseX, mouseY);
			if(clickResults[0] != -1 && splitLineResults[0] != -1 && isOnCenterResults[0] != -1) {
				if(splitLineResults[2] < clickResults[2] && splitLineResults[2] < isOnCenterResults[2]) {
					//the line split point is closer to the 
					lineSplitPointX = splitLineResults[0];
					lineSplitPointY = splitLineResults[1];
				}
				else if(isOnCenterResults[2] < clickResults[2] && isOnCenterResults[2] < splitLineResults[2]) {
					alert("center");
				}
				else {
					//the drill bit path point is closer, or they are equal distance apart
					shapes[lastSelectedPoint_polygon][lastSelectedPoint_point][2] = false;
					shapes[clickResults[0]][clickResults[1]][2] = true;
					lastSelectedPoint_polygon = clickResults[0];
					lastSelectedPoint_point = clickResults[1];
				}
			
			} else {
				if(clickResults[0] != -1) {
					//the drill bit path point is closer, or they are equal distance apart
					shapes[lastSelectedPoint_polygon][lastSelectedPoint_point][2] = false;
					shapes[clickResults[0]][clickResults[1]][2] = true;
					lastSelectedPoint_polygon = clickResults[0];
					lastSelectedPoint_point = clickResults[1];
				}
				else if(splitLineResults[0] != -1) {
					//the line split point is closer to the 
					lineSplitPointX = splitLineResults[0];
					lineSplitPointY = splitLineResults[1];
				}
				else if(movingPolygonsMode == true && isOnCenterResults[0] != -1) {
					centerPointX = isOnCenterResults[0];
					centerPointY = isOnCenterResults[1];
				}
			}
			
			if(clickResults[0] == -1) {
				if(lastSelectedPoint_polygon < shapes.length) {
					shapes[lastSelectedPoint_polygon][lastSelectedPoint_point][2] = false;
				}
			}
			if(splitLineResults[0] == -1) {
				//the line split point is closer to the 
				lineSplitPointX = -1;
				lineSplitPointY = -1;
			}
			if(isOnCenterResults[0] == -1) {
				centerPointX = -1;
				centerPointY = -1;
			}
		}
	}
}



function keydown(e) {
	alert(e.keyCode);
}