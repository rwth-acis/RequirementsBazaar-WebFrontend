'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
    .controller('MainCtrl', function ($scope, reqBazService, UtilityService, $upload, Profile, $sce, oauthConfig, $location, AccessToken) {

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
      reqBazService.getComponents($scope.activeProject.id,'0','100')
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
        $scope.go('/project-management/'+$scope.activeProject.id)
      }else{
        UtilityService.showFeedback('You must be logged in to edit projects')
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

    $scope.deleteRequirement = function(){
      var req = $scope.deleteObject;
      console.log('delete requirement');
      reqBazService.deleteRequirement(req.id)
        .success(function (message) {
          if(message.success !== 'true'){
            UtilityService.showFeedback('Warning: Requirement was not deleted');
          }else{
            // Delete the removed requirement from the list
            for(var i = 0; i<$scope.requirements.length;i++){
              if($scope.requirements[i].id === req.id){
                $scope.requirements.splice(i, 1);
                break;
              }
            }
            //No requirement selected
            $scope.selectedIndex = -1;
            UtilityService.showFeedback('Requirement deleted');
          }
        })
        .error(function (error) {
          //This error only catches unknown server errors, usual errorCodes are sent with success message
          console.log(error);
          UtilityService.showFeedback('Warning: Requirement was not deleted');
        });
    };


    $scope.confirmDelete = function(object){
      $scope.deleteElem = 'req';
      $scope.deleteObject = object;
      $scope.deleteDesc = 'The action cannot be undone. All comments and attachments will be deleted!';
      document.getElementById('confirmDelete').toggle();
    };


    /*
     * Register a listener for the oauth login and if an existing token is still valid
     * */
    $scope.$on('oauth:login', function(event, token) {
      reqBazService.setAccessToken(token.access_token);
      UtilityService.showFeedback('Welcome back');
    });
    $scope.$on('oauth:authorized', function(event, token) {
      reqBazService.setAccessToken(token.access_token);
      UtilityService.showFeedback('Welcome back');
    });
    $scope.$on('oauth:logout', function() {
      UtilityService.showFeedback('You are logged out');
    });


    $scope.$on('oauth:profile', function() {
      $scope.activeUser = Profile.get();
      console.log($scope.activeUser);
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


