'use strict';

/**
 * @ngdoc overview
 * @name yapp
 * @description
 * # yapp
 *
 * Main module of the application.
 */
angular
  .module('yapp', [
    'ui.router',
    'ngAnimate',
    'ngCookies'
  ])
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/dashboard', '/dashboard/exams.list');
    $urlRouterProvider.otherwise('/login');

    $stateProvider
      .state('base', {
        abstract: true,
        url: '',
        templateUrl: 'views/base.html'
      })
        .state('login', {
          url: '/login',
          parent: 'base',
          templateUrl: 'views/login.html',
          controller: 'LoginCtrl'
        })
        .state('dashboard', {
          url: '/dashboard',
          parent: 'base',
          templateUrl: 'views/dashboard.html',
          controller: 'DashboardCtrl'
        })
          .state('create_exam', {
            url: '/exams.create',
            parent: 'dashboard',
            templateUrl: 'views/dashboard/exams.create.html',
            controller: 'NewExamCtrl'
          })
          .state('list_exams', {
            url: '/exams.list',
            parent: 'dashboard',
            templateUrl: 'views/dashboard/exams.list.html',
            controller: 'ListExamCtrl'
          })
          .state('find_exam', {
            url: '/exams.find',
            parent: 'dashboard',
            templateUrl: 'views/dashboard/exams.find.html',
            controller: 'FindExamCtrl'
          })
          .state('take_exam', {
            url: '/exams.take',
            parent: 'dashboard',
            templateUrl: 'views/dashboard/exams.take.html',
            controller: 'TakeExamCtrl'
          })
          .state('view_exam', {
            url: '/exams.view',
            parent: 'dashboard',
            templateUrl: 'views/dashboard/exams.view.html',
            controller: 'ViewExamCtrl'
          })
            .state('add_question', {
            url: '/exams.addQuestion',
            parent: 'view_exam',
            templateUrl: 'views/dashboard/exams.addQuestion.html',
            controller: 'AddQuestionCtrl'
          });
  });
