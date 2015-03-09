'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:VoteCtrl
 * @description
 * # VoteCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('VoteCtrl', function ($scope, reqBazService, UtilityService, AuthorizationService) {

    $scope.voteUp = function(req){
      reqBazService.addVote(req.id,false)
        .success(function(message){
          if(AuthorizationService.isAuthorized(message)){
            if (message.status === 'UNCHANGED'){
              UtilityService.showFeedback('You have already voted');
            }
            else if (message.status === 'CHANGED'){
              req.userVoted = 'UP_VOTE';
              req.upVotes += 1;
              req.downVotes -= 1;
              UtilityService.showFeedback('Thank You');
            }
            else if(message.status === 'CREATED'){
              req.userVoted = 'UP_VOTE';
              req.upVotes += 1;
              UtilityService.showFeedback('Thank You');
            }
          }
        })
        .error(function(error){
          console.log(error);
          UtilityService.showFeedback('Warning: Vote was not counted, unknown reasons');
        });
    };

    $scope.voteDown = function(req){
      reqBazService.addVote(req.id,true)
        .success(function(message){
          if(AuthorizationService.isAuthorized(message)) {
            if (message.status === 'UNCHANGED') {
              UtilityService.showFeedback('You have already voted');
            }
            else if (message.status === 'CHANGED') {
              req.userVoted = 'DOWN_VOTE';
              req.upVotes -= 1;
              req.downVotes += 1;
              UtilityService.showFeedback('Thank You');
            }
            else if (message.status === 'CREATED') {
              req.userVoted = 'DOWN_VOTE';
              req.downVotes += 1;
              UtilityService.showFeedback('Thank You');
            }
          }
        })
        .error(function(error){
          console.log(error);
          UtilityService.showFeedback('Warning: Vote was not counted, unknown reasons');
        });
    };
  });
