'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .controller('AboutCtrl', function ($scope, reqBazService) {
    $scope.projects;
    $scope.components;
    $scope.requirements;

    $scope.sel_projectId;
    $scope.sel_componentId;

    $scope.status = '';

    getProjects();

    function getProjects(){
      reqBazService.getProjects()
        .success(function (projs) {
          $scope.projects = projs;
        })
        .error(function (error) {
          $scope.status = 'Unable to load customer data: ' + error.message;
        });
    }

    $scope.selectProj = function (projId) {
      $scope.sel_componentId = '';
      $scope.requirements = [];
      $scope.sel_projectId = projId;


      reqBazService.getComponents(projId)
        .success(function (comps) {
          $scope.components = comps;
        })
        .error(function (error) {
          $scope.status = 'ERROR: ' + error.message;
        });
    };

    $scope.selectComp = function (compId) {
      $scope.sel_componentId = compId;

      reqBazService.getRequirementsByComponent($scope.sel_projectId,compId)
        .success(function (reqs) {
          $scope.requirements = reqs;
        })
        .error(function (error) {
          $scope.status = 'ERROR: ' + error.message;
        });
    };

  });
