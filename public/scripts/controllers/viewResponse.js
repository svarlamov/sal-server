'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:ViewResponseCtrl
 * @description
 * # ViewResponseController
 * Controller to listen and watch responses
 */

angular.module('yapp')
  .controller('ViewResponseCtrl', function($rootScope, $scope, $cookieStore, $location, $http, appDomain) {
    if(!$rootScope.examIdToLoad || !$rootScope.responseToLoad || !$cookieStore.get('session')) {
        $location.path('/dashboard/exams.view');
        return false;
    }
    $scope.viewAnswer = function(answer) {
        $scope.answerSrc = appDomain + 'api/v1/exams/' + $rootScope.examIdToLoad + '/responses/' + $rootScope.responseToLoad._id + '/answers/' + answer._id + '/file?session=' + $cookieStore.get('session');
        $scope.playVideo = true;
        $scope.showControls = true;
        $scope.showVideo = true;
    }
    $scope.init = function() {
        $scope.response = $rootScope.responseToLoad;
        $scope.showVideo = false;
        $scope.playVideo = false;
        $scope.showControls = false;
        /*
        $http({
            url: appDomain + 'api/v1/exams/' + $rootScope.examIdToLoad + '/responses/' + $rootScope.responseToLoad._id + '/answers?session=' + $cookieStore.get('session'),
            method: "GET",
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            if(data.message) {
                $scope.answers = [];
            } else {
                $scope.answers = data;
                console.log($scope.answers);
            }
        }).error(function (data, status, headers, config) {
            if(status == 401) {
                $scope.authSuccess = false;
                $cookieStore.put('session', 'null');
                $location.path('/login');
            }
        });
        */
        return false;
    }
  });