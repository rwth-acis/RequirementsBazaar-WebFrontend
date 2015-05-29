'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
    .controller('MainCtrl', function ($scope, reqBazService, UtilityService, HttpErrorHandlingService, $upload, Profile, $sce, oauthConfig, $location, $anchorScroll, $timeout, AccessToken, $routeParams, $rootScope, $window, SubmitToReqChange) {

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

    //Object and description to be deleted
    $scope.deleteElem = '';
    $scope.deleteDesc = '';
    $scope.deleteObject = null;

    $scope.limit = 10;
    $scope.addMoreItems = function(){
      if($scope.requirements !== null){
        if($scope.limit < $scope.requirements.length){
          $scope.limit = $scope.limit + 10;
        }
      }
    };

    $scope.showProjectSelection = false;

    //Used to filter requirements
    $scope.filterReq = {};

    var currentlyOpenReqListIndex = 0;
    $scope.setSelectedReqId = function(reqId, newListIndex){
      //Timeout is necessary, since otherwise the listeners from child controllers are not registered yet
      $timeout(function() {
        SubmitToReqChange.emit(reqId, currentlyOpenReqListIndex, newListIndex);
        currentlyOpenReqListIndex = newListIndex;
      });

    };

    $scope.showCreateCompDiv = false;

    /*
    * Loads projects and then components ...
    * Called: only when the page loads
    * */
    (function(){
      reqBazService.getProjects(0,100)
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
            UtilityService.showFeedback('NO_PROJ_EXISTS');
          }
        })
        .error(function () {
          UtilityService.showFeedback('WARN_PROJS_NOT_LOADED');
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
            $scope.selectComp($scope.activeComponent);
          }else{
            //No components found, should not happen as default comp should exist
            $scope.components = $scope.activeComponent = $scope.requirements = null;
            UtilityService.showFeedback('WARN_COMPS_NOT_LOADED');
          }
        })
        .error(function () {
          //Null the lists, otherwise user will see wrong components/requirements
          $scope.components = $scope.activeComponent = $scope.requirements = null;
          UtilityService.showFeedback('WARN_COMPS_NOT_LOADED');

          //Show the reload requirements button
          $scope.reloadComponents = true;
        });
    };

    /*
    * Switches the active component and loads requirements belonging to it
    * Called: User selects a new component/project or reloads requirements
    * */
    $scope.selectComp = function (component) {
      document.querySelector('core-scaffold').closeDrawer();
      $scope.reloadRequirements = false;
      $scope.activeComponent = component;
      setUser($scope.activeComponent.leaderId);
      //Load the requirements
      reqBazService.getRequirementsByComponent($scope.activeProject.id,$scope.activeComponent.id,'0','300')
        .success(function (reqs) {
          $scope.requirements = reqs;
          $timeout(function() {
            $scope.$apply();
          });
          if(reqs.length !== 0){
            if($routeParams.requirementId !== undefined){
              for(var r in reqs){
                if($routeParams.requirementId === reqs[r].id.toString()){
                  $scope.setSelectedReqId($routeParams.requirementId,r);
                }
              }
            }else{
              $location.path('/project/'+$scope.activeProject.id+'/component/'+$scope.activeComponent.id, false);
            }
          }else{
            $location.path('/project/'+$scope.activeProject.id+'/component/'+$scope.activeComponent.id, false);
            UtilityService.showFeedback('NO_REQ_EXIST');
          }
        })
        .error(function () {
          //Null the list, otherwise user will see wrong requirements
          $scope.requirements = null;
          UtilityService.showFeedback('WARN_REQS_NOT_LOADED');

          //Show the reload requirements button
          $scope.reloadRequirements = true;
        });
    };

    /*
    * Loads user information
    * Called: automatically, when a component/requirement etc is shown
    * */
    function setUser(id){
      reqBazService.getUser(id)
        .success(function (user) {
          $scope.componentLeader = user;
        })
        .error(function () {
          UtilityService.showFeedback('USER_NOT_LOADED');
        });
    }

    /*
    * Reroutes user to the project management page, but only if logged in
    *
    * */
    $scope.editProject = function(){
      //Check if user is logged in
      if(AccessToken.get() !== null){
        $location.path('/project-management/'+$scope.activeProject.id+'/', true);
      }else{
        UtilityService.showFeedback('LOGIN_PROJ');
      }
    };

    /*
     * Is called to check if the user has rights to create component for a project, currently simply check if logged in
     * */
    $scope.startCreationComp = function(){
      if(AccessToken.get() !== null){
        $scope.showCreateCompDiv = true;
      }else{
        UtilityService.showFeedback('LOGIN_COMP');
      }
    };

    /*
     * Is called to check if the user has rights to create component for a project, currently simply check if logged in
     * */
    $scope.startCreationProj = function(){
      if(AccessToken.get() !== null){
        $scope.showCreateProjDiv = true;
      }else{
        UtilityService.showFeedback('LOGIN_PROJ');
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
            UtilityService.showFeedback('WARN_COMP_NOT_DEL');
          }else {
            for (var c in $scope.components) {
              if ($scope.components[c].id === $scope.activeComponent.id) {
                $scope.components.splice(c, 1);
                break;
              }
            }

            //set a new active component
            $scope.activeComponent = null;
            if ($scope.components !== null) {
              $scope.selectComp($scope.components[0]);
            }

            UtilityService.showFeedback('DEL_COMP',message.deletedItemText);
          }
        })
        .error(function (error) {
          console.log(error);
          UtilityService.showFeedback('WARN_COMP_NOT_DEL');
        });
    };

    $scope.deleteRequirement = function(){
      var req = $scope.deleteObject;
      console.log('delete requirement');
      reqBazService.deleteRequirement(req.id)
        .success(function (message) {
          if(HttpErrorHandlingService.isSuccess(message)){
            // Delete the requirement from the list
            for(var r in $scope.requirements){
              if($scope.requirements[r].id === req.id){
                $scope.requirements.splice(r, 1);
                break;
              }
            }
            //No requirement selected
            $scope.selectedReqId = -1;
            UtilityService.showFeedback('DEL_REQ',message.deletedItemText);
          }
        })
        .error(function (error) {
          //This error only catches unknown server errors, usual errorCodes are sent with success message
          console.log(error);
          UtilityService.showFeedback('WARN_REQ_NOT_DEL');
        });
    };


    $scope.confirmDelete = function(object){
      if(AccessToken.get() !== null){
        $scope.deleteElem = 'req';
        $scope.deleteObject = object;
        $scope.deleteDesc = 'DEL_REQ_DESC';
        document.getElementById('confirmDelete').toggle();
      }else{
        UtilityService.showFeedback('LOGIN_REQ_DEL');
      }
    };


    /*
     * Register a listener for the oauth login and if an existing token is still valid
     * */
    $scope.$on('oauth:login', function() {
      UtilityService.showFeedback('WELCOME_BACK');
    });
    $scope.$on('oauth:authorized', function() {
      UtilityService.showFeedback('WELCOME_BACK');
    });
    $scope.$on('oauth:logout', function() {
      UtilityService.showFeedback('LOGOUT');
      //Reload projects, since now the user rights have changed
      reqBazService.getProjects()
        .success(function (projs) {
          $scope.projects = projs;
          if(projs.length !== 0){
            $scope.activeProject = projs[0];
            $scope.selectProj($scope.activeProject);
          }else{
            //Somehow gracefully handle the fact that there are no projects
            UtilityService.showFeedback('NO_PROJ_EXISTS');
          }
        })
        .error(function () {
          UtilityService.showFeedback('WARN_PROJS_NOT_LOADED');
        });
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
  });


