import {
  createStore,
  Store as VuexStore,
  CommitOptions,
  DispatchOptions,
  createLogger
} from 'vuex';
import { vuexOidcCreateStoreModule } from 'vuex-oidc';

import { State, state } from './state';
import { Mutations, mutations } from './mutations';
import { Actions, actions } from './actions';
import { Getters, getters } from './getters';

import { oidcSettings } from '../config/oidc';
import { bazaarApi } from '../api/bazaar';
import { router } from '../router';

const debug = process.env.NODE_ENV !== 'production';

export const store = createStore<State>({
  strict: debug,
  plugins: debug ? [createLogger()] : [],
  state,
  mutations,
  actions,
  getters,
  modules: {
    oidcStore: vuexOidcCreateStoreModule(
      oidcSettings,
      {
        namespaced: true,
        dispatchEventsOnWindow: true,
        isPublicRoute: (route) => {
          if (route.meta && route.meta.isPrivate) {
            return false;
          }
          return true;
        },
      },
      {
        userLoaded: (user) => {
          console.log('OIDC user is loaded:', user);
          bazaarApi.setSecurityData(user);
        },
        userUnloaded: () => {
          console.log('OIDC user is unloaded');
          console.log(router);
          if (router.currentRoute.value.name === 'Home') {
            router.push({ name: 'landing' });
          }
        },
        accessTokenExpiring: () => console.log('Access token will expire'),
        accessTokenExpired: () => console.log('Access token did expire'),
        silentRenewError: () => console.log('OIDC user is unloaded'),
        userSignedOut: () => console.log('OIDC user is signed out'),
        oidcError: (payload) => console.log('OIDC error', payload),
        automaticSilentRenewError: (payload) => console.log('OIDC automaticSilentRenewError', payload),
      },
    ),
  },
});

// export function useStore() {
//   return store as Store
// }

export type Store = Omit<
  VuexStore<State>,
  'getters' | 'commit' | 'dispatch'
> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>;
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload?: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>;
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>
  };
}
