'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:CreateComponentCtrl
 * @description
 * # CreateComponentCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('CreateComponentCtrl', function ($scope, reqBazService, UtilityService, HttpErrorHandlingService) {

    $scope.name = '';
    $scope.desc = '';

    $scope.createInprogress = false;

    /*
     * Submit a new component
     * */
    $scope.submit = function(){
      if(!UtilityService.isEmpty($scope.name,'COMP_NAME_MISSING') && !UtilityService.isEmpty($scope.desc,'COMP_DESC_MISSING')) {
        $scope.createInprogress = true;
        var comp = {description: $scope.desc, name: $scope.name, projectId: $scope.activeProject.id};
        reqBazService.createComponent(comp)
          .success(function (newComp) {
            console.log(newComp);
            $scope.components.splice(0, 0, newComp);
            $scope.selectComp(newComp);
            $scope.clearSubmit();
            $scope.createInprogress = false;
          })
          .error(function (error,httpStatus) {
            $scope.createInprogress = false;
            HttpErrorHandlingService.handleError(error,httpStatus);
          });
      }
    };

    /*
     * Clear the input fields
     * */
    $scope.clearSubmit = function(){
      $scope.desc = $scope.name = '';
      var mobileDialog = document.getElementById('create-dialog-component');
      if(mobileDialog){
        document.getElementById('create-dialog-component').close();
      }
      $scope.$parent.showCreateCompDiv = false;
    };
  });
