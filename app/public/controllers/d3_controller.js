angular.module('myApp')

.controller('D3Ctrl', function ($scope,$http,$rootScope,dataService) {

        $scope.title = 'D3 Controller!!';

        var margin = {top: 20, right: 20, bottom: 30, left: 60},
            width = 600 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;


        /*
         * x scale bar
         * ordinal means catergorical
         * the rangeband is how much of the svg the graph should take up
         * the second value is the spacing between each of the bands
         */
        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], 0);

        /*
         * height is how close to the bottom and 0 is how close to the
         * top the graph should be
         * a linear scale is numeric
         */
        var y = d3.scale.linear()
            .rangeRound([height, 0]);

        /*
         * color scale
         */
        var color = d3.scale.ordinal()
            .range(["#7F0905", "#AD0C07", "#C40E08", "#DE1009", "#FF120A"]);

        /*
         * The x Axis is dependent on the x scale
         * labels are below the axis
         * there are lots of style choices for axes
         */
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            // number formatting for values. In this case, rounded
            .tickFormat(d3.format("r"));

        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            //element starts at 0,0 and adjusting it to margin position
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        //grab data
        d3.csv("areaData.csv", function(error, data) {
            if (error) throw error;


            // the x values (domain) of color are the keys of data[0]
            color.domain(d3.keys(data[0])
                .filter(function(key) {
                    return key !== "State";
                })
            );

            data.forEach(function(d) {
                // d is a row of data
                var y0 = 0;
                d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
                d.total = d.ages[d.ages.length - 1].y1;
            });

            ////if the bars should be sorted
            //data.sort(function(a, b) { return b.total - a.total; });


            x.domain(data.map(function(d) { return d.State; }));


            y.domain([0, d3.max(data, function(d) { return d.total; })]);

            //applying the x axis to the map
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                .attr("y", 20)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Hour");

            //applying the y axis to the map
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Population");

            var state = svg.selectAll(".state")
                .data(data)
                .enter().append("g")
                .attr("class", "g")
                .attr("transform", function(d) { return "translate(" + x(d.State) + ",0)"; })
                .on("click", function(d, i) {
                    console.log(d, i);
                });

            state.selectAll("rect")
                .data(function(d) { return d.ages; })
                .enter().append("rect")
                .attr("height", height - margin.bottom)
                .attr("y", height - margin.bottom)
                .attr("width", x.rangeBand())
                .transition()
                .duration(750)
                .attr("y", function(d) { return y(d.y1); })
                .attr("height", function(d) { return y(d.y0) - y(d.y1); })
                .style("fill", function(d) { return color(d.name); });


            //legend
            var legend = svg.selectAll(".legend")
                .data(color.domain().slice().reverse())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) { return d; });

        });



    });
