export const oidcSettings = {
  authority: 'https://api.learning-layers.eu/o/oauth2',
  clientId: 'c7588efc-f831-4e31-928e-0f46a91fb311',
  redirectUri: `${import.meta.env.VITE_OIDC_CALLBACK_URL}/oidc-callback`,
  popupRedirectUri: `${import.meta.env.VITE_OIDC_CALLBACK_URL}//oidc-popup-callback`,
  responseType: 'id_token token',
  scope: 'openid email profile',
  automaticSilentRenew: true,
  automaticSilentSignin: true,
};
