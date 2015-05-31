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
        // If the cookie doesn't exist, then redirect back to the find exam screen
        if(!$cookieStore.get('exam_in_progress')){
            $location.path('/dashboard/exams.find');
            return false;
        }
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
    
    $scope.submitExam = function() {
        // TODO: Actually Submit the exam, and redirect
        $cookieStore.remove('exam_in_progress');
        $location.path('/dashboard');
    }
    
    $scope.cancelExam = function() {
        // TODO: Actually cancel the exam, and redirect
        $cookieStore.remove('exam_in_progress');
        $location.path('/dashboard');
    }
  });