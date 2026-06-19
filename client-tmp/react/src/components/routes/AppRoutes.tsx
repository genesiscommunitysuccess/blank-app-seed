import { Routes, Route{{#if routes.[0]}}, Navigate{{/if}} } from 'react-router-dom';
import AuthPage from '../../pages/AuthPage/AuthPage';
{{#if routes.[0]}}
import {{pascalCase routes.[0].name}} from '../../pages/{{pascalCase routes.[0].name}}/{{pascalCase routes.[0].name}}';
{{/if}}
import DefaultLayout from '../../layouts/default/DefaultLayout';
import ProtectedRoute from './ProtectedRoute';
import { useRoutesContext } from '../../store/RoutesContext';
import PBCContainer from '../../pbc/container';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage.tsx';

const AppRoutes = () => {
  const routes = useRoutesContext();
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      {{#if routes.[0]}}
      <Route path="/" element={<Navigate to="/{{kebabCase routes.[0].name}}" replace />} />
      {{/if}}
      <Route element={<DefaultLayout />}>
        {{#if routes.[0]}}
        <Route path="/" element={<{{pascalCase routes.[0].name}} />} />
        {{/if}}
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

