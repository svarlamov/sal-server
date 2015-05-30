'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:TakeExamCtrl
 * @description
 * # NewExamCtrl
 * Controller to take exam
 */
angular.module('yapp')
  .controller('TakeExamCtrl', function($scope, $state, $cookieStore, $http, $location) {
    $scope.loadExam = function() {
        $http({
            url: 'http://localhost:3000/api/v1/exams/' + $scope.examId + '?session=' + $cookieStore.get('session'),
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
  });