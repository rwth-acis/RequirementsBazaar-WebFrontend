'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:CommentCtrl
 * @description
 * # CommentCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('CommentCtrl', function ($scope, reqBazService, UtilityService) {

    $scope.commentCreatorName = 'anon';

    $scope.getUserName = function(id){
      reqBazService.getUser(id).success(function (user) {
        $scope.commentCreatorName = user.firstName;
        return user;
      })
        .error(function () {
          UtilityService.showFeedback('Could not load user for: comment');
        });
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

  });
