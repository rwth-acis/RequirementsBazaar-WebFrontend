import { GetterTree } from 'vuex'
import { State } from './state'
import { Project } from '../types/api';

export type Getters = {
  projectsList(state: State): Project[];
  getProjectById(state: State): (id: number) => Project | undefined;
}

export const getters: GetterTree<State, State> & Getters = {

  projectsList: (state) => {
    return Object.values(state.projects);
  },

  getProjectById: (state) => (id: number) => {
    return state.projects[id];
  }

}
