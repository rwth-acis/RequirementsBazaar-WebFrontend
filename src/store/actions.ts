import { ActionContext, ActionTree } from 'vuex';
import { Mutations, MutationType } from './mutations';
import { State } from './state';

import { bazaarApi } from '../api/bazaar';

export enum ActionTypes {
  FetchProjects = 'FETCH_PROJECTS',
}

type ActionAugments = Omit<ActionContext<State, State>, 'commit'> & {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
}

export type Actions = {
  [ActionTypes.FetchProjects](context: ActionAugments): void;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const actions: ActionTree<State, State> & Actions = {

  async [ActionTypes.FetchProjects]({ commit }) {
    const response = await bazaarApi.projects.getProjects({ per_page: 20 });
    if (response.data && response.status === 200) {
      commit(MutationType.SetProjects, response.data);
    }
  }

}
