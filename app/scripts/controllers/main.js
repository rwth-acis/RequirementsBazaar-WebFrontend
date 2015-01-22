'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
    .controller('MainCtrl', function ($scope, reqBazService) {

    //Index which requirement in the list is selected
    $scope.selectedIndex = -1;

    $scope.projects = null;
    $scope.components = null;
    $scope.requirements = null;
    $scope.activeUser = {id : '2', firstname : 'Max2', lastname : 'Mustermann2', email : 'Max@Mustermann2.de', admin : 'true', Las2PeerId :'2'};

    $scope.projectLeader = null;
    $scope.componentLeader = null;

    $scope.activeProject = null;
    $scope.activeComponent = null;

    //Variables for confirming deleting a object
    $scope.confirmationDesc = 'The action cannot be undone !';

    //In case loading requirements/components fails, show a reload button
    $scope.reloadRequirements = false;
    $scope.reloadComponents = false;

    //Only one toast is used for feedback, toastText holds the description
    $scope.toastText = '';

    //Is used to identify what needs to be deleted after used confirmed it. project, component etc
    var confirmDeletionObject = '';

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
          $scope.showFeedback('Could not load projects, please reload !');
        });
    })();

    /*
    * Switches the active project and loads components belonging to it
    * Called: User selects a new project or reloads components
    * */
    $scope.selectProj = function (project) {
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
          $scope.selectedIndex = -1;
          $scope.showFeedback('Could not load components');

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
              $scope.showFeedback( 'This component has no requirements, feel free to create');
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
                $scope.requirements[i].comments = [];
                $scope.requirements[i].components = [];
              }
            }
        })
        .error(function () {
          //Null the list, otherwise user will see wrong requirements
          $scope.requirements = null;
          $scope.selectedIndex = -1;
          $scope.showFeedback('Could not load requirements');

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
          $scope.showFeedback('Could not load user for: '+purpose);
        });
    }

    /*
    * Toggles the visibility of a requirements
    * Called: user clicks on the requirement
    * */
    $scope.toggleRequirement = function(clickEvent,req) {
      var collapse = clickEvent.target.parentNode.nextElementSibling;
      if(collapse.getAttribute('data-visible') === 'false'){
        console.log('opened requirement');
        collapse.setAttribute('data-visible', 'true');
        //Get all the missing pieces of information, like leader, follower, votes
        reqBazService.getRequirement(req.id)
          .success(function (requirement) {
            console.log(requirement);
            req.creator = requirement.creator;
            req.attachments = requirement.attachments;
            req.components = requirement.components;
            req.leadDeveloper = requirement.leadDeveloper;
            req.followers = requirement.followers;
            req.developers = requirement.developers;
            req.contributors = requirement.contributors;
          })
          .error(function () {
            $scope.showFeedback('Warning: the requirement was not loaded !');
          });
      }else{
        collapse.setAttribute('data-visible', 'false');
      }

      //toggle visibility of the requirement
      collapse.toggle();
    };


    /*
     * Everything related to creating or deleting a project
     *
     * */

    $scope.showCreateProjectDiv = false;
    $scope.newProjectName = '';
    $scope.newProjectDesc = '';
    $scope.submitProject = function(){
      if($scope.newProjectName !== '' && $scope.newProjectDesc !== ''){
        console.log('submit new project');
        var project = {description: $scope.newProjectDesc, name: $scope.newProjectName, visibility: 'PUBLIC', leaderId: 1};
        reqBazService.createProject(project)
          .success(function (message) {
            console.log(message);
            if(message.id === 'undefined'){
              $scope.showFeedback('Warning: Project was not created !');
            }else {
              $scope.showFeedback('Project was created');

              //The project is added to be the first element and will be active
              project.id = message.id;
              $scope.activeProject = project;
              $scope.projects.splice(0, 0, $scope.activeProject);
              $scope.selectProj($scope.activeProject);
              $scope.clearProjectSubmit();
            }
          })
          .error(function (error) {
            console.log(error);
            $scope.showFeedback('Warning: Project was not created !');
          });
      }else{
        $scope.showFeedback('Provide a name & description for the Project');
      }
    };
    $scope.clearProjectSubmit = function(){
      $scope.newProjectName = '';
      $scope.newProjectDesc = '';
      $scope.showCreateProjectDiv = false;
    };
    $scope.initDeleteProject = function(){
      $scope.confirmationDesc = 'The action cannot be undone. Deleting a project also removes all components and requirements !';
      confirmDeletionObject = 'project';
      document.getElementById('confirmationDialog').toggle();
    };
    $scope.deleteProject = function(){
      console.log('delete project confirmed');
      //TODO delete the project
      $scope.showFeedback('This feature is currently under discussion');
    };


    /*
    * Everything related to creating or deleting a new component
    *
    * */

    //Creates a new component
    $scope.showCreateCompDiv = false;
    $scope.newCompName = '';
    $scope.newCompDesc = '';
    $scope.submitNewComponent = function(){
      if($scope.newCompName !== ''){
        console.log('submit new component');
        var component = {description: $scope.newCompDesc, name: $scope.newCompName, leaderId: 1, projectId: $scope.activeProject.id};
        reqBazService.createComponent($scope.activeProject.id,component)
          .success(function (message) {
            console.log(message);
            if(message.id === 'undefined'){
              $scope.showFeedback('Warning: Component was not created !');
            }else {
              $scope.showFeedback('Component was created');

              //The component is added to be the first element and will be active
              component.id = message.id;
              $scope.activeComponent = component;
              $scope.components.splice(0, 0, $scope.activeComponent);
              $scope.selectComp($scope.activeComponent);
              $scope.clearComponentSubmit();
            }
          })
          .error(function (error) {
            console.log(error);
            $scope.showFeedback('Warning: Component was not created !');
          });
      }else{
        $scope.showFeedback('Provide a name & description for the component');
      }
    };
    $scope.clearComponentSubmit = function(){
      $scope.newCompName = '';
      $scope.newCompDesc = '';
      $scope.showCreateCompDiv = false;
    };
    $scope.initDeleteComponent = function () {
      $scope.confirmationDesc = 'The action cannot be undone. The requirements will be accessible under the default component.';
      confirmDeletionObject = 'component';
      document.getElementById('confirmationDialog').toggle();
    };
    $scope.deleteComponent = function(){
      reqBazService.deleteComponent($scope.activeProject.id,$scope.activeComponent.id)
        .success(function (message) {
          console.log(message);
          if(message.success !== 'true'){
            $scope.showFeedback('Warning: Component was not deleted !');
          }else {
            for (var i = 0; i < $scope.components.length; i++) {
              if ($scope.components[i].id === $scope.activeComponent.id) {
                $scope.components.splice(i, 1);
                break;
              }
            }
            $scope.activeComponent = null;
            if ($scope.components !== null) {
              $scope.activeComponent = $scope.components[0];
            }
            $scope.showFeedback('Component deleted');
          }
        })
        .error(function (error) {
          console.log(error);
          $scope.showFeedback('Warning: Component was not deleted !');
        });
    };


    /*
     * Everything related to creating or deleting a new requirement
     *
     * */

    //Creating a requirement
    $scope.showCreateReqDiv = false;
    $scope.newReqName = '';
    $scope.newReqDesc = '';
    $scope.submitReq = function(){
      if($scope.newReqName !== '' && $scope.newReqDesc !== ''){
        console.log('submit requirement');
        var requirement = {title: $scope.newReqName, description: $scope.newReqDesc, projectId: $scope.activeProject.id, leadDeveloperId : 1, creatorId : 1};
        reqBazService.createRequirement($scope.activeProject.id,$scope.activeComponent.id,requirement)
          .success(function (message) {
            console.log(message);
            if(message.id === 'undefined'){
              $scope.showFeedback('Warning: Requirement was not created !');
            }else{
              $scope.showFeedback('Requirement was created');

              //Add missing values to the newly created requirement
              requirement.id = message.id;
              requirement.creator = {firstName : 'loading'};
              requirement.leadDeveloper = {firstName : 'loading'};
              requirement.followers = [];
              requirement.developers = [];
              requirement.contributors = [];
              requirement.attachments = [];
              requirement.comments = [];
              requirement.components = [];

              //Add the requirement to the first position
              $scope.requirements.splice(0, 0, requirement);
              $scope.clearReqSubmit();
            }
          })
          .error(function (error) {
            //This error only catches unknown server errors, usual errorCodes are sent with success message
            console.log(error);
            $scope.showFeedback('Warning: Requirement was not created !');
          });

        $scope.showCreateReqDiv = false;
      }else{
        $scope.showFeedback('Provide a name & description for the requirement');
      }
    };
    $scope.clearReqSubmit = function(){
      $scope.newReqName = '';
      $scope.newReqDesc = '';
      $scope.showCreateReqDiv = false;
    };
    $scope.deleteRequirement = function(req){
      console.log('delete requirement');
      reqBazService.deleteRequirement(req.id)
        .success(function (message) {
          if(message.success !== 'true'){
            $scope.showFeedback('Warning: Requirement was not deleted');
          }else{
            // Delete the removed requirement from the list
            for(var i = 0; i<$scope.requirements.length;i++){
              if($scope.requirements[i].id === req.id){
                $scope.requirements.splice(i, 1);
                break;
              }
            }
            $scope.showFeedback('Requirement deleted');
          }
        })
        .error(function (error) {
          //This error only catches unknown server errors, usual errorCodes are sent with success message
          console.log(error);
          $scope.showFeedback('Warning: Requirement was not deleted');
        });
    };



    /*
    * Confirmation dialog switch. Only one is used so a variable manages what is currently being deleted
    * Called: When the user confirms to delete an element
    * */
    $scope.confirmDelete = function(){
      if(confirmDeletionObject === 'project'){
        confirmDeletionObject = '';
        $scope.deleteProject();
      }
      if(confirmDeletionObject === 'component'){
        confirmDeletionObject = '';
        $scope.deleteComponent();
      }
    };

    /*
    * Shows or hides additional requirement functions
    * Called: User clicks more-vert on requirement
    * */
    $scope.showMoreClicked = function ($index) {
      if($scope.selectedIndex === $index){
        $scope.selectedIndex = -1;
      }else{
        $scope.selectedIndex = $index;
      }
    };


    /*
    * Shows feedback to the user
    * Called: automatic
    * */
    $scope.showFeedback = function(text){
      $scope.toastText = text;
      document.getElementById('feedbackToast').show();
    };

    /**
     *
     * Function calls that currently don't do anything or don't work
     *
     */
    //Become a follower of a requirement
    $scope.followRequirement = function(clickEvent,req){
      console.log('become follower');
      reqBazService.addUserToFollowers(req.id)
        .success(function (message) {
          console.log(message);
        })
        .error(function (error) {
          console.log(error);
          $scope.toastText = 'Warning: could not register as a follower';
          document.getElementById('feedbackToast').show();
        });
    };


  });


