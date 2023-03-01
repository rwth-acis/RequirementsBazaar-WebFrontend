import { ActionContext, ActionTree } from 'vuex';
import { Mutations, MutationType } from './mutations';
import { State } from './state';

import { bazaarApi, ProjectMemberRole, UserVote } from '../api/bazaar';
import { Projects, Categories, Requirements, Project, Category, Requirement, Comment, HttpResponse, ProjectMember } from '../types/bazaar-api';
import { activitiesApi } from '../api/activities';

export enum ActionTypes {
  FetchProjects = 'FETCH_PROJECTS',
  SearchProjects = 'SEARCH_PROJECTS',
  FetchProject = 'FETCH_PROJECT',
  FollowProject = 'FOLLOW_PROJECT',
  CreateProject = 'CREATE_PROJECT',
  UpdateProject = 'UPDATE_PROJECT',
  FetchCategoriesOfProject = 'FETCH_CATEGORIES',
  FetchCategory = 'FETCH_CATEGORY',
  FollowCategory = 'FOLLOW_CATEGORY',
  CreateCategory = 'CREATE_CATEGORY',
  UpdateCategory = 'UPDATE_CATEGORY',
  FetchRequirementsOfCategory = 'FETCH_REQUIREMENTS',
  FetchRequirement = 'FETCH_REQUIREMENT',
  FetchCommentsOfRequirement = 'FETCH_COMMENTS',
  FetchRequirementFollowers = 'FETCH_REQ_FOLLOWERS',
  FetchRequirementDevelopers = 'FETCH_REQ_DEVELOPERS',
  CreateRequirement = 'CREATE_REQUIREMENT',
  UpdateRequirement = 'UPDATE_REQUIREMENT',
  VoteRequirement = 'VOTE_REQUIREMENT',
  FollowRequirement = 'FOLLOW_REQUIREMENT',
  DevelopRequirement = 'DEVELOP_REQUIREMENT',
  RealizeRequirement = 'REALIZE_REQUIREMENT',
  DeleteRequirement = 'DELETE_REQUIREMENT',
  MoveRequirement = 'MOVE_REQUIREMENT',
  CreateComment = 'CREATE_COMMENT',
  UpdateComment = 'UPDATE_COMMENT',
  DeleteComment = 'DELETE_COMMENT',

  FetchProjectMembers = "FETCH_PROJECT_MEMBERS",
  UpdateProjectMemberRole = "UPDATE_PROJECT_MEMBER_ROLE",
  RemoveProjectMember = "REMOVE_PROJECT_MEMBER",

  FetchFeaturedProjects = "FETCH_FEATURED_PROJECTS",

  FetchDashboard = 'FETCH_DASHBOARD',

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
  userVoted: UserVote;
}

type FollowResourceParameters = {
  id: number;
  isFollower: boolean;
}

type DevelopRequirementParameters = {
  requirementId: number;
  isDeveloper: boolean;
}

type RealizeRequirementParameters = {
  requirementId: number;
  realized: boolean;
}

type MoveRequirementParameters = {
  requirementId: number;
  projectId: number;
  categoryId: number;
}

type UpdateProjectMemberRoleParameters = {
  projectId: number;
  userId: number;
  role: ProjectMemberRole;
  memberId: number; // when user is already member and we want to change the role
}

type RemoveProjectMemberParameters = {
  projectId: number;
  userId: number;
}

export type Actions = {
  [ActionTypes.FetchProjects](context: ActionAugments, payload: ProjectsRequestParameters): void;
  [ActionTypes.SearchProjects](context: ActionAugments, payload: ProjectsRequestParameters): void;
  [ActionTypes.FetchProject](context: ActionAugments, projectId: number): void;
  [ActionTypes.FollowProject](context: ActionAugments, payload: FollowResourceParameters): void;
  [ActionTypes.CreateProject](context: ActionAugments, payload: Project): void;
  [ActionTypes.UpdateProject](context: ActionAugments, payload: Project): void;
  [ActionTypes.FetchCategoriesOfProject](context: ActionAugments, payload: CategoriesRequestParameters): void;
  [ActionTypes.FetchCategory](context: ActionAugments, categoryId: number): void;
  [ActionTypes.FollowCategory](context: ActionAugments, payload: FollowResourceParameters): void;
  [ActionTypes.CreateCategory](context: ActionAugments, payload: Category): void;
  [ActionTypes.UpdateCategory](context: ActionAugments, payload: Category): void;
  [ActionTypes.FetchRequirementsOfCategory](context: ActionAugments, payload: RequirementsRequestParameters): void;
  [ActionTypes.FetchRequirement](context: ActionAugments, requirementId: number): void;
  [ActionTypes.FetchCommentsOfRequirement](context: ActionAugments, requirementId: number): void;
  [ActionTypes.CreateRequirement](context: ActionAugments, payload: Requirement): void;
  [ActionTypes.UpdateRequirement](context: ActionAugments, payload: Requirement): void;
  [ActionTypes.VoteRequirement](context: ActionAugments, payload: VoteRequirementParameters): void;
  [ActionTypes.FollowRequirement](context: ActionAugments, payload: FollowResourceParameters): void;
  [ActionTypes.DevelopRequirement](context: ActionAugments, payload: DevelopRequirementParameters): void;
  [ActionTypes.RealizeRequirement](context: ActionAugments, payload: RealizeRequirementParameters): void;
  [ActionTypes.MoveRequirement](context: ActionAugments, parameters: MoveRequirementParameters): void;
  [ActionTypes.DeleteRequirement](context: ActionAugments, requirementId: number): void;
  [ActionTypes.CreateComment](context: ActionAugments, payload: Comment): void;
  [ActionTypes.UpdateComment](context: ActionAugments, payload: Comment): void;
  [ActionTypes.DeleteComment](context: ActionAugments, commentId: number): void;
  [ActionTypes.FetchRequirementFollowers](context: ActionAugments, requirementId: number): void;
  [ActionTypes.FetchRequirementDevelopers](context: ActionAugments, requirementId: number): void;

  [ActionTypes.FetchProjectMembers](context: ActionAugments, projectId: number): void;
  [ActionTypes.UpdateProjectMemberRole](context: ActionAugments, parameters: UpdateProjectMemberRoleParameters): void;
  [ActionTypes.RemoveProjectMember](context: ActionAugments, parameters: RemoveProjectMemberParameters): void;

  [ActionTypes.FetchFeaturedProjects](context: ActionAugments): void;

  [ActionTypes.FetchDashboard](context: ActionAugments): void;

  [ActionTypes.FetchActivities](context: ActionAugments, payload: ActivitiesRequestParameters): void;
}

export const actions: ActionTree<State, State> & Actions = {

  /**
   * Fetches the projects according to the given 'parameters' and merges them with the existing projects.
   * (Uses the 'SetProjects' Mutation)
   */
  async [ActionTypes.FetchProjects]({ commit }, parameters) {
    const response = await bazaarApi.projects.getProjects(parameters.query);
    if (response.data && response.status === 200) {
      commit(MutationType.SetProjects, response.data);
    }
  },

  async [ActionTypes.SearchProjects]({ commit }, parameters) {
    const response = await bazaarApi.projects.getProjects(parameters.query);
    if (response.data && response.status === 200) {
      // Difference to FetchProjects: We REPLACE the existing list of projects
      commit(MutationType.ReplaceProjects, response.data);
    }
  },

  async [ActionTypes.FetchProject]({ commit }, projectId) {
    const response = await bazaarApi.projects.getProject(projectId);
    if (response.data && response.status === 200) {
      commit(MutationType.SetProject, response.data);
    }
  },

  async [ActionTypes.FollowProject]({ commit }, parameters) {
    commit(MutationType.SetProjectIsFollower, {projectId: parameters.id, isFollower: parameters.isFollower});
    let response : HttpResponse<Project, void>;
    if (parameters.isFollower) {
      response = await bazaarApi.projects.followProject(parameters.id);
    } else {
      response = await bazaarApi.projects.unfollowProject(parameters.id);
    }
    if (response.data && ((response.status === 200) || (response.status === 201))) {
      commit(MutationType.SetProject, response.data);
    } else {
      // reset local commit
      commit(MutationType.SetProjectIsFollower, {projectId: parameters.id, isFollower: !parameters.isFollower});
    }
  },

  async [ActionTypes.CreateProject]({ commit }, project) {
    const response = await bazaarApi.projects.createProject(project);
    if (response.data && response.status === 201) {
      commit(MutationType.SetProject, response.data);
    }
  },

  async [ActionTypes.UpdateProject]({ commit }, project) {
    const response = await bazaarApi.projects.updateProject(project);
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

  async [ActionTypes.FollowCategory]({ commit }, parameters) {
    commit(MutationType.SetCategoryIsFollower, {categoryId: parameters.id, isFollower: parameters.isFollower});
    let response : HttpResponse<Category, void>;
    if (parameters.isFollower) {
      response = await bazaarApi.categories.followCategory(parameters.id);
    } else {
      response = await bazaarApi.categories.unfollowCategory(parameters.id);
    }
    if (response.data && ((response.status === 200) || (response.status === 201))) {
      commit(MutationType.SetCategory, response.data);
    } else {
      // reset local commit
      commit(MutationType.SetCategoryIsFollower, {categoryId: parameters.id, isFollower: !parameters.isFollower});
    }
  },

  async [ActionTypes.CreateCategory]({ commit }, category) {
    const response = await bazaarApi.categories.createCategory(category);
    if (response.data && response.status === 201) {
      commit(MutationType.SetCategory, response.data);
    }
  },

  async [ActionTypes.UpdateCategory]({ commit }, category) {
    const response = await bazaarApi.categories.updateCategory(category);
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

  async [ActionTypes.FetchCommentsOfRequirement]({ commit }, requirementId) {
    const response = await bazaarApi.requirements.getCommentsForRequirement(requirementId);
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

  async [ActionTypes.UpdateRequirement]({ commit }, requirement) {
    const response = await bazaarApi.requirements.updateRequirement(requirement);
    if (response.data && response.status === 200) {
      commit(MutationType.SetRequirement, response.data);
    }
  },

  async [ActionTypes.VoteRequirement]({ commit, getters }, parameters) {
    const userVotedCached = getters.getRequirementById(parameters.requirementId).userContext.userVoted;
    commit(MutationType.SetRequirementVote, parameters);
    let response : HttpResponse<any, void | Requirement>;
    if (parameters.userVoted === 'UP_VOTE') {
      response = await bazaarApi.requirements.vote(parameters.requirementId, { direction: 'up' });
    } else if (parameters.userVoted === 'DOWN_VOTE') {
      response = await bazaarApi.requirements.vote(parameters.requirementId, { direction: 'down' });
    } else {
      response = await bazaarApi.requirements.unvote(parameters.requirementId);
    }
    if (!response.ok) {
      // reset local commit
      commit(MutationType.SetRequirementVote, {requirementId: parameters.requirementId, userVoted: userVotedCached});
    } else {
      // set the notifications if present
      const response = await bazaarApi.requirements.getRequirement(parameters.requirementId);
      if (response.data && response.status === 200) {
        commit(MutationType.SetGfNotification, response.data);
      }
    }
  },

  async [ActionTypes.FollowRequirement]({ commit }, parameters) {
    commit(MutationType.SetRequirementIsFollower, {requirementId: parameters.id, isFollower: parameters.isFollower});
    let response : HttpResponse<Requirement, void>;
    if (parameters.isFollower) {
      response = await bazaarApi.requirements.followRequirement(parameters.id);
    } else {
      response = await bazaarApi.requirements.unfollowRequirement(parameters.id);
    }
    if (response.data && ((response.status === 200) || (response.status === 201))) {
      commit(MutationType.SetRequirement, response.data);
    } else {
      // reset local commit
      commit(MutationType.SetRequirementIsFollower, {requirementId: parameters.id, isFollower: !parameters.isFollower});
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

  async [ActionTypes.MoveRequirement]({ commit, getters }, parameters) {
    const projectIdCached = getters.getRequirementById(parameters.requirementId).projectId;
    const categoryIdCached = getters.getRequirementById(parameters.requirementId).categories[0];

    commit(MutationType.SetRequirementProject, {requirementId: parameters.requirementId, projectId: parameters.projectId});
    commit(MutationType.SetRequirementCategory, {requirementId: parameters.requirementId, categoryId: parameters.categoryId});

    let response : HttpResponse<Requirement, void> = await bazaarApi.requirements.moveRequirement(parameters.requirementId,{
      projectId: parameters.projectId, categoryId: parameters.categoryId
    });
    if (response.data && ((response.status === 200) || (response.status === 201))) {
      commit(MutationType.SetRequirement, response.data);
    } else {
      // reset local commit
      commit(MutationType.SetRequirementProject, {requirementId: parameters.requirementId, projectId: projectIdCached});
      commit(MutationType.SetRequirementCategory, {requirementId: parameters.requirementId, categoryId: categoryIdCached});
    }
  },

  async [ActionTypes.DeleteRequirement]({ commit }, requirementId) {
    const response = await bazaarApi.requirements.deleteRequirement(requirementId);
    if (response.data && response.status === 200) {
      commit(MutationType.RemoveRequirement, requirementId);
    }
  },

  async [ActionTypes.CreateComment]({ commit }, comment) {
    const response = await bazaarApi.comments.createComment(comment);
    if (response.data && response.status === 201) {
      commit(MutationType.SetComment, response.data);
    }
  },

  async [ActionTypes.UpdateComment]({ commit }, comment) {
    const response = await bazaarApi.comments.updateComment(comment);
    if (response.data && response.status === 200) {
      commit(MutationType.SetComment, response.data);
    }
  },

  async [ActionTypes.DeleteComment]({ commit }, commentId) {
    const response = await bazaarApi.comments.deleteComment(commentId);
    if (response.data && response.status === 200) {
      commit(MutationType.RemoveComment, commentId);
    }
  },

  async [ActionTypes.FetchRequirementFollowers]({ commit }, requirementId) {
    // TODO Add paging
    const response = await bazaarApi.requirements.getFollowersForRequirement(requirementId);
    if (response.data && response.status === 200) {
      commit(MutationType.SetRequirementFollowers, {requirementId: requirementId, followers: response.data});
    }
  },

  async [ActionTypes.FetchRequirementDevelopers]({ commit }, requirementId) {
    // TODO Add paging
    const response = await bazaarApi.requirements.getDevelopersForRequirement(requirementId);
    if (response.data && response.status === 200) {
      commit(MutationType.SetRequirementDevelopers, {requirementId: requirementId, developers: response.data});
    }
  },

  async [ActionTypes.FetchProjectMembers]({ commit }, projectId) {
    // TODO Add paging
    const response = await bazaarApi.projects.getMembers(projectId);
    if (response.data && response.status === 200) {
      commit(MutationType.SetProjectMembers, {projectId: projectId, members: response.data});
    }
  },

  async [ActionTypes.UpdateProjectMemberRole]({ commit, dispatch }, parameters) {
    // TODO Add paging
    const memberUpdates = [
      {
        userId: parameters.userId,
        role: parameters.role,
        id: parameters.memberId, // can be undefined for new members
      }
    ];
    const response = await bazaarApi.projects.updateMember(parameters.projectId, memberUpdates);
    if (response.status === 204 || response.status === 200) {
      // We do not have all information about the user available here to simply add them
      // Workaround: Fetch fresh list of members

      dispatch(ActionTypes.FetchProjectMembers, parameters.projectId);

      //commit(MutationType.UpdateProjectMemberRole, {projectId: parameters.projectId, userId: parameters.userId});
    }
  },

  async [ActionTypes.RemoveProjectMember]({ commit }, parameters) {
    // TODO Add paging
    const response = await bazaarApi.projects.removeMember(parameters.projectId, parameters.userId);
    if (response.status === 204 || response.status === 200) {
      commit(MutationType.RemoveProjectMember, {projectId: parameters.projectId, userId: parameters.userId});
    }
  },

  async [ActionTypes.FetchFeaturedProjects]({ commit }) {
    // Query most popular projects by follower count
    const response = await bazaarApi.projects.getProjects({
      sortDirection: 'DESC',
      sort: ['follower'],
      per_page: 3
    });

    if (response.data && response.status == 200) {
      commit(MutationType.SetFeaturedProjects, response.data);
    }
  },

  async [ActionTypes.FetchDashboard]({ commit }) {
    const response = await bazaarApi.users.getUserDashboard();
    if (response.data && response.status === 200) {
      commit(MutationType.SetDashboard, response.data);
    }
  },

  async [ActionTypes.FetchActivities]({ commit }, parameters) {
    const response = await activitiesApi.getActivities(parameters.query);
    if (response.data && response.status === 200) {
      commit(MutationType.SetActivities, response.data);
    }
  },

}
