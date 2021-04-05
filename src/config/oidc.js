export const oidcSettings = {
  authority: 'https://api.learning-layers.eu/o/oauth2',
  clientId: 'c7588efc-f831-4e31-928e-0f46a91fb311',
  redirectUri: 'http://localhost:3000/oidc-callback',
  popupRedirectUri: "http://localhost:3000/oidc-popup-callback",
  responseType: 'id_token token',
  scope: 'openid email profile',
  automaticSilentRenew: true,
  automaticSilentSignin: true, 
};
