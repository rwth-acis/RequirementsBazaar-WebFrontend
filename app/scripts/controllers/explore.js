'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:ExploreCtrl
 * @description
 * # ExploreCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('ExploreCtrl', function ($scope, oauthConfig, $location, reqBazService, UtilityService){

    $scope.projects = null;
    $scope.featured = [];

    $scope.limit = 5;
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
          }else{
            getFeatured();
          }
        })
        .error(function () {
          UtilityService.showFeedback('WARN_PROJS_NOT_LOADED');
        });
    })();

    var getFeatured = function(){
      for(var i in $scope.projects){
        if($scope.projects[i].id === 2 || $scope.projects[i].id === 125 || $scope.projects[i].id === 133){
          $scope.featured.push($scope.projects[i]);
          $scope.projects.splice(i, 1);
        }
      }
    };

    $scope.selectProject = function(project){
      $location.path('/project/'+project.id, true);
    };
  });
