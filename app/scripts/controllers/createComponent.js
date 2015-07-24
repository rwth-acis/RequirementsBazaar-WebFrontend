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
      // There is a data binding problem in Firefox, check manually if something has been inserted
      if(!$scope.name && !$scope.desc){
        $scope.name = document.getElementById('createCompName').value;
        $scope.desc = document.getElementById('createCompDesc').value;
      }

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
      $scope.desc = $scope.name = '';
      // Data binding is not working on some browsers, set it manually also
      document.getElementById('createCompName').value = '';
      document.getElementById('createCompDesc').value = '';
      $scope.$parent.showCreateCompDiv = false;
    };
  });
