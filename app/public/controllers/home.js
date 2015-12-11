angular.module('myApp')

    .controller('HomeCtrl', function ($scope,$http,$rootScope,dataService) {

        $scope.title = 'Sample Angular Node App!!';
        $scope.states;
        $scope.stateData;
        $scope.stateSelected=false;


        /*
         * return all of the states and their id numbers
         */
        var promise = dataService.getAllStates();

        promise.then(function(response){
            $scope.states = response.data.features;
        });


        /*
         * return full data for states
         */
        var promise = dataService.getAllStateData();

        promise.then(function(response){
            $scope.stateData = response.data.features;
        });


        /*
         * return data for 1 state
         */
        var getStateData = function(state_id) {

            promise = dataService.getOneStateData(state_id);

            promise.then(function (response) {
                $scope.stateDatum = response.data.features;
            });
        }




        function createMap() {

            //d3 implementation of map

            var width = 600,
                height = 500,
                centered;

            // defines size of map, and location on the screen
            var projection = d3.geo.albersUsa()
                .translate([300, 100])
                .scale([400]);

            var path = d3.geo.path().projection(projection);


            // normal svg setup
            var svg = d3.select("#mapChart").append("svg")
                .attr("width", width)
                .attr("height", height);

            // read in US geometries
            d3.json("../../us.json", function (error, topology) {

                var g = svg.append("g")
                    .attr("class", "all-states");

                // attach path for US state boundaries
                g.selectAll("path")
                    .data(topojson.feature(topology, topology.objects.cb_2014_us_state_500k).features)
                    .enter()
                    .append("path")
                    .attr("d", path)
                    .attr("class", "state")
                    .on("click", function (d) {
                        console.log(d);
                        $('#pieChart').empty();
                        getStateData(d.id);

                        var x, y, k;

                        if (d && centered !== d) {
                            var centroid = path.centroid(d);
                            x = centroid[0];
                            y = centroid[1];
                            k = 3;
                            centered = d;
                            $scope.stateSelected = true;
                            //createEducationPie(d.id);
                            twoValuePieChart(1, d.id);
                            twoValuePieChart(2, d.id);
                            twoValuePieChart(3, d.id);

                        } else {
                            x = width / 2;
                            y = height / 2;
                            k = 1;
                            centered = null;
                            $scope.stateSelected = false;
                            $scope.stateDatum = '';

                        }


                        g.selectAll("path")
                            .classed("active", centered && function (d) {
                                return d === centered;
                            });

                        g.transition()
                            .duration(350)
                            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
                            .style("stroke-width", 1.5 / k + "px");
                    });
            });
        }

        createMap();



        function createPie(data_input) {


                var data = data_input;

                var width = 300,
                    height = 300,
                    radius = height / 2 - 10;

                var arc = d3.svg.arc()
                    .innerRadius(radius - 80)
                    .outerRadius(radius);

                var pie = d3.layout.pie()
                    .padAngle(.02);

                var color = d3.scale.category10();

                var svg = d3.select("#pieChart").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                svg.selectAll("path")
                    .data(pie(data))
                    .enter().append("path")
                    .style("fill", function (d, i) {
                        return color(i);
                    })
                    .attr("d", arc);
        }

        function createEducationPie (state_id) {
            promise = dataService.getOneStateData(state_id);

            promise.then(function (response) {

                var percent_college_degree = 0;

                response.data.features.forEach(function(datum) {
                    if (datum.properties.indicator_id == 3) {
                        percent_college_degree = datum.properties.indicator_value;
                    }
                });

                var data = [percent_college_degree, 100-percent_college_degree];

                createPie(data);

            });
        }

        function twoValuePieChart (indicator_id, state_id) {
            promise = dataService.getOneStateData(state_id);

            promise.then(function (response) {

                var data_value = 0;

                response.data.features.forEach(function(datum) {
                    if (datum.properties.indicator_id == indicator_id) {
                        data_value = datum.properties.indicator_value;
                    }
                });

                var data = [data_value, 100-data_value];

                createPie(data);

            });
        }




        //function clicked(d) {
        //    var x, y, k;
        //
        //    if (d && centered !== d) {
        //        var centroid = path.centroid(d);
        //        x = centroid[0];
        //        y = centroid[1];
        //        k = 4;
        //        centered = d;
        //    } else {
        //        x = width / 2;
        //        y = height / 2;
        //        k = 1;
        //        centered = null;
        //    }
        //
        //    g.selectAll("path")
        //        .classed("active", centered && function(d) { return d === centered; });
        //
        //    g.transition()
        //        .duration(750)
        //        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        //        .style("stroke-width", 1.5 / k + "px");
        //}


        /*
         * broadcast
         */
        //$scope.$on('data-change',function(evt,data){
        //    console.log(data);
        //});

        /*
         * http request with promise
         */
        //var promise = dataService.albumsGet();
        //
        //promise.then(function(response){
        //    $scope.albumSongHash = response.albumSongHash;
        //
        //    return dataService.songsGet();
        //
        //}).then(function(response){
        //    $scope.all_songs = response.all_songs;
        //});
    });