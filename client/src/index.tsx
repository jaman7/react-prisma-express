import { createRoot } from 'react-dom/client';
import App from 'App';
import { Provider } from 'react-redux';
import store from './store/store';
import { PrimeReactProvider } from 'primereact/api';
import '../assets/scss/main.scss';

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(
  <Provider store={store}>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </Provider>
);
