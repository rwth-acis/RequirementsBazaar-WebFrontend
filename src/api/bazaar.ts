import { RequestParams, Api } from '../types/bazaar-api';
import { User } from 'oidc-client';

const getRequestHeaders = (user: User | null | undefined): RequestParams => {
  if (!user) {
    return {};
  }
  return {
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${window.btoa(`${user.profile.preferred_username}:${user.profile.sub}`)}`,
      'access_token': user.access_token,
      'oidc_provider': 'https://api.learning-layers.eu/o/oauth2',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };
};

export const bazaarApi = new Api({
  baseUrl: `${import.meta.env.VITE_BAZAAR_API_URL}`,
  //baseUrl: 'http://localhost:8080/bazaar',
  securityWorker: getRequestHeaders,
});
