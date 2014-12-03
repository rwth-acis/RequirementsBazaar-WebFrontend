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

    //activeUser is logged in user and users everyone else
    $scope.activeUser = {id : '1', firstname : 'Kristjan', lastname : 'Liiva', email : 'liiva@web.com', admin : 'true', Las2PeerId :'000', username : 'KristjanLiiva'};
    $scope.users = [
      {id : '1', firstname : 'Kristjan', lastname : 'Liiva', email : 'liiva@web.com', admin : 'true', Las2PeerId :'000', username : 'KristjanLiiva'},
      {id : '2', firstname : 'Istvan', lastname : 'Koren', email : 'koren@web.com', admin : 'true', Las2PeerId :'000', username : 'IstvanKoren'},
      {id : '3', firstname : 'Adam', lastname : 'Gavronek', email : 'gavronek@web.com', admin : 'true', Las2PeerId :'000', username : 'AdamGavronek'}
    ];

    //activeproject holds the project that is currently selected and projects everything else
    $scope.activeProject = {id : '1', name : 'Project 1', description : 'This is a cool project 1', visibility : '+', leader : '1'};
    $scope.projects = [
      {id : '1', name : 'Project 1', description : 'This is a cool project 1', visibility : '+', leader : '1'},
      {id : '2',name : 'Project 2', description : 'This is a cool project 2', visibility : '+', leader : '2'}
    ];

    //activeComponent holds the component that is currently selected and components everything else from the active project
    $scope.activeComponent = {id : '1', name : 'Component 1', description : 'This is a cool component 1', projectId : '1', leaderId : '1'};
    $scope.components = [
      {id : '1', name : 'Component 1', description : 'This is a cool component 1', projectId : '1', leaderId : '1'},
      {id : '2', name : 'Component 2', description : 'This is a cool component 2', projectId : '1', leaderId : '2'}
    ];


    $scope.requirements = [
      {id : '1', name : 'Requirement 1', description : 'Please update the ui 1', projectId : '1', leaderId : '1'},
      {id : '2', name : 'Requirement 2', description : 'Please update the ui 2', projectId : '1', leaderId : '1'},
      {id : '3', name : 'Requirement 3', description : 'Please update the ui 3', projectId : '1', leaderId : '1'}
    ];

    $scope.selectProject = function(project){
      $scope.activeProject = project;

      //TODO Rewrite components
      //Request Components with projectId
      //Demo Data
      if($scope.activeProject.id === '1'){
        $scope.components = [
          {id : '1', name : 'Component 1', description : 'This is a cool component 1', projectId : '1', leaderId : '1'},
          {id : '2', name : 'Component 2', description : 'This is a cool component 2', projectId : '1', leaderId : '2'}
        ];
      }else{
        $scope.components = [
          {id : '3', name : 'Component 3', description : 'This is a cool component 3', projectId : '2', leaderId : '3'}
        ];
      }

      //TODO check if empty and how to handle it?
      $scope.activeComponent = $scope.components[0];

      showRequirements();

      //TODO query tags

    };

    $scope.selectComponent = function(component){
      $scope.activeComponent = component;

      showRequirements();

      //TODO query tags
    };

    var showRequirements = function(){
      //TODO query the requirements for the component
      //Demo Data
      if($scope.activeComponent.id === '1'){
        $scope.requirements = [
          {id : '1', name : 'Requirement 1', description : 'Please update the ui 1', projectId : '1', leaderId : '1'},
          {id : '2', name : 'Requirement 2', description : 'Please update the ui 2', projectId : '1', leaderId : '1'},
          {id : '3', name : 'Requirement 3', description : 'Please update the ui 3', projectId : '1', leaderId : '1'}
        ];
      }else if($scope.activeComponent.id === '2'){
        $scope.requirements = [
          {id : '1', name : 'Requirement 1', description : 'Please update the ui 1', projectId : '1', leaderId : '1'},
          {id : '4', name : 'Requirement 4', description : 'Please update the ui 4', projectId : '1', leaderId : '1'}
        ];
      }else{
        //Component 3 belong to project 2
        $scope.requirements = [
          {id : '5', name : 'Requirement 5', description : 'Please update the ui 5', projectId : '2', leaderId : '1'},
          {id : '6', name : 'Requirement 6', description : 'Please update the ui 6', projectId : '2', leaderId : '1'}
        ];
      }
    };

    $scope.toggle = function(clickEvent) {
      clickEvent.toElement.nextElementSibling.toggle();
    };

    $scope.signOut = function(){
      window.alert('TODO sign out');
    };

  });


