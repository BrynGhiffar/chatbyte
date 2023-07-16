import ReactDOM from 'react-dom/client'
import App from './pages/App.tsx'
import Auth from '@/pages/Auth.tsx';
import "./index.css";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/common/Layout.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <App/>
      </Layout>
    )
  },
  {
    path: "/auth",
    element: (
      <Layout>
        <Auth/>
      </Layout>
    )
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <RouterProvider router={router}/>
  // </React.StrictMode>,
)
