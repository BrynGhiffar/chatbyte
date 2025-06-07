import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Auth from '@/pages/Auth.tsx';
import Home from '@/pages/Home.tsx';

import { Layout } from './components/common/Layout.tsx';
import './index.css';
import App from './pages/App.tsx';

const router = createBrowserRouter([
  {
    path: '/chat',
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
  {
    path: '/',
    element: <Home />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>,
);
