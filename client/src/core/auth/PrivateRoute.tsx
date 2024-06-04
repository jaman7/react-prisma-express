import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import dataSlice from 'store/dataSlice';
import { IBoard, IUser } from 'store/data.model';
import { IRootState } from 'store/store';
import { fetchBoards } from 'store/actions/bordsActions';
import { fetchUsers } from 'store/actions';
import { useAuth } from './userAuth';

const { setUser } = dataSlice.actions;

const PrivateRoute = () => {
  const boards: IBoard[] = useSelector((state: IRootState) => state?.dataSlice?.boards ?? []) ?? [];
  const users: IUser[] = useSelector((state: IRootState) => state?.dataSlice.users ?? []);
  const dispatch = useDispatch();

  const { user = {}, logout, refreshToken } = useAuth() || {};
  const { accessToken: accessTokenCookies, refreshToken: refreshTokenCookies } =
    JSON.parse((Cookies.get('userInfo') as string) ?? null) ?? {};

  useEffect(() => {
    const checkTokenExpiration = async () => {
      const { accessTokenExpiresAt } = JSON.parse(Cookies.get('userInfo') ?? '{}');
      if (accessTokenExpiresAt) {
        const expirationTime = new Date(accessTokenExpiresAt).getTime();
        const now = new Date().getTime();

        // Refresh token if it's about to expire in the next minute
        if (expirationTime - now < 60 * 1000) {
          try {
            await refreshToken?.();
          } catch {
            logout?.();
          }
        }
      }
    };

    checkTokenExpiration();
  }, [accessTokenCookies, refreshToken, logout]);

  useEffect(() => {
    // if (user?.id && Object.keys(users)?.length === 0) {
    //   dispatch(fetchUsers());
    //   dispatch(fetchBoards());
    // }
  }, [user?.id]);

  return accessTokenCookies ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
