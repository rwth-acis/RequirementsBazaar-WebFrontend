'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:CreateProjectCtrl
 * @description
 * # CreateProjectCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('CreateProjectCtrl', function ($scope, reqBazService, UtilityService) {

    //Creates a new component
    $scope.showCreateDiv = false;
    $scope.newName = '';
    $scope.newDesc = '';
    $scope.submitProject = function(){
      if(!UtilityService.isEmpty($scope.newName,'Choose project name') && !UtilityService.isEmpty($scope.newDesc, 'Choose project description')){
        console.log('submit new project');
        var project = {description: $scope.newDesc, name: $scope.newName, visibility: 'PUBLIC', leaderId: 1};
        reqBazService.createProject(project)
          .success(function (message) {
            console.log(message);
            if(message.hasOwnProperty('errorCode')){
              UtilityService.showFeedback('Warning: Project was not created !');
            }else {
              UtilityService.showFeedback('Project was created');

              //The project is added to be the first element and will be active
              project.id = message.id;
              $scope.activeProject = project;
              $scope.projects.splice(0, 0, $scope.activeProject);
              $scope.selectProj($scope.activeProject);
              $scope.clearSubmit();
            }
          })
          .error(function (error) {
            console.log(error);
            UtilityService.showFeedback('Warning: Project was not created !');
          });
      }
    };

    $scope.clearSubmit = function(){
      $scope.newName = '';
      $scope.newDesc = '';
      $scope.showCreateDiv = false;
    };
  });
