'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:ActiveCompCtrl
 * @description
 * # ActiveCompCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 *
 * Functionality
 *   1. edit the name and description
 *   2. set as default
 */

angular.module('requirementsBazaarWebFrontendApp')
  .controller('ActiveCompCtrl', function ($scope, reqBazService, UtilityService, AccessToken, HttpErrorHandlingService) {

    $scope.dirtyComp = null;
    $scope.isDirty = false;

    $scope.mainCompSavingInprogress = false;

    /*
    * Set the default component
    * */
    $scope.setDefaulComp = function () {
      $scope.activeProject.defaultComponentId = $scope.activeComponent.id;
      reqBazService.updateProject($scope.activeProject.id,$scope.activeProject)
        .success(function (message) {
          console.log(message);
          UtilityService.showFeedback('EDIT_SUCCESSFUL');
        })
        .error(function (error,httpStatus) {
          HttpErrorHandlingService.handleError(error,httpStatus);
        });
    };


    /*
    * User has started editing a component
    * */
    $scope.startEdit = function(){
      //Create a copy of the component, that is shown for the user while editing
      $scope.dirtyComp = angular.copy($scope.activeComponent);
      $scope.isDirty = true;
    };

    /*
    * Save changes of the modified component
    * */
    $scope.saveChanges = function(){
      $scope.mainCompSavingInprogress = true;
      reqBazService.updateComponent($scope.dirtyComp.id,$scope.dirtyComp)
        .success(function (message) {
          //Find the component
          for(var comp in $scope.components){
            if($scope.components[comp].id === message.id){
              console.log('found');
              $scope.components[comp] = message;
              $scope.selectComp(message);
            }
          }
          $scope.dirtyComp = null;
          $scope.isDirty = false;
          $scope.mainCompSavingInprogress = false;
          UtilityService.showFeedback('EDIT_SUCCESSFUL');
        })
        .error(function (error,httpStatus) {
          $scope.mainCompSavingInprogress = false;
          HttpErrorHandlingService.handleError(error,httpStatus);
        });
    };

    /*
    * Cancel the changes that the user might have made to the component
    * */
    $scope.cancelChanges = function(){
      $scope.isDirty = false;
      $scope.dirtyComp = null;
    };

  });
