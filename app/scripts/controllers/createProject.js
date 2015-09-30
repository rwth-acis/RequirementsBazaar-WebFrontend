'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:CreateProjectCtrl
 * @description
 * # CreateProjectCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 *
 * Functionality
 *   1. Create project
 *
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('CreateProjectCtrl', function ($scope, reqBazService, UtilityService, HttpErrorHandlingService) {

    $scope.name = '';
    $scope.desc = '';

    /*
    * Submit a new project
    * */
    $scope.submit = function(){
      if(!UtilityService.isEmpty($scope.name,'PROJ_NAME_MISSING') && !UtilityService.isEmpty($scope.desc, 'PROJ_DESC_MISSING')){
        var proj = {description: $scope.desc, name: $scope.name, visibility: 'PUBLIC'};
        reqBazService.createProject(proj)
          .success(function (newProj) {
            console.log(newProj);
            $scope.projects.splice(0, 0, newProj);
            $scope.clearSubmit();
          })
          .error(function (error,httpStatus) {
            HttpErrorHandlingService.handleError(error,httpStatus);
          });
      }
    };

    /*
     * Clear the input fields
     * */
    $scope.clearSubmit = function(){
      $scope.name = $scope.desc = '';
      var mobileDialog = document.getElementById('create-dialog-project');
      if(mobileDialog){
        document.getElementById('create-dialog-project').close();
      }
      $scope.$parent.showCreateProjDiv = false;
    };
  });
