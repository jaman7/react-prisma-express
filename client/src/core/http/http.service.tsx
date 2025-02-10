import { environment as env } from '@/environments/environment';
import Cookies from 'js-cookie';
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { EHttpMethod } from './http.enum';
import { toHttpParams } from './http.utils';
import { IParams } from './http.models';
import { IAuth } from '@/core/auth/auth.model';
import { cookiesAuth } from '@/core/auth/auth-helper';

class HttpService {
  private http: AxiosInstance;
  private baseURL = env.SERVER_API_URL;

  constructor() {
    this.http = axios.create({
      baseURL: this.baseURL,
      withCredentials: false,
      headers: this.setupHeaders(),
    });
    this.injectInterceptors();
  }

  private getAuthorization(): Record<string, string> {
    const cookie: IAuth = cookiesAuth() || {};
    return cookie?.accessToken ? { Authorization: `Bearer ${cookie?.accessToken}` } : {};
  }

  private setupHeaders(hasAttachment = false): Record<string, string> {
    return hasAttachment
      ? { 'Content-Type': 'multipart/form-data', ...this.getAuthorization() }
      : { 'Content-Type': 'application/json', ...this.getAuthorization() };
  }

  private async updateTokens(response: IAuth): Promise<void> {
    const { accessToken, refreshToken, refreshTokenExpiresAt } = response || {};
    if (accessToken && refreshToken) {
      Cookies.set(
        'userInfo',
        JSON.stringify({
          accessToken,
          refreshToken,
          accessTokenExpiresAt: refreshTokenExpiresAt?.toLocaleString(),
        }),
        { expires: new Date(refreshTokenExpiresAt || '') }
      );
    }
  }

  private injectInterceptors(): void {
    this.http.interceptors.request.use((config) => config);

    this.http.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error?.config;
        if (error?.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const { refreshToken } = cookiesAuth() || {};
          try {
            const res = await axios.post('/api/auth/refresh', { refreshToken });
            await this.updateTokens(res?.data ?? {});
            originalRequest.headers.Authorization = `Bearer ${res?.data?.accessToken ?? ''}`;
            return this.http(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
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
      return Promise.reject(error);
    }
  }

  public async get<T>(url: string, params?: any, hasAttachment = false): Promise<T> {
    return this.request<T>(EHttpMethod.GET, url, {
      params: toHttpParams(params),
      headers: this.setupHeaders(hasAttachment),
    });
  }

  public async post<T, P>(url: string, payload: P, params?: IParams, hasAttachment = false): Promise<T> {
    return this.request<T>(EHttpMethod.POST, url, {
      params: toHttpParams(params),
      data: payload,
      headers: this.setupHeaders(hasAttachment),
    });
  }

  public async put<T, P>(url: string, payload: P, params?: IParams, hasAttachment = false): Promise<T> {
    return this.request<T>(EHttpMethod.PUT, url, {
      params: toHttpParams(params),
      data: payload,
      headers: this.setupHeaders(hasAttachment),
    });
  }

  public async patch<T, P>(url: string, payload: P, params?: IParams, hasAttachment = false): Promise<T> {
    return this.request<T>(EHttpMethod.PATCH, url, {
      params: toHttpParams(params),
      data: payload,
      headers: this.setupHeaders(hasAttachment),
    });
  }

  public async delete<T>(url: string, params?: IParams, hasAttachment = false): Promise<T> {
    return this.request<T>(EHttpMethod.DELETE, url, {
      params: toHttpParams(params),
      headers: this.setupHeaders(hasAttachment),
    });
  }
}

export default HttpService;
