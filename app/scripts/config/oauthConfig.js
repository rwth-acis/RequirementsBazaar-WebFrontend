'use strict';

angular.module('requirementsBazaarWebFrontendApp')
  .constant( 'oauthConfig', {
    'SITE' : 'https://api.learning-layers.eu/o/oauth2',
    'CLIENT_ID' : 'c7588efc-f831-4e31-928e-0f46a91fb311',
    'DATA_SCOPE' : 'openid email profile',
    'REDIRECT_URI' : location.origin+location.pathname,
    'PROFILE_URI' : 'https://api.learning-layers.eu/o/oauth2/userinfo',
    'SCOPE' : 'public',
    'TEMPLATE' : location.origin+location.pathname + 'my-components/sign-in-button.html'
  })

  // Make the oauth config available in the HTML
  .run(function ($rootScope, oauthConfig) {
    $rootScope.oauthSite = oauthConfig.SITE;
    $rootScope.oauthClientId = oauthConfig.CLIENT_ID;
    $rootScope.oauthDataScope = oauthConfig.DATA_SCOPE;
    $rootScope.oauthRedirectURI = oauthConfig.REDIRECT_URI;
    $rootScope.oauthProfileURI = oauthConfig.PROFILE_URI;
    $rootScope.oauthScope = oauthConfig.SCOPE;
    $rootScope.oauthTemplateURI = oauthConfig.TEMPLATE;
  });

