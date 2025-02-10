import Cookies from 'js-cookie';
import { addMilliseconds } from 'date-fns';
import { IAuth } from './auth.model';

// Funkcje pomocnicze do kodowania Base64
export const encodeBase64 = <T,>(obj: T): string => {
  const jsonString = JSON.stringify(obj);
  return btoa(encodeURIComponent(jsonString));
};

export const decodeBase64 = <T,>(base64Str: string): T => {
  if (!base64Str) return {} as T;
  return JSON.parse(decodeURIComponent(atob(base64Str)));
};

// Sprawdzenie, czy refresh token wygasa w określonym czasie
export const isBeforeRefreshTokenExpiration = (timeBefore: number): boolean => {
  const userInfo = Cookies.get('userInfo');
  if (!userInfo) return false;

  const { refreshTokenExpiresAt } = decodeBase64<{ refreshTokenExpiresAt: string }>(userInfo);
  if (!refreshTokenExpiresAt) return false;

  const currentTime = new Date();

  return currentTime >= addMilliseconds(refreshTokenExpiresAt, -timeBefore * 1.5);
};

// Sprawdzenie, czy refresh token istnieje
export const isRefreshTokenExist = (): boolean => {
  const userInfo = Cookies.get('userInfo');
  if (!userInfo) return false;

  const { refreshTokenExpiresAt } = decodeBase64<{ refreshTokenExpiresAt: string }>(userInfo);
  return !!refreshTokenExpiresAt;
};

// Pobranie danych użytkownika z ciasteczek
export const cookiesAuth = (): IAuth => {
  const userInfo = Cookies.get('userInfo');
  return userInfo ? decodeBase64<IAuth>(userInfo) : ({} as IAuth);
};

// Usunięcie danych autoryzacji z ciasteczek
export const cookiesAuthRemove = (): void => {
  Cookies.remove('userInfo');
};
