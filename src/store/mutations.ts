import { MutationTree } from 'vuex'
import { State, LocalComment } from './state'

import { Project, Category, Requirement, Comment } from '../types/api';
import { Activity } from '../types/activities-api';

export enum MutationType {
  SetProjects = 'SET_PROJECTS',
  SetProject = 'SET_PROJECT',
  SetCategories = 'SET_CATEGORIES',
  SetCategory = 'SET_CATEGORY',
  SetRequirements = 'SET_REQUIREMENTS',
  SetRequirement = 'SET_REQUIREMENT',
  SetRequirementVote = 'SET_REQUIREMENT_VOTE',
  SetComments = 'SET_COMMENTS',
  SetComment = 'SET_COMMENT',
  SetCommentShowReplyTo = 'SET_COMMENT_SHOW_REPLY_TO',
  RemoveComment = 'REMOVE_COMMENT',

  SetActivities = 'SET_ACTIVITIES',
}

export type Mutations = {
  [MutationType.SetProjects](state: State, projects: Project[]): void;
  [MutationType.SetProject](state: State, project: Project): void;
  [MutationType.SetCategories](state: State, categories: Category[]): void;
  [MutationType.SetCategory](state: State, category: Category): void;
  [MutationType.SetRequirements](state: State, requirements: Requirement[]): void;
  [MutationType.SetRequirement](state: State, requirement: Requirement): void;
  [MutationType.SetRequirementVote](state: State, {requirementId: number, userVoted: string}): void;
  [MutationType.SetComments](state: State, comments: LocalComment[]): void;
  [MutationType.SetComment](state: State, comment: LocalComment): void;
  [MutationType.SetCommentShowReplyTo](state: State, {comment: LocalComment, showReplyTo: boolean}): void;
  [MutationType.RemoveComment](state: State, commentId: number): void;

  [MutationType.SetActivities](state: State, activities: Activity[]): void;
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

  [MutationType.SetRequirements](state, requirements) {
    requirements.forEach((requirement) => {
      if (requirement.id) {
        state.requirements[requirement.id] = requirement;
      }
    });
  },

  [MutationType.SetRequirement](state, requirement) {
    if (requirement.id) {
      state.requirements[requirement.id] = requirement;
    }
  },

  [MutationType.SetRequirementVote](state, {requirementId, userVoted}) {
    let requirement = state.requirements[requirementId]
    requirement.userVoted = userVoted;
    if (userVoted === 'UP_VOTE') {
      (requirement.upVotes !== undefined) ? ++requirement.upVotes : 1;
    } else {
      (requirement.upVotes !== undefined) ? requirement.upVotes-- : 0;
    }
  },

  [MutationType.SetComments](state, comments) {
    comments.forEach((comment) => {
      if (comment.id) {
        state.comments[comment.id] = comment;
      }
    });
  },

  [MutationType.SetComment](state, comment) {
    if (comment.id) {
      state.comments[comment.id] = comment;
    }
  },

  [MutationType.SetCommentShowReplyTo](state, {comment, showReplyTo}) {
    if (comment.id) {
      state.comments[comment.id].showReplyTo = showReplyTo;
    }
  },

  [MutationType.RemoveComment](state, commentId) {
    delete state.comments[commentId];
  },

  [MutationType.SetActivities](state, activities) {
    activities.forEach((activity) => {
      if (activity.id) {
        state.activities[activity.id] = activity;
      }
    });
  },

}
