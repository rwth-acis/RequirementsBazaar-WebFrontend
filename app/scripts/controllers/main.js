'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
    .controller('MainCtrl', function ($scope) {
    $scope.projects = [
      {name : 'Project 1', description : 'This is a cool project 1'},
      {name : 'Project 2', description : 'This is a cool project 2'},
      {name : 'Project 3', description : 'This is a cool project 3'},
      {name : 'Project 4', description : 'This is a cool project 4'}
    ];
    $scope.activeProjectComponents = [
      {name : 'Component 1', description : 'This is a cool component 1'},
      {name : 'Component 2', description : 'This is a cool component 2'},
      {name : 'Component 3', description : 'This is a cool component 3'},
      {name : 'Component 4', description : 'This is a cool component 4'},
      {name : 'Component 5', description : 'This is a cool component 5'},
      {name : 'Component 6', description : 'This is a cool component 6'},
      {name : 'Component 7', description : 'This is a cool component 7'},
      {name : 'Component 8', description : 'This is a cool component 8'}
    ];

    $scope.activeComponent = {name : 'Component 1', description : 'This is a cool component 1'};

    $scope.activeProject = {name : 'Project 1', description : 'This is a cool project 1'};

    $scope.activeComponentRequirements = [
      {name : 'Requirement 1', text : 'Please update the ui'},
      {name : 'Requirement 2', text : 'It does not work'},
      {name : 'Requirement 3', text : 'Still not working'}
    ];

    $scope.selectComponent = function(name, description){
      $scope.activeComponent.name = name;
      $scope.activeComponent.description = description;

      //TODO Rewrite the activeComponentRequirements
      //Either request them from server or take ones saved locally
      $scope.activeComponentRequirements = [
        {name : 'Requirement 1 alternative', text : 'Please update the ui'},
        {name : 'Requirement 2 alternative', text : 'It does not work'},
        {name : 'Requirement 3 alternative', text : 'Still not working'},
        {name : 'Requirement 4 alternative', text : 'Please update the ui 2'},
        {name : 'Requirement 5 alternative', text : 'It does not work 2 '},
        {name : 'Requirement 6 alternative', text : 'Still not working 2'},
        {name : 'Requirement 1 alternative', text : 'Please update the ui'},
        {name : 'Requirement 2 alternative', text : 'It does not work'},
        {name : 'Requirement 3 alternative', text : 'Still not working'},
        {name : 'Requirement 4 alternative', text : 'Please update the ui 2'},
        {name : 'Requirement 5 alternative', text : 'It does not work 2 '},
        {name : 'Requirement 6 alternative', text : 'Still not working 2'},
        {name : 'Requirement 1 alternative', text : 'Please update the ui'},
        {name : 'Requirement 2 alternative', text : 'It does not work'},
        {name : 'Requirement 3 alternative', text : 'Still not working'},
        {name : 'Requirement 4 alternative', text : 'Please update the ui 2'},
        {name : 'Requirement 5 alternative', text : 'It does not work 2 '},
        {name : 'Requirement 6 alternative', text : 'Still not working 2'},
        {name : 'Requirement 1 alternative', text : 'Please update the ui'},
        {name : 'Requirement 2 alternative', text : 'It does not work'},
        {name : 'Requirement 3 alternative', text : 'Still not working'},
        {name : 'Requirement 4 alternative', text : 'Please update the ui 2'},
        {name : 'Requirement 5 alternative', text : 'It does not work 2 '},
        {name : 'Requirement 6 alternative', text : 'Still not working 2'}
      ];

    };

    $scope.selectProject = function(name, description){
      $scope.activeProject.name = name;
      $scope.activeProject.description = description;

      //TODO Rewrite activeProjectComponents
      //Either request them from server or take ones saved locally
      $scope.activeProjectComponents = [
        {name : 'Component 1', description : 'This is a cool component 1'},
        {name : 'Component 2', description : 'This is a cool component 2'},
        {name : 'Component 3', description : 'This is a cool component 3'}
      ];
    };

  });


