'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:RequirementCtrl
 * @description
 * # RequirementCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('RequirementCtrl', function ($scope, reqBazService, UtilityService, HttpErrorHandlingService, $location, SubmitToReqChange, $rootScope, $upload) {

    $scope.attachments = [];
    $scope.showRequirement = false;
    $scope.showContributors = true;

    $scope.dirtyReq = null;
    $scope.isDirtyReq = false;

    $scope.reqCreator = 'NaN';

    // Used to show user who created the requirement
    (function(){
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

    // Determine whether contributors should be shown right away
    (function(){
      // device detection taken from Stackoverflow
      if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) $scope.showContributors = false;
    })();


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
    * User has cancelled the edit
    * */
    $scope.cancelChanges = function(){
      $scope.isDirtyReq = false;
      $scope.dirtyReq = null;
    };

    /*
     * After the user has finished editing
     * Called: by the user, by clicking on submit requirement
     * */
    $scope.saveChanges = function(){
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
          UtilityService.showFeedback('EDIT_SUCCESSFUL');
        })
        .error(function (error,httpStatus) {
          HttpErrorHandlingService.handleError(error,httpStatus);
        });

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



    $scope.showContrib = function(req,index){
      // open the requirement
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
          console.log(comments);
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
      reqBazService.addUserToFollowers(req.id)
        .success(function (requirement) {
          console.log(requirement);
          UtilityService.showFeedback('THANK_YOU_FOR_FOLLOWING');
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
      var dateString = null;
      if(action){
        action = new Date();
        var today = new Date();
        dateString = today.format('mmm d, yyyy') +' ' + today.format('h:MM:ss TT');
      }
      var re = {id: req.id, realized: dateString};
      reqBazService.updateRequirement(req.id,re)
        .success(function (message) {
          console.log(message);
          if(message.hasOwnProperty('realized')){
            req.realized = message.realized;
          }else{
            delete req.realized;
          }
          UtilityService.showFeedback('THANK_FOR_INIT');
        })
        .error(function (error,httpStatus) {
          HttpErrorHandlingService.handleError(error,httpStatus);
        });
    };

  });
