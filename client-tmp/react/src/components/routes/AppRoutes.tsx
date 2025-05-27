import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from '../../pages/AuthPage/AuthPage';
import Home from '../../pages/Home/Home';
import DefaultLayout from '../../layouts/default/DefaultLayout';
import ProtectedRoute from './ProtectedRoute';
import { useRoutesContext } from '@/store/RoutesContext';
import PBCContainer from '@/pbc/container';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage.tsx';

const AppRoutes = () => {
  const routes = useRoutesContext();
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/" element={<Navigate to="/{{kebabCase routes.[0].name}}" replace />} />
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        {routes.map(route => (<Route
            key={route.path}
            path={route.path}
            element={
            <ProtectedRoute>
              {route.data?.pbcElement ? <PBCContainer /> : route.element}
            </ProtectedRoute>
            }
            />))}
      </Route>
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes; 

