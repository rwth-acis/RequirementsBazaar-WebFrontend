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

    //Currently logged in user
    $scope.activeUser = {id : '000', firstname : 'Kristjan', lastname : 'Liiva', email : 'liiva@web.com', admin : 'true', Las2PeerId :'000', username : 'KristjanLiiva'};

    //activeproject holds the project that is currently selected and projects everything else
    $scope.activeProject = {id : '1', name : 'Project 1', description : 'This is a cool project 1', visibility : '+', leader : '000'};
    $scope.projects = [
      {id : '1', name : 'Project 1', description : 'This is a cool project 1', visibility : '+', leader : '000'},
      {id : '2',name : 'Project 2', description : 'This is a cool project 2', visibility : '+', leader : '000'}
    ];

    //activeComponent holds the component that is currently selected and components everythings else from the active project
    $scope.activeComponent = {name : 'Component 1', description : 'This is a cool component 1'};
    $scope.components = [
      {name : 'Component 1', description : 'This is a cool component 1'},
      {name : 'Component 2', description : 'This is a cool component 2'}
    ];



    $scope.activeComponentRequirements = [
      {id : '000', name : 'Requirement 1', description : 'Please update the ui 1', Project_Id : '000', Leader_Id : '000'},
      {id : '001', name : 'Requirement 2', description : 'Please update the ui 2', Project_Id : '000', Leader_Id : '000'},
      {id : '002', name : 'Requirement 3', description : 'Please update the ui 3', Project_Id : '000', Leader_Id : '000'}
    ];

    $scope.selectComponent = function(name, description){
      $scope.activeComponent.name = name;
      $scope.activeComponent.description = description;

      //TODO Rewrite the activeComponentRequirements
      //Either request them from server or take ones saved locally
      $scope.activeComponentRequirements = [
        {id : '003', name : 'Requirement 4', description : 'UI is wack 1', Project_Id : '000', Leader_Id : '000'},
        {id : '004', name : 'Requirement 5', description : 'UI is wack 2', Project_Id : '000', Leader_Id : '000'},
        {id : '005', name : 'Requirement 6', description : 'UI is wack 3', Project_Id : '000', Leader_Id : '000'}
      ];

    };

    $scope.selectProject = function(name, description){
      $scope.activeProject.name = name;
      $scope.activeProject.description = description;

      //TODO Rewrite components
      //Either request them from server or take ones saved locally
      $scope.components = [
        {name : 'Component 1', description : 'This is a cool component 1'},
        {name : 'Component 2', description : 'This is a cool component 2'},
        {name : 'Component 3', description : 'This is a cool component 3'}
      ];
    };

    $scope.toggle = function(clickEvent) {
      clickEvent.toElement.nextElementSibling .toggle();
    };

    $scope.signOut = function(){
      window.alert('TODO sign out');
    };

  });


