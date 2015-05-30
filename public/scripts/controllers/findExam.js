'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:FindExamCtrl
 * @description
 * # NewExamCtrl
 * Controller to find an exam to take
 */
angular.module('yapp')
  .controller('FindExamCtrl', function($scope, $state, $cookieStore, $http, $location) {
    $scope.findExam = function() {
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