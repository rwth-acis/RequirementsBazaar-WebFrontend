'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:VoteCtrl
 * @description
 * # VoteCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('VoteCtrl', function ($scope, reqBazService, UtilityService) {

    $scope.voteUp = function(req){
      reqBazService.addVote(req.id,false)
        .success(function(message){
          if (message.hasOwnProperty('errorCode')) {
            UtilityService.showFeedback('Warning: Vote not counted !');
          } else {
            req.upVotes += 1;
            UtilityService.showFeedback('Thank You');
          }
        })
        .error(function(){
          UtilityService.showFeedback('Warning: Vote was not counted');
        });
    };

    $scope.voteDown = function(req){
      reqBazService.addVote(req.id,true)
        .success(function(message){
          if (message.hasOwnProperty('errorCode')) {
            UtilityService.showFeedback('Warning: Vote not counted !');
          } else {
            req.downVotes += 1;
            UtilityService.showFeedback('Thank You');
          }
        })
        .error(function(){
          UtilityService.showFeedback('Warning: Vote was not counted');
        });
    };
  });
