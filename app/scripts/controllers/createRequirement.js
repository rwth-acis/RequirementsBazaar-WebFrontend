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
    $scope.newName = '';
    $scope.newDesc = '';

    $scope.createAttachments = [];

    $scope.createReqInprogress  = false;

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
      // There is a data binding problem in Firefox, check manually if something has been inserted
      if(!$scope.newName && !$scope.newDesc){
        $scope.newName = document.getElementById('createReqName').value;
        $scope.newDesc = document.getElementById('createReqDesc').value;
      }
      if(!UtilityService.isEmpty($scope.newName,'REQ_NAME_MISSING')) {
        if($scope.createAttachments.length !== 0){
          //TODO save the attachments
          $scope.createAttachments = [];
          UtilityService.showFeedback('ATTACHMENTS_NOT_INCLUDED');
        }
        console.log('submit requirement');
        $scope.createReqInprogress  = true;
        var components = [{id:$scope.activeComponent.id}];
        var req = {title: $scope.newName, description: $scope.newDesc, projectId: $scope.activeProject.id, components: components};
        reqBazService.createRequirement(req)
          .success(function (message) {
            console.log(message);
            $scope.requirements.splice(0, 0, message);
            $scope.clearSubmit();
            $scope.createReqInprogress  = false;
          })
          .error(function (error,httpStatus) {
            $scope.createReqInprogress  = false;
            HttpErrorHandlingService.handleError(error,httpStatus);
          });
      }
    };

    /*
    * Clear the input fields
    * */
    $scope.clearSubmit = function(){
      $scope.newName = $scope.newDesc = '';
      // Data binding is not working on some browsers, set it manually also
      document.getElementById('createReqName').value = '';
      document.getElementById('createReqDesc').value = '';

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
