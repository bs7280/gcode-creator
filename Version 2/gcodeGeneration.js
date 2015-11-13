
			function makeGcode() {
				//variable that contains all the outputted gcode.
				var gcode_string = "";
				
				//Initialization code generation. For now, it will always be the same.
				var gcode_initialization = "";
				
				//content that gets added to the end of a gcode program
				var gcode_finish = "M30";
				
				//information containing the depth of the plate and ammount to cut out per layer.
				var depthOfCut = 0.3; //depth of the plate in MILLIMETERS
				var depthPerLayer = 0.15; //depth, in MILLIMETERS
				var clockwise = true; //if true, then the cut is clockwise (otherwise counterclockwise)
				
				//Modifying Scale
				var scaleModifier = 65; //used to decrease the dimensions of the design, for the sake of
				//temporarily making realistically sized model to cut out when testing.
				
				//Looping through all the shapes/polygons and getting the gcode for each
				for(var s = 0; s < shapes.length; s++) {
					gcode_string += "(Polygon : " + (s + 1) + ")\n";
					var lastDepth = 0;
					for(var d = 0; d < depthOfCut; d+=depthPerLayer) {
						for(var i = 0; i < shapes[s].length; i++) {
							var depthChange = Math.ceil((depthPerLayer/(shapes[s].length)) * 100)/100;
							gcode_string += "G1 x" + (roundSpecific(shapes[s][i][0]/scaleModifier, 5) - roundSpecific(plateHorizontalOffset/scaleModifier, 5))
											+ " y" + (roundSpecific(shapes[s][i][1]/scaleModifier, 5) - roundSpecific(plateVerticalOffset/scaleModifier, 5))
											+ " z-" + roundSpecific((lastDepth + depthChange), 5)
											+ " F12 \n";
							lastDepth += depthChange;
						}
					}
					gcode_string += "\n";
					
					gcode_string += "G1 x" + (roundSpecific(shapes[s][shapes[s].length - 1][0]/scaleModifier, 5) - roundSpecific(plateHorizontalOffset/scaleModifier, 5))
									+ " y" + (roundSpecific(shapes[s][shapes[s].length - 1][1]/scaleModifier, 5) - roundSpecific(plateVerticalOffset/scaleModifier, 5))
									+ " z1 F12\n";
					if (s < shapes.length - 1) {
						gcode_string += "G1 x" + (roundSpecific(shapes[s + 1][0][0]/scaleModifier, 5) - roundSpecific(plateHorizontalOffset/scaleModifier, 5))
										+ " y" + (roundSpecific(shapes[s + 1][0][1]/scaleModifier, 5) - roundSpecific(plateVerticalOffset/scaleModifier, 5))
										+ " z1 F12\n";
					}
					
					gcode_string += "\n";
				}
				
				//Putting gcode string into the textbox
				document.getElementById('gcodeOutput').value = gcode_string;
			}