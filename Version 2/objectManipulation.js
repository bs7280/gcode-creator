
//Checks wether or not an imputed coordinate is within range of any of the
//polygon coordinate points						
function isPointCoordinate(x,y) {
	var closestDistance = 5.1;
	var closestShapeId = 0;
	var closestPointId = 0;
	for(var s = 0; s < getNumberOfPolygons(); s++) {
		for(var i = 0; i < getNumberOfPoints(s); i++) {
			var xdist = Math.abs(x - getPointData(s,i,0));
			var ydist = Math.abs(y - getPointData(s,i,1));
			if(xdist <=2.5 && ydist <=2.5) {
				if(xdist+ydist < closestDistance) {
					closestShapeId = s;
					closestPointId = i;
					closestDistance = xdist + ydist;
				}
			}
		}
	}
	
	//returning the closest one, if one was found
	if(closestDistance < 5.1) {
		return [closestShapeId, closestPointId, closestDistance];
	} else {
		return [-1, -1];
	}
}

//returns wether or not the input coordinates are near any of the centers of
//the lines between points.			
function isLineSplit(x,y) {
	var closestDistance = 50;
	var closestPointX = 0;
	var closestPointY = 0;
	var closestPolygon = 0;
	var closestPoint = 0;
	
	//variables for determining wheather or not to show the midpoint (to close to points)
	var minDistanceToPoint = 5; //if both the x and y distance from the nearest point
								 //to the midpoint are less than this, then point not shown.
	
	for(var s = 0; s < shapes.length; s++) {
		for(var i = 0; i < shapes[s].length; i++) {
			//var xPoint = (shapes[s][(i+1)%shapes[s].length][0] + shapes[s][i][0])/2.0; (getPointData(s,(i+1)%getNumberOfPoints(s),0) + getPointData(s,i,0))/2.0
			//var yPoint = (shapes[s][(i+1)%shapes[s].length][1] + shapes[s][i][1])/2.0; (getPointData(s,(i+1)%getNumberOfPoints(s),1) + getPointData(s,i,1))/2.0
			var xPoint = (getPointData(s,(i+1)%getNumberOfPoints(s),0) + getPointData(s,i,0))/2.0; 
			var yPoint = (getPointData(s,(i+1)%getNumberOfPoints(s),1) + getPointData(s,i,1))/2.0; 
		
			var xdist = Math.abs(x - xPoint);
			var ydist = Math.abs(y - yPoint);
			
			//checks if the midpoint is too close to a current point
			if(Math.abs(getPointData(s,i,0) - xPoint) > minDistanceToPoint || Math.abs(getPointData(s,i,1) - yPoint) > minDistanceToPoint) {
			
				if(xdist <=20 && ydist <=20) {
					if(xdist+ydist < closestDistance) {
						closestPointX = xPoint;
						closestPointY = yPoint;
						closestPolygon = s;
						closestPoint = i;
						closestDistance = xdist + ydist;
					}
				}
			}
		}
	}
	
	//returning the closest one, if one was found
	if(closestDistance < 15) {
		return [closestPointX, closestPointY, closestDistance, closestPoint, closestPolygon];
	} else {
		return [-1, -1];
	}
}

//returns wether or not the inputed coordinates are near the center of any of the polygons
function isOnCenter(x,y) {
	var closestX = 0;
	var closestY = 0;
	var closestDistance = 40;
	var closestPolygon = 0;
	for(var s = 0; s < shapes.length; s++) { //looping through all polygons
		//calculating the midpoint
		var xMidpoint = 0;
		var yMidpoint = 0;
		
		for(var i = 0; i < shapes[s].length; i++) {
			xMidpoint += shapes[s][i][0];
			yMidpoint += shapes[s][i][1];
		}
		
		xMidpoint = xMidpoint/getNumberOfPoints(s);
		yMidpoint = yMidpoint/getNumberOfPoints(s);
		
		var xdist = Math.abs(x - xMidpoint);
		var ydist = Math.abs(y - yMidpoint);
			
		if(xdist <=10 && ydist <=10) {
			if(xdist+ydist < closestDistance) {
				closestX = xMidpoint;
				closestY = yMidpoint;
				closestPolygon = s;
				closestDistance = xdist + ydist;
			}
		}
	}
	
	makeGcode();
	//makePointEditingBoxes();
	
	//returning the closest one, if one was found
	if(closestDistance < 40) {
		return [closestX, closestY, closestDistance, closestPolygon];
	} else {
		return [-1, -1];
	}
	
	
}




function setDeletePolygonMode() {
	if(deletingPolygonsMode == true) {
		document.getElementById("deletePolygon").value="delete polygon";
		
		deletingPolygonsMode = false;
		
		//reseting the other buttons
		if(movingPolygonsMode == true) {
			setMovePolygonMode();
		}
		if(addingPointsMode == true) {
			setAddPolygonMode();
		}
		if(createArcMode == true) {
			setCreateArcMode();
		}
	} else {
		//reseting the other buttons
		if(movingPolygonsMode == true) {
			setMovePolygonMode();
		}
		if(addingPointsMode == true) {
			setAddPolygonMode();
		}
		if(createArcMode == true) {
			setCreateArcMode();
		}
		document.getElementById("deletePolygon").value="stop deleteing polygons";
		deletingPolygonsMode = true;
	}
}

function setAddPolygonMode() {
	if(addingPointsMode == true) {
		if(pointsToAdd.length > 0) {
			shapes[shapes.length] = pointsToAdd;
		}
		pointsToAdd = new Array();
		
		document.getElementById("addPoints").value="add new polygon";
		
		addingPointsMode = false;
		if(movingPolygonsMode == true) {
			setMovePolygonMode();
		}
		if(deletingPolygonsMode == true) {
			setDeletePolygonMode();
		}
		if(createArcMode == true) {
			setCreateArcMode();
		}
	} else {
		if(movingPolygonsMode == true) {
			setMovePolygonMode();
		}
		if(deletingPolygonsMode == true) {
			setDeletePolygonMode();
		}
		if(createArcMode == true) {
			setCreateArcMode();
		}
		document.getElementById("addPoints").value="stop adding polygons";
		addingPointsMode = true;
	}
}

function setMovePolygonMode() {
	if(movingPolygonsMode == true) {
		document.getElementById("movePolygon").value="move polygon";
		
		movingPolygonsMode = false;
		if(deletingPolygonsMode == true) {
			setDeletePolygonMode();
		}
		if(addingPointsMode == true) {
			setAddPolygonMode();
		}
		if(createArcMode == true) {
			setCreateArcMode();
		}
	} else {
		if(deletingPolygonsMode == true) {
			setDeletePolygonMode();
		}
		if(addingPointsMode == true) {
			setAddPolygonMode();
		}
		if(createArcMode == true) {
			setCreateArcMode();
		}
		document.getElementById("movePolygon").value="stop moving polygons";
		movingPolygonsMode = true;
	}
}

function setCreateArcMode() {
	if(createArcMode == true) {
		document.getElementById("createArc").value="create arc";
		
		createArcMode = false;
		
		if(deletingPolygonsMode == true) {
			setDeletePolygonMode();
		}
		if(addingPointsMode == true) {
			setAddPolygonMode();
		}
		if(movingPolygonsMode == true) {
			setMovePolygonMode();
		}
	} else {
		if(deletingPolygonsMode == true) {
			setDeletePolygonMode();
		}
		if(addingPointsMode == true) {
			setAddPolygonMode();
		}
		if(movingPolygonsMode == true) {
			setMovePolygonMode();
		}
		document.getElementById("createArc").value="stop creating arcs";
		createArcMode = true;
	}
}