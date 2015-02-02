'use strict';

/**
 * @ngdoc function
 * @name requirementsBazaarWebFrontendApp.directive:contenteditable
 * @description
 * # contenteditable
 * directive of the requirementsBazaarWebFrontendApp
 */
angular.module('requirementsBazaarWebFrontendApp')
  .directive("contenteditable",function(){
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel){

        function read() {
          ngModel.$setViewValue(element.html());
        }

        ngModel.$render = function(){
          element.html(ngModel.$viewValue || '');
        };

        element.bind('blur keyup change', function(){
          scope.$apply(read);
        });
      }
    }

});
