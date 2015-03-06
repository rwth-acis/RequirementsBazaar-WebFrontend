'use strict';

/**
 * @ngdoc overview
 * @name requirementsBazaarWebFrontendApp
 * @description
 * # requirementsBazaarWebFrontendApp
 *
 * Main module of the application.
 */
angular
  .module('requirementsBazaarWebFrontendApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ng-polymer-elements',
    'oauth',
    'angularFileUpload'
  ])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider) {
    $routeProvider
      .when('/access_token=:accessToken', {
        template: '',
        controller: function ($location, AccessToken) {
          var hash = $location.path().substr(1);
          AccessToken.setTokenFromString(hash);
          $location.path('/');
          $location.replace();
        }
      })
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/project-management/:projectId', {
        templateUrl: 'views/project-management.html',
        controller: 'ProjectManagementCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .run(function($rootScope, $location) {
    $rootScope.$on('$routeChangeSuccess', function () {
      if(sessionStorage.getItem('ngStorage-token') == null){
        if($location.path().indexOf('/access_token') > -1){
          //User is currently logging in
        }else{
          $location.path('/');
          $location.replace();
        }
      }
    });
  });
