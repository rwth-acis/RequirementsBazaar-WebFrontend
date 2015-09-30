'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.directive:fallbackSrc
 * @description
 * # fallbackSrc
 * directive of the requirementsBazaarWebFrontendApp
 *
 * If a src of an image is not successfully set then a fallback source is used instead.
 *
 */
angular.module('requirementsBazaarWebFrontendApp')
  .directive('fallbackSrc', function () {
  return {
    link: function postLink(scope, iElement, iAttrs) {
      iElement.bind('error', function() {
        angular.element(this).attr('src', iAttrs.fallbackSrc);
      });
    }
  }
});
