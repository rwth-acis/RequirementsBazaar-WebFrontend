'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:RequirementCtrl
 * @description
 * # RequirementCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('RequirementCtrl', function ($scope, reqBazService, UtilityService, AuthorizationService, $location, SubmitToReqChange, $rootScope, $upload) {

    $scope.attachments = [];
    $scope.showRequirement = false;
    $scope.editRequirement = false;

    $scope.showContributors = false;

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
      UtilityService.showFeedback('WARN_NOT_IMPL');


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
    var toggleRequirement = function(event, args){
      if(parseInt(args.val) === $scope.req.id){
        if($scope.showRequirement === false){
          $scope.showRequirement = true;
          $location.path('/project/'+$scope.activeProject.id+'/component/'+$scope.activeComponent.id+'/requirement/'+$scope.req.id, false);

          //Scroll the user to the opened requirement
          var topPos = 0;
          var scaffold = null;
          var scrollArea = null;
          if(args.newListIndex > args.oldListIndex){
            topPos = 0;
            var prevHeight = 0;
            if(document.getElementById('req-'+args.newListIndex)){
              topPos = document.getElementById('req-'+args.newListIndex).offsetTop;
            }
            if(document.getElementById('req-'+args.oldListIndex)){
              prevHeight = document.getElementById('req-'+args.oldListIndex).clientHeight;
            }
            scaffold = document.querySelector('core-scaffold');
            scrollArea = scaffold.shadowRoot.querySelector('core-header-panel');
            scrollArea.scroller.scrollTop = topPos-prevHeight+100;
          }else{
            if(document.getElementById('req-'+args.newListIndex)){
              topPos = document.getElementById('req-'+args.newListIndex).offsetTop;
            }
            scaffold = document.querySelector('core-scaffold');
            scrollArea = scaffold.shadowRoot.querySelector('core-header-panel');
            scrollArea.scroller.scrollTop = topPos-50;
          }

          reqBazService.getRequirement($scope.req.id)
            .success(function (requirement) {
              $scope.req.creator = requirement.creator;
              $scope.req.attachments = requirement.attachments;
              $scope.req.components = requirement.components;
              $scope.req.leadDeveloper = requirement.leadDeveloper;
              $scope.req.followers = requirement.followers;
              $scope.req.developers = requirement.developers;
              $scope.req.contributors = requirement.contributors;

              //Load comments
              getComments($scope.req);
            })
            .error(function () {
              UtilityService.showFeedback('WARN_REQ_NOT_LOADED');
            });
        }else{
          $scope.showRequirement = false;
          $location.path('/project/'+$scope.activeProject.id+'/component/'+$scope.activeComponent.id, false);
        }
      }else{
        //Close if not selected
        $scope.showRequirement = false;
      }
    };

    /*
     * A listener to call toggle requirement
     * */
    SubmitToReqChange.listen(toggleRequirement);



    var getComments = function(req){
      reqBazService.getComments(req.id,0,30)
        .success(function (comments) {
          req.comments = comments;
        })
        .error(function (error) {
          //This error only catches unknown server errors, usual errorCodes are sent with success message
          console.log(error);
          UtilityService.showFeedback('WARN_COMMENTS_NOT_LOADED');
        });
    };


    //Become a follower of a requirement
    $scope.followRequirement = function(clickEvent,req){
      console.log('become follower');
      reqBazService.addUserToFollowers(req.id)
        .success(function (message) {
          if(AuthorizationService.isAuthorized(message)){
            UtilityService.showFeedback('THANK_YOU_FOR_FOLLOWING');
            reqBazService.getRequirement(req.id)
              .success(function (reqNew) {
                req.followers = reqNew.followers;
              })
              .error(function (error) {
                console.log(error);
                UtilityService.showFeedback('REFRESH_PLEASE');
              });
          }
        })
        .error(function (error) {
          console.log(error);
          UtilityService.showFeedback('WARN_NOT_REG_AS_FOLLOWER');
        });
    };

    //Become a developer of a requirement
    $scope.developRequirement = function(clickEvent,req){
      console.log('become developer');
      reqBazService.addUserToDevelopers(req.id)
        .success(function (message) {
          console.log(message);
          if(AuthorizationService.isAuthorized(message)){
            UtilityService.showFeedback('THANK_FOR_INIT');
            reqBazService.getRequirement(req.id)
              .success(function (reqNew) {
                req.developers = reqNew.developers;
              })
              .error(function (error) {
                console.log(error);
                UtilityService.showFeedback('REFRESH_PLEASE');
              });
          }
        })
        .error(function (error) {
          console.log(error);
          UtilityService.showFeedback('WARN_NOT_REG_AS_DEV');
        });
    };
  });
