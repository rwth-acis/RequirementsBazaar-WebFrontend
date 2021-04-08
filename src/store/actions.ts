import { ActionContext, ActionTree } from 'vuex';
import { Mutations, MutationType } from './mutations';
import { State } from './state';

import { bazaarApi } from '../api/bazaar';
import { Projects, Categories, Requirements, Requirement, Comment, HttpResponse } from '../types/bazaar-api';
import { activitiesApi } from '../api/activities';

export enum ActionTypes {
  FetchProjects = 'FETCH_PROJECTS',
  FetchProject = 'FETCH_PROJECT',
  FetchCategoriesOfProject = 'FETCH_CATEGORIES',
  FetchCategory = 'FETCH_CATEGORY',
  FetchRequirementsOfCategory = 'FETCH_REQUIREMENTS',
  FetchRequirement = 'FETCH_REQUIREMENT',
  FetchCommentsOfRequirement = 'FETCH_COMMENTS',
  CreateRequirement = 'CREATE_REQUIREMENT',
  VoteRequirement = 'VOTE_REQUIREMENT',
  RealizeRequirement = 'REALIZE_REQUIREMENT',
  DevelopRequirement = 'DEVELOP_REQUIREMENT',
  CreateComment = 'CREATE_COMMENT',
  DeleteComment = 'DELETE_COMMENT',
  
  FetchActivities = 'FETCH_ACTIVITIES',
}

type ActionAugments = Omit<ActionContext<State, State>, 'commit'> & {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
}

type ProjectsRequestParameters = {
  query?: Projects.GetProjects.RequestQuery;
}

type CategoriesRequestParameters = {
  projectId: number;
  query?: Projects.GetCategoriesForProject.RequestQuery;
}

type RequirementsRequestParameters = {
  categoryId: number;
  query?: Categories.GetRequirementsForCategory.RequestQuery;
}

type CommentsRequestParameters = {
  requirementId: number;
  query?: Requirements.GetCommentsForRequirement.RequestQuery;
}

type ActivitiesRequestParameters = {
  query?: {
    before?: number;
    after?: number;
    limit?: number;
    fillChildElements?: "true" | "false";
    search?: string;
    activityAction?: string[];
    origin?: string[];
    dataType?: string[];
    dataUrl?: string[];
    parentDataType?: string[];
    parentDataUrl?: string[];
    userUrl?: string[];
    combinedFilter?: string[];
  }
}

type VoteRequirementParameters = {
  requirementId: number;
  userVoted: string;
}

type RealizeRequirementParameters = {
  requirementId: number;
  realized: boolean;
}

type DevelopRequirementParameters = {
  requirementId: number;
  isDeveloper: boolean;
}

export type Actions = {
  [ActionTypes.FetchProjects](context: ActionAugments, payload: ProjectsRequestParameters): void;
  [ActionTypes.FetchProject](context: ActionAugments, projectId: number): void;
  [ActionTypes.FetchCategoriesOfProject](context: ActionAugments, payload: CategoriesRequestParameters): void;
  [ActionTypes.FetchCategory](context: ActionAugments, categoryId: number): void;
  [ActionTypes.FetchRequirementsOfCategory](context: ActionAugments, payload: RequirementsRequestParameters): void;
  [ActionTypes.FetchRequirement](context: ActionAugments, requirementId: number): void;
  [ActionTypes.FetchCommentsOfRequirement](context: ActionAugments, payload: CommentsRequestParameters): void;
  [ActionTypes.CreateRequirement](context: ActionAugments, payload: Requirement): void;
  [ActionTypes.VoteRequirement](context: ActionAugments, payload: VoteRequirementParameters): void;
  [ActionTypes.RealizeRequirement](context: ActionAugments, payload: RealizeRequirementParameters): void;
  [ActionTypes.DevelopRequirement](context: ActionAugments, payload: DevelopRequirementParameters): void;
  [ActionTypes.CreateComment](context: ActionAugments, payload: Comment): void;
  [ActionTypes.DeleteComment](context: ActionAugments, commentId: number): void;

  [ActionTypes.FetchActivities](context: ActionAugments, payload: ActivitiesRequestParameters): void;
}

export const actions: ActionTree<State, State> & Actions = {

  async [ActionTypes.FetchProjects]({ commit }, parameters) {
    const response = await bazaarApi.projects.getProjects(parameters.query);
    if (response.data && response.status === 200) {
      commit(MutationType.SetProjects, response.data);
    }
  },

  async [ActionTypes.FetchProject]({ commit }, projectId) {
    const response = await bazaarApi.projects.getProject(projectId);
    if (response.data && response.status === 200) {
      commit(MutationType.SetProject, response.data);
    }
  },

  async [ActionTypes.FetchCategoriesOfProject]({ commit }, parameters) {
    const response = await bazaarApi.projects.getCategoriesForProject(parameters.projectId, parameters.query);
    if (response.data && response.status === 200) {
      commit(MutationType.SetCategories, response.data);
    }
  },

  async [ActionTypes.FetchCategory]({ commit }, categoryId) {
    const response = await bazaarApi.categories.getCategory(categoryId);
    if (response.data && response.status === 200) {
      commit(MutationType.SetCategory, response.data);
    }
  },

  async [ActionTypes.FetchRequirementsOfCategory]({ commit }, parameters) {
    const response = await bazaarApi.categories.getRequirementsForCategory(parameters.categoryId, parameters.query);
    if (response.data && response.status === 200) {
      commit(MutationType.SetRequirements, response.data);
    }
  },

  async [ActionTypes.FetchRequirement]({ commit }, requirementId) {
    const response = await bazaarApi.requirements.getRequirement(requirementId);
    if (response.data && response.status === 200) {
      commit(MutationType.SetRequirement, response.data);
    }
  },

  async [ActionTypes.FetchCommentsOfRequirement]({ commit }, parameters) {
    const response = await bazaarApi.requirements.getCommentsForRequirement(parameters.requirementId, parameters.query);
    if (response.data && response.status === 200) {
      commit(MutationType.SetComments, response.data);
    }
  },

  async [ActionTypes.CreateRequirement]({ commit }, requirement) {
    const response = await bazaarApi.requirements.createRequirement(requirement);
    if (response.data && response.status === 201) {
      commit(MutationType.SetRequirement, response.data);
    }
  },

  async [ActionTypes.VoteRequirement]({ commit, getters }, parameters) {
    const userVotedCached = getters.getRequirementById(parameters.requirementId).userVoted;
    commit(MutationType.SetRequirementVote, parameters);
    let response : HttpResponse<any, void | Requirement>;
    if (parameters.userVoted === 'UP_VOTE') {
      response = await bazaarApi.requirements.vote(parameters.requirementId, {direction: 'up'});
    } else {
      response = await bazaarApi.requirements.unvote(parameters.requirementId);
    }
    if (response.data && ((response.status === 200) || (response.status === 201))) {
      commit(MutationType.SetRequirement, response.data);
    } else {
      // reset local commit
      commit(MutationType.SetRequirementVote, {requirementId: parameters.requirementId, userVoted: userVotedCached});
    }
  },

  async [ActionTypes.RealizeRequirement]({ commit, getters }, parameters) {
    const realizedCached = getters.getRequirementById(parameters.requirementId).realized;
    const realizedDate = parameters.realized ? new Date().toISOString() : null;
    commit(MutationType.SetRequirementRealized, {requirementId: parameters.requirementId, realized: realizedDate});
    let response : HttpResponse<Requirement, void>;
    if (parameters.realized) {
      response = await bazaarApi.requirements.realize(parameters.requirementId);
    } else {
      response = await bazaarApi.requirements.unrealize(parameters.requirementId);
    }
    if (response.data && ((response.status === 200) || (response.status === 201))) {
      commit(MutationType.SetRequirement, response.data);
    } else {
      // reset local commit
      commit(MutationType.SetRequirementRealized, {requirementId: parameters.requirementId, realized: realizedCached});
    }
  },

  async [ActionTypes.DevelopRequirement]({ commit }, parameters) {
    commit(MutationType.SetRequirementIsDeveloper, {requirementId: parameters.requirementId, isDeveloper: parameters.isDeveloper});
    let response : HttpResponse<Requirement, void>;
    if (parameters.isDeveloper) {
      response = await bazaarApi.requirements.developRequirement(parameters.requirementId);
    } else {
      response = await bazaarApi.requirements.undevelopRequirement(parameters.requirementId);
    }
    if (response.data && ((response.status === 200) || (response.status === 201))) {
      commit(MutationType.SetRequirement, response.data);
    } else {
      // reset local commit
      commit(MutationType.SetRequirementIsDeveloper, {requirementId: parameters.requirementId, isDeveloper: !parameters.isDeveloper});
    }
  },

  async [ActionTypes.CreateComment]({ commit }, comment) {
    const response = await bazaarApi.comments.createComment(comment);
    if (response.data && response.status === 201) {
      commit(MutationType.SetComment, response.data);
    }
  },

  async [ActionTypes.DeleteComment]({ commit }, commentId) {
    const response = await bazaarApi.comments.deleteComment(commentId);
    if (response.data && response.status === 200) {
      commit(MutationType.RemoveComment, commentId);
    }
  },

  async [ActionTypes.FetchActivities]({ commit }, parameters) {
    const response = await activitiesApi.getActivities(parameters.query);
    if (response.data && response.status === 200) {
      commit(MutationType.SetActivities, response.data);
    }
  },

}
