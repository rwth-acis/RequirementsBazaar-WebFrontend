import { GetterTree } from 'vuex'
import { State } from './state'
import { Project } from '../types/api';

export type Getters = {
  projectsList(state: State): (parameters: any) => Project[];
  getProjectById(state: State): (id: number) => Project | undefined;
}

export const getters: GetterTree<State, State> & Getters = {

  projectsList: (state) => (parameters) => {
    let projects: Project[] = Object.values(state.projects);

    if (parameters.sort.substring(1) === 'name') {
      projects.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
    }

    projects = projects.filter(project => project.name?.toLowerCase().includes(parameters.search.toLowerCase()));

    return projects.slice(0, parameters.per_page);
  },

  getProjectById: (state) => (id: number) => {
    return state.projects[id];
  }

}
