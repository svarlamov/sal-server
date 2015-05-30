'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:NewExamCtrl
 * @description
 * # NewExamCtrl
 * Controller to create new exams
 */
angular.module('yapp')
  .controller('NewExamCtrl', function($scope, $state) {
    $scope.createNewExam = function() {
            var postData = { session: $cookieStore.get('session'), email: $scope.exam.name }
            $http({
                url: 'http://localhost:3000/api/v1/exams',
                method: "POST",
                data: JSON.stringify(postData),
                headers: {'Content-Type': 'application/json'}
            }).success(function (data, status, headers, config) {
                $scope.authSuccess = data.auth;
                $cookieStore.put('session', data.session);
                $location.path('/dashboard');
            }).error(function (data, status, headers, config) {
                $scope.authSuccess = data.auth;
                $scope.status = status;
                $location.path('/login');
            });

            return false;
        }
  });
