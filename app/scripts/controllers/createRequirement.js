'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:CreateRequirementCtrl
 * @description
 * # CreateRequirementCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('CreateRequirementCtrl', function ($scope, reqBazService, UtilityService, HttpErrorHandlingService, AccessToken, $upload) {

    $scope.showCreateDiv = false;
    $scope.name = '';
    $scope.desc = '';

    $scope.createAttachments = [];

    $scope.createInprogress  = false;

    /*
    * Is called to check if the user has rights to create requirements for a project, currently simply check if logged in
    * */
    $scope.startCreation = function(){
      if(AccessToken.get() !== null){
        if($scope.isMobile){
          setTimeout( function(){
            document.getElementById('create-dialog-requirement').open();
          },400);
        }else{
          $scope.showCreateDiv = true;
        }
      }else{
        UtilityService.showFeedback('LOGIN_REQ');
      }
    };

    /*
    * Submit a new Requirement
    * */
    $scope.submit = function(){
      if(!UtilityService.isEmpty($scope.name,'REQ_NAME_MISSING')) {
        if($scope.createAttachments.length !== 0){
          //TODO save the attachments
          $scope.createAttachments = [];
          UtilityService.showFeedback('ATTACHMENTS_NOT_INCLUDED');
        }
        console.log('submit requirement');
        $scope.createInprogress  = true;
        var components = [{id:$scope.activeComponent.id}];
        var req = {title: $scope.name, description: $scope.desc, projectId: $scope.activeProject.id, components: components};
        reqBazService.createRequirement(req)
          .success(function (message) {
            console.log(message);
            $scope.requirements.splice(0, 0, message);
            $scope.clearSubmit();
            $scope.createInprogress  = false;
          })
          .error(function (error,httpStatus) {
            $scope.createInprogress  = false;
            HttpErrorHandlingService.handleError(error,httpStatus);
          });
      }
    };

    /*
    * Clear the input fields
    * */
    $scope.clearSubmit = function(){
      var mobileDialog = document.getElementById('create-dialog-requirement');
      if(mobileDialog){
        document.getElementById('create-dialog-requirement').close();
      }
      $scope.name = $scope.desc = '';
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
