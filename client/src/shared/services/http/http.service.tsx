import { environment as env } from 'environments/environment';
import Cookies from 'js-cookie';
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { EHttpMethod } from './http.enum';
import { toHttpParams } from './http.utils';
import { IParams, ITokens } from './http.models';
import { dateIsoLocalZone } from 'shared/utils/helpers';

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
    const cookie = JSON.parse((Cookies.get('userInfo') as string) ?? null) || {};
    return cookie?.accessToken ? { Authorization: `Bearer ${cookie?.accessToken}` } : {};
  }

  private setupHeaders(hasAttachment = false) {
    return hasAttachment
      ? { 'Content-Type': 'multipart/form-data', ...this.getAuthorization() }
      : { 'Content-Type': 'application/json', ...this.getAuthorization() };
  }

  private async updateTokens(response: AxiosResponse<ITokens>): Promise<void> {
    const { accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt } = response || {};
    if (accessToken && refreshToken) {
      const cookie = JSON.parse(Cookies.get('userInfo') as string) || {};
      Cookies.set(
        'userInfo',
        JSON.stringify({
          email: cookie.email,
          accessToken,
          refreshToken,
          accessTokenExpiresAt: dateIsoLocalZone(accessTokenExpiresAt),
          refreshTokenExpiresAt: dateIsoLocalZone(refreshTokenExpiresAt),
        }),
        { expires: new Date(dateIsoLocalZone(new Date(refreshTokenExpiresAt))) }
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

  // private async request<T>(method: EHttpMethod, url: string, options: AxiosRequestConfig): Promise<T> {
  //   try {
  //     const response: AxiosResponse<T> = await this.http.request<T>({
  //       method,
  //       url,
  //       ...options,
  //     });
  //     return response.data;
  //   } catch (error) {
  //     return this.normalizeError(error);
  //   }
  // }

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
          const { refreshToken } = JSON.parse(Cookies.get('userInfo')) || {};
          const response = await axios.post('/api/auth/refresh', { refreshToken });
          await this.updateTokens(response);
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
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
