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
    * The API already has explanation for errors, just display it
    * */
    this.handleError = function (message,httpStatus) {
      //Currently I am just showing the error message that is sent by server, so the switch is kinda useless.
      switch (httpStatus){
        case '401':
          UtilityService.showFeedback(message.message);
          break;
        default :
          UtilityService.showFeedback(message.message);
          break;
      }
    }

  });
