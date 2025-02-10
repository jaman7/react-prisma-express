import AuthProvider from 'core/auth/AuthProvider';
import { Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import PrivateRoute from './core/auth/PrivateRoute';
import Loader from './shared/components/Loader';
import Login from './view/auth/Login';
import Dashboard from './view/pages/dashboard/Dashboard';
import Projects from './view/pages/Projects/Projects';
import UsersList from './view/pages/UsersList/UsersList';
import UserProfile from './view/pages/user-profile/UserProfile';
import { useSelector } from 'react-redux';
import { IRootState } from './store/store';
import AuthLayout from './view/components/layouts/AuthLayout';
import MainLayout from './view/components/layouts/MainLayout';
import './i18n';
import { useTranslation } from 'react-i18next';
import TaskDetails from './view/pages/task-details/TaskDetails';

const App = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const isLoading = useSelector((state: IRootState) => state?.dataSlice.isLoading);

  useEffect(() => {
    const currentPath = location?.pathname.replace(/^\//, '') ?? '';
    const selectedNamespace = currentPath && currentPath !== '' ? currentPath : 'dashboard';
    if (!i18n.hasResourceBundle(i18n.language, selectedNamespace)) {
      i18n.loadNamespaces(selectedNamespace);
    }
  }, [location, i18n]);

  return (
    <>
      <AuthProvider>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login path="/login" />} />
              <Route path="/logout" element={<Login path="/logout" />} />
              <Route path="/signup" element={<Login path="/signup" />} />
              <Route path="/forgot-password" element={<Login path="/forgot-password" />} />
            </Route>

            <Route element={<PrivateRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/update-password" element={<Login path="/update-password" />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/boards/:boardId/tasks/:taskId" element={<TaskDetails />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/users-list" element={<UsersList />} />
                <Route path="/user-profile" element={<UserProfile />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>

      {isLoading && <Loader />}
    </>
  );
};

export default App;
