import AppRoutes from './routes/AppRoutes';
import './i18n';
import GlobalOverlays from './view/components/layouts/GlobalOverlays';

const App = () => {
  return (
    <>
      <AppRoutes />
      <GlobalOverlays />
    </>
  );
};

export default App;
