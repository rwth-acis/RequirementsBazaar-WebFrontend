'use strict';

/**
 * @ngdoc service
 * @name requirementsBazaarWebFrontendApp.AuthorizationService
 * @description
 * # AuthorizationService
 * Service in the requirementsBazaarWebFrontendApp.
 */
angular.module('requirementsBazaarWebFrontendApp')
  .service('AuthorizationService', function AuthorizationService(UtilityService) {

    /*
     * Checks if the user is logged in
     * */
    this.isAuthorized = function(message){
      if (message.hasOwnProperty('errorCode')) {
        if(message.errorCode === 'AUTHORIZATION'){
          UtilityService.showFeedback(message.message);
        }else{
          console.log(message.message);
          UtilityService.showFeedback('Error occurred, unknown reasons !');
        }
        return false;
      }
      return true;
    };

  });
