'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:IndexCtrl
 * @description
 * # IndexCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('IndexCtrl', function ($scope, $location, $sce, UtilityService, reqBazService, HttpErrorHandlingService) {

    $scope.activeUser = null;

    $scope.goWelcomePage = function(){
      $location.path('/', true);
    };
    $scope.exploreProjects = function(){
      $location.path('/explore/', true);
    };

    /*
     * Register a listener for the oauth login and if an existing token is still valid
     * */
    $scope.$on('oauth:login', function() {
      UtilityService.showFeedback('WELCOME_BACK');
      setActiveUser();
    });
    $scope.$on('oauth:authorized', function() {
      setActiveUser();
    });
    $scope.$on('oauth:logout', function() {
      UtilityService.showFeedback('LOGOUT');
      $scope.activeUser = null;
      $location.path($location.$$path, true);
    });
    $scope.$on('oauth:profile', function() {
      setActiveUser();
    });

    var setActiveUser = function(){
      reqBazService.getCurrentUser()
        .success(function (user) {
          console.log(user);
          $scope.activeUser = user;
        })
        .error(function (error,httpStatus) {
          HttpErrorHandlingService.handleError(error,httpStatus);
        });
    };

    /*
     * Making sure that the URL passing works on custom elements
     * */
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    };

  });


