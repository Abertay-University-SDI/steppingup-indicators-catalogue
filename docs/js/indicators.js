var raw = [];
var categories = ["FOODWASTE", "BIOENERGY", "ECONOMY", "EDUCATION", "CLIMATE", "LAND"];
	
var C = {
	CANVAS_COLOUR: "rgb(206, 235, 241)",
	
	EC_COLOUR: "hsl(200, 100%, 50%)",
	ENV_COLOUR: "hsl(100, 100%, 42%)",
	SOC_COLOUR: "hsl(40, 100%, 50%)",
	SOC_EC_COLOUR: "hsl(275, 70%, 65%)",
	SOC_ENV_COLOUR: "hsl(70, 100%, 35%)",
	ALL_COLOUR: "hsl(0, 0%, 65%)",

	IN_RADIUS: 190,
	OUT_RADIUS: 270,
	IN_RADIUS_PUSH: -30,
	OUT_RADIUS_PUSH: 90,
	CENTR_RADIUS: 120
}

var cx = window.innerWidth/2;
var cy = (window.innerHeight/2) + 20;

var ready = false;

var selectedInnovation = "";

window.onresize = function() {
	if ( (raw.length > 0) && (ready) ) {
		resize();
	}
}

window.onorientationchange = function() {
	if ( (raw.length > 0) && (ready) ) {
		resize();
	}
}

window.onload = function() {
	getDimensions();	
	loadData();
}

var filteredData = [];

function getIndicatorColour(type) {
	switch (type) {
		case "Ec": return C.EC_COLOUR; break;
		case "Soc": return C.SOC_COLOUR; break;
		case "Env": return C.ENV_COLOUR; break;
		case "Soc/Env": return C.SOC_ENV_COLOUR; break;
		case "Soc/Ec": return C.SOC_EC_COLOUR; break;
		default: return C.ALL_COLOUR; break;
	}
}

function getDimensions() {
	d3.select("#svgCanvas")
		.attr("width", window.innerWidth)
		.attr("height", d3.max([window.innerHeight - document.getElementById("header").clientHeight - 8, 660]));
	
	d3.select("body").style("width", window.innerWidth);
	
	cx = d3.select("#svgCanvas").attr("width")/2;
	cy = (d3.select("#svgCanvas").attr("height")/2) + 20;
		
	var eyeSize = 0;
	if (window.innerWidth > window.innerHeight) {
		eyeSize = window.innerHeight/7.5;
	} else {
		eyeSize = window.innerWidth/5.0;
	}
	
	C.IN_RADIUS =  d3.max([150, eyeSize + 80]);
	C.OUT_RADIUS = d3.max([240, eyeSize + 160]);
	/*C.CENTR_RADIUS = d3.max([80, eyeSize]);
	C.IN_RADIUS_PUSH = d3.max([-40, eyeSize -170]);
	C.OUT_RADIUS_PUSH = d3.max([80, eyeSize]);*/
}

function changeData(innovation, button, icon) {
	
	if (ready) {
		
	ready = false;
	if (d3.select(button).classed("selected") || d3.select(icon).classed("selected")) {
		selectedInnovation = "";
		d3.selectAll("#innovations button").classed("selected", false);
		d3.selectAll(".innovationIcon").classed("selected", false).attr("fill", "#64778f");
		filteredData = raw;
	} else {
		selectedInnovation = innovation;
		d3.selectAll("#innovations button").classed("selected", false);
		d3.select(button).classed("selected", true);

		d3.selectAll(".innovationIcon").classed("selected", false).attr("fill", "#64778f");
		d3.select(icon).classed("selected", true).attr("fill", "red");
		
		filteredData = [];
		for (r = 0; r < raw.length; r++) {
			if (raw[r][innovation] == 1) {
				filteredData.push(raw[r]);
			}
		}
	}
	// bind
	var newData = d3.select("#svgCanvas").selectAll("path.tablet").data(filteredData, function(x) { return x.name; });
	
	
	var ex = 0;
	var en = 0;
	
	// exit tablets
		newData
			.exit()
			.classed("tablet", false)
			.transition("exitTablet")
				.attr("d", function(d, i) {
					return [
								"M",
								cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
								cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
								"L",
								cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
								cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
								"A",
								0,
								0,
								0,
								0,
								1,
								cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
								cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
								
								"L",
								cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
								cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
								"A",
								0,
								0,
								0,
								0,
								0,
								cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
								cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (0))						
							].join(" ");

				})
				.remove()
				.on("end", function() { 
					ex++;
					if (ex == newData.exit().size()) {
						if (en == newData.enter().size()) {
							ready = true;
						}
					}
				});
	
	
	
	// enter tablets
	
	// Indicators
	newData
		.enter()
		.append("path")
		.classed("tablet", true)
		.attr("d", function(d, i) {
			return [
						"M",
						cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						"L",
						cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						"A",
						0,
						0,
						0,
						0,
						1,
						cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						
						"L",
						cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						"A",
						0,
						0,
						0,
						0,
						0,
						cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (0))						
					].join(" ");

		})
		.attr("fill", function(d) {
			return getIndicatorColour(d.type)
		})
		.attr("stroke", function(d) {
			return getIndicatorColour(d.type)
		})
		.attr("stroke-width", 2)
		.merge(newData)
		.classed("selected", false)
		.classed("opened", false)
		.on("mouseover", function(d, i) {
			if (!d3.select(this).classed("opened")) {
				d3.select("#lab" + String(i)).style("font-weight", "bold");
				
				// SELECT
				if (!d3.select(this).classed("selected")) {
					selectIndicator(this, d, i, C.IN_RADIUS + C.IN_RADIUS_PUSH - 15, C.OUT_RADIUS + C.OUT_RADIUS_PUSH + 30);
					createLabel(d, i, C.IN_RADIUS + C.IN_RADIUS_PUSH);
					d3.select("#lab" + String(i)).style("font-weight", "bold");
				} else {
					selectIndicator(this, d, i, C.IN_RADIUS + C.IN_RADIUS_PUSH - 15, C.OUT_RADIUS + C.OUT_RADIUS_PUSH + 30);
					d3.select("#lab" + String(i)).style("font-weight", "bold");
				}
			}
		})
		.on("mouseout", function(d, i) {
			if (!d3.select(this).classed("opened")) {
				d3.select("#lab" + String(i)).style("font-weight", "normal");
				
				// DESELECT
				if (!d3.select(this).classed("selected")) {
					d3.select(this).transition("select").attr("d", function() {
						return [
								"M",
								cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
								cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
								"L",
								cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
								cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
								"A",
								C.OUT_RADIUS,
								C.OUT_RADIUS,
								0,
								0,
								1,
								cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
								cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
								
								"L",
								cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
								cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
								"A",
								C.IN_RADIUS,
								C.IN_RADIUS,
								0,
								0,
								0,
								cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
								cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS))						
							].join(" ");

					});
					d3.select("#lab" + String(i)).remove();
					d3.select("#labelPath" + String(i)).remove();
				} else {
					selectIndicator(this, d, i, C.IN_RADIUS + C.IN_RADIUS_PUSH, C.OUT_RADIUS + C.OUT_RADIUS_PUSH);
				}
			}
		})
		.on("click", function(d) {
			openIndicator(this, d);
		})
		.transition("switchTablet").duration(400)
		.attr("d", function(d, i) {
					return [
							"M",
							cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
							cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
							"L",
							cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
							cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
							"A",
							C.OUT_RADIUS,
							C.OUT_RADIUS,
							0,
							0,
							1,
							cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
							cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
							
							"L",
							cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
							cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
							"A",
							C.IN_RADIUS,
							C.IN_RADIUS,
							0,
							0,
							0,
							cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
							cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS))						
						].join(" ");
		})
		.on("end", function() { 
			en++;
			if (en == newData.enter().size()) {
				if (ex == newData.exit().size()) {
					ready = true;
				}
			}
		});
		
		
		
	d3.selectAll(".labelPath").remove();
	d3.selectAll(".textLab").remove();
	d3.selectAll("path.centre").style("fill", "#42556d").classed("selected", false);

	}
}

function loadData() {
	d3.csv("data/indicators_table.csv", function(d) {
		return 	{
					name: d["Indicator"],
					type: d["Type"],
					definition: d["Definition of Indicator"],
					driverBarrier: d["Driver/Barrier"],
					upDown: d["Increase/Decrease"],
					bigSmartAD: d["Big n Smart AD"],
					createCopeAD: d["Create n Cope AD"],
					shareConnectAD: d["Share n Connect AD"],
					bigSmartFR: d["Big n Smart Food redistribution"],
					createCopeFR: d["Create n Cope Food redistribution"],
					shareConnectFR: d["Share n Connect Food redistribution"],
					bigSmartIP: d["Big n Smart Insect protein"],
					createCopeIP: d["Create n Cope Insect protein"],
					shareConnectIP: d["Share n Connect Insect protein"],
					sdgGoals: d["SDGGoals"],
					InsectProteinInnovation: +d["InsectProteinInnovation"],
					ADInnovation: +d["ADInnovation"],
					FoodRedistributionInnovation: +d["FoodRedistributionInnovation"],
					FOODWASTE: +d["FOOD WASTE"],
					BIOENERGY: +d["BIOENERGY"],
					CLIMATE: +d["CLIMATE"],
					ECONOMY: +d["ECONOMY"],
					EDUCATION: +d["EDUCATION"],
					LAND: +d["LAND"]
				}
	}).then(function(data) {
		raw = data;	
		filteredData = raw;
		getDimensions();
		drawBackground();
	});
}

function resize() {
	getDimensions();
	
	d3.select("#svgCanvas").selectAll("path.tablet")
		.attr("d", function(d, i) {
				if (d3.select(this).classed("opened")) {
					return [
						"M",
						cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS + C.IN_RADIUS_PUSH - 15)),
						cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS + C.IN_RADIUS_PUSH - 15)),
						"L",
						cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS + C.OUT_RADIUS_PUSH + 30)),
						cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS + C.OUT_RADIUS_PUSH + 30)),
						"A",
						C.OUT_RADIUS + C.OUT_RADIUS_PUSH + 30,
						C.OUT_RADIUS + C.OUT_RADIUS_PUSH + 30,
						0,
						0,
						1,
						cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS + C.OUT_RADIUS_PUSH + 30)),
						cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS + C.OUT_RADIUS_PUSH + 30)),
						
						"L",
						cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS + C.IN_RADIUS_PUSH - 15)),
						cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS + C.IN_RADIUS_PUSH - 15)),
						"A",
						C.IN_RADIUS + C.IN_RADIUS_PUSH - 15,
						C.IN_RADIUS + C.IN_RADIUS_PUSH - 15,
						0,
						0,
						0,
						cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS + C.IN_RADIUS_PUSH - 15)),
						cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS + C.IN_RADIUS_PUSH - 15))						
					].join(" ");
				} else if (d3.select(this).classed("selected")) {
					return [
						"M",
						cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS + C.IN_RADIUS_PUSH)),
						cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS + C.IN_RADIUS_PUSH)),
						"L",
						cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS + C.OUT_RADIUS_PUSH)),
						cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS + C.OUT_RADIUS_PUSH)),
						"A",
						C.OUT_RADIUS + C.OUT_RADIUS_PUSH,
						C.OUT_RADIUS + C.OUT_RADIUS_PUSH,
						0,
						0,
						1,
						cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS + C.OUT_RADIUS_PUSH)),
						cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS + C.OUT_RADIUS_PUSH)),
						
						"L",
						cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS + C.IN_RADIUS_PUSH)),
						cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS + C.IN_RADIUS_PUSH)),
						"A",
						C.IN_RADIUS + C.IN_RADIUS_PUSH,
						C.IN_RADIUS + C.IN_RADIUS_PUSH,
						0,
						0,
						0,
						cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS + C.IN_RADIUS_PUSH)),
						cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS + C.IN_RADIUS_PUSH))						
					].join(" ");
					
				} else {
					return [
							"M",
							cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
							cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
							"L",
							cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
							cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
							"A",
							C.OUT_RADIUS,
							C.OUT_RADIUS,
							0,
							0,
							1,
							cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
							cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
							
							"L",
							cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
							cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
							"A",
							C.IN_RADIUS,
							C.IN_RADIUS,
							0,
							0,
							0,
							cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
							cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS))						
						].join(" ");
				}
			});
		
	d3.select("#svgCanvas").selectAll("path.centre")
		.attr("d", function(d, i) {
			return [
						"M",
						cx + (Math.sin( ((i-0.5)/6)*2*Math.PI ) * (0)),
						cy - (Math.cos( ((i-0.5)/6)*2*Math.PI ) * (0)),
						"L",
						cx + (Math.sin( ((i-0.5)/6)*2*Math.PI ) * (C.CENTR_RADIUS)),
						cy - (Math.cos( ((i-0.5)/6)*2*Math.PI ) * (C.CENTR_RADIUS)),
						"A",
						C.CENTR_RADIUS,
						C.CENTR_RADIUS,
						0,
						0,
						1,
						cx + (Math.sin( ((i+0.5)/6)*2*Math.PI ) * (C.CENTR_RADIUS)),
						cy - (Math.cos( ((i+0.5)/6)*2*Math.PI ) * (C.CENTR_RADIUS)),
						
						"L",
						cx + (Math.sin( ((i+0.5)/6)*2*Math.PI ) * (0)),
						cy - (Math.cos( ((i+0.5)/6)*2*Math.PI ) * (0)),
						"A",
						0,
						0,
						0,
						0,
						0,
						cx + (Math.sin( ((i-0.5)/6)*2*Math.PI ) * (0)),
						cy - (Math.cos( ((i-0.5)/6)*2*Math.PI ) * (0))						
					].join(" ");
		});
		
		
	d3.selectAll(".centreLabelPath")
		.attr("d", function(d, i) {
				// for text direction
				// based on proportion of circle
				if 	( 	( ( (i)/categories.length ) % 1 > 0.25 ) &&
						( ( (i)/categories.length ) % 1 < 0.75 )
					) {		
					// bottom
					return [
						"M",
						cx + (Math.sin( ((i+0.5)/categories.length)*2*Math.PI ) * (C.CENTR_RADIUS - 10)),
						cy - (Math.cos( ((i+0.5)/categories.length)*2*Math.PI ) * (C.CENTR_RADIUS - 10)),
						"A",
						C.CENTR_RADIUS - 10,
						C.CENTR_RADIUS - 10,
						0,
						0,
						0,
						cx + (Math.sin( ((i-0.5)/categories.length)*2*Math.PI ) * (C.CENTR_RADIUS - 10)),
						cy - (Math.cos( ((i-0.5)/categories.length)*2*Math.PI ) * (C.CENTR_RADIUS - 10))
						
						].join(" ");
				} else {
					// top
					return [
						"M",
						cx + (Math.sin( ((i-0.5)/categories.length)*2*Math.PI ) * (C.CENTR_RADIUS - 16)),
						cy - (Math.cos( ((i-0.5)/categories.length)*2*Math.PI ) * (C.CENTR_RADIUS - 16)),
						"A",
						C.CENTR_RADIUS - 16,
						C.CENTR_RADIUS - 16,
						0,
						0,
						1,
						cx + (Math.sin( ((i+0.5)/categories.length)*2*Math.PI ) * (C.CENTR_RADIUS - 16)),
						cy - (Math.cos( ((i+0.5)/categories.length)*2*Math.PI ) * (C.CENTR_RADIUS - 16))
						].join(" ");		
				}
			});
	
	d3.selectAll(".labelPath").attr("d", function(dd) {
		var i = dd.indicatorIndex;
		var inRadius = C.IN_RADIUS + C.IN_RADIUS_PUSH;
		// for text direction
		// based on proportion of circle
		if 	( 	( ( (i)/filteredData.length ) % 1 > 0.0 ) &&
				( ( (i)/filteredData.length ) % 1 < 0.5 )
			) {		
			// right
			return [
			"M",
			cx + (Math.sin( ((i-0.3)/filteredData.length)*2*Math.PI ) * (inRadius)),
			cy - (Math.cos( ((i-0.3)/filteredData.length)*2*Math.PI ) * (inRadius)),
			"L",
			cx + (Math.sin( ((i-0.3)/filteredData.length)*2*Math.PI ) * (inRadius + dd.indicatorData.name.length*10)),
			cy - (Math.cos( ((i-0.3)/filteredData.length)*2*Math.PI ) * (inRadius + dd.indicatorData.name.length*10))
			].join(" ");		
		} else {
			// left
			return [
			"M",
			cx + (Math.sin( ((i-0.7)/filteredData.length)*2*Math.PI ) * (inRadius + dd.indicatorData.name.length*9)),
			cy - (Math.cos( ((i-0.7)/filteredData.length)*2*Math.PI ) * (inRadius + dd.indicatorData.name.length*9)),
			"L",
			cx + (Math.sin( ((i-0.7)/filteredData.length)*2*Math.PI ) * (inRadius)),
			cy - (Math.cos( ((i-0.7)/filteredData.length)*2*Math.PI ) * (inRadius))
			].join(" ");
		}
	});
	
	d3.select("#centreCentre")
		.attr("cx", cx)
		.attr("cy", cy);
	
	
		
	d3.select("#ipIcon")
		.attr("cx", cx - 36)
		.attr("cy", cy + 22);
		
	d3.select("#frIcon")
		.attr("cx", cx + 36)
		.attr("cy", cy + 22);
		
	d3.select("#adIcon")
		.attr("cx", cx)
		.attr("cy", cy - 40);

	d3.select("#ipIconImage")
		.attr("x", cx - 57)
		.attr("y", cy + 2);
		
	d3.select("#frIconImage")
		.attr("x", cx + 16)
		.attr("y", cy + 2);
		
	d3.select("#adIconImage")
		.attr("x", cx - 20)
		.attr("y", cy - 61);
	
	
	//d3.selectAll(".labelPath").remove();
	
}


function drawBackground() {
	
		
	// Indicators
	d3.select("#svgCanvas").selectAll("path.tablet").data(filteredData, function(x) { return x.name; })
		.enter()
		.append("path")
		.classed("tablet", true)
		.attr("d", function(d, i) {
			return [
						"M",
						cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						"L",
						cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						"A",
						0,
						0,
						0,
						0,
						1,
						cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						
						"L",
						cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						"A",
						0,
						0,
						0,
						0,
						0,
						cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (0))						
					].join(" ");

		})
		.attr("fill", function(d) {
			return getIndicatorColour(d.type)
		})
		.attr("stroke", function(d) {
			return getIndicatorColour(d.type)
		})
		.attr("stroke-width", 2)
		.on("mouseover", function(d, i) {
			if (!d3.select(this).classed("opened")) {
				d3.select("#lab" + String(i)).style("font-weight", "bold");
				
				// SELECT
				if (!d3.select(this).classed("selected")) {
					selectIndicator(this, d, i, C.IN_RADIUS + C.IN_RADIUS_PUSH - 15, C.OUT_RADIUS + C.OUT_RADIUS_PUSH + 30);
					createLabel(d, i, C.IN_RADIUS + C.IN_RADIUS_PUSH);
					d3.select("#lab" + String(i)).style("font-weight", "bold");
				} else {
					selectIndicator(this, d, i, C.IN_RADIUS + C.IN_RADIUS_PUSH - 15, C.OUT_RADIUS + C.OUT_RADIUS_PUSH + 30);
					d3.select("#lab" + String(i)).style("font-weight", "bold");
				}
			}
		})
		.on("mouseout", function(d, i) {
			if (!d3.select(this).classed("opened")) {
				d3.select("#lab" + String(i)).style("font-weight", "normal");
				
				// DESELECT
				if (!d3.select(this).classed("selected")) {
					d3.select(this).transition("select").attr("d", function() {
						return [
								"M",
								cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
								cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
								"L",
								cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
								cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
								"A",
								C.OUT_RADIUS,
								C.OUT_RADIUS,
								0,
								0,
								1,
								cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
								cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
								
								"L",
								cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
								cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
								"A",
								C.IN_RADIUS,
								C.IN_RADIUS,
								0,
								0,
								0,
								cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
								cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS))						
							].join(" ");

					});
					d3.select("#lab" + String(i)).remove();
					d3.select("#labelPath" + String(i)).remove();
				} else {
					selectIndicator(this, d, i, C.IN_RADIUS + C.IN_RADIUS_PUSH, C.OUT_RADIUS + C.OUT_RADIUS_PUSH);
				}
			}
		})
		.on("click", function(d) {
			openIndicator(this, d);
		})
		.transition("introTablets").duration(400).delay(function(d, i) { return i*20; })
		.attr("d", function(d, i) {
			return [
						"M",
						cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
						cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
						"L",
						cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
						cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
						"A",
						C.OUT_RADIUS,
						C.OUT_RADIUS,
						0,
						0,
						1,
						cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
						cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
						
						"L",
						cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
						cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
						"A",
						C.IN_RADIUS,
						C.IN_RADIUS,
						0,
						0,
						0,
						cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
						cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS))						
					].join(" ");

		});
	
	
	
	// Centre
	d3.select("#svgCanvas").selectAll("path.centre")
		.data(categories)
		.enter()
		.append("path")
		.classed("centre", true)
		.attr("d", function(d, i) {
			return [
						"M",
						cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						"L",
						cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						"A",
						0,
						0,
						0,
						0,
						1,
						cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						
						"L",
						cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						"A",
						0,
						0,
						0,
						0,
						0,
						cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (0))						
					].join(" ");

		})
		.attr("fill", "#42556d")
		.attr("stroke", "#000")
		.attr("stroke-width", 1)
		.on("mouseover", function(d, i) {
			if (!d3.select(this).classed("selected")) {
				d3.select(this).style("fill", "#000");
			} else {
				d3.select(this).style("fill", "red");
			}
			d3.selectAll("path.tablet").each(function(dd, ii) {
				if (dd[d] === 1) {
					d3.select(this).transition("blackOutline").duration(500)
					.attr("stroke", "black");
				}
			});
		})
		.on("mouseout", function(d, i) {
			if (!d3.select(this).classed("selected")) {
					d3.select(this).style("fill", "#42556d");
				} else {
					d3.select(this).style("fill", "hsl(0, 100%, 40%)");
				}
				d3.selectAll("path.tablet").each(function(dd, ii) {

					if (dd[d] === 1) {
						d3.select(this).transition("colourOutline").duration(500).attr("stroke", function() {
								return getIndicatorColour(dd.type)
						})
							.attr("fill", function() {
							return getIndicatorColour(dd.type)
						});
					}
				});
		})
		.on("click", function(d, i) {
				// DESELECT OLD
				// note transition same name to avoid overlapping categories from not working properly
				d3.selectAll("path.tablet").transition("select").attr("d", function(dd, ii) {
					d3.select("#" + "lab" + String(ii)).remove();
					d3.select("#" + "labelPath" + String(ii)).remove();
					d3.select(this).classed("selected", false);
				
					return [
							"M",
							cx + (Math.sin( (((ii-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
							cy - (Math.cos( (((ii-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
							"L",
							cx + (Math.sin( (((ii-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
							cy - (Math.cos( (((ii-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
							"A",
							C.OUT_RADIUS,
							C.OUT_RADIUS,
							0,
							0,
							1,
							cx + (Math.sin( (((ii)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
							cy - (Math.cos( (((ii)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
							
							"L",
							cx + (Math.sin( (((ii)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
							cy - (Math.cos( (((ii)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
							"A",
							C.IN_RADIUS,
							C.IN_RADIUS,
							0,
							0,
							0,
							cx + (Math.sin( (((ii-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
							cy - (Math.cos( (((ii-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS))						
						].join(" ");

				});
				
				if (!d3.select(this).classed("selected")) {
					d3.selectAll("path.centre").style("fill", "#42556d").classed("selected", false);			
					d3.select(this).style("fill", "#f00").classed("selected", true);

					// SELECT NEW
					d3.selectAll(".textLab, .labelPath").remove();
					
					d3.selectAll("path.tablet").each(function(dd, ii) {
						if (dd[d] === 1) {
							// DANGER: not all have been deleted and not all have been created (ii incorrect)
							d3.select(this).classed("selected", true);
							selectIndicator(this, dd, ii, C.IN_RADIUS + C.IN_RADIUS_PUSH, C.OUT_RADIUS + C.OUT_RADIUS_PUSH);
							createLabel(dd, ii, C.IN_RADIUS + C.IN_RADIUS_PUSH);
						}
						
					});
				} else {
					d3.selectAll("path.centre").style("fill", "#42556d").classed("selected", false);
					d3.select(this).style("fill", "#000");
				}
		})
		.each(function(d, i) {

			// text path
			d3.select("#svgCanvas").append("path").classed("centreLabelPath", true).attr("id", "centreLabelPath" + String(i))
			.attr("d", function() {
				// for text direction
				// based on proportion of circle
				if 	( 	( ( (i)/categories.length ) % 1 > 0.25 ) &&
						( ( (i)/categories.length ) % 1 < 0.75 )
					) {		
					// bottom
					return [
						"M",
						cx + (Math.sin( ((i+0.5)/categories.length)*2*Math.PI ) * (C.CENTR_RADIUS - 10)),
						cy - (Math.cos( ((i+0.5)/categories.length)*2*Math.PI ) * (C.CENTR_RADIUS - 10)),
						"A",
						C.CENTR_RADIUS - 10,
						C.CENTR_RADIUS - 10,
						0,
						0,
						0,
						cx + (Math.sin( ((i-0.5)/categories.length)*2*Math.PI ) * (C.CENTR_RADIUS - 10)),
						cy - (Math.cos( ((i-0.5)/categories.length)*2*Math.PI ) * (C.CENTR_RADIUS - 10))
						
						].join(" ");
				} else {
					// top
					return [
						"M",
						cx + (Math.sin( ((i-0.5)/categories.length)*2*Math.PI ) * (C.CENTR_RADIUS - 16)),
						cy - (Math.cos( ((i-0.5)/categories.length)*2*Math.PI ) * (C.CENTR_RADIUS - 16)),
						"A",
						C.CENTR_RADIUS - 16,
						C.CENTR_RADIUS - 16,
						0,
						0,
						1,
						cx + (Math.sin( ((i+0.5)/categories.length)*2*Math.PI ) * (C.CENTR_RADIUS - 16)),
						cy - (Math.cos( ((i+0.5)/categories.length)*2*Math.PI ) * (C.CENTR_RADIUS - 16))
						].join(" ");		
				}
			})
			.attr("fill", "none")
			.attr("stroke", "black")
			.attr("startOffset", 6 + (9 - d.length)*6 )
			.attr("stroke-width", 0)
			.style("pointer-events", "none");

			// text
			d3.select("#svgCanvas").append("text").classed("centreTextLab", true)
				.append("textPath")
				.attr("href", "#centreLabelPath" + String(i))
				.attr("xlink:href", "#centreLabelPath" + String(i))
				.attr("id", "centreLab" + String(i))
				.attr("startOffset", 6 + (10 - d.length)*5 )
				.text(d)
				.style("font-size", "0.9em")
				.style("pointer-events", "none")
				.style("fill", "rgba(255, 255, 255, 0)")
				.transition("introCentreText").delay(900).duration(600)
				.style("fill", "white");
		})
		.transition("introCentre").duration(600).delay(600)
		.on("end", function() { 
			// FINAL TRANSITION
			ready = true; 
			resize(); 
		})
		.attr("d", function(d, i) {
			return [
						"M",
						cx + (Math.sin( ((i-0.5)/6)*2*Math.PI ) * (0)),
						cy - (Math.cos( ((i-0.5)/6)*2*Math.PI ) * (0)),
						"L",
						cx + (Math.sin( ((i-0.5)/6)*2*Math.PI ) * (C.CENTR_RADIUS)),
						cy - (Math.cos( ((i-0.5)/6)*2*Math.PI ) * (C.CENTR_RADIUS)),
						"A",
						C.CENTR_RADIUS,
						C.CENTR_RADIUS,
						0,
						0,
						1,
						cx + (Math.sin( ((i+0.5)/6)*2*Math.PI ) * (C.CENTR_RADIUS)),
						cy - (Math.cos( ((i+0.5)/6)*2*Math.PI ) * (C.CENTR_RADIUS)),
						
						"L",
						cx + (Math.sin( ((i+0.5)/6)*2*Math.PI ) * (0)),
						cy - (Math.cos( ((i+0.5)/6)*2*Math.PI ) * (0)),
						"A",
						0,
						0,
						0,
						0,
						0,
						cx + (Math.sin( ((i-0.5)/6)*2*Math.PI ) * (0)),
						cy - (Math.cos( ((i-0.5)/6)*2*Math.PI ) * (0))						
					].join(" ");
		});
		
		
	// Innovation Icons
	d3.select("#svgCanvas").append("circle")
		.attr("id", "centreCentre")
		.attr("r", 20)
		.attr("cx", cx)
		.attr("cy", cy)
		.attr("fill", "#20334b")
		.attr("stroke", "black")
		.attr("stroke-width", 1)
		.transition("introCentre").duration(600).delay(200)
		.attr("r", 80);
	
	
		
	d3.select("#svgCanvas").append("circle")
		.attr("id", "ipIcon")
		.classed("innovationIcon", true)
		.attr("r", 36)
		.attr("cx", cx - 36)
		.attr("cy", cy + 22)
		.attr("fill", "#64778f")
		.attr("stroke", "black")
		.attr("stroke-width", 1)
		.on("mouseover", function() {
			d3.select(this).attr("stroke-width", 3);
			d3.select("#ipBtn").style("border", "4px solid black");
		})
		.on("mouseout", function() {
			d3.select(this).attr("stroke-width", 1);
			d3.select("#ipBtn").style("border", ""/*"4px solid #64778f"*/);
		})
		.on("click", function() {
			changeData("InsectProteinInnovation", document.getElementById("ipBtn"), this);
		});
		
	d3.select("#svgCanvas").append("circle")
		.attr("id", "frIcon")
		.classed("innovationIcon", true)
		.attr("r", 36)
		.attr("cx", cx + 36)
		.attr("cy", cy + 22)
		.attr("fill", "#64778f")
		.attr("stroke", "black")
		.attr("stroke-width", 1)
		.on("mouseover", function() {
			d3.select(this).attr("stroke-width", 3);
			d3.select("#frBtn").style("border", "4px solid black");
		})
		.on("mouseout", function() {
			d3.select(this).attr("stroke-width", 1);
			d3.select("#frBtn").style("border", ""/*"4px solid #64778f"*/);
		})
		.on("click", function() {
			changeData("FoodRedistributionInnovation", document.getElementById("frBtn"), this);
		});
		
	d3.select("#svgCanvas").append("circle")
		.attr("id", "adIcon")
		.classed("innovationIcon", true)
		.attr("r", 36)
		.attr("cx", cx)
		.attr("cy", cy - 40)
		.attr("fill", "#64778f")
		.attr("stroke", "black")
		.attr("stroke-width", 1)
		.on("mouseover", function() {
			d3.select(this).attr("stroke-width", 3);
			d3.select("#adBtn").style("border", "4px solid black");
		})
		.on("mouseout", function() {
			d3.select(this).attr("stroke-width", 1);
			d3.select("#adBtn").style("border", ""/*"4px solid #64778f"*/);
		})
		.on("click", function() {
			changeData("ADInnovation", document.getElementById("adBtn"), this);
		});
		
	d3.select("#svgCanvas").append("image")
		.attr("id", "ipIconImage")
		.attr('xlink:href', 'img/iconmonstr-bug-4w.svg')
		.attr('width', 40)
		.attr('height', 40)
		.attr("x", cx - 57)
		.attr("y", cy + 2)
		.classed("nopointer", true);
		
	d3.select("#svgCanvas").append("image")
		.attr("id", "frIconImage")
		.attr('xlink:href', 'img/iconmonstr-eat-4w.svg')
		.attr('width', 40)
		.attr('height', 40)
		.attr("x", cx + 16)
		.attr("y", cy + 2)
		.classed("nopointer", true);
		
	d3.select("#svgCanvas").append("image")
		.attr("id", "adIconImage")
		.attr('xlink:href', 'img/iconmonstr-light-bulb-6w.svg')
		.attr('width', 40)
		.attr('height', 40)
		.attr("x", cx - 20)
		.attr("y", cy - 61)
		.classed("nopointer", true);
		
	d3.select("#ipBtn")
		.on("mouseover", function() {
			d3.select("#ipIcon").attr("stroke-width", 3);
		})
		.on("mouseout", function() {
			d3.select("#ipIcon").attr("stroke-width", 1);
		});
		
	d3.select("#frBtn")
		.on("mouseover", function() {
			d3.select("#frIcon").attr("stroke-width", 3);
		})
		.on("mouseout", function() {
			d3.select("#frIcon").attr("stroke-width", 1);
		});
		
	d3.select("#adBtn")
		.on("mouseover", function() {
			d3.select("#adIcon").attr("stroke-width", 3);
		})
		.on("mouseout", function() {
			d3.select("#adIcon").attr("stroke-width", 1);
		});
		
}

function goback() {
	
	d3.select("#backButton").style("top", "2em")
				.transition().duration(300)
				.style("top", "100em");
	
	d3.select("#indicatorDetails").style("top", "3em").style("bottom", "3em")
				.transition().duration(600)
				.style("top", "100em").style("bottom", "-100em")
				.on("end", function() {
					document.getElementById("indicatorDetails").hidden = true;	

					setTimeout(function() {
						d3.selectAll("path.tablet").each(function(d, i) {
							if (d3.select(this).classed("opened")) {
								d3.select("#lab" + String(i)).style("font-weight", "normal");
					
								// DESELECT ( like mouse out)
								if (!d3.select(this).classed("selected")) {
									d3.select(this).transition("deselectBack").attr("d", function() {
										return [
												"M",
												cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
												cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
												"L",
												cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
												cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
												"A",
												C.OUT_RADIUS,
												C.OUT_RADIUS,
												0,
												0,
												1,
												cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
												cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
												
												"L",
												cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
												cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
												"A",
												C.IN_RADIUS,
												C.IN_RADIUS,
												0,
												0,
												0,
												cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
												cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (C.IN_RADIUS))						
											].join(" ");

									});
									d3.select("#lab" + String(i)).remove();
									d3.select("#labelPath" + String(i)).remove();
								} else {
									selectIndicator(this, d, i, C.IN_RADIUS + C.IN_RADIUS_PUSH, C.OUT_RADIUS + C.OUT_RADIUS_PUSH);
								}
								d3.selectAll("path.tablet").classed("opened", false);
							}
						});
					}, 60);
				});
				
	
}


function openIndicator(element, d, i) {
			if (d3.selectAll("path.tablet.opened").size() < 1) {
			// KEEP OPEN
			d3.select(element).classed("opened", true);
			
			// OPEN INDICATOR DETAILS
			// UPDATE DETAILS
			d3.select("#indicatorDetails").style("background-color", function() {
				return getIndicatorColour(d.type)
			});
			
			d3.select("#driverBarrier").text(function() {
				/*if (d.driverBarrier === "Driver") {
					d3.select(element).style("color", "rgb(0, 120 , 0)");
					return "Innovation Driver"
				} else if (d.driverBarrier === "Barrier") {
					d3.select(element).style("color", "rgb(120, 0 , 0)");
					return "Innovation Barrier"
				} else {
					return d.driverBarrier;
				}*/
				return d.driverBarrier;
			});

			d3.select("#upDown").text(function() {
				/*if (d.upDown === "Decrease") {
					d3.select(element).style("color", "rgb(120, 0 , 0)");
					return "Ideally Decrease";
				} else if (d.upDown === "Increase") {
					d3.select(element).style("color", "rgb(0, 120 , 0)");
					return "Ideally Increase";
				} else {
					return d.upDown;
				}*/
				return d.upDown;
			});
			
			d3.select("#iDefinition").text(function() {
				return d.definition;
			});
			
			d3.select("#iTitle").text(function() {
				return d.name;
			});
			
			d3.select("#futureScenario").classed("selected", false);
			d3.select("#bns").classed("selected", false);
			d3.select("#cnc").classed("selected", false);
			d3.select("#snc").classed("selected", false);
			d3.select("#futureScenario").text("^ Select a Future Scenario Tab Above ^");
			
			d3.select("#bns").on("click", function() {
				switch (selectedInnovation) {
					case "InsectProteinInnovation": d3.select("#futureScenario").text(d.bigSmartIP); break;
					case "FoodRedistributionInnovation": d3.select("#futureScenario").text(d.bigSmartFR); break;
					case "ADInnovation": d3.select("#futureScenario").text(d.bigSmartAD); break;
					default: 
						document.getElementById("futureScenario").innerHTML = "";
						d3.select("#futureScenario").append("h4").text("Insect Protein");
						d3.select("#futureScenario").append("p").text(d.bigSmartIP);
						d3.select("#futureScenario").append("h4").text("Anaerobic Digestion");
						d3.select("#futureScenario").append("p").text(d.bigSmartAD);
						d3.select("#futureScenario").append("h4").text("Food Redistribution");
						d3.select("#futureScenario").append("p").text(d.bigSmartFR);
						break;
				}
				d3.select("#futureScenario").classed("selected", true);
				d3.select(this).classed("selected", true);
				d3.select("#cnc").classed("selected", false);
				d3.select("#snc").classed("selected", false);
			});
			
			d3.select("#cnc").on("click", function() {
				switch (selectedInnovation) {
					case "InsectProteinInnovation": d3.select("#futureScenario").text(d.createCopeIP); break;
					case "FoodRedistributionInnovation": d3.select("#futureScenario").text(d.createCopeFR); break;
					case "ADInnovation": d3.select("#futureScenario").text(d.createCopeAD); break;
					default: 
						document.getElementById("futureScenario").innerHTML = "";
						d3.select("#futureScenario").append("h4").text("Insect Protein");
						d3.select("#futureScenario").append("p").text(d.createCopeIP);
						d3.select("#futureScenario").append("h4").text("Anaerobic Digestion");
						d3.select("#futureScenario").append("p").text(d.createCopeAD);
						d3.select("#futureScenario").append("h4").text("Food Redistribution");
						d3.select("#futureScenario").append("p").text(d.createCopeFR);
						break;
				}
				d3.select("#futureScenario").classed("selected", true);
				d3.select(this).classed("selected", true);
				d3.select("#bns").classed("selected", false);
				d3.select("#snc").classed("selected", false);
			});
			
			d3.select("#snc").on("click", function() {
				switch (selectedInnovation) {
					case "InsectProteinInnovation": d3.select("#futureScenario").text(d.shareConnectIP); break;
					case "FoodRedistributionInnovation": d3.select("#futureScenario").text(d.shareConnectFR); break;
					case "ADInnovation": d3.select("#futureScenario").text(d.shareConnectAD); break;
					default: 
						document.getElementById("futureScenario").innerHTML = "";
						d3.select("#futureScenario").append("h4").text("Insect Protein");
						d3.select("#futureScenario").append("p").text(d.shareConnectIP);
						d3.select("#futureScenario").append("h4").text("Anaerobic Digestion");
						d3.select("#futureScenario").append("p").text(d.shareConnectAD);
						d3.select("#futureScenario").append("h4").text("Food Redistribution");
						d3.select("#futureScenario").append("p").text(d.shareConnectFR);
						break;
				}
				d3.select("#futureScenario").classed("selected", true);
				d3.select(this).classed("selected", true);
				d3.select("#cnc").classed("selected", false);
				d3.select("#bns").classed("selected", false);
			});
			
			// hide future scenarios if all empty
			/*document.getElementById("futureSection").hidden = false;
			if ( (d.bigSmart.length < 1) && (d.createCope.length < 1) && (d.shareConnect.length < 1) ) {
				document.getElementById("futureSection").hidden = true;
			}*/

			// UN SDG 
			d3.selectAll("#unsdg *").remove();
			var sdg = JSON.parse('{ "numbers": [' + d.sdgGoals + ']}');
				d3.select("#unsdg").selectAll("a")
					.data(sdg.numbers).enter().append("a")
					.attr("href", "https://www.un.org/sustainabledevelopment/sustainable-development-goals/")
					.attr("target", "_blank")
					.append("img")
					.attr("src", function(dd, i) {
						return "img/sdg_icons/E_SDG goals_icons-individual-rgb-" + String(dd) + ".png";
					})
					.attr("alt", function(dd, i) {
						return "UN Sustainable Development Goal Number " + String(dd);
					})
					.classed("sdgImg", true);
			
			// REVEAL WINDOW
			
			document.getElementById("indicatorDetails").hidden = false;
			d3.select("#indicatorDetails").style("top", "100em").style("bottom", "-100em")
				.transition().duration(600)
				.style("top", "3em").style("bottom", "3em");
			
			d3.select("#backButton").style("top", "100em")
				.transition().duration(300)
				.style("top", "2em");

			}
}

function selectIndicator(element, d, i, inRadius, outRadius) {
	d3.select(element).transition("select").attr("d", function() {
				return [
						"M",
						cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (inRadius)),
						cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (inRadius)),
						"L",
						cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (outRadius)),
						cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (outRadius)),
						"A",
						outRadius,
						outRadius,
						0,
						0,
						1,
						cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (outRadius)),
						cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (outRadius)),
						
						"L",
						cx + (Math.sin( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (inRadius)),
						cy - (Math.cos( (((i)/filteredData.length) - (((1)/filteredData.length)/10) )*2*Math.PI ) * (inRadius)),
						"A",
						inRadius,
						inRadius,
						0,
						0,
						0,
						cx + (Math.sin( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (inRadius)),
						cy - (Math.cos( (((i-1)/filteredData.length) + (((1)/filteredData.length)/10) )*2*Math.PI ) * (inRadius))						
					].join(" ");

			});
}

function createLabel(d, i, inRadius) {
	// text path
	d3.select("#svgCanvas").append("path").classed("labelPath", true).attr("id", "labelPath" + String(i))
	.datum({indicatorData: d, indicatorIndex: i})
	.attr("d", function() {
		// for text direction
		// based on proportion of circle
		if 	( 	( ( (i)/filteredData.length ) % 1 > 0.0 ) &&
				( ( (i)/filteredData.length ) % 1 < 0.5 )
			) {		
			// right
			return [
			"M",
			cx + (Math.sin( ((i-0.3)/filteredData.length)*2*Math.PI ) * (inRadius)),
			cy - (Math.cos( ((i-0.3)/filteredData.length)*2*Math.PI ) * (inRadius)),
			"L",
			cx + (Math.sin( ((i-0.3)/filteredData.length)*2*Math.PI ) * (inRadius + d.name.length*10)),
			cy - (Math.cos( ((i-0.3)/filteredData.length)*2*Math.PI ) * (inRadius + d.name.length*10))
			].join(" ");		
		} else {
			// left
			return [
			"M",
			cx + (Math.sin( ((i-0.7)/filteredData.length)*2*Math.PI ) * (inRadius + d.name.length*9)),
			cy - (Math.cos( ((i-0.7)/filteredData.length)*2*Math.PI ) * (inRadius + d.name.length*9)),
			"L",
			cx + (Math.sin( ((i-0.7)/filteredData.length)*2*Math.PI ) * (inRadius)),
			cy - (Math.cos( ((i-0.7)/filteredData.length)*2*Math.PI ) * (inRadius))
			].join(" ");
		}
	})
	.attr("fill", "none")
	.attr("stroke", "black")
	.attr("stroke-width", 0);
	
	// text
	d3.select("#svgCanvas").append("text").classed("textLab", true)
		.append("textPath")
		.attr("href", "#labelPath" + String(i))
		.attr("xlink:href", "#labelPath" + String(i))
		.attr("id", "lab" + String(i))
		.text(d.name)
		.style("fill", "white")
		.attr("pointer-events", "none");
}