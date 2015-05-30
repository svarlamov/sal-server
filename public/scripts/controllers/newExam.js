'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:NewExamCtrl
 * @description
 * # NewExamCtrl
 * Controller to create new exams
 */
angular.module('yapp')
  .controller('NewExamCtrl', function($scope, $state, $cookieStore, $http, $location) {
    $scope.submit = function() {
            var postData = { session: $cookieStore.get('session'), name: $scope.exam.name }
            $http({
                url: 'http://localhost:3000/api/v1/exams',
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
