'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:CreateProjectCtrl
 * @description
 * # CreateProjectCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('CreateProjectCtrl', function ($scope, reqBazService, UtilityService, AuthorizationService) {

    $scope.name = '';
    $scope.desc = '';

    /*
    * Submit a new project
    * */
    $scope.submitProject = function(){
      if(!UtilityService.isEmpty($scope.name,'PROJ_NAME_MISSING') && !UtilityService.isEmpty($scope.desc, 'PROJ_DESC_MISSING')){
        console.log('submit new project');
        var proj = {description: $scope.desc, name: $scope.name, visibility: 'PUBLIC', leaderId: 1};
        reqBazService.createProject(proj)
          .success(function (message) {
            console.log(message);
            if(AuthorizationService.isAuthorized(message)) {
              //Retrieve it from the server to get all auto generated fields
              reqBazService.getProject(message.id)
                .success(function (proj) {
                  //The project is added to be the first element and will be active
                  $scope.projects.splice(0, 0, proj);
                  $scope.selectProj(proj);
                  $scope.clearSubmit();
                })
                .error(function (error) {
                  console.log(error);
                  UtilityService.showFeedback('WARN_PROJ_NOT_LOADED');
                });
            }
          })
          .error(function (error) {
            console.log(error);
            UtilityService.showFeedback('WARN_PROJ_NOT_CREATED');
          });
      }
    };

    /*
     * Clear the input fields
     * */
    $scope.clearSubmit = function(){
      $scope.name = $scope.desc = '';
      $scope.$parent.showCreateProjDiv = false;
    };
  });
