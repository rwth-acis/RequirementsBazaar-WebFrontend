'use strict';

/**
 * @ngdoc service
 * @name requirementsBazaarWebFrontendApp.HttpErrorHandlingService
 * @description
 * # HttpErrorHandlingService
 * Service in the requirementsBazaarWebFrontendApp.
 */
angular.module('requirementsBazaarWebFrontendApp')
  .service('HttpErrorHandlingService', function HttpErrorHandlingService(UtilityService) {

    /*
     * Checks if the POST was valid
     * */
    this.isSuccess = function(message){
      if (message.hasOwnProperty('errorCode')) {
        if(message.errorCode === 'VALIDATION' || message.errorCode === 'AUTHORIZATION'){
          UtilityService.showFeedback(message.message);
        }else{
          console.log(message.message);
          UtilityService.showFeedback('Unknown error code');
        }
        return false;
      }
      return true;
    };

  });
