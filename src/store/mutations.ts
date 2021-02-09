import { MutationTree } from 'vuex'
import { State } from './state'

import { Project } from '../types/api';

export enum MutationType {
  SetProjects = 'SET_PROJECTS',
}

export type Mutations = {

  [MutationType.SetProjects](state: State, projects: Project[]): void;

};

export const mutations: MutationTree<State> & Mutations = {
  [MutationType.SetProjects](state, projects) {
    projects.forEach((project) => {
      state.projects[project.id] = project;
    });
    //state.projects = Object.values(projects);
  }
}
