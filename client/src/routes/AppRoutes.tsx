import { Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Suspense, useEffect } from 'react';
import Loader from '@/shared/components/Loader';
import AuthProvider from '@/core/auth/AuthProvider';
import AuthLayout from '@/view/components/layouts/AuthLayout';
import PrivateRoute from '@/core/auth/PrivateRoute';
import MainLayout from '@/view/components/layouts/MainLayout';
import Login from '@/view/auth/Login';
import Dashboard from '@/view/pages/dashboard/Dashboard';
import TaskDetails from '@/view/pages/task-details/TaskDetails';
import Projects from '@/view/pages/Projects/Projects';
import UsersList from '@/view/pages/UsersList/UsersList';
import UserProfile from '@/view/pages/user-profile/UserProfile';
import SocketProvider from '@/core/auth/SocketProvider';

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
    {children}
  </motion.div>
);

const AppRoutes = () => {
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname === '/' ? 'dashboard' : location.pathname.replace(/^\//, '');
    const namespaces = ['common', currentPath];
    namespaces.forEach((ns) => {
      if (!i18n.hasResourceBundle(i18n.language, ns)) {
        i18n.loadNamespaces(ns);
      }
    });
  }, [location, i18n]);

  return (
    <AuthProvider>
      <SocketProvider>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login path="/login" />} />
              <Route path="/logout" element={<Login path="/logout" />} />
              <Route path="/signup" element={<Login path="/signup" />} />
              <Route path="/forgot-password" element={<Login path="/forgot-password" />} />
            </Route>

            <Route element={<PrivateRoute />}>
              <Route path="/" element={<MainLayout />}>
                <Route
                  path="/update-password"
                  element={
                    <PageWrapper>
                      <Login path="/update-password" />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/"
                  element={
                    <PageWrapper>
                      <Dashboard />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/project/:name/:projectId"
                  element={
                    <PageWrapper>
                      <Dashboard />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/boards/:boardId/tasks/:taskId"
                  element={
                    <PageWrapper>
                      <TaskDetails />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/projects"
                  element={
                    <PageWrapper>
                      <Projects />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/projects/archive"
                  element={
                    <PageWrapper>
                      <Projects />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/users-list"
                  element={
                    <PageWrapper>
                      <UsersList />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/user-profile"
                  element={
                    <PageWrapper>
                      <UserProfile />
                    </PageWrapper>
                  }
                />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </SocketProvider>
    </AuthProvider>
  );
};

export default AppRoutes;
