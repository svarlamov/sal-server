'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:ViewExamCtrl
 * @description
 * # NewExamCtrl
 * Controller to add questions
 */
var urlForNewQuestionUpload = null;
var urlStubForQuestionDeletion = null;

angular.module('yapp')
  .controller('AddQuestionCtrl', function($rootScope, $scope, $cookieStore, $location, appDomain) {
    if(!$rootScope.examIdToLoad || !$cookieStore.get('session')){
        $location.path('/dashboard/exams.list');
    }
    urlForNewQuestionUpload = appDomain + 'api/v1/exams/' + $rootScope.examIdToLoad + '/questions?session=' + $cookieStore.get('session');
    urlStubForQuestionDeletion = appDomain + 'api/v1/exams/' + $rootScope.examIdToLoad + '/questions/'
  });