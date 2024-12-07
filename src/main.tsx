import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import store from './redux-store/store.ts';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

createRoot(document.getElementById('root')!).render(
 <StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </Provider>
  </StrictMode>,
)
