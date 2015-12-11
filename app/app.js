'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute','ngMaterial', 'angularFileUpload'
]).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'public/templates/home.html',
                controller: 'HomeCtrl'
            })
            .when('/material', {
                templateUrl: 'public/templates/material.html',
                controller: 'MaterialCtrl'
            })
            .when('/sideToggle', {
                templateUrl: 'public/templates/sideToggle.html',
                controller: 'SideCtrl'
            })
            .when('/d3', {
                templateUrl: 'public/templates/d3.html',
                controller: 'D3Ctrl'
            })
            .otherwise({
                redirectTo: '/'
            });

    }])
