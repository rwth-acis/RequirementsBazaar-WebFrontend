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
      console.log('vote up');
      reqBazService.addVote(req.id,false)
        .success(function(message){
          console.log('vote up successful');
          console.log(message);
          //TODO catch if the user has already voted
          UtilityService.showFeedback('Thank You');
        })
        .error(function(){
          console.log('vote up unsuccessful');
          UtilityService.showFeedback('Warning: Vote was not counted');
        });
    };

    $scope.voteDown = function(req){
      console.log('vote down');
      reqBazService.addVote(req.id,true)
        .success(function(message){
          console.log('vote up successful');
          console.log(message);
          UtilityService.showFeedback('Thank You');
        })
        .error(function(){
          console.log('vote up unsuccessful');
        });
    };
  });
