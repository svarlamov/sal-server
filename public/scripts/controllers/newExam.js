'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:NewExamCtrl
 * @description
 * # NewExamCtrl
 * Controller to create new exams
 */
angular.module('yapp')
  .controller('NewExamCtrl', function($scope, $state, $cookieStore, $http, $location, appDomain) {
    $scope.init = function() {
        if(!$cookieStore.get('session')) {
            $location.path('/login');
        }
    }
    $scope.submit = function() {
            var postData = { session: $cookieStore.get('session'), name: $scope.exam.name }
            $http({
                url: appDomain + 'api/v1/exams',
                method: "POST",
                data: JSON.stringify(postData),
                headers: {'Content-Type': 'application/json'}
            }).success(function (data, status, headers, config) {
                $location.path('/dashboard/exams.list');
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
