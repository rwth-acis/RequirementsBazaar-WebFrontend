'use strict';

/**
 * @ngdoc service
 * @name requirementsBazaarWebFrontendApp.CommentService
 * @description
 * # CommentService
 * Service in the requirementsBazaarWebFrontendApp.
 */
angular.module('requirementsBazaarWebFrontendApp')
  .service('CommentService', function CommentService($rootScope, reqBazService) {

    this.getComments = function(req){
      reqBazService.getComments(req.id,0,30)
        .success(function (comments) {
          req.comments = comments;
        })
        .error(function (error) {
          //This error only catches unknown server errors, usual errorCodes are sent with success message
          console.log(error);
          $rootScope.showFeedback('Warning: Could not get comments');
        });
    };


    this.deleteComponent = function(id, req){
      reqBazService.deleteComment(id)
        .success(function (message) {
          console.log(message);
          if(message.success !== 'true'){
            $rootScope.showFeedback('Warning: Comment was not deleted !');
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
          $rootScope.showFeedback('Warning: Comment was not deleted !');
        });
    };


    this.submitComment = function(text,req){
      console.log('post comment: '+text);
      // user 1 is the current anon user
      var comment = {requirementId: req.id, message: text, creatorId: 1};

      reqBazService.createComment(req.id,comment)
        .success(function (message) {
          console.log(message);
          if(message.hasOwnProperty('errorCode')){
            $rootScope.showFeedback('Warning: Comment was not submitted !');
          }else{
            comment.Id = message.id;
            //Instead of making a new server call, just approximate
            comment.creation_time = Date();
            req.comments.splice(0, 0, comment);
          }
        })
        .error(function (error) {
          //This error only catches unknown server errors, usual errorCodes are sent with success message
          console.log(error);
          $rootScope.showFeedback('Warning: Comment was not submitted !');
        });
    };


  });
