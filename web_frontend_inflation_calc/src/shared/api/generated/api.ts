/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface SerializerAuthUserRequest {
  login: string;
  password: string;
}

export interface SerializerConsumerCategoryResponse {
  basket_weight?: number;
  created_at?: string;
  creator_id?: number;
  description?: string;
  historical_date?: string;
  id?: number;
  image_url?: string;
  is_creator?: number;
  is_liked?: number;
  likes_count?: number;
  published_at?: string;
  status?: string;
  title?: string;
  video_url?: string;
}

export interface SerializerRegisterUserRequest {
  full_name?: string;
  login: string;
  password?: string;
}

export interface SerializerUserResponse {
  full_name?: string;
  id?: number;
  login?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "//localhost:8084",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Consumer Categories API
 * @version 1.0
 * @baseUrl //localhost:8084
 * @contact
 *
 * API для работы с пользовательскими категориями.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Возвращает список опубликованных категорий с количеством лайков и информацией о лайке текущего пользователя.
     *
     * @tags Consumer Categories
     * @name ConsumerCategoriesList
     * @summary Получить список категорий
     * @request GET:/api/consumer_categories
     */
    consumerCategoriesList: (
      query?: {
        /**
         * Дата исторического события
         * @format YYYY-MM-DD
         */
        date?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        SerializerConsumerCategoryResponse[],
        Record<string, string>
      >({
        path: `/api/consumer_categories`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Создаёт черновик категории и загружает изображение и видео в хранилище.
     *
     * @tags Consumer Categories
     * @name ConsumerCategoriesCreate
     * @summary Создать черновик категории
     * @request POST:/api/consumer_categories
     * @secure
     */
    consumerCategoriesCreate: (
      data: {
        /** Название категории */
        title: string;
        /**
         * Изображение категории
         * @format binary
         */
        image: File;
        /**
         * Видео категории
         * @format binary
         */
        video: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/api/consumer_categories`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает последний черновик текущего пользователя.
     *
     * @tags Consumer Categories
     * @name ConsumerCategoriesDraftList
     * @summary Получить свой черновик
     * @request GET:/api/consumer_categories/draft
     * @secure
     */
    consumerCategoriesDraftList: (params: RequestParams = {}) =>
      this.request<SerializerConsumerCategoryResponse, Record<string, string>>({
        path: `/api/consumer_categories/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает опубликованную категорию. При next=true возвращает следующую опубликованную категорию, а при достижении конца списка переходит к первой.
     *
     * @tags Consumer Categories
     * @name ConsumerCategoriesFeedDetail
     * @summary Получить категорию по ID
     * @request GET:/api/consumer_categories/feed/{id}
     */
    consumerCategoriesFeedDetail: (
      id: number,
      query?: {
        /** Перейти к следующей категории */
        next?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<SerializerConsumerCategoryResponse, Record<string, string>>({
        path: `/api/consumer_categories/feed/${id}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Меняет статус категории на deleted. Удалять можно только свою категорию.
     *
     * @tags Consumer Categories
     * @name ConsumerCategoriesDelete
     * @summary Удалить категорию
     * @request DELETE:/api/consumer_categories/{id}
     * @secure
     */
    consumerCategoriesDelete: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/api/consumer_categories/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Устанавливает или снимает лайк текущего пользователя для опубликованной категории.
     *
     * @tags Consumer Categories
     * @name ConsumerCategoriesLikeCreate
     * @summary Поставить или снять лайк
     * @request POST:/api/consumer_categories/{id}/like
     * @secure
     */
    consumerCategoriesLikeCreate: (
      id: number,
      data: {
        /** Действие: 1 — поставить лайк, 0 — снять */
        like: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/api/consumer_categories/${id}/like`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Публикует черновик текущего пользователя, сохраняя описание, историческую дату и вес корзины.
     *
     * @tags Consumer Categories
     * @name ConsumerCategoriesPublishUpdate
     * @summary Опубликовать категорию
     * @request PUT:/api/consumer_categories/{id}/publish
     * @secure
     */
    consumerCategoriesPublishUpdate: (
      id: number,
      data: {
        /** Описание категории */
        description?: string;
        /** Историческая дата в формате YYYY-MM-DD */
        historical_date: string;
        /** Вес корзины */
        basket_weight: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/api/consumer_categories/${id}/publish`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Проверяет логин и пароль и возвращает JWT-токен со сроком действия 24 часа.
     *
     * @tags Users
     * @name UsersAuthCreate
     * @summary Авторизовать пользователя
     * @request POST:/api/users/auth
     */
    usersAuthCreate: (
      request: SerializerAuthUserRequest,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, Record<string, string>>({
        path: `/api/users/auth`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Отзывает текущий JWT, добавляя его хеш в чёрный список Redis до истечения срока действия токена.
     *
     * @tags Users
     * @name UsersDeauthCreate
     * @summary Выйти из системы
     * @request POST:/api/users/deauth
     * @secure
     */
    usersDeauthCreate: (params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/api/users/deauth`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Создаёт пользователя с логином, именем и паролем. Пароль сохраняется в виде bcrypt-хеша.
     *
     * @tags Users
     * @name UsersRegisterCreate
     * @summary Зарегистрировать пользователя
     * @request POST:/api/users/register
     */
    usersRegisterCreate: (
      request: SerializerRegisterUserRequest,
      params: RequestParams = {},
    ) =>
      this.request<SerializerUserResponse, Record<string, string>>({
        path: `/api/users/register`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
