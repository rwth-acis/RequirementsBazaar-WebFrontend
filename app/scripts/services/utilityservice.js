'use strict';

/**
 * @ngdoc service
 * @name requirementsBazaarWebFrontendApp.UtilityService
 * @description
 * # UtilityService
 * Service in the requirementsBazaarWebFrontendApp.
 */
angular.module('requirementsBazaarWebFrontendApp')
  .service('UtilityService', function UtilityService($translate) {

    /*
     * Shows feedback to the user
     * Called: automatic
     * */
    this.showFeedback = function(text, param){
      var toast = document.querySelector('#feedbackToast');
      if(toast.show === undefined){
        // Needed because toast is actually not loaded, no idea how to wait for the event
        // document.readyState === "complete" did not help
        setTimeout(function() {
          toast.text = (param !== undefined) ? $translate.instant(text) + param : $translate.instant(text);
          toast.show();
        }, 3000);
      }else{
        toast.text = (param !== undefined) ? $translate.instant(text) + param : $translate.instant(text);
        toast.show();
      }
    };

    this.isEmpty = function(elem, text){
      if(elem === '' || elem === undefined){
        this.showFeedback(text);
        return true;
      } else{
        return false;
      }
    };


  });
