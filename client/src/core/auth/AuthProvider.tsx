'use client';

import { createContext, JSX, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { cookiesAuth, cookiesAuthRemove, encodeBase64, isBeforeRefreshTokenExpiration, isRefreshTokenExist } from './auth-helper';
import { IAuth, IAuthUser, IUseAuth } from './auth.model';
import HttpService from '@/core/http/http.service';
import { useDispatch } from 'react-redux';
import dataSlice from '@/store/dataSlice';
import { fetchDictionary } from '@/store/actions/dictionaryActions';
import { AppDispatch } from '@/store/store';

const { clearStore, setIsLoading } = dataSlice.actions;

export const AuthContext = createContext<IUseAuth | null>(null);

const AuthProvider = ({ children }: { children?: JSX.Element | any }) => {
  const [user, setUser] = useState<IAuthUser | null>(null);

  const httpService = new HttpService();
  const dispatch = useDispatch<AppDispatch>();
  const timeBefore = 30000;
  const authCookies: IAuth | null = cookiesAuth() || null;

  const fetchUser = async () => {
    try {
      const userData: IAuthUser = await httpService.get('/api/users/me');
      setUser(userData ?? null);
    } catch (error) {
      console.error('Error fetching user:', error);
      cookiesAuthRemove();
    }
  };

  const login = async (email: string, password: string) => {
    dispatch(setIsLoading(true));
    try {
      const res: IAuth = await httpService.post('/api/auth/login', { email, password });
      const { accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt } = res ?? {};
      const data: IAuth = {
        accessToken,
        refreshToken,
        accessTokenExpiresAt: accessTokenExpiresAt?.toLocaleString(),
        refreshTokenExpiresAt: refreshTokenExpiresAt?.toLocaleString(),
      };
      Cookies.set('userInfo', encodeBase64(data), {
        expires: new Date(accessTokenExpiresAt?.toLocaleString() as string),
      });
      fetchUser();
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const logout = async () => {
    dispatch(setIsLoading(true));
    try {
      await httpService.get('/api/auth/logout');
      dispatch(clearStore());
      setUser(null);
      cookiesAuthRemove();
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const refreshToken = async (): Promise<void> => {
    const cookieAuth = cookiesAuth() || {};
    const { refreshToken } = cookieAuth || {};

    if (!refreshToken) {
      logout();
      return Promise.reject('No refresh token available');
    }

    try {
      const response: IAuth = await httpService.post('/api/auth/refresh', { refreshToken });
      const { accessToken, refreshToken: newRefreshToken, accessTokenExpiresAt, refreshTokenExpiresAt } = response ?? {};
      const data: IAuth = {
        accessToken,
        refreshToken: newRefreshToken,
        accessTokenExpiresAt: accessTokenExpiresAt?.toLocaleString(),
        refreshTokenExpiresAt: refreshTokenExpiresAt?.toLocaleString(),
      };
      Cookies.set('userInfo', encodeBase64(data), {
        expires: new Date(accessTokenExpiresAt?.toLocaleString() as string),
      });
      return Promise.resolve();
    } catch (e) {
      logout();
      return Promise.reject(e);
    }
  };

  const setActiveBoard = async (id: string) => {
    dispatch(setIsLoading(true));
    try {
      const res: IAuthUser = await httpService.patch('/api/users/me/activeBoardId', { activeBoardId: id });
      const { activeBoardId } = res ?? {};
      setUser((prev) => ({ ...prev, activeBoardId }));
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    const cookieAuth = cookiesAuth() || {};
    if (user?.id && cookieAuth?.refreshTokenExpiresAt) {
      interval = setInterval(async () => {
        if (isRefreshTokenExist() && isBeforeRefreshTokenExpiration(timeBefore)) await refreshToken();
      }, timeBefore);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user?.id]);

  useEffect(() => {
    const { refreshToken } = cookiesAuth() || {};
    if (!user?.id && refreshToken) fetchUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) await dispatch(fetchDictionary(user.id));
    };
    fetchData();

    const interval = setInterval(
      async () => {
        if (user?.id) dispatch(fetchDictionary(user.id));
      },
      30 * 60 * 1000
    );
    return () => clearInterval(interval);
  }, [user?.id, dispatch]);

  return <AuthContext.Provider value={{ auth: authCookies || {}, user, login, logout, setActiveBoard }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
