import { GetterTree } from 'vuex'
import { State } from './state'
import { Project, Category, Requirement, Comment } from '../types/bazaar-api';
import { Activity } from '../types/activities-api';

export type Getters = {
  projectsList(state: State): (parameters: any) => Project[]; //TODO: any type, replace by types in actions.ts!?
  getProjectById(state: State): (id: number) => Project | undefined;
  categoriesList(state: State): (projectId: number, parameters: any) => Category[];
  getCategoryById(state: State): (id: number) => Category | undefined;
  requirementsList(state: State): (requirementId: number, parameters: any) => Requirement[];
  getRequirementById(state: State): (id: number) => Requirement | undefined;
  commentsList(state: State): (requirementId: number) => Comment[];
  activitiesList(state: State): (parameters: any) => Activity[];
}

const numericalSortFunction = (property, sortAscending) => (a, b) => {
  if (a[property] !== undefined && b[property] !== undefined) {
    const compare = (a[property] - b[property]) * (sortAscending ? 1 : -1);
    return compare;
  }
  return 0;
};

const lexicographicalSortFunction = (property, sortAscending) => (a, b) => {
  if (a[property] !== undefined && b[property] !== undefined) {
    const compare = ((a[property] < b[property]) ? -1 : ((a[property] > b[property]) ? 1 : 0)) * (sortAscending ? 1 : -1);
    return compare;
  }
  return 0;
};

export const getters: GetterTree<State, State> & Getters = {

  projectsList: (state) => (parameters) => {
    let projects: Project[] = Object.values(state.projects);

    const sortAscending = parameters.sortDirection === 'ASC';
    // first, sort alphabetically in all cases
    projects.sort((a, b) => {
      if (a['name'] && b['name']) {
        const compare = a['name'].localeCompare(b['name'], undefined, {numeric: true, sensitivity: 'base'});
        return compare;
      }
      return 0;
    });
    if ((parameters.sort === 'name') && !sortAscending) {
      projects.reverse();
    }
    // then sort according to sort argument
    switch(parameters.sort) {
      case 'last_activity':
        projects.sort(lexicographicalSortFunction('lastUpdatedDate', sortAscending));
        break;
      case 'date':
        projects.sort(lexicographicalSortFunction('creationDate', sortAscending));
        break;
      case 'requirement':
        projects.sort(numericalSortFunction('numberOfRequirements', sortAscending));
        break;
      case 'follower':
        projects.sort(numericalSortFunction('numberOfFollowers', sortAscending));
        break;
    }

    projects = projects.filter(project => project.name?.toLowerCase().includes(parameters.search.toLowerCase()));

    return projects;//.slice(0, parameters.per_page);
  },

  getProjectById: (state) => (id: number): Project => {
    return state.projects[id];
  },

  categoriesList: (state) => (projectId, parameters) => {
    let categories: Category[] = Object.values(state.categories).filter(category => (category.projectId === projectId));

    const sortAscending = parameters.sortDirection === 'ASC';
    // first, sort alphabetically in all cases
    categories.sort((a, b) => {
      if (a['name'] && b['name']) {
        const compare = a['name'].localeCompare(b['name'], undefined, {numeric: true, sensitivity: 'base'});
        return compare;
      }
      return 0;
    });
    if ((parameters.sort === 'name') && !sortAscending) {
      categories.reverse();
    }
    // then sort according to sort argument
    switch(parameters.sort) {
      case 'last_activity':
        categories.sort(lexicographicalSortFunction('lastUpdatedDate', sortAscending));
        break;
      case 'date':
        categories.sort(lexicographicalSortFunction('creationDate', sortAscending));
        break;
      case 'requirement':
        categories.sort(numericalSortFunction('numberOfRequirements', sortAscending));
        break;
      case 'follower':
        categories.sort(numericalSortFunction('numberOfFollowers', sortAscending));
        break;
    }

    categories = categories.filter(category => category.name?.toLowerCase().includes(parameters.search.toLowerCase()));

    return categories.slice(0, parameters.per_page);
  },

  getCategoryById: (state) => (id: number) => {
    return state.categories[id];
  },

  requirementsList: (state) => (categoryId, parameters) => {
    // filter all requirements who have a category object with id equaling the requested categoryId
    let requirements: Requirement[] = Object.values(state.requirements).filter(requirement => (requirement.categories.some(c => c === categoryId)));

    const sortAscending = parameters.sortDirection === 'ASC';
    // first, sort alphabetically in all cases
    requirements.sort((a, b) => {
      if (a['name'] && b['name']) {
        const compare = a['name'].localeCompare(b['name'], undefined, {numeric: true, sensitivity: 'base'});
        return compare;
      }
      return 0;
    });
    if ((parameters.sort === 'name') && !sortAscending) {
      requirements.reverse();
    }
    // then sort according to sort argument
    switch(parameters.sort) {
      case 'last_activity':
        requirements.sort(lexicographicalSortFunction('lastUpdatedDate', sortAscending));
        break;
      case 'date':
        requirements.sort(lexicographicalSortFunction('creationDate', sortAscending));
        break;
      case 'comment':
        requirements.sort(numericalSortFunction('numberOfComments', sortAscending));
        break;
      case 'follower':
        requirements.sort(numericalSortFunction('numberOfFollowers', sortAscending));
        break;
      case 'vote':
        requirements.sort(numericalSortFunction('upVotes', sortAscending));
        break;
    }

    requirements = requirements.filter(requirement => requirement.name?.toLowerCase().includes(parameters.search.toLowerCase()));

    return requirements.slice(0, parameters.per_page);
  },

  getRequirementById: (state) => (id: number) => {
    return state.requirements[id];
  },

  commentsList: (state) => (requirementId) => {
    let commentsOriginal: Comment[] = Object.values(state.comments).filter(comment => (comment.requirementId === requirementId));
    let comments : Comment[] = [];

    // order according to replyToComment
    commentsOriginal.forEach(comment => {
      if (comment.replyToComment) {
        const replyTo = comment.replyToComment;
        const replyComment = comments.find(element => (element.id === replyTo));
        if (replyComment) {
          comments.splice((comments.indexOf(replyComment) + 1), 0, comment);
        }
      } else {
        comments.push(comment);
      }
    });

    return comments;
  },

  activitiesList: (state) => (parameters) => {
    let activities: Activity[] = Object.values(state.activities);

    activities.sort(numericalSortFunction('id', false));

    return activities.slice(0, parameters.limit);
  },

}
