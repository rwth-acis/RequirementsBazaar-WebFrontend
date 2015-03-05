'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:CreateRequirementCtrl
 * @description
 * # CreateRequirementCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('CreateRequirementCtrl', function ($scope, reqBazService, UtilityService, $upload) {

    $scope.showCreateDiv = false;
    $scope.newName = '';
    $scope.newDesc = '';

    $scope.createAttachments = [];

    /*
    * Submit a new Requirement
    * */
    $scope.submitReq = function(){
      if(!UtilityService.isEmpty($scope.newName,'Choose requirement name') /*&& !UtilityService.isEmpty($scope.newDesc,'Choose requirement description')*/) {
        if($scope.createAttachments.length !== 0){
          //TODO save the attachments
          $scope.createAttachments = [];
          UtilityService.showFeedback('Warning: Attachments were not included !');
        }
        console.log('submit requirement');
        var req = {title: $scope.newName, description: $scope.newDesc, projectId: $scope.activeProject.id, leadDeveloperId: 1};
        reqBazService.createRequirement($scope.activeProject.id, $scope.activeComponent.id, req)
          .success(function (message) {
            console.log(message);
            if (message.hasOwnProperty('errorCode')) {
              if(message.errorCode === 'AUTHORIZATION'){
                UtilityService.showFeedback('You are not allowed to create new requirements!');
              } else {
                  UtilityService.showFeedback('Warning: Requirement was not created !');
              }
            } else {
              //Add missing values to the newly created requirement
              req.id = message.id;
              req.creator = {firstName: 'loading'};
              req.leadDeveloper = {firstName: 'loading'};
              req.followers = [];
              req.developers = [];
              req.contributors = [];
              req.attachments = [];
              req.components = [];

              //Add the requirement to the first position
              $scope.requirements.splice(0, 0, req);
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

    /*
    * Clear the input fields
    * */
    $scope.clearSubmit = function(){
      $scope.newName = '';
      $scope.newDesc = '';
      $scope.showCreateDiv = false;
    };

    /*
    * Add attachments to the requirement
    * */
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
