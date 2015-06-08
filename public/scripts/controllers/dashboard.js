'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('yapp')
  .controller('DashboardCtrl', function($scope, $rootScope, $state, $location, $cookieStore, $http, appDomain) {
    $scope.$state = $state;
    $scope.logout = function(){
        if($cookieStore.get('session')) {
            var postData = { session: $cookieStore.get('session') };
            $http({
                url: appDomain + 'api/v1/logout',
                method: "POST",
                data: JSON.stringify(postData),
                headers: {'Content-Type': 'application/json'}
            }).success(function (data, status, headers, config) {
                if(data.success) {
                    // TODO: Notify the user that we logged him out
                    $cookieStore.remove('session');
                    $location.path('/login');
                } else {
                    // TODO: Notify the user that we could not log him out
                    $cookieStore.remove('session');
                    $location.path('/login');
                }
            }).error(function (data, status, headers, config) {
                // TODO: Notify the user that we could not log him out
                $location.path('/login');
            });
        }
    }
  });
