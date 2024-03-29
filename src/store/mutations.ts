import { MutationTree } from 'vuex'
import { State, LocalComment, UnhandledError } from './state'

import { Project, Category, Requirement, Comment, Dashboard, ProjectMember, GamificationNotification, Tag } from '../types/bazaar-api';
import { Activity } from '../types/activities-api';
import { UserVote } from '@/api/bazaar';

export enum MutationType {
  SetProjects = 'SET_PROJECTS',
  ReplaceProjects = 'REPLACE_PROJECTS',
  SetProject = 'SET_PROJECT',
  SetProjectIsFollower = 'SET_PROJECT_IS_FOLLOWER',
  SetCategories = 'SET_CATEGORIES',
  SetCategory = 'SET_CATEGORY',
  SetCategoryIsFollower = 'SET_CATEGORY_IS_FOLLOWER',
  SetProjectTags = 'SET_PROJECT_TAGS',
  SetRequirements = 'SET_REQUIREMENTS',
  SetRequirement = 'SET_REQUIREMENT',
  SetRequirementVote = 'SET_REQUIREMENT_VOTE',
  SetRequirementIsFollower = 'SET_REQUIREMENT_ISFOLLOWER',
  SetRequirementIsDeveloper = 'SET_REQUIREMENT_ISDEVELOPER',
  SetRequirementRealized = 'SET_REQUIREMENT_REALIZED',
  SetRequirementProject = 'SET_REQUIREMENT_PROJECT',
  SetRequirementCategory = 'SET_REQUIREMENT_CATEGORY',
  RemoveRequirement = 'REMOVE_REQUIREMENT',
  SetComments = 'SET_COMMENTS',
  SetComment = 'SET_COMMENT',
  SetCommentShowReplyTo = 'SET_COMMENT_SHOW_REPLY_TO',
  RemoveComment = 'REMOVE_COMMENT',

  SetRequirementFollowers = 'SET_REQUIREMENT_FOLLOWERS',
  SetRequirementDevelopers = 'SET_REQUIREMENT_DEVELOPERS',
  SetProjectMembers = 'SET_PROJECT_MEMBERS',
  RemoveProjectMember = 'REMOVE_PROJECT_MEMBER',

  SetFeaturedProjects = 'SET_FEATURED_PROJECTS',

  SetDashboard = 'SET_DASHBOARD',

  SetActivities = 'SET_ACTIVITIES',

  _AddUnhandledError = 'ADD_UNHANDLED_ERROR',
  AddNotification = 'ADD_NOTIFICATION',
  SetGfNotification = 'SET_GFNOTIFICATION',
  RemoveTag = 'REMOVE_TAG',
  SetTag = 'SET_TAG',

}

type RemoveProjectMemberParameters = {
  projectId: number;
  userId: number;
}

type RemoveTagParameters = {
  projectId: number;
  tagId: number;
}

/*
 * TODO Fix type definitions of Mutations. Parameter types are ignored! (see actions for how to do it)
 */
export type Mutations = {
  [MutationType.SetProjects](state: State, projects: Project[]): void;
  [MutationType.ReplaceProjects](state: State, project: Project[]): void;
  [MutationType.SetProject](state: State, project: Project): void;
  [MutationType.SetProjectIsFollower](state: State, {projectId: number, isFollower: boolean}): void;
  [MutationType.SetProjectTags](state: State, {projectId, tags}): void;
  [MutationType.SetCategories](state: State, categories: Category[]): void;
  [MutationType.SetCategory](state: State, category: Category): void;
  [MutationType.SetCategoryIsFollower](state: State, {categoryId: number, isFollower: boolean}): void;
  [MutationType.SetRequirements](state: State, requirements: Requirement[]): void;
  [MutationType.SetRequirement](state: State, requirement: Requirement): void;
  [MutationType.SetGfNotification](state: State, requirement: Requirement): void;
  [MutationType.SetRequirementVote](state: State, {requirementId: number, userVoted: string}): void;
  [MutationType.SetRequirementIsFollower](state: State, {requirementId: number, isFollower: boolean}): void;
  [MutationType.SetRequirementIsDeveloper](state: State, {requirementId: number, isDeveloper: boolean}): void;
  [MutationType.SetRequirementRealized](state: State, {requirementId: number, realized: string}): void;
  [MutationType.SetRequirementProject](state: State, {requirementId: number, projectId: number}): void;
  [MutationType.SetRequirementCategory](state: State, {requirementId: number, categoryId: number}): void;
  [MutationType.RemoveRequirement](state: State, requirementId: number): void;
  [MutationType.SetComments](state: State, comments: LocalComment[]): void;
  [MutationType.SetComment](state: State, comment: LocalComment): void;
  [MutationType.SetCommentShowReplyTo](state: State, {commentId: number, showReplyTo: boolean}): void;
  [MutationType.RemoveComment](state: State, commentId: number): void;

  [MutationType.SetRequirementFollowers](state: State, {requirementId, followers}): void;
  [MutationType.SetRequirementDevelopers](state: State, {requirementId, developers}): void;
  [MutationType.SetProjectMembers](state: State, {projectId: number, members: any }): void;
  [MutationType.RemoveProjectMember](state: State, parameters: RemoveProjectMemberParameters): void;
  [MutationType.RemoveTag](state: State, parameters: RemoveTagParameters): void;
  [MutationType.SetTag](state: State, tag: Tag): void;


  [MutationType.SetFeaturedProjects](state: State, featuredProjects: Project[]): void;

  [MutationType.SetDashboard](state: State, dashboard: Dashboard): void;


  [MutationType.SetActivities](state: State, activities: Activity[]): void;

  [MutationType._AddUnhandledError](state: State, error: UnhandledError): void;
  [MutationType.AddNotification](state: State, payload: GamificationNotification): void;

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
      if(project.gamificationNotifications?.length != 0){
        if(project.gamificationNotifications){
          state.notification = project.gamificationNotifications;
        }
      }
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

  [MutationType.SetProjectTags](state, {projectId , tags}) {
    state.tags[projectId] = {}

    tags.forEach((tag) => {
      if (tag.id) {
        state.tags[projectId][tag.id] = tag;
      }
    });
  },

  [MutationType.SetTag](state, tag) {
      state.tags[tag.projectId][tag.id] = tag;
  },

  [MutationType.RemoveTag](state, {projectId, tagId}) {
    if (!state.tags[projectId]) {
      // Project tags are not tracked in local state
      return;
    }

    delete state.tags[projectId][tagId];
  },

  [MutationType.SetCategory](state, category) {
    if (category.id) {
      if(category.gamificationNotifications?.length != 0){
        if(category.gamificationNotifications){
          state.notification = category.gamificationNotifications;
        }
      }
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
      if(requirement.gamificationNotifications?.length != 0){
        if(requirement.gamificationNotifications){
          state.notification = requirement.gamificationNotifications;
        }
      }
      state.requirements[requirement.id] = requirement;
    }
  },

  [MutationType.SetGfNotification](state, requirement){
    if (requirement.id) {
      if(requirement.gamificationNotifications?.length != 0){
        if(requirement.gamificationNotifications){
          state.notification = requirement.gamificationNotifications;
        }
      }
    }
  },

  [MutationType.SetRequirementVote](state, {requirementId, userVoted}) {
    const requirement = state.requirements[requirementId]
    if (!requirement.userContext) {
      requirement.userContext = {isFollower: false};
    }
    const prevVote = requirement.userContext.userVoted as UserVote | undefined;
    requirement.userContext.userVoted = userVoted;
    if (userVoted === 'UP_VOTE') {
      if (prevVote !== 'UP_VOTE') {
        // increment up votes
        (requirement.upVotes !== undefined) ? ++requirement.upVotes : 1;
      }
      if (prevVote == 'DOWN_VOTE') {
        // decrement down votes
        (requirement.downVotes !== undefined) ? --requirement.downVotes : 0;
      }
    } else if (userVoted === 'DOWN_VOTE') {
      if (prevVote !== 'DOWN_VOTE') {
        // increment down votes
        (requirement.downVotes !== undefined) ? ++requirement.downVotes : 1;
      }
      if (prevVote == 'UP_VOTE') {
        // decrement up votes
        (requirement.upVotes !== undefined) ? --requirement.upVotes : 0;
      }
    } else {
      // user removed vote completly
      if (prevVote === 'DOWN_VOTE') {
        // decrement down votes
        (requirement.downVotes !== undefined) ? --requirement.downVotes : 0;
      }
      if (prevVote == 'UP_VOTE') {
        // decrement up votes
        (requirement.upVotes !== undefined) ? --requirement.upVotes : 0;
      }
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

  [MutationType.SetRequirementProject](state, {requirementId, projectId}) {
    const requirement = state.requirements[requirementId];
    requirement.projectId = projectId;
  },

  [MutationType.SetRequirementCategory](state, {requirementId, categoryId}) {
    const requirement = state.requirements[requirementId];
    requirement.categories = [categoryId];
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
      if(comment.gamificationNotifications?.length != 0){
        if(comment.gamificationNotifications){
          state.notification = comment.gamificationNotifications;
        }
      }
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

  [MutationType.SetRequirementFollowers](state: State, {requirementId, followers}) {
    // reset first
    state.requirementFollowers[requirementId] = {}

    followers.forEach((follower) => {
      if (follower.id) {
        state.requirementFollowers[requirementId][follower.id] = follower;
      }
    });
  },

  [MutationType.SetRequirementDevelopers](state: State, {requirementId, developers}) {
    // reset first
    state.requirementDevelopers[requirementId] = {}

    developers.forEach((developer) => {
      if (developer.id) {
        state.requirementDevelopers[requirementId][developer.id] = developer;
      }
    });
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
    if(dashboard.gamificationNotifications?.length != 0){
      if(dashboard.gamificationNotifications){
        state.notification = dashboard.gamificationNotifications;
      }
    }
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

  [MutationType.AddNotification](state, payload) {
    state.notification.push(payload);
  },
}
