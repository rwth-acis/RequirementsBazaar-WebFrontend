'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.directive:contenteditable
 * @description
 * # contenteditable
 * directive of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .directive('fallbackSrc', function () {
  var fallbackSrc = {
    link: function postLink(scope, iElement, iAttrs) {
      iElement.bind('error', function() {
        angular.element(this).attr("src", iAttrs.fallbackSrc);
      });
    }
  };
  return fallbackSrc;
});
