import { MutationTree } from 'vuex'
import { State, LocalComment } from './state'

import { Project, Category, Requirement, Comment, Attachment } from '../types/bazaar-api';
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
  SetDraftRequirement = 'SET_DRAFTREQUIREMENT',
  SetDraftRequirementName = 'SET_DRAFTREQUIREMENT_NAME',
  SetDraftRequirementDescription = 'SET_DRAFTREQUIREMENT_DESCRIPTION',
  DraftRequirementAddAttachment = 'DRAFTREQUIREMENT_ADD_ATTACHMENT',
  DraftRequirementRemoveAttachment = 'DRAFTREQUIREMENT_REMOVE_ATTACHMENT',
  DraftRequirementCleanAttachments = 'DRAFTREQUIREMENT_CLEAN_ATTACHMENTS',
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
  [MutationType.SetDraftRequirement](state: State, requirement: Requirement): void;
  [MutationType.SetDraftRequirementName](state: State, {requirement: Requirement, name: string}): void;
  [MutationType.DraftRequirementAddAttachment](state: State, {requirement: Requirement, attachment: Attachment, file: File}): void;
  [MutationType.DraftRequirementRemoveAttachment](state: State, {requirement: Requirement, attachment: Attachment}): void;
  [MutationType.DraftRequirementCleanAttachments](state: State, requirement: Requirement): void;
  [MutationType.SetComments](state: State, comments: LocalComment[]): void;
  [MutationType.SetComment](state: State, comment: LocalComment): void;
  [MutationType.SetCommentShowReplyTo](state: State, {commentId: number, showReplyTo: boolean}): void;
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

  [MutationType.SetDraftRequirement](state, requirement) {
    const requirementIndex = state.draftRequirements.findIndex(element => (requirement.id ? (element.id === requirement.id) : (element.categories[0] === requirement.categories[0])));
    if (requirementIndex === -1) {
      state.draftRequirements.push(requirement);
    } else {
      state.draftRequirements[requirementIndex] = requirement;
    }
  },

  [MutationType.SetDraftRequirementName](state, {requirement, name}) {
    const requirementIndex = state.draftRequirements.findIndex(element => (requirement.id ? (element.id === requirement.id) : (element.categories[0] === requirement.categories[0])));
    if (requirementIndex > -1) {
      state.draftRequirements[requirementIndex].name = name;
    }
  },

  [MutationType.SetDraftRequirementDescription](state, {requirement, description}) {
    const requirementIndex = state.draftRequirements.findIndex(element => (requirement.id ? (element.id === requirement.id) : (element.categories[0] === requirement.categories[0])));
    if (requirementIndex > -1) {
      state.draftRequirements[requirementIndex].description = description;
    }
  },

  [MutationType.DraftRequirementAddAttachment](state, {requirement, attachment, file}) {
    const requirementIndex = state.draftRequirements.findIndex(element => (requirement.id ? (element.id === requirement.id) : (element.categories[0] === requirement.categories[0])));
    attachment.draftFile = file;
    if (requirementIndex > -1) {
      state.draftRequirements[requirementIndex].attachments?.push(attachment);
    }
  },

  [MutationType.DraftRequirementRemoveAttachment](state, {requirement, attachment}) {
    const requirementIndex = state.draftRequirements.findIndex(element => (requirement.id ? (element.id === requirement.id) : (element.categories[0] === requirement.categories[0])));
    if (requirementIndex > -1) {
      if (state.draftRequirements[requirementIndex].attachments) {
        const attachmentIndex = state.draftRequirements[requirementIndex].attachments?.indexOf(attachment);
        if (attachmentIndex !== undefined) {
          state.draftRequirements[requirementIndex].attachments?.splice(attachmentIndex, 1);
        }
      }
    }
  },

  [MutationType.DraftRequirementCleanAttachments](state, requirement) {
    requirement.attachments?.forEach(attachment => {
      delete (attachment as any).draftFile;
    });
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

  [MutationType.SetActivities](state, activities) {
    activities.forEach((activity) => {
      if (activity.id) {
        state.activities[activity.id] = activity;
      }
    });
  },

}
