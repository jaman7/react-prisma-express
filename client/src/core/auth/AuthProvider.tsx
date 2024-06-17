import { useEffect, useState } from 'react';
import { IAuth, IAuthUser, IUseAuth } from './auth.model';
import { AuthContext } from './AuthContext';
import Cookies from 'js-cookie';
import dataSlice from 'store/dataSlice';
import HttpService from 'shared/services/http/http.service';
import { useDispatch } from 'react-redux';
import { dateIsoLocal, momentDate, parseDateString } from 'shared/utils/helpers';
import { cookiesAuth, cookiesAuthRemove, encodeBase64, isBeforeRefreshTokenExpiration, isRefreshTokenExist } from './auth-helper';
const { clearStore, setIsLoading } = dataSlice.actions;

const AuthProvider = ({ children }: { children?: JSX.Element | any }) => {
  const [user, setUser] = useState<IAuthUser | null>(null);

  const httpService = new HttpService();
  const dispatch = useDispatch();
  const timeBefore = 30000;
  const authCookies: IAuth | null = cookiesAuth() || null;

  const fetchUser = async () => {
    dispatch(setIsLoading(true));
    try {
      const userData: IAuthUser = await httpService.service().get('/api/users/me');
      setUser(userData ?? null);
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const login = async (email: string, password: string) => {
    dispatch(setIsLoading(true));
    try {
      const res: IAuth = await httpService.service().post('/api/auth/login', { email, password });
      const { accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt } = res ?? {};
      const accessTokenExpires = dateIsoLocal(accessTokenExpiresAt as string);
      const data: IAuth = {
        accessToken,
        refreshToken,
        accessTokenExpiresAt: accessTokenExpires,
        refreshTokenExpiresAt: dateIsoLocal(refreshTokenExpiresAt as string),
      };
      Cookies.set('userInfo', encodeBase64(data), {
        expires: momentDate(accessTokenExpires as string),
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
      await httpService.service().get('/api/auth/logout');
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
      const response: IAuth = await httpService.service().post('/api/auth/refresh', { refreshToken });
      const { accessToken, refreshToken: newRefreshToken, accessTokenExpiresAt, refreshTokenExpiresAt } = response ?? {};
      const accessTokenExpires = dateIsoLocal(accessTokenExpiresAt as string);
      const data: IAuth = {
        accessToken,
        refreshToken: newRefreshToken,
        accessTokenExpiresAt: accessTokenExpires,
        refreshTokenExpiresAt: dateIsoLocal(refreshTokenExpiresAt as string),
      };
      Cookies.set('userInfo', encodeBase64(data), {
        expires: parseDateString(accessTokenExpires as string),
      });
      return Promise.resolve();
    } catch (e) {
      logout();
      return Promise.reject(e);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const cookieAuth = cookiesAuth() || {};
    if (user?.id && cookieAuth?.refreshTokenExpiresAt) {
      interval = setInterval(async () => {
        if (isRefreshTokenExist() && isBeforeRefreshTokenExpiration(timeBefore)) {
          await refreshToken();
        }
      }, timeBefore);
    } else {
      if (!!interval) {
        clearInterval(interval);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [user?.id]);

  useEffect(() => {
    const { refreshToken } = cookiesAuth() || {};
    if (!user?.id && refreshToken) {
      fetchUser();
    }
  }, []);

  const value: IUseAuth = {
    auth: authCookies || {},
    user,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
