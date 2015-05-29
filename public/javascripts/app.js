'use strict';


// Declare app level module which depends on filters, and services
// Declare app level module which depends on filters, and services
angular.module('salApp', ['sal.filters', 'salApp.services', 'salApp.directives','ngRoute']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/view1', {templateUrl: 'partial/1', controller: salCtrl1});
    $routeProvider.when('/view2', {templateUrl: 'partial/2', controller: salCtrl2});
    $routeProvider.otherwise({redirectTo: '/view1'});
    $locationProvider.html5Mode(true);
  }]);