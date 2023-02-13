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
      'access-token': user.access_token,
      'oidc_provider': 'https://auth.las2peer.org/o/oauth2',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };
};

export type ProjectMemberRole = "ProjectMember" | "ProjectManager" | "ProjectAdmin";

export type UserVote = "UP_VOTE" | "DOWN_VOTE" | "NO_VOTE";

export const bazaarApi = new Api({
  baseUrl: `${import.meta.env.VITE_BAZAAR_API_URL}`,
  securityWorker: getRequestHeaders,
});

// uses to access production bazaar API from every possible instance
export const prodBazaarApi = new Api({
  baseUrl: `https://requirements-bazaar.org/bazaar`,
  securityWorker: getRequestHeaders,
});
