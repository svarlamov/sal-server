'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('yapp')
    .controller('LoginCtrl', function($scope, $rootScope, $location, $http, $cookieStore) {
        $scope.loginRqd = false;
        $scope.testCookie = function() {
            if(!$cookieStore.get('session')) {
                $scope.loginRqd = true;
                return false;
            }
            var postData = { session: $cookieStore.get('session') };
            $http({
                url: 'http://localhost:3000/api/v1/login',
                method: "POST",
                data: JSON.stringify(postData),
                headers: {'Content-Type': 'application/json'}
            }).success(function (data, status, headers, config) {
                $scope.authSuccess = data.auth;
                var sessionId = data.session;
                $cookieStore.put('session', sessionId);
                $location.path('/dashboard');
            }).error(function (data, status, headers, config) {
                $cookieStore.remove('session');
                $scope.loginRqd = true;
                return false;
            });
        }
        $scope.testCookie();
        $scope.submit = function() {
            var postData = { email: $scope.user.email, password: $scope.user.password }
            $http({
                url: 'http://localhost:3000/api/v1/login',
                method: "POST",
                data: JSON.stringify(postData),
                headers: {'Content-Type': 'application/json'}
            }).success(function (data, status, headers, config) {
                $scope.authSuccess = data.auth;
                var sessionId = data.session;
                $cookieStore.put('session', sessionId);
                $location.path('/dashboard');
            }).error(function (data, status, headers, config) {
                $scope.authSuccess = data.auth;
                $scope.status = status;
                $location.path('/login');
            });

            return false;
        }
    });
