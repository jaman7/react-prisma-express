import moment from 'moment';
import Cookies from 'js-cookie';
import { IAuth } from './auth.model';

export const encodeBase64 = <T,>(obj: T): string => {
  const jsonString = JSON.stringify(obj);
  return btoa(unescape(encodeURIComponent(jsonString)));
};

export const decodeBase64 = <T,>(base64Str: string): T => {
  return base64Str ? JSON.parse(decodeURIComponent(escape(atob(base64Str)))) : {};
};

export const isBeforeRefreshTokenExpiration = (timeBefore: number): boolean => {
  const userInfo = Cookies.get('userInfo');
  const { refreshTokenExpiresAt } = decodeBase64(userInfo as string) || {};
  const expirationTime = moment(refreshTokenExpiresAt).valueOf();
  return expirationTime - moment().valueOf() <= timeBefore * 1.5;
};

export const isRefreshTokenExist = (): boolean => {
  const userInfo = Cookies.get('userInfo');
  const { refreshTokenExpiresAt } = decodeBase64(userInfo as string) || {};
  return !!refreshTokenExpiresAt;
};

export const cookiesAuth = (): IAuth => {
  return decodeBase64(Cookies.get('userInfo') as string) || {};
};

export const cookiesAuthRemove = (): void => {
  Cookies.remove('userInfo');
};
