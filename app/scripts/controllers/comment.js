'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:CommentCtrl
 * @description
 * # CommentCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('CommentCtrl', function ($scope, reqBazService, UtilityService, AuthorizationService) {

    $scope.creatorName = 'anon';
    $scope.creatorProfileImage = '';

    /*
     * Submits a comment, time of the post is initially approximate
     * Called: by the user
     * */
    $scope.submitComment = function(text,req){
      if(!UtilityService.isEmpty(text,'Comment cannot be empty')){
        console.log('post comment: '+text);
        var comment = {requirementId: req.id, message: text};
        reqBazService.createComment(req.id,comment)
          .success(function (message) {
            console.log(message);
            if(AuthorizationService.isAuthorized(message)) {

              console.log($scope.activeUser);
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
          if(AuthorizationService.isAuthorized(message)) {
            // Delete the removed requirement from the list
            for(var i = 0; i<req.comments.length;i++){
              if(req.comments[i].Id === id){
                req.comments.splice(i, 1);
                break;
              }
            }
            UtilityService.showFeedback('Comment: ' + message.deletedItemText + ' deleted');
          }
        })
        .error(function (error) {
          //This error only catches unknown server errors, usual errorCodes are sent with success message
          console.log(error);
          UtilityService.showFeedback('Warning: Comment was not deleted !');
        });
    };

  });
