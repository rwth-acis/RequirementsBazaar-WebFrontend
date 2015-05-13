'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:ProjectManagementCtrl
 * @description
 * # ProjectManagementCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('WelcomeCtrl', function ($scope, oauthConfig, $location, reqBazService, UtilityService){
    $scope.oauthSite = oauthConfig.SITE;
    $scope.oauthClientId = oauthConfig.CLIENT_ID;
    $scope.oauthDataScope = oauthConfig.DATA_SCOPE;
    $scope.oauthRedirectURI = oauthConfig.REDIRECT_URI;
    $scope.oauthProfileURI = oauthConfig.PROFILE_URI;
    $scope.oauthScope = oauthConfig.SCOPE;

    /*
     * Loads projects
     * Called: only when the page loads
     * */
    (function(){
      reqBazService.getProjects()
        .success(function (projs) {
          $scope.projects = projs;
          if(projs.length === 0){
            UtilityService.showFeedback('NO_PROJ_EXISTS');
          }
        })
        .error(function () {
          UtilityService.showFeedback('WARN_PROJS_NOT_LOADED');
        });
    })();

    $scope.selectProj = function(project){
      $location.path('/project/'+project.id, true);
    };
  });
