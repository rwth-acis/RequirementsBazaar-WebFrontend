'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:ActiveCompCtrl
 * @description
 * # ActiveCompCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('ActiveCompCtrl', function ($scope, reqBazService, UtilityService, AccessToken) {

    $scope.dirtyComp = null;
    $scope.isDirty = false;

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
      //TODO save the changes
      $scope.isDirty = false;
      UtilityService.showFeedback('Not yet implemented');
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
        $scope.$parent.deleteDesc = 'The action cannot be undone. The requirements will be accessible under the default component.';
        $scope.$parent.deleteElem = 'comp';
        document.getElementById('confirmDelete').toggle();
      }else{
        UtilityService.showFeedback('Please log in to delete components');
      }
    };

  });
