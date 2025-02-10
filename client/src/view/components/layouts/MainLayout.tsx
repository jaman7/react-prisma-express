import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Header from '../Header';

const MainLayout: React.FC = () => {
  return (
    <div className="layout">
      <Sidebar />

      <div className="d-flex flex-column flex-grow-1">
        <Header />

        <main className="main bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
