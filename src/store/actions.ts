import { ActionContext, ActionTree } from 'vuex';
import { Mutations, MutationType } from './mutations';
import { State } from './state';

import { bazaarApi } from '../api/bazaar';
import { projects, categories, requirements, Requirement, Comment, HttpResponse } from '../types/api';
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
  CreateComment = 'CREATE_COMMENT',
  
  FetchActivities = 'FETCH_ACTIVITIES',
}

type ActionAugments = Omit<ActionContext<State, State>, 'commit'> & {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
}

type ProjectsRequestParameters = {
  query?: projects.GetProjects.RequestQuery;
}

type CategoriesRequestParameters = {
  projectId: number;
  query?: projects.GetCategoriesForProject.RequestQuery;
}

type RequirementsRequestParameters = {
  categoryId: number;
  query?: categories.GetRequirementsForCategory.RequestQuery;
}

type CommentsRequestParameters = {
  requirementId: number;
  query?: requirements.GetCommentsForRequirement.RequestQuery;
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
  [ActionTypes.CreateComment](context: ActionAugments, payload: Comment): void;

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
    const response = await bazaarApi.requirements.getCommentsForRequirement(parameters.requirementId);
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

  async [ActionTypes.VoteRequirement]({ commit }, parameters) {
    commit(MutationType.SetRequirementVote, {requirementId: parameters.requirementId, userVoted: parameters.userVoted});
    let response : HttpResponse<Requirement, void>;
    if (parameters.userVoted === 'UP_VOTE') {
      response = await bazaarApi.requirements.vote(parameters.requirementId, {direction: 'up'});
    } else {
      response = await bazaarApi.requirements.unvote(parameters.requirementId);
    }
    if (response.data && ((response.status === 200) || (response.status === 201))) {
      commit(MutationType.SetRequirement, response.data);
    }
  },

  async [ActionTypes.CreateComment]({ commit }, comment) {
    const response = await bazaarApi.comments.createComment(comment);
    if (response.data && response.status === 201) {
      commit(MutationType.SetComment, response.data);
    }
  },

  async [ActionTypes.FetchActivities]({ commit }, parameters) {
    const response = await activitiesApi.getActivities(parameters.query);
    if (response.data && response.status === 200) {
      commit(MutationType.SetActivities, response.data);
    }
  },

}
