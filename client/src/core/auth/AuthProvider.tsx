import { createContext, JSX, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { cookiesAuth, cookiesAuthRemove, encodeBase64, isBeforeRefreshTokenExpiration, isRefreshTokenExist } from './auth-helper';
import { useGlobalStore } from '@/store/useGlobalStore';
import { useNavigate } from 'react-router-dom';
import { IAuthPath } from '@/view/auth/auth.enum';
import { initializeData } from '@/hooks/useInitializeData';
import { IAuth, IAuthUser, IUseAuth } from '@/shared/model/auth';
import { catchError, finalize, of, tap } from 'rxjs';
import { updateActiveProjectIdHandler$ } from '@/shared/services/UserProject';
import httpService from '@/core/http/http.service';

const { PATH_LOGIN } = IAuthPath;

export const AuthContext = createContext<IUseAuth | null>(null);

const AuthProvider = ({ children }: { children?: JSX.Element | any }) => {
  const [user, setUser] = useState<IAuthUser | null>(null);

  const http = httpService;
  const timeBefore = 30000;
  const authCookies: IAuth | null = cookiesAuth() || null;

  const { clearStore, setIsLoading } = useGlobalStore();
  const navigate = useNavigate();

  const fetchUser = async (): Promise<IAuthUser | null> => {
    try {
      const userData: IAuthUser = await http.get('users/me');
      setUser(userData ?? null);
      return userData ?? {};
    } catch (error) {
      console.error('Error fetching user:', error);
      cookiesAuthRemove();
      return null;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res: IAuth = await http.post('auth/login', { email, password });
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
      fetchUser().then((res) => {
        if (res?.id) initializeData(res?.id);
      });
    } catch (e) {
      console.error(e);
    }
  };

  const logout = async () => {
    try {
      await http.get('auth/logout');
      clearStore();
      setUser(null);
      cookiesAuthRemove();
      navigate(PATH_LOGIN);
    } catch (e) {
      console.error(e);
    }
  };

  const signup = async (name: string, email: string, password: string, passwordConfirm: string): Promise<IAuthUser | null> => {
    try {
      const res: IAuthUser = await http.post('auth/signup', { name, email, password, passwordConfirm });
      return { verificationCode: res?.verificationCode };
    } catch (e) {
      console.error(e);
      return null;
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
      const response: IAuth = await http.post('auth/refresh', { refreshToken }, { ignoreLoader: 'true' });
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

  const setActivProject = (id: string) => {
    setIsLoading(true);
    const subscription = updateActiveProjectIdHandler$(id)
      .pipe(
        tap((res) => {
          const { activeProjectId } = res || {};
          setUser((prev) => ({ ...prev, activeProjectId }));
          setIsLoading(false);
        }),
        finalize(() => setIsLoading(false)),
        catchError((error) => {
          setIsLoading(false);
          console.error('Failed to fetch suggestions.', error);
          return of({});
        })
      )
      .subscribe();
    return () => subscription.unsubscribe();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    const cookieAuth = cookiesAuth() || {};
    if (user?.id && cookieAuth?.refreshTokenExpiresAt) {
      interval = setInterval(async () => {
        if (isRefreshTokenExist() && isBeforeRefreshTokenExpiration(timeBefore * 3)) {
          await refreshToken();
        }
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
    if (!user?.id && refreshToken) {
      fetchUser().then((res) => {
        if (res?.id) initializeData(res?.id);
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth: authCookies || {}, user, login, logout, signup, setActivProject }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
