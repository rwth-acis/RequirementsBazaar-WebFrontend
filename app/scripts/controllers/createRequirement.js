'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:CreateRequirementCtrl
 * @description
 * # CreateRequirementCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('CreateRequirementCtrl', function ($scope, reqBazService, UtilityService, AuthorizationService, AccessToken, $upload) {

    $scope.showCreateDiv = false;
    $scope.newName = '';
    $scope.newDesc = '';

    $scope.createAttachments = [];

    /*
    * Is called to check if the user has rights to create requirements for a project, currently simply check if logged in
    * */
    $scope.startCreation = function(){
      if(AccessToken.get() !== null){
        $scope.showCreateDiv = true;
      }else{
        UtilityService.showFeedback('LOGIN_REQ');
      }
    };

    /*
    * Submit a new Requirement
    * */
    $scope.submitReq = function(){
      if(!UtilityService.isEmpty($scope.newName,'REQ_NAME_MISSING')) {
        if($scope.createAttachments.length !== 0){
          //TODO save the attachments
          $scope.createAttachments = [];
          UtilityService.showFeedback('ATTACHMENTS_NOT_INCLUDED');
        }
        console.log('submit requirement');
        var req = {title: $scope.newName, description: $scope.newDesc, projectId: $scope.activeProject.id, leadDeveloperId: 1};
        reqBazService.createRequirement($scope.activeProject.id, $scope.activeComponent.id, req)
          .success(function (message) {
            console.log(message);
            if(AuthorizationService.isAuthorized(message)) {
              reqBazService.getRequirement(message.id)
                .success(function (req) {
                  $scope.requirements.splice(0, 0, req);
                  $scope.clearSubmit();
                })
                .error(function (error) {
                  console.log(error);
                  UtilityService.showFeedback('WARN_REQ_NOT_LOADED');
                });
            }
          })
          .error(function (error) {
            //This error only catches unknown server errors, usual errorCodes are sent with success message
            console.log(error);
            UtilityService.showFeedback('WARN_REQ_NOT_CREATED');
          });
      }
    };

    /*
    * Clear the input fields
    * */
    $scope.clearSubmit = function(){
      $scope.newName = $scope.newDesc = '';
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
