import { RequestParams, Api } from '../types/files-api';
import { User } from 'oidc-client';

const getRequestHeaders = (user: User | null | undefined): RequestParams => {
  if (!user) {
    return {};
  }
  return {
    credentials: 'same-origin',
    headers: {
      'Authorization': `Basic ${window.btoa(`${user.profile.preferred_username}:${user.profile.sub}`)}`,
      'access_token': user.access_token,
      'oidc_provider': 'https://api.learning-layers.eu/o/oauth2',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };
};

export const filesApi = new Api({
  baseUrl: 'https://beta.requirements-bazaar.org/files',
  securityWorker: getRequestHeaders,
});
