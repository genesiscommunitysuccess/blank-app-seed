import { renderAppRoutes } from '@genesislcap/foundation-react-utils/router';
import DefaultLayout from '../../layouts/default/DefaultLayout';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage.tsx';
import { useRoutesContext } from '../../store/RoutesContext';
import ProtectedRoute from './ProtectedRoute';
{{#if routes.[0]}}
import SingleComponent, { initialComponentName } from '../single-component/SingleComponent';
{{/if}}

/**
 * Builds the app's `<Routes>` from the declarative route table (see RoutesContext)
 * via `renderAppRoutes`, which applies the auth/permission guard, wraps in-layout
 * routes in `DefaultLayout`, and handles the `/` redirect, not-found, and the
 * single-component (`?component=<name>`) short-circuit.
 */
const AppRoutes = () => {
  const routes = useRoutesContext();

  return renderAppRoutes({
    routes,
    ProtectedRoute,
    layout: <DefaultLayout />,
{{#if routes.[0]}}
    redirects: [{ from: '/', to: '/{{kebabCase routes.[0].name}}' }],
    singleComponent: { name: initialComponentName, element: <SingleComponent /> },
{{/if}}
    notFound: <NotFoundPage />,
  });
};

export default AppRoutes;
