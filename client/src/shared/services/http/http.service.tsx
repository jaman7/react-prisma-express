import { environment as env } from 'environments/environment';
import Cookies from 'js-cookie';
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { EHttpMethod } from './http.enum';
import { toHttpParams } from './http.utils';
import { IParams } from './http.models';
import { dateIsoLocal } from 'shared/utils/helpers';
import { cookiesAuth } from 'core/auth/auth-helper';
import { IAuth } from 'core/auth/auth.model';

class HttpService {
  private http: AxiosInstance;
  private baseURL = env.SERVER_API_URL;

  constructor() {
    this.http = axios.create({
      baseURL: this.baseURL,
      withCredentials: false,
      headers: this.setupHeaders(),
    });
  }

  private getAuthorization(): any {
    const cookie: IAuth = cookiesAuth() || {};
    return cookie?.accessToken ? { Authorization: `Bearer ${cookie?.accessToken}` } : {};
  }

  private setupHeaders(hasAttachment = false) {
    return hasAttachment
      ? { 'Content-Type': 'multipart/form-data', ...this.getAuthorization() }
      : { 'Content-Type': 'application/json', ...this.getAuthorization() };
  }

  private async updateTokens(response: IAuth): Promise<void> {
    const { accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt } = response || {};
    if (accessToken && refreshToken) {
      Cookies.set(
        'userInfo',
        JSON.stringify({
          accessToken,
          refreshToken,
          accessTokenExpiresAt: dateIsoLocal(accessTokenExpiresAt as string),
          refreshTokenExpiresAt: dateIsoLocal(refreshTokenExpiresAt as string),
        }),
        { expires: new Date(dateIsoLocal(refreshTokenExpiresAt as string) as Date) }
      );
    }
  }

  private injectInterceptors(instance?: AxiosInstance): void {
    if (instance) this.http = instance;
    this.http.interceptors.request.use(request => {
      return request;
    });
    this.http.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  private normalizeError(error: any): Promise<any> {
    return Promise.reject(error);
  }

  public service(instance?: AxiosInstance) {
    this.injectInterceptors(instance);
    return this;
  }

  private async request<T>(method: EHttpMethod, url: string, options: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.http.request<T>({
        method,
        url,
        ...options,
      });
      return response.data;
    } catch (error) {
      const originalRequest = error?.config;
      const { status } = error?.response || {};
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const { refreshToken } = cookiesAuth() || {};
          const res = await axios.post('/api/auth/refresh', { refreshToken });
          await this.updateTokens(res?.data ?? {});
          originalRequest.headers.Authorization = `Bearer ${res?.data?.accessToken ?? ''}`;
          return this.http(originalRequest);
        } catch (refreshError) {
          return this.normalizeError(refreshError);
        }
      }
      return this.normalizeError(error);
    }
  }

  public async get<T>(url: string, params?: any, hasAttachment = false): Promise<T> {
    return this.request<T>(EHttpMethod.GET, url, {
      params: toHttpParams(params),
      headers: this.setupHeaders(hasAttachment),
    });
  }

  public post<T, P>(url: string, payload: P, params?: IParams, hasAttachment = false): Promise<T> {
    return this.request<T>(EHttpMethod.POST, url, {
      params,
      data: payload,
      headers: this.setupHeaders(hasAttachment),
    });
  }

  public put<T, P>(url: string, payload: P, params?: IParams, hasAttachment = false): Promise<T> {
    return this.request<T>(EHttpMethod.PUT, url, {
      params,
      data: payload,
      headers: this.setupHeaders(hasAttachment),
    });
  }

  public patch<T, P>(url: string, payload: P, params?: IParams, hasAttachment = false): Promise<T> {
    return this.request<T>(EHttpMethod.PATCH, url, {
      params,
      data: payload,
      headers: this.setupHeaders(hasAttachment),
    });
  }

  public delete<T>(url: string, params?: IParams, hasAttachment = false): Promise<T> {
    return this.request<T>(EHttpMethod.DELETE, url, {
      params,
      headers: this.setupHeaders(hasAttachment),
    });
  }
}

export default HttpService;
