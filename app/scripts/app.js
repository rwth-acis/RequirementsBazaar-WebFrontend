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
    'angularFileUpload',
    'pascalprecht.translate'
  ])
  .config(function ($routeProvider, $httpProvider) {
    $routeProvider

      /*
      * Catch the log in result and navigate the user to explore page
      * */
      .when('/access_token=:accessToken', {
        template: '',
        controller: function ($location, AccessToken) {
          var hash = $location.path().substr(1);
          AccessToken.setTokenFromString(hash);
          $location.path('/explore/');
          $location.replace();
        }
      })
      /*
      * Non log in situations
      * */
      .when('/project/:projectId/component/:componentId/requirement/:requirementId', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/project/:projectId/component/:componentId', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/project/:projectId', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/', {
        templateUrl: 'views/welcome-page.html'
      })
      .when('/explore', {
        templateUrl: 'views/explore.html',
        controller: 'ExploreCtrl'
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
            // Use this as soon as the service allows. config.headers['Authorization'] = "Bearer "+token;
            // It will then also require the modification of the routing
            config.url += (config.url.indexOf('?') > -1) ? '&access_token='+token : '?access_token='+token;
          }
        }
        return config;
      }
    };
  })
  .run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
  var original = $location.path;
  $location.path = function (path, reload) {
    if (reload === false) {
      var lastRoute = $route.current;
      var un = $rootScope.$on('$locationChangeSuccess', function () {
        $route.current = lastRoute;
        un();
      });
    }
    return original.apply($location, [path]);
  };
}]);

/*
* Bootstrap the angular application
*
* Problem: The WebComponentsReady event is fired at the wrong time. Only some of the components are ready when it fires.
* But hey, at least the toast problem was fixed
* */
window.addEventListener('WebComponentsReady', function() {
  angular.bootstrap(wrap(document), ['requirementsBazaarWebFrontendApp']);
});
