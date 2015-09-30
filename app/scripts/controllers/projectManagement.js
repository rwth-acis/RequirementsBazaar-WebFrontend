'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:ProjectManagementCtrl
 * @description
 * # ProjectManagementCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 *
 * Functionality
 *   1. Edit the project
 *
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('ProjectManagementCtrl', function ($scope, $http, $routeParams, $location, UtilityService, reqBazService, HttpErrorHandlingService){

    // Keep the current version of the project
    var project = null;

    // Modified version of the project, this is what the user interacts with
    $scope.dirtyProject = null;
    $scope.isDirty = false;
    $scope.pmSavingInprogress = false;

    // Used for navigation
    $scope.activeTab = 'pm-settings';


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

    /*
    * Tries to save the changes the user has made
    * */
    $scope.saveChanges = function(){
      $scope.pmSavingInprogress = true;
      reqBazService.updateProject($scope.dirtyProject.id,$scope.dirtyProject)
        .success(function (updatedProject) {
          project = updatedProject;
          $scope.isDirty = false;
          $scope.pmSavingInprogress = false;
          UtilityService.showFeedback('EDIT_SUCCESSFUL');
        })
        .error(function (error,httpStatus) {
          $scope.pmSavingInprogress = false;
          HttpErrorHandlingService.handleError(error,httpStatus);
        });
    };

    /*
    * Clears the changes and resets the dirty project
    * */
    $scope.cancelChanges = function(){
      $scope.isDirty = false;
      $scope.dirtyProject = angular.copy(project);
    };
  });
