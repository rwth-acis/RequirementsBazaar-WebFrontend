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
        reqBazService.createComment(req.id,comment)
          .success(function (message) {
            console.log(message);
            if(HttpErrorHandlingService.isSuccess(message)) {
              UtilityService.showFeedback('THANKS_FOR_FEEDBACK');
              reqBazService.getComment($scope.activeComponent.id, message.id)
                .success(function (commentNew) {
                  comment = commentNew;
                  req.comments.splice(0, 0, comment);
                })
                .error(function (error) {
                  console.log(error);
                  UtilityService.showFeedback('REFRESH_PLEASE');
                });
            }
          })
          .error(function (error) {
            //This error only catches unknown server errors, usual errorCodes are sent with success message
            console.log(error);
            UtilityService.showFeedback('WARN_COMMENT_NOT_CREATED');
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
          if(HttpErrorHandlingService.isSuccess(message)) {
            // Delete the removed requirement from the list
            for(var i = 0; i<req.comments.length;i++){
              if(req.comments[i].Id === id){
                req.comments.splice(i, 1);
                break;
              }
            }
            UtilityService.showFeedback('DEL_COMMENT',message.deletedItemText);
          }
        })
        .error(function (error) {
          //This error only catches unknown server errors, usual errorCodes are sent with success message
          console.log(error);
          UtilityService.showFeedback('WARN_COMMENT_NOT_DEL');
        });
    };

  });
