'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:RequirementCtrl
 * @description
 * # RequirementCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('RequirementCtrl', function ($scope, reqBazService, UtilityService, $upload) {

    $scope.attachments = [];
    $scope.showRequirement = false;
    $scope.editRequirement = false;

    /*
     * Currently only images, videos and pdfs are accepted as attachments
     * Called: when the user has selected a file
     * */
    $scope.fileSelected = function (files) {
      if(files[0].type.indexOf('image/') > -1){
        $scope.attachments.push({'file':files[0],'URL':URL.createObjectURL(files[0])});
      }
      if(files[0].type.indexOf('application/pdf') > -1 || files[0].type.indexOf('video/') > -1){
        console.log('is pdf or video');
        $scope.attachments.push({'file':files[0],'URL':null});
      }
      console.log($scope.attachments);
    };


    //$scope.upload = $upload.upload({
    //  url: 'server/upload/url',
    //  data: {myObj: $scope.myModelObj},
    //  file: $scope.files
    //}).progress(function(evt) {
    //  console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :'+ evt.config.file.name);
    //}).success(function(data, status, headers, config) {
    //  console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);
    //});



    /*
     * After the user has finished editing
     * Called: by the user, by clicking on submit requirement
     * */
    $scope.updateRequirement = function(req){
      console.log('save changes');
      console.log('text : '+req.description);
      if($scope.attachments !== null){
        console.log('with attachments:');
      }

      console.log($scope.attachments);
      UtilityService.showFeedback('Warning: Not implemented');


      $scope.editRequirement = false;

      //TODO update req text
      //TODO save all the attachments that did not exist before?

      //var url = 'http://localhost:8080/bazaar/';
      //var attachmentUrl = url + 'projects/' + 0 + '/components/' + 0 + '/requirements/' + 0 + '/attachments';
      //attachmentUrl+= '?attachmentType=F';
      //
      //$scope.upload = $upload.upload({
      //  url: attachmentUrl,
      //  data: {myObj: $scope.myModelObj},
      //  file: $scope.files
      //}).progress(function(evt) {
      //  console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :'+ evt.config.file.name);
      //}).success(function(data, status, headers, config) {
      //  console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);
      //});


      //this.createAttachment = function(attachmentType, attachment){
      //  var attachmentUrl = url + 'projects/' + 0 + '/components/' + 0 + '/requirements/' + 0 + '/attachments';
      //
      //  attachmentUrl+= '?attachmentType' + attachmentType;
      //
      //  return $http.post(attachmentUrl, attachment);
      //};

    };


    /*
     * Toggles the visibility of a requirements
     * Called: user clicks on the requirement
     * */
    $scope.toggleRequirement = function(req) {

      if($scope.showRequirement === false){
        reqBazService.getRequirement(req.id)
          .success(function (requirement) {
            console.log(requirement);
            req.creator = requirement.creator;
            req.attachments = requirement.attachments;
            req.components = requirement.components;
            req.leadDeveloper = requirement.leadDeveloper;
            req.followers = requirement.followers;
            req.developers = requirement.developers;
            req.contributors = requirement.contributors;

            //Load comments
            getComments(req);
          })
          .error(function () {
            UtilityService.showFeedback('Warning: the requirement was not loaded !');
          });
      }
      $scope.showRequirement = !$scope.showRequirement;
    };


    var getComments = function(req){
      reqBazService.getComments(req.id,0,30)
        .success(function (comments) {
          req.comments = comments;
        })
        .error(function (error) {
          //This error only catches unknown server errors, usual errorCodes are sent with success message
          console.log(error);
          UtilityService.showFeedback('Warning: Could not get comments');
        });
    };


    /*
     * Submits a comment, time of the post is initially approximate
     * Called: by the user
     * */
    $scope.submitComment = function(text,req){
      if(!UtilityService.isEmpty(text,'Comment cannot be empty')){
        console.log('post comment: '+text);
        // user 1 is the current anon user
        var comment = {requirementId: req.id, message: text};

        reqBazService.createComment(req.id,comment)
          .success(function (message) {
            console.log(message);
            if(message.hasOwnProperty('errorCode')){
              UtilityService.showFeedback('Warning: Comment was not submitted !');
            }else{
              comment.creatorId = $scope.activeUser.preferred_username;
              comment.Id = message.id;
              //Instead of making a new server call, just approximate
              comment.creationTime = Date();
              req.comments.splice(0, 0, comment);
            }
          })
          .error(function (error) {
            //This error only catches unknown server errors, usual errorCodes are sent with success message
            console.log(error);
            UtilityService.showFeedback('Warning: Comment was not submitted !');
          });
      }
    };

    /*
     * Comment is deleted without further confirmation
     * Called: by the user
     * */
    $scope.deleteComment = function(id,req){
      reqBazService.deleteComment(id)
        .success(function (message) {
          console.log(message);
          if(message.success !== 'true'){
            UtilityService.showFeedback('Warning: Comment was not deleted !');
          }else{
            // Delete the removed requirement from the list
            for(var i = 0; i<req.comments.length;i++){
              if(req.comments[i].Id === id){
                req.comments.splice(i, 1);
                break;
              }
            }
          }
        })
        .error(function (error) {
          //This error only catches unknown server errors, usual errorCodes are sent with success message
          console.log(error);
          UtilityService.showFeedback('Warning: Comment was not deleted !');
        });
    };





    /**
     *
     * Function calls that currently don't do anything or don't work
     *
     */
      //Become a follower of a requirement
    $scope.followRequirement = function(clickEvent,req){
      console.log('become follower');
      reqBazService.addUserToFollowers(req.id)
        .success(function (message) {
          console.log(message);
        })
        .error(function (error) {
          console.log(error);
          $scope.toastText = 'Warning: could not register as a follower';
          document.getElementById('feedbackToast').show();
        });
    };


    $scope.deleteRequirement = function(req){
      console.log('delete requirement');
      reqBazService.deleteRequirement(req.id)
        .success(function (message) {
          if(message.success !== 'true'){
            UtilityService.showFeedback('Warning: Requirement was not deleted');
          }else{
            // Delete the removed requirement from the list
            for(var i = 0; i<$scope.requirements.length;i++){
              if($scope.requirements[i].id === req.id){
                $scope.requirements.splice(i, 1);
                break;
              }
            }
            //No requirement selected
            $scope.selectedIndex = -1;
            UtilityService.showFeedback('Requirement deleted');
          }
        })
        .error(function (error) {
          //This error only catches unknown server errors, usual errorCodes are sent with success message
          console.log(error);
          UtilityService.showFeedback('Warning: Requirement was not deleted');
        });
    };


  });
