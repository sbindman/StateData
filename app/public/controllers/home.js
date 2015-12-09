angular.module('myApp')

    .controller('HomeCtrl', function ($scope,$http,$rootScope,dataService) {

        $scope.title = 'Sample Angular Node App!!';
        $scope.states;
        $scope.stateData;


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






        //d3 implementation of map

        var width = 960,
            height = 500;
            centered = false;

        // defines size of map, and location on the screen
        var projection = d3.geo.albersUsa()
            .translate([100,100])
            .scale([200]);

        var path = d3.geo.path().projection(projection);

        // list of cities to show, and locations
        var citiesData = [{"city": "Chicago", location: {"lat": 41.87811, "long": -87.62980}},
            {"city": "New Orleans", location: {"lat": 29.95107 , "long": -90.07153}},
            {"city": "Seattle", location: {"lat": 47.60621, "long": -122.33207}},
            {"city": "Boston", location: {"lat":  42.35849, "long": -71.06010}}];

        // normal svg setup
        var svg = d3.select("#mapChart").append("svg")
            .attr("width", width)
            .attr("height", height);

        // read in US geometry
        d3.json("../../us.json", function(error, topology) {


            // attach path for US boundary
            svg.append("path")
                .datum(topojson.feature(topology, topology.objects.cb_2014_us_state_500k))
                .attr("d", path);

            // append cities
            svg.append("g")
                .attr("class", "cities")
                .selectAll("circle")
                .data(citiesData)
                .enter().append("circle")
                .attr("transform", function(d) {
                    return "translate(" + projection([
                            d.location.long,
                            d.location.lat
                        ]) + ")"
                })
                .attr("r", 3);


            svg.append("path", ".graticule")
                .datum(topojson.mesh(topology, topology.objects.cb_2014_us_state_500k, function(a, b) { return a !== b; }))
                .attr("class", "state-boundary")
                .attr("d", path)
                .on("click", clicked);


        });

        function clicked(d) {
            var x, y, k;

            if (d && centered !== d) {
                var centroid = path.centroid(d);
                x = centroid[0];
                y = centroid[1];
                k = 4;
                centered = d;
            } else {
                x = width / 2;
                y = height / 2;
                k = 1;
                centered = null;
            }
        }


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