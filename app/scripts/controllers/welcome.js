'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:ProjectManagementCtrl
 * @description
 * # ProjectManagementCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('WelcomeCtrl', function ($scope, oauthConfig, $location){
    $scope.oauthSite = oauthConfig.SITE;
    $scope.oauthClientId = oauthConfig.CLIENT_ID;
    $scope.oauthDataScope = oauthConfig.DATA_SCOPE;
    $scope.oauthRedirectURI = oauthConfig.REDIRECT_URI;
    $scope.oauthProfileURI = oauthConfig.PROFILE_URI;
    $scope.oauthScope = oauthConfig.SCOPE;

    $scope.goToMain = function(){
      $location.path('/project/1', true);
    }

  });
