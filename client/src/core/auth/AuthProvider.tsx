import { useEffect, useState } from 'react';
import axios from 'axios';
import { ILogin, IUseAuth } from './auth.model';
import { AuthContext } from './AuthContext';
import Cookies from 'js-cookie';
import moment, { Moment } from 'moment';
import dataSlice from 'store/dataSlice';
import HttpService from 'shared/services/http/http.service';
import { useDispatch } from 'react-redux';
import { dateIsoLocalZone } from 'shared/utils/helpers';
const { clearStore, setUserData, setIsLoading } = dataSlice.actions;

const AuthProvider = ({ children }: { children?: JSX.Element | any }) => {
  const [user, setUser] = useState<any | null>(null);
  const httpService = new HttpService();
  const dispatch = useDispatch();

  const fetchUser = async () => {
    dispatch(setIsLoading(true));
    httpService
      .service()
      .get('/api/users/me')
      .then(data => {
        dispatch(setUserData(data));
        setUser(data);
        dispatch(setIsLoading(false));
      })
      .catch(e => {
        dispatch(setIsLoading(false));
      });
  };

  const login = async (email: string, password: string) => {
    dispatch(setIsLoading(true));
    httpService
      .service()
      .post('/api/auth/login', { email, password })
      .then((res: any) => {
        const { accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt } = res ?? {};
        const jsonString = JSON.stringify({
          email,
          accessToken,
          refreshToken,
          accessTokenExpiresAt: dateIsoLocalZone(accessTokenExpiresAt ?? null),
          refreshTokenExpiresAt: dateIsoLocalZone(refreshTokenExpiresAt ?? null),
        });
        Cookies.set('userInfo', jsonString, { expires: new Date(dateIsoLocalZone(accessTokenExpiresAt ?? null)!) });
        fetchUser();
      })
      .catch(e => {
        dispatch(setIsLoading(false));
      });
  };

  const logout = async () => {
    dispatch(setIsLoading(true));
    console.log(user);
    httpService
      .service()
      .post('/api/auth/logout', user)
      .then(() => {
        dispatch(clearStore());
        setUser(null);
        dispatch(setIsLoading(false));
        Cookies.remove('userInfo');
      })
      .catch(e => {
        dispatch(setIsLoading(false));
      });
  };

  const refreshToken = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const { refreshToken } = JSON.parse((Cookies.get('userInfo') as string) ?? null) || {};
      console.log(refreshToken, user?.id);
      if (refreshToken) {
        httpService
          .service()
          .post('/api/auth/refresh', { refreshToken })
          .then(async response => {
            const { accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt } = response || {};
            const { email } = JSON.parse((Cookies.get('userInfo') as string) ?? null) || {};
            Cookies.set(
              'userInfo',
              JSON.stringify({
                email,
                accessToken,
                refreshToken,
                accessTokenExpiresAt: dateIsoLocalZone(accessTokenExpiresAt),
                refreshTokenExpiresAt: dateIsoLocalZone(refreshTokenExpiresAt),
              }),
              { expires: new Date(dateIsoLocalZone(refreshTokenExpiresAt)!) }
            );
            resolve();
          });
      } else {
        logout();
        reject();
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(
      () => {
        refreshToken();
      },
      5 * 60 * 1000 - 999
    );
    return () => clearInterval(interval);
  }, []);

  const value: IUseAuth = {
    user,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
