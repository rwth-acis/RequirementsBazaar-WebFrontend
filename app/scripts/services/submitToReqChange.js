'use strict';

/**
 * @ngdoc service
 * @name requirementsBazaarWebFrontendApp.SubmitToReqChange
 * @description The service is used to push updates from the main Ctrl to the individual Requirement Ctrls
 * # SubmitToReqChange
 * Service in the requirementsBazaarWebFrontendApp.
 */
angular.module('requirementsBazaarWebFrontendApp')
  .service('SubmitToReqChange', function SubmitToReqChange($rootScope) {

    this.emit = function(id,height) {
      $rootScope.$emit('selectedReqIdChange',{'val':id, 'height':height});
    };

    this.listen = function(callback) {
      $rootScope.$on('selectedReqIdChange',callback);
    };

  });
