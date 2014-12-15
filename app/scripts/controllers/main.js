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

    $scope.projects = null;
    $scope.components = null;
    $scope.requirements = null;
    $scope.activeUser = {id : '1', firstname : 'Kristjan', lastname : 'Liiva', email : 'liiva@web.com', admin : 'true', Las2PeerId :'000', username : 'KristjanLiiva'};

    $scope.projectLeader = null;
    $scope.componentLeader = null;

    $scope.activeProject = null;
    $scope.activeComponent = null;

    $scope.warningText = 'Confirm deletion !';
    $scope.warningVisible = false;

    //init functions that need to be run when the user enters the page
    function getProjects(){
      reqBazService.getProjects()
        .success(function (projs) {
          $scope.projects = projs;
          $scope.activeProject = $scope.projects[0];
          $scope.selectProj($scope.activeProject);

        })
        .error(function (error) {
          $scope.status = 'Unable to load customer data: ' + error.message;
        });
    }

    //Is called when the user selects a new project
    $scope.selectProj = function (project) {
      $scope.activeProject = project;

      reqBazService.getComponents($scope.activeProject.id,'0','30')
        .success(function (comps) {
          $scope.components = comps;
          $scope.activeComponent = $scope.components[0];
          console.log($scope.activeComponent);
          $scope.selectComp($scope.activeComponent);
        })
        .error(function (error) {
          $scope.status = 'ERROR: ' + error.message;
        });
    };

    //Is called when the user has selected a different component
    $scope.selectComp = function (component) {
      $scope.activeComponent = component;
      getUser($scope.activeComponent.leaderId,'component');
      console.log('get requirements for projectID: '+$scope.activeProject.id+' and componentID: '+$scope.activeComponent.id);
      reqBazService.getRequirementsByComponent($scope.activeProject.id,$scope.activeComponent.id)
        .success(function (reqs) {
          $scope.requirements = reqs;
          console.log($scope.requirements);
        })
        .error(function (error) {
          $scope.status = 'ERROR: ' + error.message;
        });
    };

    //Queries for users
    function getUser(id,purpose){
      reqBazService.getUser(id)
        .success(function (user) {
          if(purpose === 'component'){
            $scope.componentLeader = user;
          }else if(purpose === 'project'){
            $scope.projectLeader = user;
          }else{

          }
        })
        .error(function (error) {
          console.log(error.message);
          $scope.status = 'ERROR: ' + error.message;
        });
    }

    //Call the init functions
    getProjects();

    $scope.toggle = function(clickEvent,index) {
      console.log(index);
      var collapse = clickEvent.target.nextElementSibling;

      if(collapse.getAttribute('data-visible') === 'false'){
        console.log('opened requirement');
        collapse.setAttribute('data-visible', 'true');

        //Get all the missing pieces of information, like leader, follower, votes

      }else{
        collapse.setAttribute('data-visible', 'false');
      }

      //toggle visibility of the requirement
      collapse.toggle();
    };

    $scope.toggleAttachments = function(clickEvent) {
      console.log('toggle attachments');
    };
    $scope.toggleComments = function(clickEvent) {
      console.log('toggle comments');
    };


    //Creates a new component
    $scope.showCreateCompDiv = false;
    $scope.newCompName = '';
    $scope.newCompDesc = '';
    $scope.submitNewComponent = function(){
      if($scope.newCompName !== ''){
        console.log('submit new component');
        //TODO leaderId is not used, as there is no user management yet
        var component = {description: $scope.newCompDesc, name: $scope.newCompName, leaderId: 1, projectId: $scope.activeProject.id};
        reqBazService.createComponent($scope.activeProject.id,component)
          .success(function (message) {
            console.log(message);
            //TODO add the new component to the $scope.component and then set everything to default
            $scope.clearComponentSubmit();
          })
          .error(function (error) {
            console.log(error.message);
            alert('Something went wrong, please try again');
          });
      }else{
        console.log('Input field empty');
        //TODO Show toast
      }
    };
    $scope.clearComponentSubmit = function(){
      $scope.newCompName = '';
      $scope.newCompDesc = '';
      $scope.showCreateCompDiv = false;
    };
    $scope.initDeleteComponent = function () {
      $scope.warningText = 'Confirm deleting the component !';
      $scope.warningVisible = true;
    };
    $scope.cancelDeleteComponent = function(){
      $scope.warningText = 'Confirm deletion !';
      $scope.warningVisible = false;
    };
    $scope.deleteComponent = function(){
      $scope.warningText = 'Confirm deletion !';
      $scope.warningVisible = false;
      reqBazService.deleteComponent($scope.activeProject.id,$scope.activeComponent.id)
        .success(function (message) {
          console.log(message);
          for(var i = 0; i<$scope.components.length;i++){
            if($scope.components[i].id === $scope.activeComponent.id){
              $scope.components.splice(i, 1);
              break;
            }
          }
          $scope.activeComponent = null;
          if($scope.components !== null){
            $scope.activeComponent = $scope.components[0];
          }
        })
        .error(function (error) {
          console.log(error.message);
          alert('Could not delete, please try again');
        });
    };

    //Creating a requirement
    $scope.showCreateReqDiv = false;
    $scope.newReqName = '';
    $scope.newReqDesc = '';
    $scope.submitNewReq = function(){
      if($scope.newReqName !== '' && $scope.newReqDesc !== ''){
        console.log('submit requirement');
        var requirement = {title: $scope.newReqName, description: $scope.newReqDesc, projectId: $scope.activeProject.id, leadDeveloperId : 1, creatorId : 1};

        console.log($scope.activeProject.id);
        console.log($scope.activeComponent.id);
        console.log(requirement);
        reqBazService.createRequirement($scope.activeProject.id,$scope.activeComponent.id,requirement)
          .success(function (message) {
            console.log(message);
          })
          .error(function (error) {
            console.log(error.message);
          });

        $scope.showCreateReqDiv = false;
        //this.createRequirement = function(projectId, componentId, requirement){
        //  var reqUrl = url + 'projects/' + projectId + '/components/' + componentId + '/requirements';
        //  return $http.post(reqUrl, requirement);
        //};

      }else{
        console.log('Input field empty');
        //TODO Show toast
      }
    };
    $scope.clearReqSubmit = function(){
      $scope.newReqName = '';
      $scope.newReqDesc = '';
      $scope.showCreateReqDiv = false;
    };




    $scope.signOut = function(){
      window.alert('TODO sign out');
    };

    $scope.editProfile = function(){
      window.alert('TODO');
    };


  });


