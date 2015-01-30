'use strict';

/**
 * @ngdoc service
 * @name requirementsBazaarWebFrontendApp.UtilityService
 * @description
 * # UtilityService
 * Service in the requirementsBazaarWebFrontendApp.
 */
angular.module('requirementsBazaarWebFrontendApp')
  .service('UtilityService', function UtilityService() {

    /*
     * Shows feedback to the user
     * Called: automatic
     * */
    this.showFeedback = function(viewText, text){
      viewText = text;
      document.getElementById('feedbackToast').show();
    };

    this.isEmpty = function(elem, text){
      if(elem === ''){
        this.showFeedback(text);
        return true;
      }else if(elem === undefined){
        this.showFeedback(text);
        return true;
      }
      else{
        return false;
      }
    };


  });
