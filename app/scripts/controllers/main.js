'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
    .controller('MainCtrl', function ($scope, reqBazService, UtilityService, AuthorizationService, $upload, Profile, $sce, oauthConfig, $location, AccessToken, $routeParams) {

    $scope.projects = null;
    $scope.components = null;
    $scope.requirements = null;
    $scope.activeUser = {};

    $scope.projectLeader = null;
    $scope.componentLeader = null;

    $scope.activeProject = null;
    $scope.activeComponent = null;

    //In case loading requirements/components fails, show a reload button
    $scope.reloadRequirements = false;
    $scope.reloadComponents = false;

    $scope.showProjectSelection = false;

    $scope.oauthSite = oauthConfig.SITE;
    $scope.oauthClientId = oauthConfig.CLIENT_ID;
    $scope.oauthDataScope = oauthConfig.DATA_SCOPE;
    $scope.oauthRedirectURI = oauthConfig.REDIRECT_URI;
    $scope.oauthProfileURI = oauthConfig.PROFILE_URI;
    $scope.oauthScope = oauthConfig.SCOPE;

    //Used to filter requirements
    $scope.filterReq = {};


    $scope.showCreateCompDiv = false;

    /*
    * Loads projects and then components ...
    * Called: only when the page loads
    * */
    (function(){
      reqBazService.getProjects()
        .success(function (projs) {
          $scope.projects = projs;
          if(projs.length !== 0){
            //Check if the user followed a bookmarked link
            var bmProj = null;
            if($routeParams.projectId !== undefined){
              for(var p in projs){
                if($routeParams.projectId === projs[p].id.toString()){
                  bmProj = p;
                  break;
                }
              }
            }
            $scope.activeProject = (bmProj !== null) ? projs[bmProj] : projs[0];
            $scope.selectProj($scope.activeProject);
          }else{
            //TODO somehow gracefully handle the fact that there are no projects
            UtilityService.showFeedback('No projects exist yet');
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

      reqBazService.getComponents($scope.activeProject.id,'0','100')
        .success(function (comps) {
          $scope.components = comps;
          if(comps.length !== 0){
            //Check if the user followed a bookmarked link
            var bmComp = null;
            if($routeParams.componentId !== undefined){
              for(var c in comps){
                if($routeParams.componentId === comps[c].id.toString()){
                  bmComp=c;
                  break;
                }
              }
            }
            $scope.activeComponent = (bmComp !== null) ? comps[bmComp] : comps[0];
            //Change the path without reloading the page
            $location.path('/project/'+$scope.activeProject.id+'/component/'+$scope.activeComponent.id, false);
            $scope.selectComp($scope.activeComponent);
          }else{
            //No components found, should not happen as default comp should exist
            $scope.components = $scope.activeComponent = $scope.requirements = null;
            UtilityService.showFeedback('No components found');
          }
        })
        .error(function () {
          //Null the lists, otherwise user will see wrong components/requirements
          $scope.components = $scope.activeComponent = $scope.requirements = null;
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
      $location.path('/project/'+$scope.activeProject.id+'/component/'+$scope.activeComponent.id, false);
      getUser($scope.activeComponent.leaderId,'component');

      //Load the requirements
      reqBazService.getRequirementsByComponent($scope.activeProject.id,$scope.activeComponent.id,'0','100')
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
    * Reroutes user to the project management page, but only if logged in
    *
    * */
    $scope.editProject = function(){
      //Check if user is logged in
      if(AccessToken.get() !== null){
        $scope.go('/project-management/'+$scope.activeProject.id);
      }else{
        UtilityService.showFeedback('You must be logged in to edit projects');
      }
    };

    /*
     * Is called to check if the user has rights to create component for a project, currently simply check if logged in
     * */
    $scope.startCreationComp = function(){
      if(AccessToken.get() !== null){
        $scope.showCreateCompDiv = true;
      }else{
        UtilityService.showFeedback('Please log in to create components');
      }
    };

    /*
     * Is called to check if the user has rights to create component for a project, currently simply check if logged in
     * */
    $scope.startCreationProj = function(){
      if(AccessToken.get() !== null){
        $scope.showCreateProjDiv = true;
      }else{
        UtilityService.showFeedback('Please log in to create projects');
      }
    };


    /*
    * Everything related to creating or deleting a new component
    *
    * */
    $scope.deleteComponent = function(){
      reqBazService.deleteComponent($scope.activeProject.id,$scope.activeComponent.id)
        .success(function (message) {
          console.log(message);
          if(message.success !== true){
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
              $scope.selectComp($scope.components[0]);
            }

            UtilityService.showFeedback('Component: ' + message.deletedItemText + ' deleted');
          }
        })
        .error(function (error) {
          console.log(error);
          UtilityService.showFeedback('Warning: Component was not deleted !');
        });
    };

    $scope.deleteRequirement = function(){
      var req = $scope.deleteObject;
      console.log('delete requirement');
      reqBazService.deleteRequirement(req.id)
        .success(function (message) {
          if(AuthorizationService.isAuthorized(message)){
            // Delete the requirement from the list
            for(var i = 0; i<$scope.requirements.length;i++){
              if($scope.requirements[i].id === req.id){
                $scope.requirements.splice(i, 1);
                break;
              }
            }
            //No requirement selected
            $scope.selectedIndex = -1;
            UtilityService.showFeedback('Requirement: ' + message.deletedItemText + ' deleted');
          }
        })
        .error(function (error) {
          //This error only catches unknown server errors, usual errorCodes are sent with success message
          console.log(error);
          UtilityService.showFeedback('Warning: Requirement was not deleted');
        });
    };


    $scope.confirmDelete = function(object){
      if(AccessToken.get() !== null){
        $scope.deleteElem = 'req';
        $scope.deleteObject = object;
        $scope.deleteDesc = 'The action cannot be undone. All comments and attachments will be deleted!';
        document.getElementById('confirmDelete').toggle();
      }else{
        UtilityService.showFeedback('Please log in to delete requirements');
      }
    };


    /*
     * Register a listener for the oauth login and if an existing token is still valid
     * */
    $scope.$on('oauth:login', function() {
      UtilityService.showFeedback('Welcome back');
    });
    $scope.$on('oauth:authorized', function() {
      UtilityService.showFeedback('Welcome back');
    });
    $scope.$on('oauth:logout', function() {
      UtilityService.showFeedback('You are logged out');
    });


    $scope.$on('oauth:profile', function() {
      $scope.activeUser = Profile.get();
    });

    /*
    * Making sure that the URL passing works on custom elements
    * */
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    };

    $scope.go = function ( path ) {
      $location.path( path );
    };
  });


