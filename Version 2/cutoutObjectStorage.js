//Variable that stores all the coordinate points for shapes to be cut out
var shapes = new Array();
shapes[0] = new Array(); //creating a new shape/cutout section
shapes[0][0] = new Array(3);
shapes[0][0][0] = 32*7;
shapes[0][0][1] = 32*7;
shapes[0][0][2] = false;
shapes[0][0][3] = 1; //type of movement for the gcode (1:linear, 2:arc, 3:arc, etc...)
shapes[0][1] = new Array(3);
shapes[0][1][0] = 32*9;
shapes[0][1][1] = 32*7;
shapes[0][1][2] = false;
shapes[0][1][3] = 1; //type of movement for the gcode (1:linear, 2:arc, 3:arc, etc...)
shapes[0][2] = new Array(3);
shapes[0][2][0] = 32*9;
shapes[0][2][1] = 32*9;
shapes[0][2][2] = false;
shapes[0][2][3] = 1; //type of movement for the gcode (1:linear, 2:arc, 3:arc, etc...)

shapes[1] = new Array();
shapes[1][0] = new Array(3);
shapes[1][0][0] = 32*10;
shapes[1][0][1] = 32*10;
shapes[1][0][2] = false;
shapes[1][0][3] = 1; //type of movement for the gcode (1:linear, 2:arc, 3:arc, etc...)
shapes[1][1] = new Array(3);
shapes[1][1][0] = 32*14;
shapes[1][1][1] = 32*12;
shapes[1][1][2] = false;
shapes[1][1][3] = 1; //type of movement for the gcode (1:linear, 2:arc, 3:arc, etc...)
shapes[1][2] = new Array(3);
shapes[1][2][0] = 32*15;
shapes[1][2][1] = 32*11;
shapes[1][2][2] = false;
shapes[1][2][3] = 1; //type of movement for the gcode (1:linear, 2:arc, 3:arc, etc...)

function getPointData(polygonId, pointId, data) {
	//console.log(polygonId + " " + pointId + " " + data);
	if(data == 2) {
		return shapes[polygonId][pointId][data];
	} else {
		return shapes[polygonId][pointId][data];// * millimetersToPixels;
	}
}

function setPointData(polygonId, pointId, dataLocation, dataValue) {
	shapes[polygonId][pointId][dataLocation] = dataValue;
}

function getNumberOfPolygons() {
	return shapes.length;
}

function getNumberOfPoints(s) {
	return shapes[s].length;
}
/*
function cutoutStorage() {
	this.storage = new Array();
	this.addCutout = function(cuttoutArray) {
		this.storage[this.storage.length] = cuttoutArray
	}
}

function cutout() {
	var this.coordinates = new Array();
	
	this.addCoordinate = function(points) {
		this.coordinates[this.coordinates.length] = points;
		alert(this.coordinates.length);
	}
	
	this.getCoordiante = new function(a) {
		return this.coordinates[a];
	}
	
	this.farts = "adasdasd";
}

//creates a new coordinate set with a given location
function coordinateSet(x,y) {
	this.points = new Array(3);
	this.points[0] = x;
	this.points[1] = y;
	this.points[2] = false;
	
	
	//updates the location of the coordinate
	this.setPoints = new function(x,y) {
		this.points[0] = x;
		this.points[1] = y;
		this.points[3] = false;
	}	
	
	this.getPointsString = new function() {
		return "(" + this.points[0] + ", " + this.points[1] + ")";
	}
}

var storage = new cutoutStorage();
var cutout1 = new cutout();
//cutout1.addCoordinate(new coordinateSet(100,100));
//cutout1.addCoordinate(new coordinateSet(200,100));
//cutout1.addCoordinate(new coordinateSet(100,200));

//alert(cutout1.getCoordinate(0).getPointsString());
alert(cutout1.farts);

//storage.addCutout(cutout1);

*/

