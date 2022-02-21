import { MutationTree } from 'vuex'
import { State, LocalComment, UnhandledError } from './state'

import { Project, Category, Requirement, Comment, Dashboard, ProjectMember } from '../types/bazaar-api';
import { Activity } from '../types/activities-api';

export enum MutationType {
  SetProjects = 'SET_PROJECTS',
  ReplaceProjects = 'REPLACE_PROJECTS',
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

  SetProjectMembers = 'SET_PROJECT_MEMBERS',
  RemoveProjectMember = 'REMOVE_PROJECT_MEMBER',

  SetFeaturedProjects = 'SET_FEATURED_PROJECTS',

  SetDashboard = 'SET_DASHBOARD',

  SetActivities = 'SET_ACTIVITIES',

  _AddUnhandledError = 'ADD_UNHANDLED_ERROR',
}

type RemoveProjectMemberParameters = {
  projectId: number;
  userId: number;
}

export type Mutations = {
  [MutationType.SetProjects](state: State, projects: Project[]): void;
  [MutationType.ReplaceProjects](state: State, project: Project[]): void;
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
  [MutationType.SetCommentShowReplyTo](state: State, {commentId: number, showReplyTo: boolean}): void;
  [MutationType.RemoveComment](state: State, commentId: number): void;

  [MutationType.SetProjectMembers](state: State, {projectId: number, members: any }): void;
  [MutationType.RemoveProjectMember](state: State, parameters: RemoveProjectMemberParameters): void;

  [MutationType.SetFeaturedProjects](state: State, featuredProjects: Project[]): void;

  [MutationType.SetDashboard](state: State, dashboard: Dashboard): void;


  [MutationType.SetActivities](state: State, activities: Activity[]): void;

  [MutationType._AddUnhandledError](state: State, error: UnhandledError): void;
};

export const mutations: MutationTree<State> & Mutations = {

  /**
   * Updates each of the projects or adds them to the list if they not exist.
   *
   * This DOES NOT replace the list of projects.
   */
  [MutationType.SetProjects](state, projects) {
    projects.forEach((project) => {
      if (project.id) {
        state.projects[project.id] = project;
      }
    });
  },

  /**
   * Replaces the list of projects with the given ones.
   */
  [MutationType.ReplaceProjects](state, projects) {
    // clear before
    state.projects = {};
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
      project.userContext = {isFollower};
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
      category.userContext = {isFollower};
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
      requirement.userContext = {isFollower: false};
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
      requirement.userContext = {isFollower};
    }
    requirement.userContext.isFollower = isFollower;
  },

  [MutationType.SetRequirementIsDeveloper](state, {requirementId, isDeveloper}) {
    const requirement = state.requirements[requirementId];
    if (!requirement.userContext) {
      requirement.userContext = {isFollower: false};
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

  [MutationType.SetCommentShowReplyTo](state, {commentId, showReplyTo}) {
    if (commentId) {
      state.comments[commentId].showReplyTo = showReplyTo;
    }
  },

  [MutationType.RemoveComment](state, commentId) {
    delete state.comments[commentId];
  },

  [MutationType.SetProjectMembers](state, {projectId, members}) {
    // reset first
    state.projectMembers[projectId] = {}

    members.forEach((member) => {
      if (member.id) {
        state.projectMembers[projectId][member.id] = member;
      }
    });
  },

  [MutationType.RemoveProjectMember](state, {projectId, userId}) {
    if (!state.projectMembers[projectId]) {
      // Project members are not tracked in local state
      return;
    }
    // first get memberId because we store the members NOT by their userId, but by their role-mapping 'memberId'
    const localMember = Object.values(state.projectMembers[projectId]).find(m => m.userId === userId);
    if (localMember && localMember.id) {
      delete state.projectMembers[projectId][localMember.id];
    }
  },

  /**
   * Updates the list of featured project IDs and adds/updates the projects in the global project list.
   *
   * @param state
   * @param featuredProjects
   */
  [MutationType.SetFeaturedProjects](state: State, featuredProjects: Project[]) {
    // override
    state.featuredProjectIds = featuredProjects.map(project => project.id!);

    // update projects in project list
    featuredProjects.forEach(project => {
      if (project.id) {
        state.projects[project.id] = project;
      }
    });
  },

  [MutationType.SetDashboard](state, dashboard) {
    state.dashboard = dashboard;
  },

  [MutationType.SetActivities](state, activities) {
    activities.forEach((activity) => {
      if (activity.id) {
        state.activities[activity.id] = activity;
      }
    });
  },

  [MutationType._AddUnhandledError](state, error) {
    state.unhandledErrors.push(error);
  },
}
