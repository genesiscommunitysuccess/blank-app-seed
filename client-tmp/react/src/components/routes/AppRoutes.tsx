import { Routes, Route, Navigate } from 'react-router-dom';
import DefaultLayout from '../../layouts/default/DefaultLayout';
import AuthPage from '../../pages/AuthPage/AuthPage';
{{#if routes.[0]}}
import {{pascalCase routes.[0].name}} from '../../pages/{{pascalCase routes.[0].name}}/{{pascalCase routes.[0].name}}';
{{/if}}
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage.tsx';
import PBCContainer from '../../pbc/container';
import { useRoutesContext } from '../../store/RoutesContext';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  const routes = useRoutesContext();
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/" element={<Navigate to="/{{kebabCase routes.[0].name}}" replace />} />
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<{{pascalCase routes.[0].name}} />} />
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute>
                {route.data?.pbcElement ? <PBCContainer /> : route.element}
              </ProtectedRoute>
            }
          />
        ))}
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
