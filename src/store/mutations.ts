import { MutationTree } from 'vuex'
import { State } from './state'

import { Project, Category } from '../types/api';

export enum MutationType {
  SetProjects = 'SET_PROJECTS',
  SetProject = 'SET_PROJECT',
  SetCategories = 'SET_CATEGORIES',
  SetCategory = 'SET_CATEGORY',
}

export type Mutations = {
  [MutationType.SetProjects](state: State, projects: Project[]): void;
  [MutationType.SetProject](state: State, project: Project): void;
  [MutationType.SetCategories](state: State, categories: Category[]): void;
  [MutationType.SetCategory](state: State, category: Category): void;
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

  [MutationType.SetCategories](state, categories) {
    categories.forEach((category) => {
      if (category.id) {
        state.categories[category.id] = category;
      }
    });
  },

  [MutationType.SetCategory](state, category) {
    if (category.id) {
      state.categories[category.id] = category;
    }
  },

}
