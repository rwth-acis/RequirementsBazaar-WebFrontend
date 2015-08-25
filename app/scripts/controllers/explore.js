'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:ExploreCtrl
 * @description
 * # ExploreCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 *
 * Functionality
 *   1. Populates the list of projects
 *   2. opens div to create a new project
 *   3. holds infinite scroll params for the explore page
 *
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('ExploreCtrl', function ($scope, oauthConfig, $location, reqBazService, AccessToken, UtilityService){

    $scope.projects = null;
    $scope.showCreateProjDiv = false;

    // Infinite scroll parameters
    $scope.limit = 10;
    $scope.addMoreItems = function(){
      if($scope.projects !== null){
        if($scope.limit < $scope.projects.length){
          $scope.limit = $scope.limit + 10;
        }
      }
    };

    /*
     * Loads projects
     * Called: only when the page loads
     * */
    (function(){
      reqBazService.getProjects(0,100)
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

    /*
     * Open the panel to start creating a project
     * */
    $scope.startCreationProj = function(){
      if($scope.isMobile){
        // The timeout is used as sometimes the panel instantly closes itself
        setTimeout( function(){
          document.getElementById('create-dialog-project').open();
        },400);
      }else{
        $scope.showCreateProjDiv = true;
      }
    };
  });
