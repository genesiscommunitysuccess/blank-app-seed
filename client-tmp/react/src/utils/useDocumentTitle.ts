import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRoutesContext } from '../store/RoutesContext';

type ExtendedRouteObject = {
  path?: string;
  title?: string;
  data?: {
    navItems?: Array<{ title?: string }>;
  };
};

/**
 * Hook to update document title based on current route
 */
export const useDocumentTitle = () => {
  const location = useLocation();
  const routes = useRoutesContext() as unknown as ExtendedRouteObject[];

  useEffect(() => {
    const currentRoute = routes.find((route) => {
      const routePath = route.path;

      if (!routePath) return false;

      return location.pathname === routePath || location.pathname.startsWith(routePath + '/');
    });

    let pageTitle = '{{capitalCase appName}}';

    if (currentRoute) {
      if (currentRoute.title) {
        pageTitle = currentRoute.title;
      } else if (currentRoute.data?.navItems && currentRoute.data.navItems.length > 0) {
        pageTitle = currentRoute.data.navItems[0].title || '{{capitalCase appName}}';
      }
    }

    document.title = pageTitle;

    return () => {
      document.title = '{{capitalCase appName}}';
    };
  }, [location.pathname, routes]);
};
