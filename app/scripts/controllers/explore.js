'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:ExploreCtrl
 * @description
 * # ExploreCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('ExploreCtrl', function ($scope, oauthConfig, $location, reqBazService, AccessToken, UtilityService){

    $scope.projects = null;
    $scope.showCreateProjDiv = false;

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
      var mobileDialog = document.getElementById('create-dialog-project');
      if(mobileDialog){
        // If there is no delay then the overlay is closed right away
        setTimeout( function(){
          document.getElementById('create-dialog-project').open();
        },400);
      }
      $scope.showCreateProjDiv = true;
    };


    $scope.selectProject = function(project){
      $location.path('/project/'+project.id+'/component/'+project.defaultComponentId, true);
    };
  });
