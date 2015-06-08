'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:ViewExamCtrl
 * @description
 * # NewExamCtrl
 * Controller to view a singular exam, it's questions, and it's responses
 */
angular.module('yapp')
  .controller('ViewExamCtrl', function($rootScope, $scope, $state, $cookieStore, $http, $location, appDomain) {
    $scope.init = function(){
        if(!$cookieStore.get('session')) {
            $location.path('/login');
        }
    }
    $scope.loadExam = function() {
        if(!$rootScope.examIdToLoad) {
            $location.path('/dashboard/exams.list');
            return false;
        }
        $http({
            url: appDomain + 'api/v1/exams/' + $rootScope.examIdToLoad + '?session=' + $cookieStore.get('session'),
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
    $scope.deleteExam = function() {
        $http({
            url: appDomain + 'api/v1/exams/' + $rootScope.examIdToLoad + '?session=' + $cookieStore.get('session'),
            method: "DELETE",
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            // TODO: Let the user know that the exam has been deleted
            $location.path('/dashboard/exams.list');
        }).error(function (data, status, headers, config) {
            if(status == 401) {
                $scope.authSuccess = false;
                $cookieStore.put('session', 'null');
                $location.path('/login');
            }
        });
    }
    $scope.viewResponse = function(response) {
        $rootScope.responseToLoad = response;
        $location.path('/dashboard/exams.viewResponse');
        return false;
    }
    $scope.manageQuestion = function(question) {
        $rootScope.questionToLoad = question;
        $location.path('/dashboard/exams.manageQuestion');
    }
  });