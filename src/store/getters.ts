import { GetterTree } from 'vuex'
import { State, UnhandledError } from './state'
import { Project, Category, Requirement, Comment, ProjectMember, User, GamificationNotification, Tag} from '../types/bazaar-api';
import { Activity } from '../types/activities-api';

export type Getters = {
  projectsList(state: State): (parameters: any) => Project[]; //TODO: any type, replace by types in actions.ts!?
  getProjectById(state: State): (id: number) => Project | undefined;
  categoriesList(state: State): (projectId: number, parameters: any) => Category[];
  getCategoryById(state: State): (id: number) => Category | undefined;
  requirementsList(state: State): (requirementId: number, parameters: any, realized: Boolean) => Requirement[];
  getRequirementById(state: State): (id: number) => Requirement | undefined;
  commentsList(state: State): (requirementId: number) => Comment[];
  getProjectMembers(state: State): (projectId: number) => ProjectMember[];
  getRequirementFollowers(state: State): (requirementId: number) => User[];
  getRequirementDevelopers(state: State): (requirementId: number) => User[];
  activitiesList(state: State): (parameters: any) => Activity[];
  unhandledErrors(state: State): (parameters: any) => UnhandledError[];
  getFeaturedProjects(state: State): (parameters: any) => Project[];
  getNotifications(state: State): (parameters: any) => GamificationNotification[];
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
        projects.sort(lexicographicalSortFunction('lastActivity', sortAscending));
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
        categories.sort(lexicographicalSortFunction('lastActivity', sortAscending));
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

  getProjectMembers: (state) => (projectId) => {
    let members: ProjectMember[] = Object.values(state.projectMembers[projectId] ?? {});

    return members;
  },

  getRequirementFollowers: (state: State) => (requirementId: number) => {
    let followers: User[] = Object.values(state.requirementFollowers[requirementId] ?? {});

    return followers;
  },

  getRequirementDevelopers: (state: State) => (requirementId: number) => {
    let followers: User[] = Object.values(state.requirementDevelopers[requirementId] ?? {});

    return followers;
  },

  requirementsList: (state) => (categoryId, parameters, realized) => {
    // filter all requirements who have a category object with id equaling the requested categoryId
    let requirements: Requirement[] = Object.values(state.requirements).filter(requirement => (requirement.categories.some(c => c === categoryId)))
        .filter(requirement => realized === undefined ? true : (realized === (requirement.realized != undefined)));

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
        requirements.sort(lexicographicalSortFunction('lastActivity', sortAscending));
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
      case 'tag':
        requirements.sort((a, b) => {
          const aTag = a.tags?.[0]? a.tags[0].name : '';
          const bTag = b.tags?.[0]? b.tags[0].name : '';
          return sortAscending ? aTag.localeCompare(bTag) : bTag.localeCompare(aTag);
        });
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

  unhandledErrors: (state: State) => (parameters: any) => {

    return state.unhandledErrors;
  },

  getFeaturedProjects: (state: State) => (parameters: any) => {
    const featuredProjects: Project[] = [];

    state.featuredProjectIds.forEach(projectId => {
      if (state.projects[projectId]) {
        featuredProjects.push(state.projects[projectId]);
      }
    });

    return featuredProjects;
  },

  getNotifications: (state: State) => (parameters: any) => {
    return state.notification;
  },

  getProjectTags: (state: State) => (projectId: number) => {
    let tags: Tag[] = Object.values(state.tags[projectId] ?? {});
    return tags;
  },

}
