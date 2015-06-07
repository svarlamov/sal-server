'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:TakeExamCtrl
 * @description
 * # NewExamCtrl
 * Controller to take exam
 */
var questionCount = 10000
angular.module('yapp')
  .controller('TakeExamCtrl', function($scope, $state, $cookieStore, $http, $location) {
    $scope.init = function() {
        if(!$cookieStore.get('session')) {
            $location.path('/login');
        }
    }
    $scope.submitExam = function() {
        // TODO: Actually Submit the exam, and redirect
        $http({
            url: 'http://localhost:3000/api/v1/exams/' + $cookieStore.get('exam_in_progress') + '/responses/' + $cookieStore.get('response_id') + '/submit?session=' + $cookieStore.get('session'),
            method: "POST",
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            $cookieStore.remove('response_id');
            $cookieStore.remove('exam_in_progress');
            $location.path('/dashboard/exams.list');
        }).error(function (data, status, headers, config) {
            if(status == 401) {
                $scope.authSuccess = false;
                $cookieStore.put('session', 'null');
                $location.path('/login');
            }
        });
    }
    $scope.cancelExam = function() {
        $http({
            url: 'http://localhost:3000/api/v1/exams/' + $cookieStore.get('exam_in_progress') + '/responses/' + $cookieStore.get('response_id') + '?session=' + $cookieStore.get('session'),
            method: "DELETE",
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            $cookieStore.remove('response_id');
            $location.path('/dashboard/exams.previewQuestion');
        }).error(function (data, status, headers, config) {
            if(status == 401) {
                $scope.authSuccess = false;
                $cookieStore.put('session', 'null');
                $location.path('/login');
            }
        });
    }
    $scope.countQuestions = function() {
        $http({
            url: 'http://localhost:3000/api/v1/exams/' + $cookieStore.get('exam_in_progress') + '/questionCount?session=' + $cookieStore.get('session'),
            method: "GET",
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            questionCount = data.count;
        }).error(function (data, status, headers, config) {
            if(status == 401) {
                $scope.authSuccess = false;
                $cookieStore.put('session', 'null');
                $location.path('/login');
            }
        });
    }
    $scope.countQuestions();
});