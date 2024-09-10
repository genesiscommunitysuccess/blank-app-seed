import React, { useEffect, useRef, useState } from 'react';
import { unstable_HistoryRouter as HistoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import {
  history,
  setApiHost,
  getLayoutNameByRoute,
  getStore,
  {{#if FDC3.channels.length~}}
  listenToChannel,
  onFDC3Ready,
  {{/if}}
} from './utils';
import { customEventFactory, registerStylesTarget } from '@/pbc/utils';
import LayoutWrapper from './layouts/LayoutWrapper';
import { AUTH_PATH, routeLayouts } from './config';
import AuthGuard from './guards/AuthGuard';
import PermissionsGuard from './guards/PermissionsGuard';
import { AuthProvider } from './store/AuthContext';
import { RoutesProvider, useRoutesContext } from './store/RoutesContext';
import AuthPage from './pages/AuthPage/AuthPage';
import { registerComponents as genesisRegisterComponents } from './share/genesis-components';
{{#each routes~}}
import {{pascalCase this.name}} from './pages/{{pascalCase this.name}}/{{pascalCase this.name}}';
{{/each}}

const LayoutWithLocation = () => {
  const location = useLocation();
  const layout = routeLayouts[location.pathname] || 'default';
  const routes = useRoutesContext();
  const [layoutName, setLayoutName] = useState<string | undefined>(undefined);
  const store = useRef(getStore());
  {{#if FDC3.channels.length~}}
  const FDC3ReadyHandler = () => {
    {{#each FDC3.channels}}
    listenToChannel('{{this.name}}', '{{this.type}}', (result) => {
      console.log('Received FDC3 channel message on: {{this.name}} channel, type: {{this.type}}', result);
      // TODO: Add your listener logic here
      // E.g. open a modal or route to specific page: Route.path.push(`[Route name]`);
    });
    {{/each}}
  };
{{/if}}

  useEffect(() => {
    genesisRegisterComponents();
    const handleRouteChange = (location: any) => {
      setLayoutName(getLayoutNameByRoute(location.pathname));
    };

    history.listen(handleRouteChange);
    handleRouteChange(location);

    registerStylesTarget(document.body, 'main');

    const handleStoreConnected = () => {
      store.current.onConnected();
    };

    const dispatchCustomEvent = (type: string, detail?: any) => {
      document.body.dispatchEvent(customEventFactory(type, detail));
    };

    dispatchCustomEvent('store-connected');
    dispatchCustomEvent('store-ready', true);

    {{#if FDC3.channels.length~}}
    onFDC3Ready(FDC3ReadyHandler);
    {{/if}}

    document.body.addEventListener('store-connected', handleStoreConnected);

    return () => {
      document.body.removeEventListener('store-connected', handleStoreConnected);
      dispatchCustomEvent('store-disconnected');
    };
  }, [location]);

  let pageComponent;
  let permissionCode = '';

  const route = routes.find((r) => r.path === location.pathname);
  if (route) {
    pageComponent = route.element;
    permissionCode = route.data?.permissionCode || '';
  } else {
    pageComponent = <AuthPage />;
  }

  if (location.pathname === `/${AUTH_PATH}` || location.pathname === '/') {
    return <LayoutWrapper layout={layout}>{pageComponent}</LayoutWrapper>;
  } else {
    return (
      <AuthGuard>
        <PermissionsGuard permissionCode={permissionCode}>
          <LayoutWrapper layout={layout}>{pageComponent}</LayoutWrapper>
        </PermissionsGuard>
      </AuthGuard>
    );
  }
};

const App: React.FC = () => {
  setApiHost();

  return (
    <AuthProvider>
      <RoutesProvider>
        <HistoryRouter history={history}>
          <Routes>
            <Route path="*" element={<LayoutWithLocation />} />
          </Routes>
        </HistoryRouter>
      </RoutesProvider>
    </AuthProvider>
  );
};

export default App;