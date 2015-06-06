'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:ViewExamCtrl
 * @description
 * # NewExamCtrl
 * Controller to view a singular exam, it's questions, and it's responses
 */
angular.module('yapp')
  .controller('ViewExamCtrl', function($rootScope, $scope, $state, $cookieStore, $http, $location) {
    $scope.loadExam = function() {
        if(!$rootScope.examIdToLoad) {
            $location.path('/dashboard/exams.list');
            return false;
        }
        $http({
            url: 'http://localhost:3000/api/v1/exams/' + $rootScope.examIdToLoad + '?session=' + $cookieStore.get('session'),
            method: "GET",
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            $scope.exam = data;
        }).error(function (data, status, headers, config) {
            if(status == 401) {
                $scope.authSuccess = false;
                $cookieStore.put('session', 'null');
                $location.path('/login');
            }
        });
        return false;
    }
    $scope.viewResponse = function(response) {
        // TODO: Load the response and redirect
        $rootScope.responseIdToLoad = response;
        $location.path('/dashboard/exams.viewResponse');
        return false;
    }
  });