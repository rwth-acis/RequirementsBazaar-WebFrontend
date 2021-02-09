/* tslint:disable */
/* eslint-disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Attachment {
  id?: number;
  name?: string;
  description?: string;
  mimeType?: string;
  identifier?: string;
  fileUrl?: string;
  requirementId?: number;
  creator?: User;
  creationDate?: string;
  lastUpdatedDate?: string;
}

export interface User {
  id?: number;
  userName?: string;
  firstName?: string;
  lastName?: string;
  admin?: boolean;
  las2peerId?: string;
  profileImage?: string;
  emailLeadSubscription?: boolean;
  emailFollowSubscription?: boolean;
  personalizationEnabled?: boolean;
  creationDate?: string;
  lastUpdatedDate?: string;
  lastLoginDate?: string;
}

export interface Statistic {
  numberOfProjects?: number;
  numberOfCategories?: number;
  numberOfRequirements?: number;
  numberOfComments?: number;
  numberOfAttachments?: number;
  numberOfVotes?: number;
}

export interface Category {
  id?: number;
  name?: string;
  description?: string;
  projectId?: number;
  leader?: User;
  creationDate?: string;
  lastUpdatedDate?: string;
  numberOfRequirements?: number;
  numberOfFollowers?: number;
  isFollower?: boolean;
}

export interface CategoryContributors {
  leader?: User;
  requirementCreator?: User[];
  leadDeveloper?: User[];
  developers?: User[];
  commentCreator?: User[];
  attachmentCreator?: User[];
}

export interface Comment {
  id?: number;
  message?: string;
  replyToComment?: number;
  requirementId?: number;
  creator?: User;
  creationDate?: string;
  lastUpdatedDate?: string;
  _context?: EntityContext;
}

export interface EntityContext {
  project?: Project;
  requirement?: Requirement;
  comment?: Comment;
  category?: Category[];
}

export interface Project {
  id?: number;
  name?: string;
  description?: string;
  visibility?: boolean;
  defaultCategoryId?: number;
  leader?: User;
  creationDate?: string;
  lastUpdatedDate?: string;
  numberOfCategories?: number;
  numberOfRequirements?: number;
  numberOfFollowers?: number;
  isFollower?: boolean;
}

export interface Requirement {
  id?: number;
  name?: string;
  description?: string;
  realized?: string;
  projectId?: number;
  creator?: User;
  leadDeveloper?: User;
  categories?: Category[];
  attachments?: Attachment[];
  creationDate?: string;
  lastUpdatedDate?: string;
  numberOfComments?: number;
  numberOfAttachments?: number;
  numberOfFollowers?: number;
  upVotes?: number;
  downVotes?: number;
  userVoted?: "UP_VOTE" | "DOWN_VOTE" | "NO_VOTE";
  _context?: EntityContext;
  isDeveloper?: boolean;
  isContributor?: boolean;
  isFollower?: boolean;
}

export interface PersonalisationData {
  id?: number;
  key?: string;
  version?: number;
  userId?: number;
  value?: string;
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
}

export type RequestParams = Omit<RequestInit, "body" | "method"> & {
  secure?: boolean;
};

export type RequestQueryParamsType = Record<string | number, any>;

interface ApiConfig<SecurityDataType> {
  baseUrl?: string;
  baseApiParams?: RequestParams;
  securityWorker?: (securityData: SecurityDataType) => RequestParams;
}

interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

enum BodyType {
  Json,
  FormData,
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "/bazaar/";
  private securityData: SecurityDataType = null as any;
  private securityWorker: null | ApiConfig<SecurityDataType>["securityWorker"] = null;

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType) => {
    this.securityData = data;
  };

  private addQueryParam(query: RequestQueryParamsType, key: string) {
    return (
      encodeURIComponent(key) + "=" + encodeURIComponent(Array.isArray(query[key]) ? query[key].join(",") : query[key])
    );
  }

  protected addQueryParams(rawQuery?: RequestQueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys.length
      ? `?${keys
          .map((key) =>
            typeof query[key] === "object" && !Array.isArray(query[key])
              ? this.addQueryParams(query[key] as object).substring(1)
              : this.addQueryParam(query, key),
          )
          .join("&")}`
      : "";
  }

  private bodyFormatters: Record<BodyType, (input: any) => any> = {
    [BodyType.Json]: JSON.stringify,
    [BodyType.FormData]: (input: any) =>
      Object.keys(input).reduce((data, key) => {
        data.append(key, input[key]);
        return data;
      }, new FormData()),
  };

  private mergeRequestOptions(params: RequestParams, securityParams?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params,
      ...(securityParams || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params.headers || {}),
        ...((securityParams && securityParams.headers) || {}),
      },
    };
  }

  private safeParseResponse = <T = any, E = any>(response: Response): Promise<HttpResponse<T, E>> => {
    const r = response as HttpResponse<T, E>;
    r.data = (null as unknown) as T;
    r.error = (null as unknown) as E;

    return response
      .json()
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
  };

  public request = <T = any, E = any>(
    path: string,
    method: string,
    { secure, ...params }: RequestParams = {},
    body?: any,
    bodyType?: BodyType,
    secureByDefault?: boolean,
  ): Promise<HttpResponse<T>> => {
    const requestUrl = `${this.baseUrl}${path}`;
    const secureOptions =
      (secureByDefault || secure) && this.securityWorker ? this.securityWorker(this.securityData) : {};
    const requestOptions = {
      ...this.mergeRequestOptions(params, secureOptions),
      method,
      body: body ? this.bodyFormatters[bodyType || BodyType.Json](body) : null,
    };

    return fetch(requestUrl, requestOptions).then(async (response) => {
      const data = await this.safeParseResponse<T, E>(response);
      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Requirements Bazaar
 * @version 0.6
 * @baseUrl /bazaar/
 * Requirements Bazaar project
 */
export class Api<SecurityDataType = any> extends HttpClient<SecurityDataType> {
  attachments = {
    /**
     * No description
     *
     * @tags attachments
     * @name GetAttachment
     * @summary This method allows to retrieve a certain attachment
     * @request GET:/attachments/{attachmentId}
     * @secure
     */
    getAttachment: (attachmentId: number, params?: RequestParams) =>
      this.request<Attachment, any>(`/attachments/${attachmentId}`, "GET", params, null, BodyType.Json, true),

    /**
     * No description
     *
     * @tags attachments
     * @name DeleteAttachment
     * @summary This method deletes a specific attachment.
     * @request DELETE:/attachments/{attachmentId}
     * @secure
     */
    deleteAttachment: (attachmentId: number, params?: RequestParams) =>
      this.request<Attachment, any>(`/attachments/${attachmentId}`, "DELETE", params, null, BodyType.Json, true),

    /**
     * No description
     *
     * @tags attachments
     * @name CreateAttachment
     * @summary This method allows to create a new attachment.
     * @request POST:/attachments
     * @secure
     */
    createAttachment: (body: Attachment, params?: RequestParams) =>
      this.request<Attachment, any>(`/attachments`, "POST", params, body, BodyType.Json, true),
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
    sendNotifications: (params?: RequestParams) =>
      this.request<any, any>(`/notifications`, "POST", params, null, BodyType.Json, true),
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
    getStatistics: (query?: { since?: string }, params?: RequestParams) =>
      this.request<Statistic, any>(
        `/statistics${this.addQueryParams(query)}`,
        "GET",
        params,
        null,
        BodyType.Json,
        true,
      ),
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
    getServiceNameVersion: (params?: RequestParams) =>
      this.request<any, any>(`/version`, "GET", params, null, BodyType.Json, true),
  };
  categories = {
    /**
     * No description
     *
     * @tags categories
     * @name GetCategory
     * @summary This method allows to retrieve a certain category.
     * @request GET:/categories/{categoryId}
     * @secure
     */
    getCategory: (categoryId: number, params?: RequestParams) =>
      this.request<Category, any>(`/categories/${categoryId}`, "GET", params, null, BodyType.Json, true),

    /**
     * No description
     *
     * @tags categories
     * @name UpdateCategory
     * @summary This method allows to update a certain category.
     * @request PUT:/categories/{categoryId}
     * @secure
     */
    updateCategory: (categoryId: number, body: Category, params?: RequestParams) =>
      this.request<Category, any>(`/categories/${categoryId}`, "PUT", params, body, BodyType.Json, true),

    /**
     * No description
     *
     * @tags categories
     * @name DeleteCategory
     * @summary This method deletes a specific category.
     * @request DELETE:/categories/{categoryId}
     * @secure
     */
    deleteCategory: (categoryId: number, params?: RequestParams) =>
      this.request<Category, any>(`/categories/${categoryId}`, "DELETE", params, null, BodyType.Json, true),

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
      params?: RequestParams,
    ) =>
      this.request<User[], any>(
        `/categories/${categoryId}/followers${this.addQueryParams(query)}`,
        "GET",
        params,
        null,
        BodyType.Json,
        true,
      ),

    /**
     * No description
     *
     * @tags categories
     * @name FollowCategory
     * @summary This method add the current user to the followers list of a given category.
     * @request POST:/categories/{categoryId}/followers
     * @secure
     */
    followCategory: (categoryId: number, params?: RequestParams) =>
      this.request<Category, any>(`/categories/${categoryId}/followers`, "POST", params, null, BodyType.Json, true),

    /**
     * No description
     *
     * @tags categories
     * @name UnfollowCategory
     * @summary This method removes the current user from a followers list of a given category.
     * @request DELETE:/categories/{categoryId}/followers
     * @secure
     */
    unfollowCategory: (categoryId: number, params?: RequestParams) =>
      this.request<Category, any>(`/categories/${categoryId}/followers`, "DELETE", params, null, BodyType.Json, true),

    /**
     * No description
     *
     * @tags categories
     * @name GetContributorsForCategory
     * @summary This method returns the list of contributors for a specific category.
     * @request GET:/categories/{categoryId}/contributors
     * @secure
     */
    getContributorsForCategory: (categoryId: number, params?: RequestParams) =>
      this.request<CategoryContributors, any>(
        `/categories/${categoryId}/contributors`,
        "GET",
        params,
        null,
        BodyType.Json,
        true,
      ),

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
        sort?: ("date" | "last_activity" | "name" | "vote" | "comment" | "follower" | "realized")[];
      },
      params?: RequestParams,
    ) =>
      this.request<Category[], any>(
        `/categories/${categoryId}/requirements${this.addQueryParams(query)}`,
        "GET",
        params,
        null,
        BodyType.Json,
        true,
      ),

    /**
     * No description
     *
     * @tags categories
     * @name CreateCategory
     * @summary This method allows to create a new category under a given a project.
     * @request POST:/categories
     * @secure
     */
    createCategory: (body: Category, params?: RequestParams) =>
      this.request<Category, any>(`/categories`, "POST", params, body, BodyType.Json, true),

    /**
     * No description
     *
     * @tags categories
     * @name GetStatisticsForCategory
     * @summary This method allows to retrieve statistics for one category.
     * @request GET:/categories/{categoryId}/statistics
     * @secure
     */
    getStatisticsForCategory: (categoryId: number, query?: { since?: string }, params?: RequestParams) =>
      this.request<Statistic, any>(
        `/categories/${categoryId}/statistics${this.addQueryParams(query)}`,
        "GET",
        params,
        null,
        BodyType.Json,
        true,
      ),
  };
  comments = {
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
        filters: ("created" | "following" | "replies" | "developing")[];
        embedParents: ("project" | "requirement")[];
      },
      params?: RequestParams,
    ) =>
      this.request<Comment[], any>(`/comments${this.addQueryParams(query)}`, "GET", params, null, BodyType.Json, true),

    /**
     * No description
     *
     * @tags comments
     * @name CreateComment
     * @summary This method allows to create a new comment.
     * @request POST:/comments
     * @secure
     */
    createComment: (body: Comment, params?: RequestParams) =>
      this.request<Comment, any>(`/comments`, "POST", params, body, BodyType.Json, true),

    /**
     * No description
     *
     * @tags comments
     * @name GetComment
     * @summary This method allows to retrieve a certain comment
     * @request GET:/comments/{commentId}
     * @secure
     */
    getComment: (commentId: number, params?: RequestParams) =>
      this.request<Comment, any>(`/comments/${commentId}`, "GET", params, null, BodyType.Json, true),

    /**
     * No description
     *
     * @tags comments
     * @name DeleteComment
     * @summary This method deletes a specific comment.
     * @request DELETE:/comments/{commentId}
     * @secure
     */
    deleteComment: (commentId: number, params?: RequestParams) =>
      this.request<Comment, any>(`/comments/${commentId}`, "DELETE", params, null, BodyType.Json, true),
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
    getPersonalisationData: (key: string, version: number, params?: RequestParams) =>
      this.request<PersonalisationData, any>(
        `/personalisation/${key}-${version}`,
        "GET",
        params,
        null,
        BodyType.Json,
        true,
      ),

    /**
     * No description
     *
     * @tags personalisation
     * @name SetPersonalisationData
     * @summary This method allows to save a personalisationData item
     * @request PUT:/personalisation/{key}-{version}
     * @secure
     */
    setPersonalisationData: (key: string, version: number, body: PersonalisationData, params?: RequestParams) =>
      this.request<PersonalisationData, any>(
        `/personalisation/${key}-${version}`,
        "PUT",
        params,
        body,
        BodyType.Json,
        true,
      ),
  };
  projects = {
    /**
     * No description
     *
     * @tags projects
     * @name GetProject
     * @summary This method allows to retrieve a certain project.
     * @request GET:/projects/{projectId}
     * @secure
     */
    getProject: (projectId: number, params?: RequestParams) =>
      this.request<Project, any>(`/projects/${projectId}`, "GET", params, null, BodyType.Json, true),

    /**
     * No description
     *
     * @tags projects
     * @name UpdateProject
     * @summary This method allows to update a certain project.
     * @request PUT:/projects/{projectId}
     * @secure
     */
    updateProject: (projectId: number, body: Project, params?: RequestParams) =>
      this.request<Project, any>(`/projects/${projectId}`, "PUT", params, body, BodyType.Json, true),

    /**
     * No description
     *
     * @tags projects
     * @name GetFollowersForProject
     * @summary This method returns the list of followers for a specific project.
     * @request GET:/projects/{projectId}/followers
     * @secure
     */
    getFollowersForProject: (projectId: number, query?: { page?: number; per_page?: number }, params?: RequestParams) =>
      this.request<User[], any>(
        `/projects/${projectId}/followers${this.addQueryParams(query)}`,
        "GET",
        params,
        null,
        BodyType.Json,
        true,
      ),

    /**
     * No description
     *
     * @tags projects
     * @name FollowProject
     * @summary This method add the current user to the followers list of a given project.
     * @request POST:/projects/{projectId}/followers
     * @secure
     */
    followProject: (projectId: number, params?: RequestParams) =>
      this.request<Project, any>(`/projects/${projectId}/followers`, "POST", params, null, BodyType.Json, true),

    /**
     * No description
     *
     * @tags projects
     * @name UnfollowProject
     * @summary This method removes the current user from a followers list of a given project.
     * @request DELETE:/projects/{projectId}/followers
     * @secure
     */
    unfollowProject: (projectId: number, params?: RequestParams) =>
      this.request<Project, any>(`/projects/${projectId}/followers`, "DELETE", params, null, BodyType.Json, true),

    /**
     * No description
     *
     * @tags projects
     * @name GetContributorsForProject
     * @summary This method returns the list of contributors for a specific project.
     * @request GET:/projects/{projectId}/contributors
     * @secure
     */
    getContributorsForProject: (projectId: number, params?: RequestParams) =>
      this.request<ProjectContributors, any>(
        `/projects/${projectId}/contributors`,
        "GET",
        params,
        null,
        BodyType.Json,
        true,
      ),

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
      },
      params?: RequestParams,
    ) =>
      this.request<Category[], any>(
        `/projects/${projectId}/categories${this.addQueryParams(query)}`,
        "GET",
        params,
        null,
        BodyType.Json,
        true,
      ),

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
        sort?: ("date" | "last_activity" | "name" | "vote" | "comment" | "follower" | "realized")[];
      },
      params?: RequestParams,
    ) =>
      this.request<Requirement[], any>(
        `/projects/${projectId}/requirements${this.addQueryParams(query)}`,
        "GET",
        params,
        null,
        BodyType.Json,
        true,
      ),

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
        filters?: ("all" | "created" | "following" | "contributed")[];
        ids?: number[];
      },
      params?: RequestParams,
    ) =>
      this.request<Project[], any>(`/projects${this.addQueryParams(query)}`, "GET", params, null, BodyType.Json, true),

    /**
     * No description
     *
     * @tags projects
     * @name CreateProject
     * @summary This method allows to create a new project.
     * @request POST:/projects
     * @secure
     */
    createProject: (body: Project, params?: RequestParams) =>
      this.request<Project, any>(`/projects`, "POST", params, body, BodyType.Json, true),

    /**
     * No description
     *
     * @tags projects
     * @name GetStatisticsForProject
     * @summary This method allows to retrieve statistics for one project.
     * @request GET:/projects/{projectId}/statistics
     * @secure
     */
    getStatisticsForProject: (projectId: number, query?: { since?: string }, params?: RequestParams) =>
      this.request<Statistic, any>(
        `/projects/${projectId}/statistics${this.addQueryParams(query)}`,
        "GET",
        params,
        null,
        BodyType.Json,
        true,
      ),
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
        filters: ("created" | "following" | "contributed")[];
        embedParents: "project"[];
      },
      params?: RequestParams,
    ) =>
      this.request<Requirement[], any>(
        `/requirements${this.addQueryParams(query)}`,
        "GET",
        params,
        null,
        BodyType.Json,
        true,
      ),

    /**
     * No description
     *
     * @tags requirements
     * @name CreateRequirement
     * @summary This method allows to create a new requirement.
     * @request POST:/requirements
     * @secure
     */
    createRequirement: (body: Requirement, params?: RequestParams) =>
      this.request<Requirement, any>(`/requirements`, "POST", params, body, BodyType.Json, true),

    /**
     * No description
     *
     * @tags requirements
     * @name GetRequirement
     * @summary This method returns a specific requirement.
     * @request GET:/requirements/{requirementId}
     * @secure
     */
    getRequirement: (requirementId: number, params?: RequestParams) =>
      this.request<Requirement, any>(`/requirements/${requirementId}`, "GET", params, null, BodyType.Json, true),

    /**
     * No description
     *
     * @tags requirements
     * @name UpdateRequirement
     * @summary This method updates a specific requirement.
     * @request PUT:/requirements/{requirementId}
     * @secure
     */
    updateRequirement: (requirementId: number, body: Requirement, params?: RequestParams) =>
      this.request<Requirement, any>(`/requirements/${requirementId}`, "PUT", params, body, BodyType.Json, true),

    /**
     * No description
     *
     * @tags requirements
     * @name DeleteRequirement
     * @summary This method deletes a specific requirement.
     * @request DELETE:/requirements/{requirementId}
     * @secure
     */
    deleteRequirement: (requirementId: number, params?: RequestParams) =>
      this.request<Requirement, any>(`/requirements/${requirementId}`, "DELETE", params, null, BodyType.Json, true),

    /**
     * No description
     *
     * @tags requirements
     * @name LeaddevelopRequirement
     * @summary This method set the current user as lead developer for a given requirement.
     * @request POST:/requirements/{requirementId}/leaddevelopers
     * @secure
     */
    leaddevelopRequirement: (requirementId: number, params?: RequestParams) =>
      this.request<Requirement, any>(
        `/requirements/${requirementId}/leaddevelopers`,
        "POST",
        params,
        null,
        BodyType.Json,
        true,
      ),

    /**
     * No description
     *
     * @tags requirements
     * @name UnleaddevelopRequirement
     * @summary This method removes the current user as lead developer for a given requirement.
     * @request DELETE:/requirements/{requirementId}/leaddevelopers
     * @secure
     */
    unleaddevelopRequirement: (requirementId: number, params?: RequestParams) =>
      this.request<Requirement, any>(
        `/requirements/${requirementId}/leaddevelopers`,
        "DELETE",
        params,
        null,
        BodyType.Json,
        true,
      ),

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
      params?: RequestParams,
    ) =>
      this.request<User[], any>(
        `/requirements/${requirementId}/developers${this.addQueryParams(query)}`,
        "GET",
        params,
        null,
        BodyType.Json,
        true,
      ),

    /**
     * No description
     *
     * @tags requirements
     * @name DevelopRequirement
     * @summary This method add the current user to the developers list of a given requirement.
     * @request POST:/requirements/{requirementId}/developers
     * @secure
     */
    developRequirement: (requirementId: number, params?: RequestParams) =>
      this.request<Requirement, any>(
        `/requirements/${requirementId}/developers`,
        "POST",
        params,
        null,
        BodyType.Json,
        true,
      ),

    /**
     * No description
     *
     * @tags requirements
     * @name UndevelopRequirement
     * @summary This method remove the current user from a developers list of a given requirement.
     * @request DELETE:/requirements/{requirementId}/developers
     * @secure
     */
    undevelopRequirement: (requirementId: number, params?: RequestParams) =>
      this.request<Requirement, any>(
        `/requirements/${requirementId}/developers`,
        "DELETE",
        params,
        null,
        BodyType.Json,
        true,
      ),

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
      params?: RequestParams,
    ) =>
      this.request<User[], any>(
        `/requirements/${requirementId}/followers${this.addQueryParams(query)}`,
        "GET",
        params,
        null,
        BodyType.Json,
        true,
      ),

    /**
     * No description
     *
     * @tags requirements
     * @name FollowRequirement
     * @summary This method add the current user to the followers list of a given requirement.
     * @request POST:/requirements/{requirementId}/followers
     * @secure
     */
    followRequirement: (requirementId: number, params?: RequestParams) =>
      this.request<Requirement, any>(
        `/requirements/${requirementId}/followers`,
        "POST",
        params,
        null,
        BodyType.Json,
        true,
      ),

    /**
     * No description
     *
     * @tags requirements
     * @name UnfollowRequirement
     * @summary This method removes the current user from a followers list of a given requirement.
     * @request DELETE:/requirements/{requirementId}/followers
     * @secure
     */
    unfollowRequirement: (requirementId: number, params?: RequestParams) =>
      this.request<Requirement, any>(
        `/requirements/${requirementId}/followers`,
        "DELETE",
        params,
        null,
        BodyType.Json,
        true,
      ),

    /**
     * No description
     *
     * @tags requirements
     * @name Vote
     * @summary This method creates a vote for the given requirement in the name of the current user.
     * @request POST:/requirements/{requirementId}/votes
     * @secure
     */
    vote: (requirementId: number, query?: { direction?: "up" | "down" }, params?: RequestParams) =>
      this.request<Requirement, any>(
        `/requirements/${requirementId}/votes${this.addQueryParams(query)}`,
        "POST",
        params,
        null,
        BodyType.Json,
        true,
      ),

    /**
     * No description
     *
     * @tags requirements
     * @name Unvote
     * @summary This method removes the vote of the given requirement made by the current user.
     * @request DELETE:/requirements/{requirementId}/votes
     * @secure
     */
    unvote: (requirementId: number, params?: RequestParams) =>
      this.request<Requirement, any>(
        `/requirements/${requirementId}/votes`,
        "DELETE",
        params,
        null,
        BodyType.Json,
        true,
      ),

    /**
     * No description
     *
     * @tags requirements
     * @name Realize
     * @summary This method set the realized field to now for a given requirement.
     * @request POST:/requirements/{requirementId}/realized
     * @secure
     */
    realize: (requirementId: number, params?: RequestParams) =>
      this.request<Requirement, any>(
        `/requirements/${requirementId}/realized`,
        "POST",
        params,
        null,
        BodyType.Json,
        true,
      ),

    /**
     * No description
     *
     * @tags requirements
     * @name Unrealize
     * @summary This method removes the realized information for the given requirement.
     * @request DELETE:/requirements/{requirementId}/realized
     * @secure
     */
    unrealize: (requirementId: number, params?: RequestParams) =>
      this.request<Requirement, any>(
        `/requirements/${requirementId}/realized`,
        "DELETE",
        params,
        null,
        BodyType.Json,
        true,
      ),

    /**
     * No description
     *
     * @tags requirements
     * @name GetContributorsForRequirement
     * @summary This method returns the list of contributors for a specific requirement.
     * @request GET:/requirements/{requirementId}/contributors
     * @secure
     */
    getContributorsForRequirement: (requirementId: number, params?: RequestParams) =>
      this.request<RequirementContributors, any>(
        `/requirements/${requirementId}/contributors`,
        "GET",
        params,
        null,
        BodyType.Json,
        true,
      ),

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
      params?: RequestParams,
    ) =>
      this.request<Comment[], any>(
        `/requirements/${requirementId}/comments${this.addQueryParams(query)}`,
        "GET",
        params,
        null,
        BodyType.Json,
        true,
      ),

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
      params?: RequestParams,
    ) =>
      this.request<Attachment[], any>(
        `/requirements/${requirementId}/attachments${this.addQueryParams(query)}`,
        "GET",
        params,
        null,
        BodyType.Json,
        true,
      ),

    /**
     * No description
     *
     * @tags requirements
     * @name GetStatisticsForRequirement
     * @summary This method allows to retrieve statistics for one requirement.
     * @request GET:/requirements/{requirementId}/statistics
     * @secure
     */
    getStatisticsForRequirement: (requirementId: number, query?: { since?: string }, params?: RequestParams) =>
      this.request<Statistic, any>(
        `/requirements/${requirementId}/statistics${this.addQueryParams(query)}`,
        "GET",
        params,
        null,
        BodyType.Json,
        true,
      ),
  };
  users = {
    /**
     * No description
     *
     * @tags users
     * @name GetActiveUser
     * @summary This method allows to retrieve the active user.
     * @request GET:/users/me
     * @secure
     */
    getActiveUser: (params?: RequestParams) =>
      this.request<User, any>(`/users/me`, "GET", params, null, BodyType.Json, true),

    /**
     * No description
     *
     * @tags users
     * @name GetUser
     * @summary This method allows to retrieve a certain user.
     * @request GET:/users/{userId}
     * @secure
     */
    getUser: (userId: number, params?: RequestParams) =>
      this.request<User, any>(`/users/${userId}`, "GET", params, null, BodyType.Json, true),

    /**
     * No description
     *
     * @tags users
     * @name UpdateUser
     * @summary This method allows to update the user profile.
     * @request PUT:/users/{userId}
     * @secure
     */
    updateUser: (userId: number, body: User, params?: RequestParams) =>
      this.request<User, any>(`/users/${userId}`, "PUT", params, body, BodyType.Json, true),

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
        filters?: ("created" | "following" | "developing")[];
      },
      params?: RequestParams,
    ) =>
      this.request<EntityOverview, any>(
        `/users/me/entities${this.addQueryParams(query)}`,
        "GET",
        params,
        null,
        BodyType.Json,
        true,
      ),
  };
}
