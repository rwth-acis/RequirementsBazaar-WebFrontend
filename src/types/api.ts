/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Attachment {
  /** @format int32 */
  id?: number;
  name: string;
  description?: string;
  mimeType: string;
  identifier: string;
  fileUrl: string;

  /**
   * @format int32
   * @min 0
   */
  requirementId?: number;
  creator?: User;

  /** @format date-time */
  creationDate?: string;

  /** @format date-time */
  lastUpdatedDate?: string;
}

export interface User {
  /** @format int32 */
  id?: number;
  userName: string;
  firstName?: string;
  lastName?: string;
  las2peerId: string;
  profileImage?: string;
  emailLeadSubscription?: boolean;
  emailFollowSubscription?: boolean;
  personalizationEnabled?: boolean;

  /** @format date-time */
  creationDate?: string;

  /** @format date-time */
  lastUpdatedDate?: string;

  /** @format date-time */
  lastLoginDate?: string;
}

export interface Statistic {
  /** @format int32 */
  numberOfProjects?: number;

  /** @format int32 */
  numberOfCategories?: number;

  /** @format int32 */
  numberOfRequirements?: number;

  /** @format int32 */
  numberOfComments?: number;

  /** @format int32 */
  numberOfAttachments?: number;

  /** @format int32 */
  numberOfVotes?: number;
}

export interface Category {
  /** @format int32 */
  id?: number;
  name?: string;
  description?: string;

  /**
   * @format int32
   * @min 0
   */
  projectId?: number;
  leader?: User;

  /** @format date-time */
  creationDate?: string;

  /** @format date-time */
  lastUpdatedDate?: string;

  /** @format int32 */
  numberOfRequirements?: number;

  /** @format int32 */
  numberOfFollowers?: number;
  isFollower?: boolean;
}

export interface Comment {
  /** @format int32 */
  id?: number;
  message: string;

  /**
   * @format int32
   * @min 0
   */
  replyToComment?: number;

  /**
   * @format int32
   * @min 0
   */
  requirementId?: number;
  creator?: User;

  /** @format date-time */
  creationDate?: string;

  /** @format date-time */
  lastUpdatedDate?: string;
  _context?: EntityContext;
}

export interface EntityContext {
  user?: User;
  project?: Project;
  categories?: Category[];
  requirement?: Requirement;
  comment?: Comment;
}

export interface Project {
  /** @format int32 */
  id?: number;
  name: string;
  description: string;
  visibility?: boolean;

  /** @format int32 */
  defaultCategoryId?: number;
  leader?: User;

  /** @format date-time */
  creationDate?: string;

  /** @format date-time */
  lastUpdatedDate?: string;

  /** @format int32 */
  numberOfCategories?: number;

  /** @format int32 */
  numberOfRequirements?: number;

  /** @format int32 */
  numberOfFollowers?: number;
  isFollower?: boolean;
}

export interface Requirement {
  /** @format int32 */
  id?: number;
  name?: string;
  description: string;

  /** @format date-time */
  realized?: string;

  /**
   * @format int32
   * @min 0
   */
  projectId?: number;
  creator?: User;
  leadDeveloper?: User;
  categories: Category[];
  attachments?: Attachment[];

  /** @format date-time */
  creationDate?: string;

  /** @format date-time */
  lastUpdatedDate?: string;

  /** @format int32 */
  numberOfComments?: number;

  /** @format int32 */
  numberOfAttachments?: number;

  /** @format int32 */
  numberOfFollowers?: number;

  /** @format int32 */
  upVotes?: number;

  /** @format int32 */
  downVotes?: number;
  userVoted?: "UP_VOTE" | "DOWN_VOTE" | "NO_VOTE";
  isFollower?: boolean;
  isDeveloper?: boolean;
  isContributor?: boolean;
  _context?: EntityContext;
}

export interface CategoryContributors {
  leader?: User;
  requirementCreator?: User[];
  leadDeveloper?: User[];
  developers?: User[];
  commentCreator?: User[];
  attachmentCreator?: User[];
}

export interface PersonalisationData {
  /** @format int32 */
  id?: number;
  key: string;

  /**
   * @format int32
   * @min 0
   */
  version?: number;

  /** @format int32 */
  userId?: number;
  value: string;
}

export interface ProjectContributors {
  leader?: User;
  categoryLeader?: User[];
  requirementCreator?: User[];
  leadDeveloper?: User[];
  developers?: User[];
  commentCreator?: User[];
  attachmentCreator?: User[];
}

export interface RequirementContributors {
  /** @format int32 */
  id?: number;
  creator?: User;
  leadDeveloper?: User;
  developers?: User[];
  commentCreator?: User[];
  attachmentCreator?: User[];
}

export interface EntityOverview {
  projects?: number[];
  categories?: number[];
  requirements?: number[];
  comments?: number[];
  attachments?: number[];
}

export namespace attachments {
  /**
   * No description
   * @tags attachments
   * @name CreateAttachment
   * @summary This method allows to create a new attachment.
   * @request POST:/attachments
   * @secure
   */
  export namespace CreateAttachment {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Attachment;
    export type RequestHeaders = {};
    export type ResponseBody = Attachment;
  }
  /**
   * No description
   * @tags attachments
   * @name GetAttachment
   * @summary This method allows to retrieve a certain attachment
   * @request GET:/attachments/{attachmentId}
   * @secure
   */
  export namespace GetAttachment {
    export type RequestParams = { attachmentId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Attachment;
  }
  /**
   * No description
   * @tags attachments
   * @name DeleteAttachment
   * @summary This method deletes a specific attachment.
   * @request DELETE:/attachments/{attachmentId}
   * @secure
   */
  export namespace DeleteAttachment {
    export type RequestParams = { attachmentId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Attachment;
  }
}

export namespace version {
  /**
   * No description
   * @name GetServiceNameVersion
   * @summary This method allows to retrieve the service name version.
   * @request GET:/version
   * @secure
   */
  export namespace GetServiceNameVersion {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
}

export namespace statistics {
  /**
   * No description
   * @name GetStatistics
   * @summary This method allows to retrieve statistics over all projects.
   * @request GET:/statistics
   * @secure
   */
  export namespace GetStatistics {
    export type RequestParams = {};
    export type RequestQuery = { since?: string };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Statistic;
  }
}

export namespace notifications {
  /**
   * No description
   * @name SendNotifications
   * @summary This method sends all notifications (emails) in the waiting queue. Run this method before shutting down Requirements Bazaar.
   * @request POST:/notifications
   * @secure
   */
  export namespace SendNotifications {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
}

export namespace categories {
  /**
   * No description
   * @tags categories
   * @name CreateCategory
   * @summary This method allows to create a new category under a given a project.
   * @request POST:/categories
   * @secure
   */
  export namespace CreateCategory {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Category;
    export type RequestHeaders = {};
    export type ResponseBody = Category;
  }
  /**
   * No description
   * @tags categories
   * @name GetStatisticsForCategory
   * @summary This method allows to retrieve statistics for one category.
   * @request GET:/categories/{categoryId}/statistics
   * @secure
   */
  export namespace GetStatisticsForCategory {
    export type RequestParams = { categoryId: number };
    export type RequestQuery = { since?: string };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Statistic;
  }
  /**
   * No description
   * @tags categories
   * @name GetFollowersForCategory
   * @summary This method returns the list of followers for a specific category.
   * @request GET:/categories/{categoryId}/followers
   * @secure
   */
  export namespace GetFollowersForCategory {
    export type RequestParams = { categoryId: number };
    export type RequestQuery = { page?: number; per_page?: number };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = User[];
  }
  /**
   * No description
   * @tags categories
   * @name FollowCategory
   * @summary This method add the current user to the followers list of a given category.
   * @request POST:/categories/{categoryId}/followers
   * @secure
   */
  export namespace FollowCategory {
    export type RequestParams = { categoryId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Category;
  }
  /**
   * No description
   * @tags categories
   * @name UnfollowCategory
   * @summary This method removes the current user from a followers list of a given category.
   * @request DELETE:/categories/{categoryId}/followers
   * @secure
   */
  export namespace UnfollowCategory {
    export type RequestParams = { categoryId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Category;
  }
  /**
   * No description
   * @tags categories
   * @name GetRequirementsForCategory
   * @summary This method returns the list of requirements for a specific category.
   * @request GET:/categories/{categoryId}/requirements
   * @secure
   */
  export namespace GetRequirementsForCategory {
    export type RequestParams = { categoryId: number };
    export type RequestQuery = {
      page?: number;
      per_page?: number;
      search?: string;
      state?: "all" | "open" | "realized";
      sort?: ("date" | "last_activity" | "name" | "vote" | "comment" | "follower")[];
      sortDirection?: "ASC" | "DESC";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Requirement[];
  }
  /**
   * No description
   * @tags categories
   * @name GetCategory
   * @summary This method allows to retrieve a certain category.
   * @request GET:/categories/{categoryId}
   * @secure
   */
  export namespace GetCategory {
    export type RequestParams = { categoryId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Category;
  }
  /**
   * No description
   * @tags categories
   * @name UpdateCategory
   * @summary This method allows to update a certain category.
   * @request PUT:/categories/{categoryId}
   * @secure
   */
  export namespace UpdateCategory {
    export type RequestParams = { categoryId: number };
    export type RequestQuery = {};
    export type RequestBody = Category;
    export type RequestHeaders = {};
    export type ResponseBody = Category;
  }
  /**
   * No description
   * @tags categories
   * @name DeleteCategory
   * @summary This method deletes a specific category.
   * @request DELETE:/categories/{categoryId}
   * @secure
   */
  export namespace DeleteCategory {
    export type RequestParams = { categoryId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Category;
  }
  /**
   * No description
   * @tags categories
   * @name GetContributorsForCategory
   * @summary This method returns the list of contributors for a specific category.
   * @request GET:/categories/{categoryId}/contributors
   * @secure
   */
  export namespace GetContributorsForCategory {
    export type RequestParams = { categoryId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CategoryContributors;
  }
}

export namespace comments {
  /**
   * No description
   * @tags comments
   * @name GetComment
   * @summary This method allows to retrieve a certain comment
   * @request GET:/comments/{commentId}
   * @secure
   */
  export namespace GetComment {
    export type RequestParams = { commentId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Comment;
  }
  /**
   * No description
   * @tags comments
   * @name DeleteComment
   * @summary This method deletes a specific comment.
   * @request DELETE:/comments/{commentId}
   * @secure
   */
  export namespace DeleteComment {
    export type RequestParams = { commentId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Comment;
  }
  /**
   * No description
   * @tags comments
   * @name GetAllComments
   * @summary This method returns the list of comments on the server.
   * @request GET:/comments
   * @secure
   */
  export namespace GetAllComments {
    export type RequestParams = {};
    export type RequestQuery = {
      page?: number;
      per_page?: number;
      search?: string;
      sort?: ("name" | "date")[];
      sortDirection?: "ASC" | "DESC";
      filters: ("created" | "following" | "replies")[];
      embedParents: ("project" | "requirement")[];
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Comment[];
  }
  /**
   * No description
   * @tags comments
   * @name CreateComment
   * @summary This method allows to create a new comment.
   * @request POST:/comments
   * @secure
   */
  export namespace CreateComment {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Comment;
    export type RequestHeaders = {};
    export type ResponseBody = Comment;
  }
}

export namespace personalisation {
  /**
   * No description
   * @tags personalisation
   * @name GetPersonalisationData
   * @summary This method allows to retrieve a certain personalisationData value
   * @request GET:/personalisation/{key}-{version}
   * @secure
   */
  export namespace GetPersonalisationData {
    export type RequestParams = { key: string; version: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PersonalisationData;
  }
  /**
   * No description
   * @tags personalisation
   * @name SetPersonalisationData
   * @summary This method allows to save a personalisationData item
   * @request PUT:/personalisation/{key}-{version}
   * @secure
   */
  export namespace SetPersonalisationData {
    export type RequestParams = { key: string; version: number };
    export type RequestQuery = {};
    export type RequestBody = PersonalisationData;
    export type RequestHeaders = {};
    export type ResponseBody = PersonalisationData;
  }
}

export namespace projects {
  /**
   * No description
   * @tags projects
   * @name GetProjects
   * @summary This method returns the list of projects on the server.
   * @request GET:/projects
   * @secure
   */
  export namespace GetProjects {
    export type RequestParams = {};
    export type RequestQuery = {
      page?: number;
      per_page?: number;
      search?: string;
      sort?: ("name" | "date" | "last_activity" | "requirement" | "follower")[];
      sortDirection?: "ASC" | "DESC";
      filters?: ("all" | "created" | "following")[];
      ids?: number[];
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Project[];
  }
  /**
   * No description
   * @tags projects
   * @name CreateProject
   * @summary This method allows to create a new project.
   * @request POST:/projects
   * @secure
   */
  export namespace CreateProject {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Project;
    export type RequestHeaders = {};
    export type ResponseBody = Project;
  }
  /**
   * No description
   * @tags projects
   * @name GetStatisticsForProject
   * @summary This method allows to retrieve statistics for one project.
   * @request GET:/projects/{projectId}/statistics
   * @secure
   */
  export namespace GetStatisticsForProject {
    export type RequestParams = { projectId: number };
    export type RequestQuery = { since?: string };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Statistic;
  }
  /**
   * No description
   * @tags projects
   * @name GetFollowersForProject
   * @summary This method returns the list of followers for a specific project.
   * @request GET:/projects/{projectId}/followers
   * @secure
   */
  export namespace GetFollowersForProject {
    export type RequestParams = { projectId: number };
    export type RequestQuery = { page?: number; per_page?: number };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = User[];
  }
  /**
   * No description
   * @tags projects
   * @name FollowProject
   * @summary This method add the current user to the followers list of a given project.
   * @request POST:/projects/{projectId}/followers
   * @secure
   */
  export namespace FollowProject {
    export type RequestParams = { projectId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Project;
  }
  /**
   * No description
   * @tags projects
   * @name UnfollowProject
   * @summary This method removes the current user from a followers list of a given project.
   * @request DELETE:/projects/{projectId}/followers
   * @secure
   */
  export namespace UnfollowProject {
    export type RequestParams = { projectId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Project;
  }
  /**
   * No description
   * @tags projects
   * @name GetCategoriesForProject
   * @summary This method returns the list of categories under a given project.
   * @request GET:/projects/{projectId}/categories
   * @secure
   */
  export namespace GetCategoriesForProject {
    export type RequestParams = { projectId: number };
    export type RequestQuery = {
      page?: number;
      per_page?: number;
      search?: string;
      sort?: ("name" | "date" | "last_activity" | "requirement" | "follower")[];
      sortDirection?: "ASC" | "DESC";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Category[];
  }
  /**
   * No description
   * @tags projects
   * @name GetRequirementsForProject
   * @summary This method returns the list of requirements for a specific project.
   * @request GET:/projects/{projectId}/requirements
   * @secure
   */
  export namespace GetRequirementsForProject {
    export type RequestParams = { projectId: number };
    export type RequestQuery = {
      page?: number;
      per_page?: number;
      search?: string;
      state?: "all" | "open" | "realized";
      sort?: ("date" | "last_activity" | "name" | "vote" | "comment" | "follower")[];
      sortDirection?: "ASC" | "DESC";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Requirement[];
  }
  /**
   * No description
   * @tags projects
   * @name GetProject
   * @summary This method allows to retrieve a certain project.
   * @request GET:/projects/{projectId}
   * @secure
   */
  export namespace GetProject {
    export type RequestParams = { projectId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Project;
  }
  /**
   * No description
   * @tags projects
   * @name UpdateProject
   * @summary This method allows to update a certain project.
   * @request PUT:/projects/{projectId}
   * @secure
   */
  export namespace UpdateProject {
    export type RequestParams = { projectId: number };
    export type RequestQuery = {};
    export type RequestBody = Project;
    export type RequestHeaders = {};
    export type ResponseBody = Project;
  }
  /**
   * No description
   * @tags projects
   * @name GetContributorsForProject
   * @summary This method returns the list of contributors for a specific project.
   * @request GET:/projects/{projectId}/contributors
   * @secure
   */
  export namespace GetContributorsForProject {
    export type RequestParams = { projectId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ProjectContributors;
  }
}

export namespace requirements {
  /**
   * No description
   * @tags requirements
   * @name GetRequirements
   * @summary This method returns the list of requirements on the server.
   * @request GET:/requirements
   * @secure
   */
  export namespace GetRequirements {
    export type RequestParams = {};
    export type RequestQuery = {
      page?: number;
      per_page?: number;
      search?: string;
      sort?: ("name" | "date" | "last_activity" | "requirement" | "follower")[];
      sortDirection?: "ASC" | "DESC";
      filters: ("created" | "following")[];
      embedParents: "project"[];
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Requirement[];
  }
  /**
   * No description
   * @tags requirements
   * @name CreateRequirement
   * @summary This method allows to create a new requirement.
   * @request POST:/requirements
   * @secure
   */
  export namespace CreateRequirement {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = Requirement;
    export type RequestHeaders = {};
    export type ResponseBody = Requirement;
  }
  /**
   * No description
   * @tags requirements
   * @name GetStatisticsForRequirement
   * @summary This method allows to retrieve statistics for one requirement.
   * @request GET:/requirements/{requirementId}/statistics
   * @secure
   */
  export namespace GetStatisticsForRequirement {
    export type RequestParams = { requirementId: number };
    export type RequestQuery = { since?: string };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Statistic;
  }
  /**
   * No description
   * @tags requirements
   * @name GetFollowersForRequirement
   * @summary This method returns the list of followers for a specific requirement.
   * @request GET:/requirements/{requirementId}/followers
   * @secure
   */
  export namespace GetFollowersForRequirement {
    export type RequestParams = { requirementId: number };
    export type RequestQuery = { page?: number; per_page?: number };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = User[];
  }
  /**
   * No description
   * @tags requirements
   * @name FollowRequirement
   * @summary This method add the current user to the followers list of a given requirement.
   * @request POST:/requirements/{requirementId}/followers
   * @secure
   */
  export namespace FollowRequirement {
    export type RequestParams = { requirementId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Requirement;
  }
  /**
   * No description
   * @tags requirements
   * @name UnfollowRequirement
   * @summary This method removes the current user from a followers list of a given requirement.
   * @request DELETE:/requirements/{requirementId}/followers
   * @secure
   */
  export namespace UnfollowRequirement {
    export type RequestParams = { requirementId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Requirement;
  }
  /**
   * No description
   * @tags requirements
   * @name Vote
   * @summary This method creates a vote for the given requirement in the name of the current user.
   * @request POST:/requirements/{requirementId}/votes
   * @secure
   */
  export namespace Vote {
    export type RequestParams = { requirementId: number };
    export type RequestQuery = { direction?: "up" | "down" };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Requirement;
  }
  /**
   * No description
   * @tags requirements
   * @name Unvote
   * @summary This method removes the vote of the given requirement made by the current user.
   * @request DELETE:/requirements/{requirementId}/votes
   * @secure
   */
  export namespace Unvote {
    export type RequestParams = { requirementId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Requirement;
  }
  /**
   * No description
   * @tags requirements
   * @name GetCommentsForRequirement
   * @summary This method returns the list of comments for a specific requirement.
   * @request GET:/requirements/{requirementId}/comments
   * @secure
   */
  export namespace GetCommentsForRequirement {
    export type RequestParams = { requirementId: number };
    export type RequestQuery = { page?: number; per_page?: number };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Comment[];
  }
  /**
   * No description
   * @tags requirements
   * @name GetAttachmentsForRequirement
   * @summary This method returns the list of attachments for a specific requirement.
   * @request GET:/requirements/{requirementId}/attachments
   * @secure
   */
  export namespace GetAttachmentsForRequirement {
    export type RequestParams = { requirementId: number };
    export type RequestQuery = { page?: number; per_page?: number };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Attachment[];
  }
  /**
   * No description
   * @tags requirements
   * @name GetRequirement
   * @summary This method returns a specific requirement.
   * @request GET:/requirements/{requirementId}
   * @secure
   */
  export namespace GetRequirement {
    export type RequestParams = { requirementId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Requirement;
  }
  /**
   * No description
   * @tags requirements
   * @name UpdateRequirement
   * @summary This method updates a specific requirement.
   * @request PUT:/requirements/{requirementId}
   * @secure
   */
  export namespace UpdateRequirement {
    export type RequestParams = { requirementId: number };
    export type RequestQuery = {};
    export type RequestBody = Requirement;
    export type RequestHeaders = {};
    export type ResponseBody = Requirement;
  }
  /**
   * No description
   * @tags requirements
   * @name DeleteRequirement
   * @summary This method deletes a specific requirement.
   * @request DELETE:/requirements/{requirementId}
   * @secure
   */
  export namespace DeleteRequirement {
    export type RequestParams = { requirementId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Requirement;
  }
  /**
   * No description
   * @tags requirements
   * @name LeaddevelopRequirement
   * @summary This method set the current user as lead developer for a given requirement.
   * @request POST:/requirements/{requirementId}/leaddevelopers
   * @secure
   */
  export namespace LeaddevelopRequirement {
    export type RequestParams = { requirementId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Requirement;
  }
  /**
   * No description
   * @tags requirements
   * @name UnleaddevelopRequirement
   * @summary This method removes the current user as lead developer for a given requirement.
   * @request DELETE:/requirements/{requirementId}/leaddevelopers
   * @secure
   */
  export namespace UnleaddevelopRequirement {
    export type RequestParams = { requirementId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Requirement;
  }
  /**
   * No description
   * @tags requirements
   * @name GetDevelopersForRequirement
   * @summary This method returns the list of developers for a specific requirement.
   * @request GET:/requirements/{requirementId}/developers
   * @secure
   */
  export namespace GetDevelopersForRequirement {
    export type RequestParams = { requirementId: number };
    export type RequestQuery = { page?: number; per_page?: number };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = User[];
  }
  /**
   * No description
   * @tags requirements
   * @name DevelopRequirement
   * @summary This method add the current user to the developers list of a given requirement.
   * @request POST:/requirements/{requirementId}/developers
   * @secure
   */
  export namespace DevelopRequirement {
    export type RequestParams = { requirementId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Requirement;
  }
  /**
   * No description
   * @tags requirements
   * @name UndevelopRequirement
   * @summary This method remove the current user from a developers list of a given requirement.
   * @request DELETE:/requirements/{requirementId}/developers
   * @secure
   */
  export namespace UndevelopRequirement {
    export type RequestParams = { requirementId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Requirement;
  }
  /**
   * No description
   * @tags requirements
   * @name Realize
   * @summary This method set the realized field to now for a given requirement.
   * @request POST:/requirements/{requirementId}/realized
   * @secure
   */
  export namespace Realize {
    export type RequestParams = { requirementId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Requirement;
  }
  /**
   * No description
   * @tags requirements
   * @name Unrealize
   * @summary This method removes the realized information for the given requirement.
   * @request DELETE:/requirements/{requirementId}/realized
   * @secure
   */
  export namespace Unrealize {
    export type RequestParams = { requirementId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Requirement;
  }
  /**
   * No description
   * @tags requirements
   * @name GetContributorsForRequirement
   * @summary This method returns the list of contributors for a specific requirement.
   * @request GET:/requirements/{requirementId}/contributors
   * @secure
   */
  export namespace GetContributorsForRequirement {
    export type RequestParams = { requirementId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = RequirementContributors;
  }
}

export namespace users {
  /**
   * No description
   * @tags users
   * @name GetUser
   * @summary This method allows to retrieve a certain user.
   * @request GET:/users/{userId}
   * @secure
   */
  export namespace GetUser {
    export type RequestParams = { userId: number };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = User;
  }
  /**
   * No description
   * @tags users
   * @name UpdateUser
   * @summary This method allows to update the user profile.
   * @request PUT:/users/{userId}
   * @secure
   */
  export namespace UpdateUser {
    export type RequestParams = { userId: number };
    export type RequestQuery = {};
    export type RequestBody = User;
    export type RequestHeaders = {};
    export type ResponseBody = User;
  }
  /**
   * No description
   * @tags users
   * @name GetActiveUser
   * @summary This method allows to retrieve the active user.
   * @request GET:/users/me
   * @secure
   */
  export namespace GetActiveUser {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = User;
  }
  /**
   * No description
   * @tags users
   * @name GetEntityOverview
   * @summary This method allows to receive an overview of entities related to the user
   * @request GET:/users/me/entities
   * @secure
   */
  export namespace GetEntityOverview {
    export type RequestParams = {};
    export type RequestQuery = {
      search?: string;
      include: ("projects" | "categories" | "requirements")[];
      sort?: ("name" | "date" | "last_activity" | "requirement" | "follower")[];
      sortDirection?: "ASC" | "DESC";
      filters?: ("created" | "following" | "developing")[];
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = EntityOverview;
  }
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "/bazaar/";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  private addQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];

    return (
      encodeURIComponent(key) +
      "=" +
      encodeURIComponent(Array.isArray(value) ? value.join(",") : typeof value === "number" ? value : `${value}`)
    );
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) =>
        typeof query[key] === "object" && !Array.isArray(query[key])
          ? this.toQueryString(query[key] as QueryParamsType)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((data, key) => {
        data.append(key, input[key]);
        return data;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  private mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  private createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format = "json",
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams = (secure && this.securityWorker && (await this.securityWorker(this.securityData))) || {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];

    return fetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
        ...(requestParams.headers || {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : void 0,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = (null as unknown) as T;
      r.error = (null as unknown) as E;

      const data = await response[format]()
        .then((data) => {
          if (r.ok) {
            r.data = data;
          } else {
            r.error = data;
          }
          return r;
        })
        .catch((e) => {
          r.error = e;
          return r;
        });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Requirements Bazaar
 * @version 0.9.0
 * @license Apache2 (http://requirements-bazaar.org/license)
 * @termsOfService http://requirements-bazaar.org
 * @baseUrl /bazaar/
 * @contact Requirements Bazaar Dev Team <info@requirements-bazaar.org> (http://requirements-bazaar.org)
 *
 * Requirements Bazaar project
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  attachments = {
    /**
     * No description
     *
     * @tags attachments
     * @name CreateAttachment
     * @summary This method allows to create a new attachment.
     * @request POST:/attachments
     * @secure
     */
    createAttachment: (body: Attachment, params: RequestParams = {}) =>
      this.request<Attachment, void>({
        path: `/attachments`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags attachments
     * @name GetAttachment
     * @summary This method allows to retrieve a certain attachment
     * @request GET:/attachments/{attachmentId}
     * @secure
     */
    getAttachment: (attachmentId: number, params: RequestParams = {}) =>
      this.request<Attachment, void>({
        path: `/attachments/${attachmentId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags attachments
     * @name DeleteAttachment
     * @summary This method deletes a specific attachment.
     * @request DELETE:/attachments/{attachmentId}
     * @secure
     */
    deleteAttachment: (attachmentId: number, params: RequestParams = {}) =>
      this.request<Attachment, void>({
        path: `/attachments/${attachmentId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  version = {
    /**
     * No description
     *
     * @name GetServiceNameVersion
     * @summary This method allows to retrieve the service name version.
     * @request GET:/version
     * @secure
     */
    getServiceNameVersion: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/version`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  statistics = {
    /**
     * No description
     *
     * @name GetStatistics
     * @summary This method allows to retrieve statistics over all projects.
     * @request GET:/statistics
     * @secure
     */
    getStatistics: (query?: { since?: string }, params: RequestParams = {}) =>
      this.request<Statistic, void>({
        path: `/statistics`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  notifications = {
    /**
     * No description
     *
     * @name SendNotifications
     * @summary This method sends all notifications (emails) in the waiting queue. Run this method before shutting down Requirements Bazaar.
     * @request POST:/notifications
     * @secure
     */
    sendNotifications: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/notifications`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  categories = {
    /**
     * No description
     *
     * @tags categories
     * @name CreateCategory
     * @summary This method allows to create a new category under a given a project.
     * @request POST:/categories
     * @secure
     */
    createCategory: (body: Category, params: RequestParams = {}) =>
      this.request<Category, void>({
        path: `/categories`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags categories
     * @name GetStatisticsForCategory
     * @summary This method allows to retrieve statistics for one category.
     * @request GET:/categories/{categoryId}/statistics
     * @secure
     */
    getStatisticsForCategory: (categoryId: number, query?: { since?: string }, params: RequestParams = {}) =>
      this.request<Statistic, void>({
        path: `/categories/${categoryId}/statistics`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags categories
     * @name GetFollowersForCategory
     * @summary This method returns the list of followers for a specific category.
     * @request GET:/categories/{categoryId}/followers
     * @secure
     */
    getFollowersForCategory: (
      categoryId: number,
      query?: { page?: number; per_page?: number },
      params: RequestParams = {},
    ) =>
      this.request<User[], void>({
        path: `/categories/${categoryId}/followers`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags categories
     * @name FollowCategory
     * @summary This method add the current user to the followers list of a given category.
     * @request POST:/categories/{categoryId}/followers
     * @secure
     */
    followCategory: (categoryId: number, params: RequestParams = {}) =>
      this.request<Category, void>({
        path: `/categories/${categoryId}/followers`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags categories
     * @name UnfollowCategory
     * @summary This method removes the current user from a followers list of a given category.
     * @request DELETE:/categories/{categoryId}/followers
     * @secure
     */
    unfollowCategory: (categoryId: number, params: RequestParams = {}) =>
      this.request<Category, void>({
        path: `/categories/${categoryId}/followers`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags categories
     * @name GetRequirementsForCategory
     * @summary This method returns the list of requirements for a specific category.
     * @request GET:/categories/{categoryId}/requirements
     * @secure
     */
    getRequirementsForCategory: (
      categoryId: number,
      query?: {
        page?: number;
        per_page?: number;
        search?: string;
        state?: "all" | "open" | "realized";
        sort?: ("date" | "last_activity" | "name" | "vote" | "comment" | "follower")[];
        sortDirection?: "ASC" | "DESC";
      },
      params: RequestParams = {},
    ) =>
      this.request<Requirement[], void>({
        path: `/categories/${categoryId}/requirements`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags categories
     * @name GetCategory
     * @summary This method allows to retrieve a certain category.
     * @request GET:/categories/{categoryId}
     * @secure
     */
    getCategory: (categoryId: number, params: RequestParams = {}) =>
      this.request<Category, void>({
        path: `/categories/${categoryId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags categories
     * @name UpdateCategory
     * @summary This method allows to update a certain category.
     * @request PUT:/categories/{categoryId}
     * @secure
     */
    updateCategory: (categoryId: number, body: Category, params: RequestParams = {}) =>
      this.request<Category, void>({
        path: `/categories/${categoryId}`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags categories
     * @name DeleteCategory
     * @summary This method deletes a specific category.
     * @request DELETE:/categories/{categoryId}
     * @secure
     */
    deleteCategory: (categoryId: number, params: RequestParams = {}) =>
      this.request<Category, void>({
        path: `/categories/${categoryId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags categories
     * @name GetContributorsForCategory
     * @summary This method returns the list of contributors for a specific category.
     * @request GET:/categories/{categoryId}/contributors
     * @secure
     */
    getContributorsForCategory: (categoryId: number, params: RequestParams = {}) =>
      this.request<CategoryContributors, void>({
        path: `/categories/${categoryId}/contributors`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  comments = {
    /**
     * No description
     *
     * @tags comments
     * @name GetComment
     * @summary This method allows to retrieve a certain comment
     * @request GET:/comments/{commentId}
     * @secure
     */
    getComment: (commentId: number, params: RequestParams = {}) =>
      this.request<Comment, void>({
        path: `/comments/${commentId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags comments
     * @name DeleteComment
     * @summary This method deletes a specific comment.
     * @request DELETE:/comments/{commentId}
     * @secure
     */
    deleteComment: (commentId: number, params: RequestParams = {}) =>
      this.request<Comment, void>({
        path: `/comments/${commentId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags comments
     * @name GetAllComments
     * @summary This method returns the list of comments on the server.
     * @request GET:/comments
     * @secure
     */
    getAllComments: (
      query: {
        page?: number;
        per_page?: number;
        search?: string;
        sort?: ("name" | "date")[];
        sortDirection?: "ASC" | "DESC";
        filters: ("created" | "following" | "replies")[];
        embedParents: ("project" | "requirement")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<Comment[], void>({
        path: `/comments`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags comments
     * @name CreateComment
     * @summary This method allows to create a new comment.
     * @request POST:/comments
     * @secure
     */
    createComment: (body: Comment, params: RequestParams = {}) =>
      this.request<Comment, void>({
        path: `/comments`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  personalisation = {
    /**
     * No description
     *
     * @tags personalisation
     * @name GetPersonalisationData
     * @summary This method allows to retrieve a certain personalisationData value
     * @request GET:/personalisation/{key}-{version}
     * @secure
     */
    getPersonalisationData: (key: string, version: number, params: RequestParams = {}) =>
      this.request<PersonalisationData, void>({
        path: `/personalisation/${key}-${version}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags personalisation
     * @name SetPersonalisationData
     * @summary This method allows to save a personalisationData item
     * @request PUT:/personalisation/{key}-{version}
     * @secure
     */
    setPersonalisationData: (key: string, version: number, body: PersonalisationData, params: RequestParams = {}) =>
      this.request<PersonalisationData, void>({
        path: `/personalisation/${key}-${version}`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  projects = {
    /**
     * No description
     *
     * @tags projects
     * @name GetProjects
     * @summary This method returns the list of projects on the server.
     * @request GET:/projects
     * @secure
     */
    getProjects: (
      query?: {
        page?: number;
        per_page?: number;
        search?: string;
        sort?: ("name" | "date" | "last_activity" | "requirement" | "follower")[];
        sortDirection?: "ASC" | "DESC";
        filters?: ("all" | "created" | "following")[];
        ids?: number[];
      },
      params: RequestParams = {},
    ) =>
      this.request<Project[], void>({
        path: `/projects`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags projects
     * @name CreateProject
     * @summary This method allows to create a new project.
     * @request POST:/projects
     * @secure
     */
    createProject: (body: Project, params: RequestParams = {}) =>
      this.request<Project, void>({
        path: `/projects`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags projects
     * @name GetStatisticsForProject
     * @summary This method allows to retrieve statistics for one project.
     * @request GET:/projects/{projectId}/statistics
     * @secure
     */
    getStatisticsForProject: (projectId: number, query?: { since?: string }, params: RequestParams = {}) =>
      this.request<Statistic, void>({
        path: `/projects/${projectId}/statistics`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags projects
     * @name GetFollowersForProject
     * @summary This method returns the list of followers for a specific project.
     * @request GET:/projects/{projectId}/followers
     * @secure
     */
    getFollowersForProject: (
      projectId: number,
      query?: { page?: number; per_page?: number },
      params: RequestParams = {},
    ) =>
      this.request<User[], void>({
        path: `/projects/${projectId}/followers`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags projects
     * @name FollowProject
     * @summary This method add the current user to the followers list of a given project.
     * @request POST:/projects/{projectId}/followers
     * @secure
     */
    followProject: (projectId: number, params: RequestParams = {}) =>
      this.request<Project, void>({
        path: `/projects/${projectId}/followers`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags projects
     * @name UnfollowProject
     * @summary This method removes the current user from a followers list of a given project.
     * @request DELETE:/projects/{projectId}/followers
     * @secure
     */
    unfollowProject: (projectId: number, params: RequestParams = {}) =>
      this.request<Project, void>({
        path: `/projects/${projectId}/followers`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags projects
     * @name GetCategoriesForProject
     * @summary This method returns the list of categories under a given project.
     * @request GET:/projects/{projectId}/categories
     * @secure
     */
    getCategoriesForProject: (
      projectId: number,
      query?: {
        page?: number;
        per_page?: number;
        search?: string;
        sort?: ("name" | "date" | "last_activity" | "requirement" | "follower")[];
        sortDirection?: "ASC" | "DESC";
      },
      params: RequestParams = {},
    ) =>
      this.request<Category[], void>({
        path: `/projects/${projectId}/categories`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags projects
     * @name GetRequirementsForProject
     * @summary This method returns the list of requirements for a specific project.
     * @request GET:/projects/{projectId}/requirements
     * @secure
     */
    getRequirementsForProject: (
      projectId: number,
      query?: {
        page?: number;
        per_page?: number;
        search?: string;
        state?: "all" | "open" | "realized";
        sort?: ("date" | "last_activity" | "name" | "vote" | "comment" | "follower")[];
        sortDirection?: "ASC" | "DESC";
      },
      params: RequestParams = {},
    ) =>
      this.request<Requirement[], void>({
        path: `/projects/${projectId}/requirements`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags projects
     * @name GetProject
     * @summary This method allows to retrieve a certain project.
     * @request GET:/projects/{projectId}
     * @secure
     */
    getProject: (projectId: number, params: RequestParams = {}) =>
      this.request<Project, void>({
        path: `/projects/${projectId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags projects
     * @name UpdateProject
     * @summary This method allows to update a certain project.
     * @request PUT:/projects/{projectId}
     * @secure
     */
    updateProject: (projectId: number, body: Project, params: RequestParams = {}) =>
      this.request<Project, void>({
        path: `/projects/${projectId}`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags projects
     * @name GetContributorsForProject
     * @summary This method returns the list of contributors for a specific project.
     * @request GET:/projects/{projectId}/contributors
     * @secure
     */
    getContributorsForProject: (projectId: number, params: RequestParams = {}) =>
      this.request<ProjectContributors, void>({
        path: `/projects/${projectId}/contributors`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  requirements = {
    /**
     * No description
     *
     * @tags requirements
     * @name GetRequirements
     * @summary This method returns the list of requirements on the server.
     * @request GET:/requirements
     * @secure
     */
    getRequirements: (
      query: {
        page?: number;
        per_page?: number;
        search?: string;
        sort?: ("name" | "date" | "last_activity" | "requirement" | "follower")[];
        sortDirection?: "ASC" | "DESC";
        filters: ("created" | "following")[];
        embedParents: "project"[];
      },
      params: RequestParams = {},
    ) =>
      this.request<Requirement[], void>({
        path: `/requirements`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name CreateRequirement
     * @summary This method allows to create a new requirement.
     * @request POST:/requirements
     * @secure
     */
    createRequirement: (body: Requirement, params: RequestParams = {}) =>
      this.request<Requirement, void>({
        path: `/requirements`,
        method: "POST",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name GetStatisticsForRequirement
     * @summary This method allows to retrieve statistics for one requirement.
     * @request GET:/requirements/{requirementId}/statistics
     * @secure
     */
    getStatisticsForRequirement: (requirementId: number, query?: { since?: string }, params: RequestParams = {}) =>
      this.request<Statistic, void>({
        path: `/requirements/${requirementId}/statistics`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name GetFollowersForRequirement
     * @summary This method returns the list of followers for a specific requirement.
     * @request GET:/requirements/{requirementId}/followers
     * @secure
     */
    getFollowersForRequirement: (
      requirementId: number,
      query?: { page?: number; per_page?: number },
      params: RequestParams = {},
    ) =>
      this.request<User[], void>({
        path: `/requirements/${requirementId}/followers`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name FollowRequirement
     * @summary This method add the current user to the followers list of a given requirement.
     * @request POST:/requirements/{requirementId}/followers
     * @secure
     */
    followRequirement: (requirementId: number, params: RequestParams = {}) =>
      this.request<Requirement, void>({
        path: `/requirements/${requirementId}/followers`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name UnfollowRequirement
     * @summary This method removes the current user from a followers list of a given requirement.
     * @request DELETE:/requirements/{requirementId}/followers
     * @secure
     */
    unfollowRequirement: (requirementId: number, params: RequestParams = {}) =>
      this.request<Requirement, void>({
        path: `/requirements/${requirementId}/followers`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name Vote
     * @summary This method creates a vote for the given requirement in the name of the current user.
     * @request POST:/requirements/{requirementId}/votes
     * @secure
     */
    vote: (requirementId: number, query?: { direction?: "up" | "down" }, params: RequestParams = {}) =>
      this.request<Requirement, void>({
        path: `/requirements/${requirementId}/votes`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name Unvote
     * @summary This method removes the vote of the given requirement made by the current user.
     * @request DELETE:/requirements/{requirementId}/votes
     * @secure
     */
    unvote: (requirementId: number, params: RequestParams = {}) =>
      this.request<Requirement, void>({
        path: `/requirements/${requirementId}/votes`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name GetCommentsForRequirement
     * @summary This method returns the list of comments for a specific requirement.
     * @request GET:/requirements/{requirementId}/comments
     * @secure
     */
    getCommentsForRequirement: (
      requirementId: number,
      query?: { page?: number; per_page?: number },
      params: RequestParams = {},
    ) =>
      this.request<Comment[], void>({
        path: `/requirements/${requirementId}/comments`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name GetAttachmentsForRequirement
     * @summary This method returns the list of attachments for a specific requirement.
     * @request GET:/requirements/{requirementId}/attachments
     * @secure
     */
    getAttachmentsForRequirement: (
      requirementId: number,
      query?: { page?: number; per_page?: number },
      params: RequestParams = {},
    ) =>
      this.request<Attachment[], void>({
        path: `/requirements/${requirementId}/attachments`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name GetRequirement
     * @summary This method returns a specific requirement.
     * @request GET:/requirements/{requirementId}
     * @secure
     */
    getRequirement: (requirementId: number, params: RequestParams = {}) =>
      this.request<Requirement, void>({
        path: `/requirements/${requirementId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name UpdateRequirement
     * @summary This method updates a specific requirement.
     * @request PUT:/requirements/{requirementId}
     * @secure
     */
    updateRequirement: (requirementId: number, body: Requirement, params: RequestParams = {}) =>
      this.request<Requirement, void>({
        path: `/requirements/${requirementId}`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name DeleteRequirement
     * @summary This method deletes a specific requirement.
     * @request DELETE:/requirements/{requirementId}
     * @secure
     */
    deleteRequirement: (requirementId: number, params: RequestParams = {}) =>
      this.request<Requirement, void>({
        path: `/requirements/${requirementId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name LeaddevelopRequirement
     * @summary This method set the current user as lead developer for a given requirement.
     * @request POST:/requirements/{requirementId}/leaddevelopers
     * @secure
     */
    leaddevelopRequirement: (requirementId: number, params: RequestParams = {}) =>
      this.request<Requirement, void>({
        path: `/requirements/${requirementId}/leaddevelopers`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name UnleaddevelopRequirement
     * @summary This method removes the current user as lead developer for a given requirement.
     * @request DELETE:/requirements/{requirementId}/leaddevelopers
     * @secure
     */
    unleaddevelopRequirement: (requirementId: number, params: RequestParams = {}) =>
      this.request<Requirement, void>({
        path: `/requirements/${requirementId}/leaddevelopers`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name GetDevelopersForRequirement
     * @summary This method returns the list of developers for a specific requirement.
     * @request GET:/requirements/{requirementId}/developers
     * @secure
     */
    getDevelopersForRequirement: (
      requirementId: number,
      query?: { page?: number; per_page?: number },
      params: RequestParams = {},
    ) =>
      this.request<User[], void>({
        path: `/requirements/${requirementId}/developers`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name DevelopRequirement
     * @summary This method add the current user to the developers list of a given requirement.
     * @request POST:/requirements/{requirementId}/developers
     * @secure
     */
    developRequirement: (requirementId: number, params: RequestParams = {}) =>
      this.request<Requirement, void>({
        path: `/requirements/${requirementId}/developers`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name UndevelopRequirement
     * @summary This method remove the current user from a developers list of a given requirement.
     * @request DELETE:/requirements/{requirementId}/developers
     * @secure
     */
    undevelopRequirement: (requirementId: number, params: RequestParams = {}) =>
      this.request<Requirement, void>({
        path: `/requirements/${requirementId}/developers`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name Realize
     * @summary This method set the realized field to now for a given requirement.
     * @request POST:/requirements/{requirementId}/realized
     * @secure
     */
    realize: (requirementId: number, params: RequestParams = {}) =>
      this.request<Requirement, void>({
        path: `/requirements/${requirementId}/realized`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name Unrealize
     * @summary This method removes the realized information for the given requirement.
     * @request DELETE:/requirements/{requirementId}/realized
     * @secure
     */
    unrealize: (requirementId: number, params: RequestParams = {}) =>
      this.request<Requirement, void>({
        path: `/requirements/${requirementId}/realized`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requirements
     * @name GetContributorsForRequirement
     * @summary This method returns the list of contributors for a specific requirement.
     * @request GET:/requirements/{requirementId}/contributors
     * @secure
     */
    getContributorsForRequirement: (requirementId: number, params: RequestParams = {}) =>
      this.request<RequirementContributors, void>({
        path: `/requirements/${requirementId}/contributors`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags users
     * @name GetUser
     * @summary This method allows to retrieve a certain user.
     * @request GET:/users/{userId}
     * @secure
     */
    getUser: (userId: number, params: RequestParams = {}) =>
      this.request<User, void>({
        path: `/users/${userId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UpdateUser
     * @summary This method allows to update the user profile.
     * @request PUT:/users/{userId}
     * @secure
     */
    updateUser: (userId: number, body: User, params: RequestParams = {}) =>
      this.request<User, void>({
        path: `/users/${userId}`,
        method: "PUT",
        body: body,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name GetActiveUser
     * @summary This method allows to retrieve the active user.
     * @request GET:/users/me
     * @secure
     */
    getActiveUser: (params: RequestParams = {}) =>
      this.request<User, void>({
        path: `/users/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name GetEntityOverview
     * @summary This method allows to receive an overview of entities related to the user
     * @request GET:/users/me/entities
     * @secure
     */
    getEntityOverview: (
      query: {
        search?: string;
        include: ("projects" | "categories" | "requirements")[];
        sort?: ("name" | "date" | "last_activity" | "requirement" | "follower")[];
        sortDirection?: "ASC" | "DESC";
        filters?: ("created" | "following" | "developing")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<EntityOverview, void>({
        path: `/users/me/entities`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
