import { MutationTree } from 'vuex'
import { State, LocalComment } from './state'

import { Project, Category, Requirement, Comment } from '../types/bazaar-api';
import { Activity } from '../types/activities-api';

export enum MutationType {
  SetProjects = 'SET_PROJECTS',
  SetProject = 'SET_PROJECT',
  SetProjectIsFollower = 'SET_PROJECT_IS_FOLLOWER',
  SetCategories = 'SET_CATEGORIES',
  SetCategory = 'SET_CATEGORY',
  SetCategoryIsFollower = 'SET_CATEGORY_IS_FOLLOWER',
  SetRequirements = 'SET_REQUIREMENTS',
  SetRequirement = 'SET_REQUIREMENT',
  SetRequirementVote = 'SET_REQUIREMENT_VOTE',
  SetRequirementIsFollower = 'SET_REQUIREMENT_ISFOLLOWER',
  SetRequirementIsDeveloper = 'SET_REQUIREMENT_ISDEVELOPER',
  SetRequirementRealized = 'SET_REQUIREMENT_REALIZED',
  RemoveRequirement = 'REMOVE_REQUIREMENT',
  SetComments = 'SET_COMMENTS',
  SetComment = 'SET_COMMENT',
  SetCommentShowReplyTo = 'SET_COMMENT_SHOW_REPLY_TO',
  RemoveComment = 'REMOVE_COMMENT',

  SetActivities = 'SET_ACTIVITIES',
}

export type Mutations = {
  [MutationType.SetProjects](state: State, projects: Project[]): void;
  [MutationType.SetProject](state: State, project: Project): void;
  [MutationType.SetProjectIsFollower](state: State, {projectId: number, isFollower: boolean}): void;
  [MutationType.SetCategories](state: State, categories: Category[]): void;
  [MutationType.SetCategory](state: State, category: Category): void;
  [MutationType.SetCategoryIsFollower](state: State, {categoryId: number, isFollower: boolean}): void;
  [MutationType.SetRequirements](state: State, requirements: Requirement[]): void;
  [MutationType.SetRequirement](state: State, requirement: Requirement): void;
  [MutationType.SetRequirementVote](state: State, {requirementId: number, userVoted: string}): void;
  [MutationType.SetRequirementIsFollower](state: State, {requirementId: number, isFollower: boolean}): void;
  [MutationType.SetRequirementIsDeveloper](state: State, {requirementId: number, isDeveloper: boolean}): void;
  [MutationType.SetRequirementRealized](state: State, {requirementId: number, realized: string}): void;
  [MutationType.RemoveRequirement](state: State, requirementId: number): void;
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

  [MutationType.SetProjectIsFollower](state, {projectId, isFollower}) {
    const project = state.projects[projectId];
    if (!project.userContext) {
      project.userContext = {};
    }
    project.userContext.isFollower = isFollower;
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

  [MutationType.SetCategoryIsFollower](state, {categoryId, isFollower}) {
    const category = state.categories[categoryId];
    if (!category.userContext) {
      category.userContext = {};
    }
    category.userContext.isFollower = isFollower;
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
    const requirement = state.requirements[requirementId]
    if (!requirement.userContext) {
      requirement.userContext = {};
    }
    requirement.userContext.userVoted = userVoted;
    if (userVoted === 'UP_VOTE') {
      (requirement.upVotes !== undefined) ? ++requirement.upVotes : 1;
    } else {
      (requirement.upVotes !== undefined) ? requirement.upVotes-- : 0;
    }
  },

  [MutationType.SetRequirementIsFollower](state, {requirementId, isFollower}) {
    const requirement = state.requirements[requirementId];
    if (!requirement.userContext) {
      requirement.userContext = {};
    }
    requirement.userContext.isFollower = isFollower;
  },

  [MutationType.SetRequirementIsDeveloper](state, {requirementId, isDeveloper}) {
    const requirement = state.requirements[requirementId];
    if (!requirement.userContext) {
      requirement.userContext = {};
    }
    requirement.userContext.isDeveloper = isDeveloper;
  },

  [MutationType.SetRequirementRealized](state, {requirementId, realized}) {
    const requirement = state.requirements[requirementId];
    requirement.realized = realized;
  },

  [MutationType.RemoveRequirement](state, requirementId) {
    delete state.requirements[requirementId];
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
