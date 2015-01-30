'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:RequirementCtrl
 * @description
 * # RequirementCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('RequirementCtrl', function ($scope, reqBazService, CommentService, UtilityService, $rootScope, $upload) {

    $scope.attachments = [];

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

      //TODO update req text
      //TODO save all the attachments

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
     * Submits a comment, time of the post is initially approximate
     * Called: by the user
     * */
    $scope.submitComment = function(text,req){
      if(!UtilityService.isEmpty(text,'Comment cannot be empty')){
        CommentService.submitComment(text,req);
      }
    };

    /*
     * Comment is deleted without further confirmation
     * Called: by the user
     * */
    $scope.deleteComment = function(id,req){
      CommentService.deleteComponent(id,req);
    };




  });
