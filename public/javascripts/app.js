'use strict';


// Declare app level module which depends on filters, and services
// Declare app level module which depends on filters, and services
angular.module('ckllsApp', ['cklls.filters', 'ckllsApp.services', 'ckllsApp.directives','ngRoute']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/view1', {templateUrl: 'partial/1', controller: ckllsCtrl1});
    $routeProvider.when('/view2', {templateUrl: 'partial/2', controller: ckllsCtrl2});
    $routeProvider.otherwise({redirectTo: '/view1'});
    $locationProvider.html5Mode(true);
  }]);