import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-page">
      <div className="bg-white shadow rounded-4 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
