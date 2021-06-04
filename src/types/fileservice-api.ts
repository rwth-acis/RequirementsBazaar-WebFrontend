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

export namespace Download {
  /**
   * No description
   * @tags download
   * @name DownloadFile
   * @request GET:/download/download/{paths}
   * @secure
   */
  export namespace DownloadFile {
    export type RequestParams = { paths: string[] };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }
}

export namespace Files {
  /**
   * No description
   * @tags files
   * @name GetFile
   * @request GET:/files/{paths}
   * @secure
   */
  export namespace GetFile {
    export type RequestParams = { paths: string[] };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }
  /**
   * No description
   * @tags files
   * @name DeleteFile
   * @request DELETE:/files/{identifier}
   * @secure
   */
  export namespace DeleteFile {
    export type RequestParams = { identifier: string };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }
  /**
   * No description
   * @tags files
   * @name PostFile
   * @request POST:/files
   * @secure
   */
  export namespace PostFile {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = {
      identifier?: string;
      filecontent?: File;
      sharewithgroup?: string;
      description?: string;
      excludefromindex?: string;
    };
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
  /**
   * No description
   * @tags files
   * @name PutFile
   * @request PUT:/files
   * @secure
   */
  export namespace PutFile {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = {
      identifier?: string;
      filecontent?: File;
      sharewithgroup?: string;
      description?: string;
      excludefromindex?: string;
    };
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
}

export namespace IndexJson {
  /**
   * No description
   * @tags index
   * @name GetFileIndexJson
   * @request GET:/index.json
   * @secure
   */
  export namespace GetFileIndexJson {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }
}

export namespace IndexHtml {
  /**
   * No description
   * @tags index
   * @name GetFileIndexHtml
   * @request GET:/index.html
   * @secure
   */
  export namespace GetFileIndexHtml {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
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
  customFetch?: typeof fetch;
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
  public baseUrl: string = "/fileservice/";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

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
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  private addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return `${value.map(this.addQueryParam).join("&")}`;
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
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
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
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

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
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
 * @title las2peer File Service
 * @version 1.0
 * @license ACIS License (BSD3) (https://github.com/rwth-acis/las2peer-FileService/blob/master/LICENSE)
 * @baseUrl /fileservice/
 * @contact ACIS Group <cuje@dbis.rwth-aachen.de> (https://las2peer.org/)
 *
 * A las2peer file service for demonstration purposes.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  download = {
    /**
     * No description
     *
     * @tags download
     * @name DownloadFile
     * @request GET:/download/download/{paths}
     * @secure
     */
    downloadFile: (paths: string[], params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/download/download/${paths}`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  files = {
    /**
     * No description
     *
     * @tags files
     * @name GetFile
     * @request GET:/files/{paths}
     * @secure
     */
    getFile: (paths: string[], params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/files/${paths}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags files
     * @name DeleteFile
     * @request DELETE:/files/{identifier}
     * @secure
     */
    deleteFile: (identifier: string, params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/files/${identifier}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags files
     * @name PostFile
     * @request POST:/files
     * @secure
     */
    postFile: (
      data: {
        identifier?: string;
        filecontent?: File;
        sharewithgroup?: string;
        description?: string;
        excludefromindex?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/files`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags files
     * @name PutFile
     * @request PUT:/files
     * @secure
     */
    putFile: (
      data: {
        identifier?: string;
        filecontent?: File;
        sharewithgroup?: string;
        description?: string;
        excludefromindex?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/files`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),
  };
  indexJson = {
    /**
     * No description
     *
     * @tags index
     * @name GetFileIndexJson
     * @request GET:/index.json
     * @secure
     */
    getFileIndexJson: (params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/index.json`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  indexHtml = {
    /**
     * No description
     *
     * @tags index
     * @name GetFileIndexHtml
     * @request GET:/index.html
     * @secure
     */
    getFileIndexHtml: (params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/index.html`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
}
