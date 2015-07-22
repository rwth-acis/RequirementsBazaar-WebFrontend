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

    $scope.createCompInprogress = false;

    /*
     * Submit a new component
     * */
    $scope.submitComponent = function(){
      if(!UtilityService.isEmpty($scope.name,'COMP_NAME_MISSING') && !UtilityService.isEmpty($scope.desc,'COMP_DESC_MISSING')) {
        $scope.createCompInprogress = true;
        var comp = {description: $scope.desc, name: $scope.name, projectId: $scope.activeProject.id};
        reqBazService.createComponent(comp)
          .success(function (newComp) {
            console.log(newComp);
            $scope.components.splice(0, 0, newComp);
            $scope.selectComp(newComp);
            $scope.clearSubmit();
            $scope.createCompInprogress = false;
          })
          .error(function (error,httpStatus) {
            $scope.createCompInprogress = false;
            HttpErrorHandlingService.handleError(error,httpStatus);
          });
      }
    };

    /*
     * Clear the input fields
     * */
    $scope.clearSubmit = function(){
      $scope.name = '';
      $scope.desc = '';
      $scope.$parent.showCreateCompDiv = false;
    };
  });
