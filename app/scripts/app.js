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
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true).hashPrefix('!');
  }]);
