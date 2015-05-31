'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:ListExamCtrl
 * @description
 * # NewExamCtrl
 * Controller to list exams
 */

angular.module('yapp')
  .controller('ListExamCtrl', function($rootScope, $scope, $state, $cookieStore, $http, $location) {
    $scope.submit = function() { $scope.init(); }
    $scope.init = function() {
        $http({
            url: 'http://localhost:3000/api/v1/exams?session=' + $cookieStore.get('session'),
            method: "GET",
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            $scope.exams = data;
        }).error(function (data, status, headers, config) {
            if(status == 401) {
                $scope.authSuccess = false;
                $cookieStore.put('session', 'null');
                $location.path('/login');
            }
        });
        return false;
    }
    $scope.goToExam = function(exam) {
        $rootScope.examIdToLoad = exam._id;
        $location.path('/dashboard/exams.view')
        return false;
    }
    $scope.deleteExam = function(exam) {
        $http({
            url: 'http://localhost:3000/api/v1/exams/' + exam._id + '?session=' + $cookieStore.get('session'),
            method: "DELETE",
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            $location.path('/dashboard');
        }).error(function (data, status, headers, config) {
            if(status == 401) {
                $scope.authSuccess = false;
                $cookieStore.put('session', 'null');
                $location.path('/login');
            }
        });
    }
  });
