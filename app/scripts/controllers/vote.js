'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:VoteCtrl
 * @description
 * # VoteCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('VoteCtrl', function ($scope, reqBazService, UtilityService, HttpErrorHandlingService) {

    $scope.voteUp = function(req){
      reqBazService.addVote(req.id,false)
        .success(function(message){
          if(HttpErrorHandlingService.isSuccess(message)){
            if (message.status === 'UNCHANGED'){
              UtilityService.showFeedback('ALREADY_VOTED');
            }
            else if (message.status === 'CHANGED'){
              req.userVoted = 'UP_VOTE';
              req.upVotes += 1;
              req.downVotes -= 1;
              UtilityService.showFeedback('THANK_YOU');
            }
            else if(message.status === 'CREATED'){
              req.userVoted = 'UP_VOTE';
              req.upVotes += 1;
              UtilityService.showFeedback('THANK_YOU');
            }
          }
        })
        .error(function(error){
          console.log(error);
          UtilityService.showFeedback('WARN_VOTE_NOT_COUNTED');
        });
    };

    $scope.voteDown = function(req){
      reqBazService.addVote(req.id,true)
        .success(function(message){
          if(HttpErrorHandlingService.isSuccess(message)) {
            if (message.status === 'UNCHANGED') {
              UtilityService.showFeedback('ALREADY_VOTED');
            }
            else if (message.status === 'CHANGED') {
              req.userVoted = 'DOWN_VOTE';
              req.upVotes -= 1;
              req.downVotes += 1;
              UtilityService.showFeedback('THANK_YOU');
            }
            else if (message.status === 'CREATED') {
              req.userVoted = 'DOWN_VOTE';
              req.downVotes += 1;
              UtilityService.showFeedback('THANK_YOU');
            }
          }
        })
        .error(function(error){
          console.log(error);
          UtilityService.showFeedback('WARN_VOTE_NOT_COUNTED');
        });
    };
  });
