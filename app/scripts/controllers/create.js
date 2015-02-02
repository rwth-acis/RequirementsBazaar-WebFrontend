'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:CreateCtrl
 * @description
 * # CreateCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('CreateCtrl', function ($scope, reqBazService, UtilityService, $upload) {

    $scope.showCreateDiv = false;
    $scope.newName = '';
    $scope.newDesc = '';

    $scope.createAttachments = [];

    //Creating a requirement
    $scope.submitReq = function(){
      if(!UtilityService.isEmpty($scope.newName,'Choose requirement name') && !UtilityService.isEmpty($scope.newDesc,'Choose requirement description')) {
        if($scope.createAttachments.length !== 0){
          //TODO save the attachments
          $scope.createAttachments = [];
          UtilityService.showFeedback('Warning: Attachments were not included !');
        }
        console.log('submit requirement');
        var requirement = {title: $scope.newName, description: $scope.newDesc, projectId: $scope.activeProject.id, leadDeveloperId: 1, creatorId: 1};
        reqBazService.createRequirement($scope.activeProject.id, $scope.activeComponent.id, requirement)
          .success(function (message) {
            console.log(message);
            if (message.hasOwnProperty('errorCode')) {
              UtilityService.showFeedback('Warning: Requirement was not created !');
            } else {
              //Add missing values to the newly created requirement
              requirement.id = message.id;
              requirement.creator = {firstName: 'loading'};
              requirement.leadDeveloper = {firstName: 'loading'};
              requirement.followers = [];
              requirement.developers = [];
              requirement.contributors = [];
              requirement.attachments = [];
              requirement.components = [];

              //Add the requirement to the first position
              $scope.requirements.splice(0, 0, requirement);
              $scope.clearSubmit();
            }
          })
          .error(function (error) {
            //This error only catches unknown server errors, usual errorCodes are sent with success message
            console.log(error);
            UtilityService.showFeedback('Warning: Requirement was not created !');
          });
      }
    };


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

    $scope.newAttachments = function(files){
      if(files[0].type.indexOf('image/') > -1){
        $scope.createAttachments.push({'file':files[0],'URL':URL.createObjectURL(files[0])});
      }
      if(files[0].type.indexOf('application/pdf') > -1 || files[0].type.indexOf('video/') > -1){
        console.log('is pdf or video');
        $scope.createAttachments.push({'file':files[0],'URL':null});
      }
      console.log($scope.createAttachments);
    };
  });
