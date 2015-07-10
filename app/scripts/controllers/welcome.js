'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:ProjectManagementCtrl
 * @description
 * # ProjectManagementCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('WelcomeCtrl', function ($scope, oauthConfig, $location){

    $scope.exploreProjects = function(){
      $location.path('/explore/', true);
    }

  });
