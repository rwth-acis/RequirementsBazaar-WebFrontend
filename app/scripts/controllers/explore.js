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
     * Is called to check if the user has rights to create component for a project, currently simply check if logged in
     * */
    $scope.startCreationProj = function(){
      $scope.showCreateProjDiv = true;
    };


    $scope.selectProject = function(project){
      $location.path('/project/'+project.id, true);
    };
  });
