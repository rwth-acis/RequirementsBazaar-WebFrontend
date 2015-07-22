'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:ActiveCompCtrl
 * @description
 * # ActiveCompCtrl
 * Controller of the requirementsBazaarWebFrontendApp
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
          $scope.activeComponent = message;
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

    /*
    * Initiate delete component
    * */
    $scope.confirmDelete = function(){
      if(AccessToken.get() !== null){
        $scope.$parent.deleteDesc = 'DEL_COMP_DESC';
        $scope.$parent.deleteElem = 'comp';
        document.getElementById('confirmDelete').toggle();
      }else{
        UtilityService.showFeedback('LOGIN_COMP_DEL');
      }
    };

  });
