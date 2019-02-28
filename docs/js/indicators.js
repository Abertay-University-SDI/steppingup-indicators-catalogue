var raw = [];
var categories = ["FOODWASTE", "BIOENERGY", "ECONOMY", "EDUCATION", "CLIMATE", "LAND"];
	
var C = {
	CANVAS_COLOUR: "rgb(206, 235, 241)",
	
	EC_COLOUR: "hsl(200, 100%, 50%)",
	ENV_COLOUR: "hsl(100, 100%, 45%)",
	SOC_COLOUR: "hsl(40, 100%, 50%)",
	MIX_COLOUR: "hsl(260, 100%, 65%)",

	IN_RADIUS: 190,
	OUT_RADIUS: 270,
	IN_RADIUS_PUSH: -40,
	OUT_RADIUS_PUSH: 80,
	CENTR_RADIUS: 110
}

var cx = window.innerWidth/2;
var cy = window.innerHeight/2;

window.onresize = function() {
	if (raw.length > 0) {
		resize();
	}
}

window.onload = function() {
	getDimensions();	
	loadData();
}

function loadData() {
	d3.csv("data/indicators_table.csv", function(d) {
		return 	{
					name: d["Indicator"],
					type: d["Type"],
					comment: d["Comment"],
					driverBarrier: d["DriverBarrier"],
					upDown: d["IncreaseDecrease"],
					bigSmart: d["Big n Smart"],
					createCope: d["Create n Cope"],
					shareConnect: d["Share n Connect"],
					sdgGoals: d["SDGGoals"],
					FOODWASTE: +d["FOOD WASTE"],
					BIOENERGY: +d["BIOENERGY"],
					CLIMATE: +d["CLIMATE"],
					ECONOMY: +d["ECONOMY"],
					EDUCATION: +d["EDUCATION"],
					LAND: +d["LAND"]
				}
	}).then(function(data) {
		raw = data;	
		getDimensions();
		drawBackground();
	});
}

function getDimensions() {
	d3.select("#svgCanvas")
		.attr("width", window.innerWidth)
		.attr("height", window.innerHeight);
	
	cx = window.innerWidth/2;
	cy = window.innerHeight/2;
	
	var eyeSize = 0;
	if (window.innerWidth > window.innerHeight) {
		eyeSize = window.innerHeight/7.5;
	} else {
		eyeSize = window.innerWidth/5.0;
	}
	
	C.IN_RADIUS =  d3.max([100, eyeSize + 80]);
	C.OUT_RADIUS = d3.max([180, eyeSize + 160]);
	/*C.CENTR_RADIUS = d3.max([80, eyeSize]);
	C.IN_RADIUS_PUSH = d3.max([-40, eyeSize -170]);
	C.OUT_RADIUS_PUSH = d3.max([80, eyeSize]);*/
}

function resize() {
	getDimensions();
	
	d3.select("#svgCanvas").selectAll("path.tablet")
		.classed("selected", false).classed("opened", false)
		.attr("d", function(d, i) {
				return [
							"M",
							cx + (Math.sin( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
							cy - (Math.cos( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
							"L",
							cx + (Math.sin( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
							cy - (Math.cos( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
							"A",
							C.OUT_RADIUS,
							C.OUT_RADIUS,
							0,
							0,
							1,
							cx + (Math.sin( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
							cy - (Math.cos( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
							
							"L",
							cx + (Math.sin( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
							cy - (Math.cos( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
							"A",
							C.IN_RADIUS,
							C.IN_RADIUS,
							0,
							0,
							0,
							cx + (Math.sin( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
							cy - (Math.cos( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS))						
						].join(" ");

		})
		
	d3.select("#svgCanvas").selectAll("path.centre")
		.classed("selected", false)
		.style("fill", "#42556d")
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
			})
	
	d3.selectAll(".labelPath").remove();
		
		
	// WEF ICON
	d3.select("#wefIcon")
		.attr("x", cx - 70).attr("y", cy - 70);

	
}


function drawBackground() {
	
		
	// Indicators
	d3.select("#svgCanvas").selectAll("path.tablet").data(raw, function(x) { return x.name; })
		.enter()
		.append("path")
		.classed("tablet", true)
		.attr("d", function(d, i) {
			return [
						"M",
						cx + (Math.sin( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (0)),
						"L",
						cx + (Math.sin( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (0)),
						"A",
						0,
						0,
						0,
						0,
						1,
						cx + (Math.sin( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (0)),
						
						"L",
						cx + (Math.sin( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (0)),
						"A",
						0,
						0,
						0,
						0,
						0,
						cx + (Math.sin( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (0))						
					].join(" ");

		})
		.attr("fill", function(d) {
			switch (d.type) {
				case "Ec": return C.EC_COLOUR; break;
				case "Soc": return C.SOC_COLOUR; break;
				case "Env": return C.ENV_COLOUR; break;
				default: return C.MIX_COLOUR; break;
			}
		})
		.attr("stroke", function(d) {
			switch (d.type) {
				case "Ec": return C.EC_COLOUR; break;
				case "Soc": return C.SOC_COLOUR; break;
				case "Env": return C.ENV_COLOUR; break;
				default: return C.MIX_COLOUR; break;
			}
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
					d3.select(this).transition("deselectOut").attr("d", function() {
						return [
								"M",
								cx + (Math.sin( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
								cy - (Math.cos( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
								"L",
								cx + (Math.sin( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
								cy - (Math.cos( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
								"A",
								C.OUT_RADIUS,
								C.OUT_RADIUS,
								0,
								0,
								1,
								cx + (Math.sin( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
								cy - (Math.cos( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
								
								"L",
								cx + (Math.sin( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
								cy - (Math.cos( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
								"A",
								C.IN_RADIUS,
								C.IN_RADIUS,
								0,
								0,
								0,
								cx + (Math.sin( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
								cy - (Math.cos( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS))						
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
			
			if (d3.selectAll("path.tablet.opened").size() < 1) {
			// KEEP OPEN
			d3.select(this).classed("opened", true);
			
			// OPEN INDICATOR DETAILS
			// UPDATE DETAILS
			d3.select("#indicatorDetails").style("background-color", function() {
				switch(d.type) {
					case "Ec": return C.EC_COLOUR; break;
					case "Soc": return C.SOC_COLOUR; break;
					case "Env": return C.ENV_COLOUR; break;
					default: return C.MIX_COLOUR; break;
				}
			});
			
			d3.select("#driverBarrier").text(function() {
				if (d.driverBarrier === "Driver") {
					d3.select(this).style("color", "rgb(0, 120 , 0)");
					return "Innovation Driver"
				} else if (d.driverBarrier === "Barrier") {
					d3.select(this).style("color", "rgb(120, 0 , 0)");
					return "Innovation Barrier"
				} else {
					return d.driverBarrier;
				}
			});

			d3.select("#upDown").text(function() {
				if (d.upDown === "Decrease") {
					d3.select(this).style("color", "rgb(120, 0 , 0)");
					return "Ideally Decrease"
				} else if (d.upDown === "Increase") {
					d3.select(this).style("color", "rgb(0, 120 , 0)");
					return "Ideally Increase"
				} else {
					return d.upDown;
				}
				return d.upDown;
			});
			
			d3.select("#iDefinition").text(function() {
				return d.comment;
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
				d3.select("#futureScenario").text(function() { return d.bigSmart; });
				d3.select("#futureScenario").classed("selected", true);
				d3.select(this).classed("selected", true);
				d3.select("#cnc").classed("selected", false);
				d3.select("#snc").classed("selected", false);
			});
			
			d3.select("#cnc").on("click", function() {
				d3.select("#futureScenario").text(function() { return d.createCope; });
				d3.select("#futureScenario").classed("selected", true);
				d3.select(this).classed("selected", true);
				d3.select("#bns").classed("selected", false);
				d3.select("#snc").classed("selected", false);
			});
			
			d3.select("#snc").on("click", function() {
				d3.select("#futureScenario").text(function() { return d.shareConnect; });
				d3.select("#futureScenario").classed("selected", true);
				d3.select(this).classed("selected", true);
				d3.select("#cnc").classed("selected", false);
				d3.select("#bns").classed("selected", false);
			});
			
			// hide future scenarios if all empty
			document.getElementById("futureSection").hidden = false;
			if ( (d.bigSmart.length < 1) && (d.createCope.length < 1) && (d.shareConnect.length < 1) ) {
				document.getElementById("futureSection").hidden = true;
			}

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
		})
		.transition("introTablets").duration(400).delay(function(d, i) { return i*20; })
		.attr("d", function(d, i) {
			return [
						"M",
						cx + (Math.sin( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
						cy - (Math.cos( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
						"L",
						cx + (Math.sin( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
						cy - (Math.cos( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
						"A",
						C.OUT_RADIUS,
						C.OUT_RADIUS,
						0,
						0,
						1,
						cx + (Math.sin( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
						cy - (Math.cos( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
						
						"L",
						cx + (Math.sin( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
						cy - (Math.cos( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
						"A",
						C.IN_RADIUS,
						C.IN_RADIUS,
						0,
						0,
						0,
						cx + (Math.sin( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
						cy - (Math.cos( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS))						
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
						cx + (Math.sin( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (0)),
						"L",
						cx + (Math.sin( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (0)),
						"A",
						0,
						0,
						0,
						0,
						1,
						cx + (Math.sin( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (0)),
						
						"L",
						cx + (Math.sin( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (0)),
						"A",
						0,
						0,
						0,
						0,
						0,
						cx + (Math.sin( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (0)),
						cy - (Math.cos( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (0))						
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
							switch (dd.type) {
								case "Ec": return C.EC_COLOUR; break;
								case "Soc": return C.SOC_COLOUR; break;
								case "Env": return C.ENV_COLOUR; break;
								default: return C.MIX_COLOUR; break;
							}
					})
						.attr("fill", function() {
						switch (dd.type) {
							case "Ec": return C.EC_COLOUR; break;
							case "Soc": return C.SOC_COLOUR; break;
							case "Env": return C.ENV_COLOUR; break;
							default: return C.MIX_COLOUR; break;
						}
					});
				}
			});
		
		})
		.on("click", function(d, i) {
			
			// DESELECT OLD
			// note transition same name to avoid switch
			d3.selectAll("path.tablet").transition("select").attr("d", function(dd, ii) {
				d3.select("#" + "lab" + String(ii)).remove();
				d3.select("#" + "labelPath" + String(ii)).remove();
				d3.select(this).classed("selected", false);
			
				return [
						"M",
						cx + (Math.sin( (((ii-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
						cy - (Math.cos( (((ii-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
						"L",
						cx + (Math.sin( (((ii-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
						cy - (Math.cos( (((ii-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
						"A",
						C.OUT_RADIUS,
						C.OUT_RADIUS,
						0,
						0,
						1,
						cx + (Math.sin( (((ii)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
						cy - (Math.cos( (((ii)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
						
						"L",
						cx + (Math.sin( (((ii)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
						cy - (Math.cos( (((ii)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
						"A",
						C.IN_RADIUS,
						C.IN_RADIUS,
						0,
						0,
						0,
						cx + (Math.sin( (((ii-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
						cy - (Math.cos( (((ii-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS))						
					].join(" ");

			})
			
				if (!d3.select(this).classed("selected")) {
					d3.selectAll("path.centre").style("fill", "#42556d").classed("selected", false);			
					d3.select(this).style("fill", "#f00").classed("selected", true);

					// SELECT NEW
					d3.selectAll(".textLab, .labelPath").remove();
					d3.selectAll("path.tablet").each(function(dd, ii) {
						if (dd[d] === 1) {
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
				.attr("startOffset", 6 + (9 - d.length)*6 )
				.text(d)
				.style("font-size", "0.9em")
				.style("pointer-events", "none")
				.style("fill", "rgba(255, 255, 255, 0)")
				.transition("introCentreText").delay(600).duration(400)
				.style("fill", "white");
		})
		.transition("introCentre").duration(600).delay(200)
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
		
		
	// WEF ICON
	d3.select("#svgCanvas").append("image")
		.attr("id", "wefIcon")
		.attr("width", 140).attr("height", 140)
		.attr("x", cx - 70).attr("y", cy - 70)
		.attr("pointer-events", "none")
		.attr("xlink:href", "img/SteppingUp_WEF_icon.png");
	
		
		
		
		
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
												cx + (Math.sin( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
												cy - (Math.cos( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
												"L",
												cx + (Math.sin( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
												cy - (Math.cos( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
												"A",
												C.OUT_RADIUS,
												C.OUT_RADIUS,
												0,
												0,
												1,
												cx + (Math.sin( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
												cy - (Math.cos( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (C.OUT_RADIUS)),
												
												"L",
												cx + (Math.sin( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
												cy - (Math.cos( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
												"A",
												C.IN_RADIUS,
												C.IN_RADIUS,
												0,
												0,
												0,
												cx + (Math.sin( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS)),
												cy - (Math.cos( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (C.IN_RADIUS))						
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



function selectIndicator(element, d, i, inRadius, outRadius) {
	
	d3.select(element).transition("select").attr("d", function() {
				return [
						"M",
						cx + (Math.sin( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (inRadius)),
						cy - (Math.cos( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (inRadius)),
						"L",
						cx + (Math.sin( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (outRadius)),
						cy - (Math.cos( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (outRadius)),
						"A",
						outRadius,
						outRadius,
						0,
						0,
						1,
						cx + (Math.sin( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (outRadius)),
						cy - (Math.cos( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (outRadius)),
						
						"L",
						cx + (Math.sin( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (inRadius)),
						cy - (Math.cos( (((i)/raw.length) - (((1)/raw.length)/10) )*2*Math.PI ) * (inRadius)),
						"A",
						inRadius,
						inRadius,
						0,
						0,
						0,
						cx + (Math.sin( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (inRadius)),
						cy - (Math.cos( (((i-1)/raw.length) + (((1)/raw.length)/10) )*2*Math.PI ) * (inRadius))						
					].join(" ");

			});
			
			
}

function createLabel(d, i, inRadius) {
	// text path
	d3.select("#svgCanvas").append("path").classed("labelPath", true).attr("id", "labelPath" + String(i))
	.attr("d", function() {
		// for text direction
		// based on proportion of circle
		if 	( 	( ( (i)/raw.length ) % 1 > 0.0 ) &&
				( ( (i)/raw.length ) % 1 < 0.5 )
			) {		
			// right
			return [
			"M",
			cx + (Math.sin( ((i-0.3)/raw.length)*2*Math.PI ) * (inRadius)),
			cy - (Math.cos( ((i-0.3)/raw.length)*2*Math.PI ) * (inRadius)),
			"L",
			cx + (Math.sin( ((i-0.3)/raw.length)*2*Math.PI ) * (inRadius + d.name.length*10)),
			cy - (Math.cos( ((i-0.3)/raw.length)*2*Math.PI ) * (inRadius + d.name.length*10))
			].join(" ");		
		} else {
			// left
			return [
			"M",
			cx + (Math.sin( ((i-0.7)/raw.length)*2*Math.PI ) * (inRadius + d.name.length*9)),
			cy - (Math.cos( ((i-0.7)/raw.length)*2*Math.PI ) * (inRadius + d.name.length*9)),
			"L",
			cx + (Math.sin( ((i-0.7)/raw.length)*2*Math.PI ) * (inRadius)),
			cy - (Math.cos( ((i-0.7)/raw.length)*2*Math.PI ) * (inRadius))
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