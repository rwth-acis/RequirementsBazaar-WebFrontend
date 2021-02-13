import { ActionContext, ActionTree } from 'vuex';
import { Mutations, MutationType } from './mutations';
import { State } from './state';

import { bazaarApi } from '../api/bazaar';

export enum ActionTypes {
  FetchProjects = 'FETCH_PROJECTS',
  FetchProject = 'FETCH_PROJECT',
  FetchCategoriesOfProject = 'FETCH_CATEGORIES',
  FetchCategory = 'FETCH_CATEGORY',
}

type ActionAugments = Omit<ActionContext<State, State>, 'commit'> & {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
}

type ProjectsRequestParameters = {
  query?: {
    page?: number;
    per_page?: number;
    search?: string;
    sort?: ("name" | "date" | "last_activity" | "requirement" | "follower")[];
    filters?: ("all" | "created" | "following" | "contributed")[];
    ids?: number[];
  },
}

type CategoriesRequestParameters = {
  projectId: number,
  query?: {
    page?: number;
    per_page?: number;
    search?: string;
    sort?: ("name" | "date" | "last_activity" | "requirement" | "follower")[];
  },
}

export type Actions = {
  [ActionTypes.FetchProjects](context: ActionAugments, payload: ProjectsRequestParameters): void;
  [ActionTypes.FetchProject](context: ActionAugments, id: number): void;
  [ActionTypes.FetchCategoriesOfProject](context: ActionAugments, payload: CategoriesRequestParameters): void;
  [ActionTypes.FetchCategory](context: ActionAugments, id: number): void;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const actions: ActionTree<State, State> & Actions = {

  async [ActionTypes.FetchProjects]({ commit }, parameters) {
    const response = await bazaarApi.projects.getProjects(parameters.query);
    if (response.data && response.status === 200) {
      commit(MutationType.SetProjects, response.data);
    }
  },

  async [ActionTypes.FetchProject]({ commit }, id) {
    const response = await bazaarApi.projects.getProject(id);
    if (response.data && response.status === 200) {
      commit(MutationType.SetProject, response.data);
    }
  },

  async [ActionTypes.FetchCategoriesOfProject]({ commit }, parameters) {
    const response = await bazaarApi.projects.getCategoriesForProject(parameters.projectId, parameters.query);
    if (response.data && response.status === 200) {
      commit(MutationType.SetCategories, response.data);
    }
  },

  async [ActionTypes.FetchCategory]({ commit }, id) {
    const response = await bazaarApi.categories.getCategory(id);
    if (response.data && response.status === 200) {
      commit(MutationType.SetCategory, response.data);
    }
  },

}
