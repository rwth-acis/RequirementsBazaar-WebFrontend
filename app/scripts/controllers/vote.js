'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:VoteCtrl
 * @description
 * # VoteCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('VoteCtrl', function ($scope, reqBazService, HttpErrorHandlingService) {

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
