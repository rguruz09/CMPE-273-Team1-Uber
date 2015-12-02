if (!d3) {
    throw "d3 wasn't included!"
};

(function() {
    d3.piechart_2 = {}
    d3.piechart_2.build = function(selector, data, options) {
        var color = d3.scale.category20c();
        var w = 500,
            h = 600,
            r = Math.min(w, h) / 2;

        var vis = d3.select(selector).append("svg:svg").data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
        var pie = d3.layout.pie().value(function(d) {
            return d.value;
        });

        // declare an arc generator function
        var arc = d3.svg.arc().outerRadius(r);

        // select paths, use arc generator to draw
        var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
        arcs.append("svg:path")
            .attr("fill", function(d, i) {
                return color(i);
            })
            .attr("d", function(d) {
                // log the result of the arc generator to show how cool it is :)
               
                return arc(d);
            });

        // add the text
        arcs.append("svg:text").attr("transform", function(d) {
            d.innerRadius = 0;
            d.outerRadius = r;
            return "translate(" + arc.centroid(d) + ")";
        }).attr("text-anchor", "middle").text(function(d, i) {
            return data[i].firstname;
        });
    }
})();

(function() {
    d3.piechart_3 = {}
    d3.piechart_3.build = function(selector, data, options) {
        var color = d3.scale.category20c();
        var w = 500,
            h = 600,
            r = Math.min(w, h) / 2;

        console.log(data);

        var vis = d3.select(selector).append("svg:svg").data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
        var pie = d3.layout.pie().value(function(d) {
            return d.value;
        });

        // declare an arc generator function
        var arc = d3.svg.arc().outerRadius(r);

        // select paths, use arc generator to draw
        var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
        arcs.append("svg:path")
            .attr("fill", function(d, i) {
                return color(i);
            })
            .attr("d", function(d) {
                // log the result of the arc generator to show how cool it is :)
               
                return arc(d);
            });

        // add the text
        arcs.append("svg:text").attr("transform", function(d) {
            d.innerRadius = 0;
            d.outerRadius = r;
            return "translate(" + arc.centroid(d) + ")";
        }).attr("text-anchor", "middle").text(function(d, i) {
            return data[i].lastname;
        });
    }
})();


(function() {
    d3.piechart_4 = {}
    d3.piechart_4.build = function(selector, data, options) {
        var color = d3.scale.category20c();
        var w = 500,
            h = 600,
            r = Math.min(w, h) / 2;

        console.log(data);

        var vis = d3.select(selector).append("svg:svg").data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
        var pie = d3.layout.pie().value(function(d) {
            return d.revenue;
        });

        // declare an arc generator function
        var arc = d3.svg.arc().outerRadius(r);

        // select paths, use arc generator to draw
        var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
        arcs.append("svg:path")
            .attr("fill", function(d, i) {
                return color(i);
            })
            .attr("d", function(d) {
                // log the result of the arc generator to show how cool it is :)
               
                return arc(d);
            });

        // add the text
        arcs.append("svg:text").attr("transform", function(d) {
            d.innerRadius = 0;
            d.outerRadius = r;
            return "translate(" + arc.centroid(d) + ")";
        }).attr("text-anchor", "middle").text(function(d, i) {
            return data[i].label;
        });
    }
})();


(function() {
    d3.piechart_5 = {}
    d3.piechart_5.build = function(selector, data, options) {
        var color = d3.scale.category20c();
        var w = 500,
            h = 600,
            r = Math.min(w, h) / 2;

        console.log(data);

        var vis = d3.select(selector).append("svg:svg").data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
        var pie = d3.layout.pie().value(function(d) {
            return d.value;
        });

        // declare an arc generator function
        var arc = d3.svg.arc().outerRadius(r);

        // select paths, use arc generator to draw
        var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
        arcs.append("svg:path")
            .attr("fill", function(d, i) {
                return color(i);
            })
            .attr("d", function(d) {
                // log the result of the arc generator to show how cool it is :)
               
                return arc(d);
            });

        // add the text
        arcs.append("svg:text").attr("transform", function(d) {
            d.innerRadius = 0;
            d.outerRadius = r;
            return "translate(" + arc.centroid(d) + ")";
        }).attr("text-anchor", "middle").text(function(d, i) {
            return data[i].label;
        });
    }
})();

(function() {
    d3.animatedBarChart = {}
    d3.animatedBarChart.build = function(selector, datajson, options) {}
})();

function plotBarChart(datajson,selector) {
	//alert("plotBarChart");

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width = 700 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(10, "%");

	var svg = d3.select(selector).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.json(datajson, type, function(error, data) {
	  if (error) throw error;

	  x.domain(data.map(function(d) { return d.letter; }));
	  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);

	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Frequency");

	  svg.selectAll(".bar")
	      .data(data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(d.letter); })
	      .attr("width", x.rangeBand())
	      .attr("y", function(d) { return y(d.frequency); })
	      .attr("height", function(d) { return height - y(d.frequency); });
	});

	function type(d) {
	  d.frequency = +d.frequency;
	  return d;
	}
	
}