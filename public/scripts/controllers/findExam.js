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
    $scope.startExam = function(examCode) {
        $http({
            url: 'http://localhost:3000/api/v1/exams/' + examCode + '?session=' + $cookieStore.get('session'),
            method: "GET",
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            if(data._id){
                $cookieStore.put('exam_in_progress', data._id);
                $location.path('/dashboard/exams.take');
            } else {
                // TODO: Flash a message that the exam was not found
            }
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