'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:RequirementCtrl
 * @description
 * # RequirementCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 *
 * Functionality
 *   1. open / close the requirement
 *   2. edit requirement
 *   3. show / hide contributor list
 *   4. (un)follow , develop, become lead, vote, mark as done
 *
 *
 * There are also some parts commented out, I tested file uploading, but the service functionality has not been added.
 * Might or might not be useful, if it ever gets that far.
 *
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('RequirementCtrl', function ($scope, reqBazService, UtilityService, HttpErrorHandlingService, $location, SubmitToReqChange, $rootScope, $upload) {

    // Toggles if the object is displayed/opened
    $scope.showRequirement = false;

    // Toggles if the contributors list if shown
    $scope.showContributors = true;

    // Editing variables
    $scope.dirtyReq = null;
    $scope.isDirtyReq = false;
    $scope.mainReqSavingInprogress = false;

    // Creator of the requirement
    $scope.reqCreator = 'NaN';


    // Used to collect the attachments the user has added to the requirement
    //$scope.attachments = [];

    (function(){
      // Determine whether contributors should be shown right away
      if($scope.isMobile)
        $scope.showContributors = false;

      // Get the creator of the requirement
      reqBazService.getUser($scope.req.creatorId)
        .success(function (user) {
          if(user !== undefined){
            $scope.reqCreator = user.userName;
          }else{
            $scope.reqCreator = 'Unknown';
            console.log('user not loaded');
          }
        })
        .error(function () {
          $scope.reqCreator = 'Unknown';
          console.log('user not loaded');
        });
    })();

    /*
     * Currently only images, videos and pdfs are accepted as attachments
     * Called: when the user has selected a file
     * */
    //$scope.fileSelected = function (files) {
    //  if(files[0].type.indexOf('image/') > -1){
    //    $scope.attachments.push({'file':files[0],'URL':URL.createObjectURL(files[0])});
    //  }
    //  if(files[0].type.indexOf('application/pdf') > -1 || files[0].type.indexOf('video/') > -1){
    //    console.log('is pdf or video');
    //    $scope.attachments.push({'file':files[0],'URL':null});
    //  }
    //  console.log($scope.attachments);
    //};


    /*
     * User has started editing a requirement
     * */
    $scope.startEdit = function(req,index){
      // open the requirement
      if($scope.showRequirement === false){
        $scope.setSelectedReqId(req.id,index);
      }

      //Create a copy of the component, that is shown for the user while editing
      $scope.dirtyReq = angular.copy(req);
      $scope.isDirtyReq = true;
    };

    /*
    * Cancels the editing process
    * */
    $scope.cancelChanges = function(){
      $scope.isDirtyReq = false;
      $scope.dirtyReq = null;
    };

    /*
     * Tries to save the changes that the user has made to the requirement
     * */
    $scope.saveChanges = function(){
      $scope.mainReqSavingInprogress = true;
      reqBazService.updateRequirement($scope.dirtyReq.id,$scope.dirtyReq)
        .success(function (message) {
          console.log(message);
          for(var r in $scope.requirements){
            if($scope.requirements[r].id === message.id){
              $scope.requirements[r].title = message.title;
              $scope.requirements[r].description = message.description;
              break;
            }
          }
          $scope.isDirtyReq = false;
          $scope.dirtyReq = null;
          $scope.mainReqSavingInprogress = false;
          UtilityService.showFeedback('EDIT_SUCCESSFUL');
        })
        .error(function (error,httpStatus) {
          $scope.mainReqSavingInprogress = false;
          HttpErrorHandlingService.handleError(error,httpStatus);
        });


      //

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
    * Shows and hides the list of contributors for a requirement
    *
    * */
    $scope.showContrib = function(req,index){
      // open the requirement first if not already open
      if($scope.showRequirement === false){
        $scope.setSelectedReqId(req.id,index);
      }
      $scope.showContributors = true;
    };
    $scope.hideContrib = function(){
      $scope.showContributors = false;
    };

    /*
     * Toggles the visibility of a requirements
     *
     * It is called by listening for the requirement change signal from the MainCtrl.
     * */
    var toggleRequirement = function(event, args){
      if(parseInt(args.val) === $scope.req.id){
        if($scope.showRequirement === false){
          $scope.showRequirement = true;
          $location.path('/project/'+$scope.activeProject.id+'/component/'+$scope.activeComponent.id+'/requirement/'+$scope.req.id, false);

          //Scroll the user to the opened requirement
          var topPos = 0;
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
            scrollArea = document.querySelector('.drawer-main');
            scrollArea.scrollTop = topPos-prevHeight;
          }else{
            if(document.getElementById('req-'+args.newListIndex)){
              topPos = document.getElementById('req-'+args.newListIndex).offsetTop;
            }
            scrollArea = document.querySelector('.drawer-main');
            scrollArea.scrollTop = topPos-100;
          }

          // Retrieve extra information about the requirement
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
          // And the set back the URL
          $location.path('/project/'+$scope.activeProject.id+'/component/'+$scope.activeComponent.id, false);
        }
      }else{
        //Close if not selected
        $scope.showRequirement = false;
      }
    };

    /*
     * A listener to call toggle requirement
     *
     * The signal is sent from the mainCtrl
     * */
    SubmitToReqChange.listen(toggleRequirement);


    /*
    * Retrieves comments
    * */
    var getComments = function(req){
      reqBazService.getComments(req.id,0,30)
        .success(function (comments) {
          console.log(comments);
          req.comments = comments;
        })
        .error(function (error) {
          //This error only catches unknown server errors, usual errorCodes are sent with success message
          console.log(error);
          UtilityService.showFeedback('WARN_COMMENTS_NOT_LOADED');
        });
    };


    /*
    * Follow or unfollow a requirement
    * */
    $scope.followRequirement = function(clickEvent,req){
      reqBazService.addUserToFollowers(req.id)
        .success(function (requirement) {
          UtilityService.showFeedback('THANK_YOU_FOR_FOLLOWING');
          req.followers = requirement.followers;
        })
        .error(function (error, httpStatus) {
          HttpErrorHandlingService.handleError(error,httpStatus);
        });
    };
    $scope.unfollowRequirement = function(clickEvent,req){
      reqBazService.removeUserFromFollowers(req.id)
        .success(function (requirement) {
          req.followers = requirement.followers;
        })
        .error(function (error, httpStatus) {
          HttpErrorHandlingService.handleError(error,httpStatus);
        });
    };


    //Become a developer of a requirement
    $scope.developRequirement = function(clickEvent,req){
      reqBazService.addUserToDevelopers(req.id)
        .success(function (requirement) {
          UtilityService.showFeedback('THANK_FOR_INIT');
          req.developers = requirement.developers;
        })
        .error(function (error,httpStatus) {
          HttpErrorHandlingService.handleError(error,httpStatus);
        });
    };

    /*
    * Set currently logged in user as lead developer
    * */
    $scope.becomeLead = function(clickEvent,req){
      var re = { id: req.id, leadDeveloperId: $scope.activeUser.Id};
      reqBazService.updateRequirement(req.id,re)
        .success(function (message) {
          console.log(message);
          req.leadDeveloperId = message.leadDeveloperId;
          req.leadDeveloper = message.leadDeveloper;
          UtilityService.showFeedback('THANK_FOR_INIT');
        })
        .error(function (error,httpStatus) {
          HttpErrorHandlingService.handleError(error,httpStatus);
        });
    };

    /*
    * Mark requirement as done
    * */
    $scope.markDone = function(req, action){

      // reqbaz service requires a specific date format
      var dateString = null;
      if(action){
        var today = new Date();
        dateString = today.format('mmm d, yyyy') +' ' + today.format('h:MM:ss TT');
      }

      var re = {id: req.id, realized: dateString};
      reqBazService.updateRequirement(req.id,re)
        .success(function (message) {
          console.log(message);
          if(message.hasOwnProperty('realized')){
            req.realized = message.realized;
            UtilityService.showFeedback('THANK_FOR_INIT');
          }else{
            UtilityService.showFeedback('ERROR_UNKNOWN');
          }
        })
        .error(function (error,httpStatus) {
          HttpErrorHandlingService.handleError(error,httpStatus);
        });
    };

    /*
    * Upvotes a requirement
    * */
    $scope.vote = function(req,upvote){
      reqBazService.addVote(req.id,upvote)
        .success(function(message){
          req.userVoted = message.userVoted;
          req.upVotes = message.upVotes;
          req.downVotes = message.downVotes;
        })
        .error(function(error){
          HttpErrorHandlingService.handleError(error);
        });
    };

  });
