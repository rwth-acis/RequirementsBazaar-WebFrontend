'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:ProjectManagementCtrl
 * @description
 * # ProjectManagementCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('ProjectManagementCtrl', function ($scope, $http, $routeParams, $location, UtilityService, reqBazService, HttpErrorHandlingService){
    //Keep the current version of the project
    var project = null;
    $scope.dirtyProject = null;

    $scope.activeTab = 'pm-settings';
    $scope.isDirty = false;

    /*
     * Loads the project
     * */
    (function(){
      reqBazService.getProject($routeParams.projectId)
        .success(function (proj) {
          project = angular.copy(proj);
          //Create a copy of the project that the user can edit
          $scope.dirtyProject = angular.copy(proj);
        })
        .error(function () {
          UtilityService.showFeedback('WARN_PROJ_NOT_LOADED');
        });
    })();

    $scope.saveChanges = function(){
      reqBazService.updateProject($scope.dirtyProject.id,$scope.dirtyProject)
        .success(function (updatedProject) {
          project = updatedProject;
          $scope.isDirty = false;
          UtilityService.showFeedback('EDIT_SUCCESSFUL');
        })
        .error(function (error,httpStatus) {
          HttpErrorHandlingService.handleError(error,httpStatus);
        });
    };

    $scope.cancelChanges = function(){
      $scope.isDirty = false;
      $scope.dirtyProject = angular.copy(project);
    };

    $scope.returnToProject = function () {
      $location.path( '/project/'+ project.id);
    };


  });
