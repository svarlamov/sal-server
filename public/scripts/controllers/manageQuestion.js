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
    if(!$rootScope.examIdToLoad || !$rootScope.questionToLoad) {
        $location.path('/dashboard/exams.view');
        return false;
    }
    $scope.init = function(){
        console.log("Initted");
        $scope.question = $rootScope.questionToLoad;
        $scope.questionSrc = 'http://localhost:3000/api/v1/exams/' + $rootScope.examIdToLoad + '/questions/' + $rootScope.questionToLoad._id + '/file?session=' + $cookieStore.get('session');
        $scope.playVideo = true;
        $scope.showControls = true;
        $scope.showVideo = true;
    }
  });