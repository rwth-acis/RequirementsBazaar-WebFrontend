'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:CreateComponentCtrl
 * @description
 * # CreateComponentCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('CreateComponentCtrl', function ($scope, reqBazService, UtilityService) {

    $scope.name = '';
    $scope.desc = '';

    /*
     * Submit a new component
     * */
    $scope.submitComponent = function(){
      if(!UtilityService.isEmpty($scope.name,'Provide a name for the component')) {
        console.log('submit new component');
        var comp = {description: $scope.desc, name: $scope.name, leaderId: 1, projectId: $scope.activeProject.id};
        reqBazService.createComponent($scope.activeProject.id,comp)
          .success(function (message) {
            console.log(message);
            if(message.hasOwnProperty('errorCode')){
              UtilityService.showFeedback('Warning: Component was not created !');
            }else {
              UtilityService.showFeedback('Component was created');
              comp.id = message.id;

              //The component is added to be the first element and will be active
              $scope.activeComponent = comp;
              $scope.components.splice(0, 0, $scope.activeComponent);
              $scope.selectComp($scope.activeComponent);
              $scope.clearComponentSubmit();
            }
          })
          .error(function (error) {
            console.log(error);
            UtilityService.showFeedback('Warning: Component was not created !');
          });
      }
    };

    /*
     * Clear the input fields
     * */
    $scope.clearSubmit = function(){
      $scope.name = '';
      $scope.desc = '';
      $scope.$parent.showCreateCompDiv = false;
    };
  });
