import { GetterTree } from 'vuex'
import { State } from './state'
import { Project, Category } from '../types/api';

export type Getters = {
  projectsList(state: State): (parameters: any) => Project[]; //TODO: any type
  getProjectById(state: State): (id: number) => Project | undefined;
  categoriesList(state: State): (projectId: number, parameters: any) => Category[];
  getCategoryById(state: State): (id: number) => Category | undefined;
}

export const getters: GetterTree<State, State> & Getters = {

  projectsList: (state) => (parameters) => {
    let projects: Project[] = Object.values(state.projects);

    if (parameters.query.sort.substring(1) === 'name') {
      projects.sort((a, b) => (a.name && b.name) && (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
    }

    projects = projects.filter(project => project.name?.toLowerCase().includes(parameters.query.search.toLowerCase()));

    return projects.slice(0, parameters.query.per_page);
  },

  getProjectById: (state) => (id: number) => {
    return state.projects[id];
  },

  categoriesList: (state) => (projectId, parameters) => {
    let categories: Category[] = Object.values(state.categories).filter(category => (category.projectId === projectId));

    if (parameters.query.sort.substring(1) === 'name') {
      categories.sort((a, b) => (a.name && b.name) && (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
    }

    categories = categories.filter(category => category.name?.toLowerCase().includes(parameters.query.search.toLowerCase()));

    return categories.slice(0, parameters.query.per_page);
  },

  getCategoryById: (state) => (id: number) => {
    return state.categories[id];
  },

}
