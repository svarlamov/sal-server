'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:ManageQuestionCtrl
 * @description
 * # ManageQuestionController
 * Controller for exam admin to manage a question
 */

angular.module('yapp')
  .controller('ManageQuestionCtrl', function($rootScope, $scope, $cookieStore, $location, $http) {
    if(!$rootScope.examIdToLoad || !$rootScope.questionToLoad || !$cookieStore.get('session')) {
        $location.path('/dashboard/exams.view');
        return false;
    }
    $scope.init = function(){
        $scope.question = $rootScope.questionToLoad;
        $scope.questionSrc = 'http://localhost:3000/api/v1/exams/' + $rootScope.examIdToLoad + '/questions/' + $rootScope.questionToLoad._id + '/file?session=' + $cookieStore.get('session');
        $scope.playVideo = true;
        $scope.showControls = true;
        $scope.showVideo = true;
    }
    $scope.deleteQuestion = function(){
        $http({
            url: 'http://localhost:3000/api/v1/exams/' + $rootScope.examIdToLoad + '/questions/' + $rootScope.questionToLoad._id + '/?session=' + $cookieStore.get('session'),
            method: "DELETE",
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            if(data.success) {
                $location.path('/dashboard/exams.view');
            }
        }).error(function (data, status, headers, config) {
            if(status == 401) {
                $scope.authSuccess = false;
                $cookieStore.put('session', 'null');
                $location.path('/login');
            }
        });
    }
  });