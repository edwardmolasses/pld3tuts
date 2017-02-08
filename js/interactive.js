var h = 500;
var w = 900;
var padding = 20;

function getDate(d) {
	var strDate = new String(d);
	var year = strDate.substr(0,4);
	var month = strDate.substr(4,2) - 1;
	var day = strDate.substr(6,2);

	return new Date(year, month, day);
}

var getLineFun = function(xScale, yScale) {
	return d3.svg.line()
		.x(function(d) { return xScale(getDate(d.month)); })
		.y(function(d) { return yScale(d.sales); })
		.interpolate("linear");
}

function getScale(min, max, aRange, bRange) {
	return d3.time.scale()
		.domain([min, max ])
		.range([aRange, bRange])
		.nice();
}

function getAxisGen(scale, orient, tickFormat, ticks) {
	return d3.svg.axis().scale(scale).orient(orient).tickFormat(tickFormat).ticks(ticks);
}

function getSvg(attr) {
	return d3.select("body").append("svg").attr(attr);
}

function buildLine(ds) {
	var minDate = getDate(ds.monthlySales[0]['month']);
	var maxDate = getDate(ds.monthlySales[ds.monthlySales.length - 1]['month']);
	var tooltip = d3.select("body").append("div")
		.attr("class","tooltip")
		.style("opacity", 0);
	var xScale = getScale(minDate, maxDate, padding + 5, w - padding);
	var yScale = getScale(0, d3.max(ds.monthlySales, function(d) { return d.sales; }), h - padding, 10);
	var xAxisGen = getAxisGen(xScale, "bottom", d3.time.format("%b"), null);
	var yAxisGen = getAxisGen(yScale, "left", null, 4);
	var lineFun = getLineFun(xScale, yScale);

	var svg = d3.select("body").append("svg").attr({width: w, height: h, "id": "svg-" + ds.category});

	var yAxis = svg.append("g").call(yAxisGen)
				.attr("class", "y-axis")
				.attr("transform", "translate(" + padding + ",0)");
	var xAxis = svg.append("g").call(xAxisGen)
				.attr("class", "x-axis")
				.attr("transform", "translate(0," + (h - padding) + ")");

	var viz = svg.append("path")
				.attr({
					d: lineFun(ds.monthlySales),
					"class": "path-" + ds.category
				});
				
	var dots = svg.selectAll("circle")
		.data(ds.monthlySales)
		.enter()
		.append("circle")
		.attr({
			cx: function(d) {return xScale(getDate(d.month)); },
			cy: function(d) {return yScale(d.sales); },
			r:4,
			"fill": "#666",
			class: "circle-" + ds.category
		})
		.on("mouseover", function(d) {
			tooltip.transition()
				.duration(500)
				.style("opacity", .85)
			tooltip.html("<strong>Sales $" + d.sales + "K</strong>")
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout", function(d) {
			tooltip.transition()
				.duration(300)
				.style("opacity", 0);
		});
}

function updateLine(ds) {
	var minDate = getDate(ds.monthlySales[0]['month']);
	var maxDate = getDate(ds.monthlySales[ds.monthlySales.length - 1]['month']);
	var xScale = getScale(minDate, maxDate, padding + 5, w - padding);
	var yScale = getScale(0, d3.max(ds.monthlySales, function(d) { return d.sales; }), h - padding, 10);
	var xAxisGen = getAxisGen(xScale, "bottom", d3.time.format("%b"), ds.monthlySales.length - 1);
	var yAxisGen = getAxisGen(xScale, "left", null, 4);
	var lineFun  = getLineFun(xScale, yScale);

	var svg = d3.select("body").select("#svg-" + ds.category);

	var yAxis = svg.selectAll("g.y-axis").call(yAxisGen);
	var xAxis = svg.selectAll("g.x-axis").call(xAxisGen);

	var viz = svg.selectAll(".path-" + ds.category)
				.transition()
				.duration(1000)
				.ease('elastic')
				.attr({
					d: lineFun(ds.monthlySales)
				});

	var dots = svg.selectAll(".circle-" + ds.category)
		.attr({
			cx: function(d) {return xScale(getDate(d.month)); },
			cy: function(d) {return yScale(d.sales); }
		});
}

d3.json("https://api.github.com/repos/bsullins/d3js-resources/contents/monthlySalesbyCategoryMultiple.json", function(error, data) {
	var decodedData = JSON.parse(window.atob(data.content));

	if(error) {
		console.log(error);
	}
	decodedData.contents.forEach(function(ds){
		buildLine(ds);
	});

	d3.select("select")
		.on("change", function(d,i) {
			console.log('on!');
			var sel = d3.select('#date-option').node().value;
			var decodedData = JSON.parse(window.atob(data.content));

			decodedData.contents.forEach(function(ds){
				ds.monthlySales.splice(0,ds.monthlySales.length - sel);
				updateLine(ds);
			});
		});
});
