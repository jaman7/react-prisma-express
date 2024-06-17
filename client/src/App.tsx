import './i18n';
import Dashboard from 'view/pages/dashboard/Dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from 'core/auth/PrivateRoute';
import Login from 'view/pages/auth/Login';
import Loader from 'shared/components/Loader';
import { useSelector } from 'react-redux';
import { IRootState } from 'store/store';
import UserProfile from 'view/pages/user-profile/UserProfile';
import Sidebar from 'view/components/Sidebar';
import Header from 'view/components/Header';
import Projects from 'view/pages/Projects';
import UsersList from 'view/pages/UsersList';
import AuthProvider from 'core/auth/AuthProvider';
import { cookiesAuth } from 'core/auth/auth-helper';

const App = () => {
  const isLoading = useSelector((state: IRootState) => state?.dataSlice.isLoading);
  const accessToken = (): boolean => {
    return !!(cookiesAuth()?.accessToken ?? null);
  };

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <div className="layout">
            {accessToken() ? <Sidebar /> : <></>}
            <div className="layout-right">
              {accessToken() ? <Header /> : <></>}
              <div className="content">
                <Routes>
                  <Route path="/login" element={<Login path="/login" />} />
                  <Route path="/logout" element={<Login path="/logout" />} />
                  <Route path="/signup" element={<Login path="/signup" />} />
                  <Route path="/forgot-password" element={<Login path="/forgot-password" />} />
                  <Route element={<PrivateRoute />}>
                    <Route path="/update-profile" element={<Login path="/update-profile" />} />
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/users-list" element={<UsersList />} />
                    <Route path="/user-profile" element={<UserProfile />} />
                  </Route>
                </Routes>
              </div>
            </div>
          </div>
        </BrowserRouter>
      </AuthProvider>

      {isLoading && <Loader />}
    </>
  );
};

export default App;
