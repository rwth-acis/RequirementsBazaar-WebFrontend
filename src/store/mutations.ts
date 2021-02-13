import { MutationTree } from 'vuex'
import { State } from './state'

import { Project } from '../types/api';

export enum MutationType {
  SetProjects = 'SET_PROJECTS',
  SetProject = 'SET_PROJECT',
}

export type Mutations = {
  [MutationType.SetProjects](state: State, projects: Project[]): void;
  [MutationType.SetProject](state: State, project: Project): void;
};

export const mutations: MutationTree<State> & Mutations = {

  [MutationType.SetProjects](state, projects) {
    projects.forEach((project) => {
      if (project.id) {
        state.projects[project.id] = project;
      }
    });
  },

  [MutationType.SetProject](state, project) {
    if (project.id) {
      state.projects[project.id] = project;
    }
  },

}
