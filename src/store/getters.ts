import { GetterTree } from 'vuex'
import { State } from './state'
import { Project, Category, Requirement, Comment } from '../types/api';

export type Getters = {
  projectsList(state: State): (parameters: any) => Project[]; //TODO: any type, replace by types in actions.ts!?
  getProjectById(state: State): (id: number) => Project | undefined;
  categoriesList(state: State): (projectId: number, parameters: any) => Category[];
  getCategoryById(state: State): (id: number) => Category | undefined;
  requirementsList(state: State): (requirementId: number, parameters: any) => Requirement[];
  getRequirementById(state: State): (id: number) => Requirement | undefined;
  commentsList(state: State): (requirementId: number, parameters: any) => Comment[];
}

export const getters: GetterTree<State, State> & Getters = {

  projectsList: (state) => (parameters) => {
    let projects: Project[] = Object.values(state.projects);

    const sortAscending = parameters.sort.charAt(0) === '+';
    const sortArgument = parameters.sort.substring(1);
    // first, sort alphabetically in all cases
    projects.sort((a, b) => {
      if (a['name'] && b['name']) {
        const compare = a['name'].localeCompare(b['name'], undefined, {numeric: true, sensitivity: 'base'});
        return compare;
      }
      return 0;
    });
    if ((sortArgument === 'name') && !sortAscending) {
      projects.reverse();
    }
    // then sort according to sort argument
    if (sortArgument === 'requirement') {
      projects.sort((a, b) => {
        if (a.numberOfRequirements !== undefined && b.numberOfRequirements !== undefined) {
          const compare = (b.numberOfRequirements - a.numberOfRequirements) * (sortAscending ? -1 : 1);
          return compare;
        }
        return 0;
      });
    } else if (sortArgument === 'follower') {
      projects.sort((a, b) => {
        if (a.numberOfFollowers !== undefined && b.numberOfFollowers !== undefined) {
          const compare = (b.numberOfFollowers - a.numberOfFollowers) * (sortAscending ? -1 : 1);
          return compare;
        }
        return 0;
      });
    }

    projects = projects.filter(project => project.name?.toLowerCase().includes(parameters.search.toLowerCase()));

    return projects;//.slice(0, parameters.per_page);
  },

  getProjectById: (state) => (id: number) => {
    return state.projects[id];
  },

  categoriesList: (state) => (projectId, parameters) => {
    let categories: Category[] = Object.values(state.categories).filter(category => (category.projectId === projectId));

    if (parameters.sort.substring(1) === 'name') {
      categories.sort((a, b) => (a.name && b.name) && (a.name.localeCompare(b.name, undefined, {numeric: true, sensitivity: 'base'}) > 0) ? 1 : -1);
    }

    categories = categories.filter(category => category.name?.toLowerCase().includes(parameters.search.toLowerCase()));

    return categories.slice(0, parameters.per_page);
  },

  getCategoryById: (state) => (id: number) => {
    return state.categories[id];
  },

  requirementsList: (state) => (categoryId, parameters) => {
    // filter all requirements who have a category object with id equaling the requested categoryId
    let requirements: Requirement[] = Object.values(state.requirements).filter(requirement => (requirement.categories.some(c => c.id === categoryId)));

    const sortAscending = parameters.sort.charAt(0) === '+';
    const sortArgument = parameters.sort.substring(1);
    // first, sort alphabetically in all cases
    requirements.sort((a, b) => {
      if (a['name'] && b['name']) {
        const compare = a['name'].localeCompare(b['name'], undefined, {numeric: true, sensitivity: 'base'});
        return compare;
      }
      return 0;
    });
    if ((sortArgument === 'name') && !sortAscending) {
      requirements.reverse();
    }
    // then sort according to sort argument
    if (sortArgument === 'comment') {
      requirements.sort((a, b) => {
        if (a.numberOfComments !== undefined && b.numberOfComments !== undefined) {
          const compare = (b.numberOfComments - a.numberOfComments) * (sortAscending ? -1 : 1);
          return compare;
        }
        return 0;
      });
    } else if (sortArgument === 'follower') {
      requirements.sort((a, b) => {
        if (a.numberOfFollowers !== undefined && b.numberOfFollowers !== undefined) {
          const compare = (b.numberOfFollowers - a.numberOfFollowers) * (sortAscending ? -1 : 1);
          return compare;
        }
        return 0;
      });
    } else if (sortArgument === 'vote') {
      requirements.sort((a, b) => {
        if (a.upVotes !== undefined && b.upVotes !== undefined) {
          const compare = (b.upVotes - a.upVotes) * (sortAscending ? -1 : 1);
          return compare;
        }
        return 0;
      });
    }

    if (parameters.sort.substring(1) === 'name') {
      requirements.sort((a, b) => (a.name && b.name) && (a.name.localeCompare(b.name, undefined, {numeric: true, sensitivity: 'base'}) > 0) ? 1 : -1);
    }

    requirements = requirements.filter(requirement => requirement.name?.toLowerCase().includes(parameters.search.toLowerCase()));

    return requirements.slice(0, parameters.per_page);
  },

  getRequirementById: (state) => (id: number) => {
    return state.requirements[id];
  },

  commentsList: (state) => (requirementId, parameters) => {
    let comments: Comment[] = Object.values(state.comments);

    return comments.slice(0, parameters.per_page);
  },

}
