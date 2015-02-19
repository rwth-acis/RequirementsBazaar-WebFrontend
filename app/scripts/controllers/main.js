'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
    .controller('MainCtrl', function ($scope, reqBazService, UtilityService, $upload) {

    $scope.projects = null;
    $scope.components = null;
    $scope.requirements = null;
    $scope.activeUser = {id : '2', firstname : 'Max2', lastname : 'Mustermann2', email : 'Max@Mustermann2.de', admin : 'true', Las2PeerId :'2'};

    $scope.projectLeader = null;
    $scope.componentLeader = null;

    $scope.activeProject = null;
    $scope.activeComponent = null;

    //In case loading requirements/components fails, show a reload button
    $scope.reloadRequirements = false;
    $scope.reloadComponents = false;

    $scope.showProjectSelection = false;

    /*
    * Loads projects and then components ...
    * Called: only when the page loads
    * */
    (function(){
      reqBazService.getProjects()
        .success(function (projs) {
          $scope.projects = projs;
          if($scope.projects.length !== 0){
            $scope.activeProject = $scope.projects[0];
            $scope.selectProj($scope.activeProject);
          }else{
            //TODO somehow gracefully handle the fact that there are no projects
          }
        })
        .error(function () {
          UtilityService.showFeedback('Could not load projects, please reload !');
        });
    })();

    /*
    * Switches the active project and loads components belonging to it
    * Called: User selects a new project or reloads components
    * */
    $scope.selectProj = function (project) {
      $scope.showProjectSelection = false;
      $scope.reloadComponents = false;
      $scope.activeProject = project;
      reqBazService.getComponents($scope.activeProject.id,'0','30')
        .success(function (comps) {
          $scope.components = comps;
          $scope.activeComponent = $scope.components[0];
          $scope.selectComp($scope.activeComponent);
        })
        .error(function () {
          //Null the lists, otherwise user will see wrong components/requirements
          $scope.components = null;
          $scope.activeComponent = null;
          $scope.requirements = null;
          UtilityService.showFeedback('Could not load components');

          //Show the reload requirements button
          $scope.reloadComponents = true;
        });
    };

    /*
    * Switches the active component and loads requirements belonging to it
    * Called: User selects a new component/project or reloads requirements
    * */
    $scope.selectComp = function (component) {
      $scope.reloadRequirements = false;
      $scope.activeComponent = component;
      getUser($scope.activeComponent.leaderId,'component');

      //Load the requirements
      reqBazService.getRequirementsByComponent($scope.activeProject.id,$scope.activeComponent.id)
        .success(function (reqs) {
          $scope.requirements = reqs;
            if($scope.requirements.length === 0){
              UtilityService.showFeedback( 'This component has no requirements, feel free to create');
            }else{
              //Show the requirements
              for(var i = 0; i<$scope.requirements.length;i++){
                //This adds the missing attributes to the requirements
                $scope.requirements[i].creator = {firstName : 'loading'};
                $scope.requirements[i].leadDeveloper = {firstName : 'loading'};
                $scope.requirements[i].followers = [];
                $scope.requirements[i].developers = [];
                $scope.requirements[i].contributors = [];
                $scope.requirements[i].attachments = [];
                $scope.requirements[i].components = [];

                $scope.requirements[i].comments = [];
              }
            }
        })
        .error(function () {
          //Null the list, otherwise user will see wrong requirements
          $scope.requirements = null;
          UtilityService.showFeedback('Could not load requirements');

          //Show the reload requirements button
          $scope.reloadRequirements = true;
        });
    };

    /*
    * Loads user information
    * Called: automatically, when a component/requirement etc is shown
    * */
    function getUser(id,purpose){
      reqBazService.getUser(id)
        .success(function (user) {
          if(purpose === 'component'){
            $scope.componentLeader = user;
          }
          if(purpose === 'project'){
            $scope.projectLeader = user;
          }
        })
        .error(function () {
          if(purpose === 'component'){
            $scope.componentLeader = null;
          }
          if(purpose === 'project'){
            $scope.projectLeader = null;
          }
          UtilityService.showFeedback('Could not load user for: '+purpose);
        });
    }



    /*
     * Everything related to creating or deleting a project
     *
     * */

    $scope.initDeleteProject = function(){
      document.getElementById('confirmDeleteProject').toggle();
    };
    $scope.deleteProject = function(){
      console.log('delete project confirmed');
      //TODO delete the project
      UtilityService.showFeedback('This feature is currently under discussion');
    };


    /*
    * Everything related to creating or deleting a new component
    *
    * */
    $scope.initDeleteComponent = function () {
      document.getElementById('confirmDeleteComponent').toggle();
    };
    $scope.deleteComponent = function(){
      reqBazService.deleteComponent($scope.activeProject.id,$scope.activeComponent.id)
        .success(function (message) {
          console.log(message);
          if(message.success !== 'true'){
            UtilityService.showFeedback('Warning: Component was not deleted !');
          }else {
            for (var i = 0; i < $scope.components.length; i++) {
              if ($scope.components[i].id === $scope.activeComponent.id) {
                $scope.components.splice(i, 1);
                break;
              }
            }

            //set a new active component
            $scope.activeComponent = null;
            if ($scope.components !== null) {
              $scope.activeComponent = $scope.components[0];
            }

            UtilityService.showFeedback('Component deleted');
          }
        })
        .error(function (error) {
          console.log(error);
          UtilityService.showFeedback('Warning: Component was not deleted !');
        });
    };


  });


