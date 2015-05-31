'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:ViewExamCtrl
 * @description
 * # NewExamCtrl
 * Controller to add questions
 */
angular.module('yapp')
  .controller('AddQuestionCtrl', function($rootScope, $scope, $state, $cookieStore, $http, $location) {
    $scope.postQuestion = function(file) {
        if(!$rootScope.examIdToLoad) {
            $location.path('/dashboard');
            return false;
        }
        var fd = new FormData();
        fd.append('file', file);
        $http({
            url: 'http://localhost:3000/api/v1/exams/' + $rootScope.examIdToLoad + '/questions?session=' + $cookieStore.get('session'),
            method: "POST",
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            $location.path('/dashboard/exams.view');
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