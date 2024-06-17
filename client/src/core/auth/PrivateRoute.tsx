import { Navigate, Outlet } from 'react-router-dom';
import { cookiesAuth } from './auth-helper';

const PrivateRoute = () => {
  const { accessToken } = cookiesAuth() || {};
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
