'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:ViewExamCtrl
 * @description
 * # NewExamCtrl
 * Controller to add questions
 */
var urlForNewQuestionUpload = null;

angular.module('yapp')
  .controller('AddQuestionCtrl', function($rootScope, $scope, $cookieStore, $location) {
    urlForNewQuestionUpload = 'http://localhost:3000/api/v1/exams/' + $rootScope.examIdToLoad + '/questions?session=' + $cookieStore.get('session');
  });