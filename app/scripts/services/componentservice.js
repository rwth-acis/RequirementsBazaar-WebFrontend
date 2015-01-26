'use strict';

/**
 * @ngdoc service
 * @name requirementsBazaarWebFrontendApp.ComponentService
 * @description
 * # ComponentService
 * Service in the requirementsBazaarWebFrontendApp.
 */
angular.module('requirementsBazaarWebFrontendApp')
  .service('ComponentService', function ComponentService($rootScope, $q, reqBazService) {
    this.createComponent = function(desc, name, projectId){
      var deferred = $q.defer();
      var promise = deferred.promise;

      var component = {description: desc, name: name, leaderId: 1, projectId: projectId};
      reqBazService.createComponent(projectId,component)
        .success(function (message) {
          console.log(message);
          if(message.hasOwnProperty('errorCode')){
            $rootScope.showFeedback('Warning: Component was not created !');
            deferred.reject();
          }else {
            $rootScope.showFeedback('Component was created');
            component.id = message.id;
            deferred.resolve(component);
          }
        })
        .error(function (error) {
          console.log(error);
          $rootScope.showFeedback('Warning: Component was not created !');
          deferred.reject();
        });

      return promise;
    };

    this.deleteComponent = function(projectId, componentId,components){
      var deferred = $q.defer();
      var promise = deferred.promise;

      reqBazService.deleteComponent(projectId,componentId)
        .success(function (message) {
          console.log(message);
          if(message.success !== 'true'){
            $rootScope.showFeedback('Warning: Component was not deleted !');
            deferred.reject();
          }else {
            for (var i = 0; i < components.length; i++) {
              if (components[i].id === componentId) {
                components.splice(i, 1);
                break;
              }
            }

            $rootScope.showFeedback('Component deleted');
            deferred.resolve(components);
          }
        })
        .error(function (error) {
          console.log(error);
          $rootScope.showFeedback('Warning: Component was not deleted !');
          deferred.reject();
        });

      return promise;
    };

  });
