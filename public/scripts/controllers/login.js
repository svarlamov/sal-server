'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('yapp')
    .controller('LoginCtrl', function($scope, $location, $http, $cookieStore) {
        $scope.submit = function() {
            var postData = { email: $scope.user.email, password: $scope.user.password }
            $http({
                url: 'http://localhost:3000/api/v1/login',
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
