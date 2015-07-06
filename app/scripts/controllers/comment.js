'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:CommentCtrl
 * @description
 * # CommentCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('CommentCtrl', function ($scope, reqBazService, UtilityService, HttpErrorHandlingService) {

    /*
     * Submits a comment, time of the post is initially approximate
     * Called: by the user
     * */
    $scope.submitComment = function(text,req){
      if(!UtilityService.isEmpty(text,'COMMENT_TEXT_MISSING')){
        console.log('post comment: '+text);
        var comment = {requirementId: req.id, message: text};
        reqBazService.createComment(comment)
          .success(function (newComment) {
            console.log(newComment);
            UtilityService.showFeedback('THANKS_FOR_FEEDBACK');
            newComment.creator = $scope.activeUser;
            console.log(newComment);
            req.comments.splice(0, 0, newComment);
          })
          .error(function (error,httpStatus) {
            HttpErrorHandlingService.handleError(error,httpStatus);
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
          for(var i = 0; i<req.comments.length;i++){
            if(req.comments[i].Id === id){
              req.comments.splice(i, 1);
              break;
            }
          }
          UtilityService.showFeedback('DEL_COMMENT',message.deletedItemText);
        })
        .error(function (error,httpStatus) {
          HttpErrorHandlingService.handleError(error,httpStatus);
        });
    };

  });
