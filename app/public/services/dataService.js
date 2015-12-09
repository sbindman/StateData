var app = angular.module("myApp")
    .service("dataService", ['$http', '$q', function ($http, $q, ENV) {

        var service = {};


        service.getAllStates = function() {
                var deferred = $q.defer();

                $http.get('api/states')
                    .then(function (response) {
                        deferred.resolve(response);

                    }, function (response) {
                        deferred.reject(response);
                    });

                return deferred.promise;
        }

        service.getAllStateData = function() {
            var deferred = $q.defer();

            $http.get('api/state-data')
                .then(function (response) {
                    deferred.resolve(response);

                }, function (response) {
                    deferred.reject(response);
                });

            return deferred.promise;
        }


        return service;
    }]);

