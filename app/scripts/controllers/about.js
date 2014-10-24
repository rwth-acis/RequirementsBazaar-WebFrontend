'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
