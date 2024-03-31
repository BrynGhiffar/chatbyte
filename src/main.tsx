import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Auth from '@/pages/Auth.tsx';

import { Layout } from './components/common/Layout.tsx';
import './index.css';
import App from './pages/App.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <App />
      </Layout>
    ),
  },
  {
    path: '/auth',
    element: (
      <Layout>
        <Auth />
      </Layout>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>,
);
