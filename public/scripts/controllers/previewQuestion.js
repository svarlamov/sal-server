'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:PreviewQuestionCtrl
 * @description
 * # PreviewQuestionController
 * Controller to listen and watch questions before the exam
 */

angular.module('yapp')
  .controller('PreviewQuestionCtrl', function($rootScope, $scope, $cookieStore, $location, $http) {
    if(!$cookieStore.get('exam_in_progress')){
        $location.path('/dashboard/exams.find');
        return false;
    }
    $scope.previewQuestion = function(question){
        $scope.questionSrc = 'http://localhost:3000/api/v1/exams/' + $cookieStore.get('exam_in_progress') + '/questions/' + question._id + '/file?session=' + $cookieStore.get('session');
        $scope.playVideo = true;
        $scope.showControls = false;
        $scope.showVideo = true;
    }
    $scope.init = function() {
        $scope.showVideo = false;
        $scope.playVideo = false;
        $scope.showControls = false;
        $http({
            url: 'http://localhost:3000/api/v1/exams/' + $cookieStore.get('exam_in_progress') + '/questions?session=' + $cookieStore.get('session'),
            method: "GET",
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            if(data.message) {
                $scope.questions = [];
            } else {
                $scope.questions = data;
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
    $scope.startExam = function() {
        $http({
            url: 'http://localhost:3000/api/v1/exams/' + $cookieStore.get('exam_in_progress') + '/responses/?session=' + $cookieStore.get('session'),
            method: "POST",
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            $cookieStore.put('response_id', data._id);
            $location.path('/dashboard/exams.take')
        }).error(function (data, status, headers, config) {
            if(status == 401) {
                $scope.authSuccess = false;
                $cookieStore.put('session', 'null');
                $location.path('/login');
            }
        });
    }
  });