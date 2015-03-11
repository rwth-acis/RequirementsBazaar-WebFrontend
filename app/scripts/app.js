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
  .config(function ($routeProvider, $httpProvider) {
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
      .when('/project/:projectId/component/:componentId', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/project-management/:projectId', {
        templateUrl: 'views/project-management.html',
        controller: 'ProjectManagementCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    //Includes the authorization header with every request
    $httpProvider.interceptors.push('jwtInterceptor');

  })
  .factory('jwtInterceptor', function () {
    return {
      request: function (config) {
        var ngStorageToken = window.sessionStorage.getItem('ngStorage-token');
        if(ngStorageToken !== null){
          var token = JSON.parse(ngStorageToken).access_token;
          if(token !== undefined){
            //For some reason this does not work?
            //config.headers['Authorization'] = "Bearer "+token;
            if(config.url.indexOf('?') > -1){
              config.url += '&access_token='+token;
            }else{
              config.url += '?access_token='+token;
            }
          }
        }
        return config;
      }
    };
  });
