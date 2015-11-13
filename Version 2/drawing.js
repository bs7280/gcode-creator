function drawGrid() {
	//var verticalIntervals = HEIGHT/millimetersToPixels;
	//var horizontalIntervals = WIDTH/millimetersToPixels;
	
	//Setting the line color and width
	ctx.strokeStyle= "#555555";
	ctx.lineWidth = 0.5;
	
	//This section draws all the horizontal lines at every mark of one millimeter,
	//or whatever the hell unit I end up using.
	for(var i = millimetersToPixels; i < HEIGHT; i+= millimetersToPixels)
	{   
		ctx.moveTo(0,i);
		ctx.lineTo(WIDTH,i);
	}
	
	//this section draws all the vertical lines at every mark of whatever unit
	//is being used (mm in this case)
	for(var n = 0; n < WIDTH; n+= millimetersToPixels)
	{   //vertical lines
		ctx.moveTo(n,0);
		ctx.lineTo(n,HEIGHT);
	}
	
	ctx.stroke();
}

function drawMouseCoordinate() {
	ctx.font="12px Sans-Serif";
	ctx.textBaseline = "top";
	ctx.fillStyle = "black";
	ctx.fillText("(" + pixelsToInches(lastMouseX) + ", " + pixelsToInches(lastMouseY) + ")",680,580);
}

function drawPlate() {
	ctx.fillStyle="#999999";
	ctx.fillRect(plateHorizontalOffset, plateVerticalOffset, plateWidth, plateHeight);
}

function drawAllPoints() {

	//Looping through all the shapes
	for(var s = 0; s < getNumberOfPolygons(); s++) {
		//Drawing all the coordinate points
		for(var i = 0; i < getNumberOfPoints(s); i++) {
			ctx.beginPath();
			
			//makes perimeter and fill of circles red or blue depending on if the point is dragged or not
			if(getPointData(s,i,2) == true) {ctx.fillStyle="blue"; ctx.strokeStyle= "#blue";} 
			else {ctx.fillStyle="red"; ctx.strokeStyle= "#red";}
			
			//Drawing the point at either stored, or a moving position.
			if(draggingPolygon == true && dragedPolygonId == s) {
				//Draw the point at it's position + adjusted with mouse position
				ctx.arc(getPointData(s,i,0) + dragOffsetX, getPointData(s,i,1) + dragOffsetY,2.5,0,2*Math.PI);
			} else { 
				//Draw coordinate at storage position
				ctx.arc(getPointData(s,i,0), getPointData(s,i,1),2.5,0,2*Math.PI);
			}
			
			//Fills all the arcs.
			ctx.fill();
			ctx.stroke();
		}
		
		//------Drawing all of the lines--------//
		ctx.beginPath();
		
		//Drawing the polygon that is being moved
		if(draggingPolygon == true && dragedPolygonId == s) { //This polygon is being dragged
			//offsetting all the points because this polygon is being dragged.
			ctx.moveTo(getPointData(s,0,0) + dragOffsetX,getPointData(s,0,1) + dragOffsetY);
			for(var i = 1; i < shapes[s].length; i++) {
				//Getting the type of line for this connection
				var lineType = getPointData(s,i,3);
				
				//Draws a line because the line type is linear
				if(lineType == 1) {
					ctx.lineTo(getPointData(s,i,0) + dragOffsetX, getPointData(s,i,1) + dragOffsetY);
				}
				//Draw an arc. For now it will always be the same type
				else {
					/*var xPositionEnd = getPointData(s,i,0) + dragOffsetX;
					var yPositionEnd = getPointData(s,i,1) + dragOffsetY;
					
					//Getting the x and y position for the point at the start of the desired arc.
					//need an if statement because sometimes the preceding point occurs "after"
					//the starting point in the array
					var xPositionStart;
					var yPositionStart;
					if(i > 0) {
						xPositionStart = getPointData(s,i-1, 0) + dragOffsetX;
						yPositionStart = getPointData(s,i-1, 1) + dragOffsetY;
					} else {
						xPositionStart = getPointData(s,getNumberOfPoints(s)-1, 0) + dragOffsetX;
						yPositionStart = getPointData(s,getNumberOfPoints(s)-1, 1) + dragOffsetY;
					}
					
					//finding the center of the arc based on the x and y position of the two points
					//that the arc will connect to. For now the center of the arc will be on the line
					//that would have linearly connected the two points, but in the future I will either
					//make it possible to change the center point or have it so that tangent line at the
					//end of the curves will be parrallel to the lines it connects to. E.G. a smooth connection
					//or "differentiable at all points" This finds the center will be in the midpoint of 
					//the line between the two points.
					var arcCenterX = (xPositionStart + xPositionEnd)/2.0;
					var arcCenterY = (yPositionStart + yPositionEnd)/2.0;
					
					//Drawing the arc
					//arc(centerX,centerY,radius, startAngle, endAngle)
					ctx.arc(arcCenterX,arcCenterY,50,0,2*Math.PI);
					
					console.log("asdasd");*/
				}
			}
			ctx.lineTo(getPointData(s,0,0) + dragOffsetX, getPointData(s,0,1) + dragOffsetY);
		//Drawing the polygons that are not being moved.
		} else {
			ctx.moveTo(getPointData(s,0,0),getPointData(s,0,1));
			for(var i = 1; i < shapes[s].length; i++) {
				//Getting the type of line for this connection
				var lineType = getPointData(s,i,3);
				
				//Draws a line because the line type is linear
				if(lineType == 1) {
					ctx.lineTo(getPointData(s,i,0),getPointData(s,i,1));
				}
				//Draw an arc. For now it will always be the same type
				else {
					//Draw the arc here
				}
			}
			ctx.lineTo(getPointData(s,0,0), getPointData(s,0,1));
		}
		ctx.stroke();
	}
	
	//Draws a point bisecting a line if the user is hovering over a place to split a line.
	if(lineSplitPointX != -1 && lineSplitPointY != -1) {
		ctx.beginPath();
		ctx.fillStyle="blue"; ctx.strokeStyle= "#blue";
		ctx.arc(lineSplitPointX,lineSplitPointY,3.5,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
	}
	
	//Drawing the hovered over center point
	if(centerPointX != -1 && centerPointY != -1) {
		ctx.beginPath();
		ctx.fillStyle="blue"; ctx.strokeStyle= "#blue";
		if(draggingPolygon == true) {
			ctx.arc(centerPointX + dragOffsetX,centerPointY + dragOffsetY,3.5,0,2*Math.PI);
		} else {
			ctx.arc(centerPointX,centerPointY,3.5,0,2*Math.PI);
		}
		ctx.fill();
		ctx.stroke();
	}
	
	if(addingPointsMode == true) {
		//Drawing the hovered over center point
		ctx.beginPath();
		ctx.fillStyle="blue"; ctx.strokeStyle= "blue";
		ctx.arc(lastMouseX,lastMouseY,3.5,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
	}
}

function drawArcConnection() {
	var xPositionEnd = getPointData(s,i,0) + dragOffsetX;
	var yPositionEnd = getPointData(s,i,1) + dragOffsetY;

	//Getting the x and y position for the point at the start of the desired arc.
	//need an if statement because sometimes the preceding point occurs "after"
	//the starting point in the array
	var xPositionStart;
	var yPositionStart;
	if(i > 0) {
		xPositionStart = getPointData(s,i-1, 0);
		yPositionStart = getPointData(s,i-1, 1);
	} else {
		xPositionStart = getPointData(s,getNumberOfPoints(s)-1, 0);
		yPositionStart = getPointData(s,getNumberOfPoints(s)-1, 1);
	}

	//finding the center of the arc based on the x and y position of the two points
	//that the arc will connect to. For now the center of the arc will be on the line
	//that would have linearly connected the two points, but in the future I will either
	//make it possible to change the center point or have it so that tangent line at the
	//end of the curves will be parrallel to the lines it connects to. E.G. a smooth connection
	//or "differentiable at all points" This finds the center will be in the midpoint of 
	//the line between the two points.
	var arcCenterX = (xPositionStart + xPositionEnd)/2.0;
	var arcCenterY = (yPositionStart + yPositionEnd)/2.0;

	//Drawing the arc
	//arc(centerX,centerY,radius, startAngle, endAngle)
	ctx.arc(arcCenterX,arcCenterY,50,0,2*Math.PI);
}

function drawUI() {

}

function clear()
{
	//clears everything
	canvas.width = canvas.width;
}

function draw() {
	//At the start on an interation, we use this method to clear the entire screen.
	clear()
	
	//drawing the background grid
	drawGrid();
	
	drawPlate();
	
	drawMouseCoordinate();
	
	drawAllPoints();
	
	drawUI();
}