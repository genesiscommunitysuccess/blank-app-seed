import { useEffect, useState, useRef } from 'react';
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
import LayoutName from '@/types/LayoutName';
import { AUTH_PATH, routeLayouts } from './config';
import { AuthProvider } from './store/AuthContext';
import { RoutesProvider, useRoutesContext } from './store/RoutesContext';
import AuthPage from './pages/AuthPage/AuthPage';
import { registerComponents as genesisRegisterComponents } from './share/genesis-components';
import { configureFoundationLogin } from './share/foundation-login';
import ProtectedGuard from './guards/ProtectedGuard';
import { storeService } from '@/services/store.service';

const DynamicLayout = () => {
  const location = useLocation();
  const [layoutName, setLayoutName] = useState<LayoutName>(routeLayouts[location.pathname]  || 'default');
  const handleRouteChange = (location: any) => {
    setLayoutName(getLayoutNameByRoute(location.pathname));
  };
  const route = useRoutesContext().find((r) => r.path === location.pathname);
  let pageComponent;
  let content;

  useEffect(() => {
    handleRouteChange(location);
    const unlisten = history.listen(handleRouteChange);

    return () => {
      unlisten();
    }
  }, [location]);

  if (route) {
    pageComponent = route.element;
  } else {
    pageComponent = <AuthPage />;
  }

  if (location.pathname === `/${AUTH_PATH}` || location.pathname === '/') {
    content = pageComponent;
  } else {
    content = <ProtectedGuard>{pageComponent}</ProtectedGuard>
  }

  return <LayoutWrapper layout={layoutName}>{content}</LayoutWrapper>

};

const App: React.FC = ({ rootElement }) => {
  const dispatchCustomEvent = (type: string, detail?: any) => {
    rootElement.dispatchEvent(customEventFactory(type, detail));
  };
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

  setApiHost();
  configureFoundationLogin({ router: history });

  useEffect(() => {
    genesisRegisterComponents();
    registerStylesTarget(document.body, 'main');
    rootElement.addEventListener('store-connected', storeService.onConnected);
    {{#if FDC3.channels.length~}}
    onFDC3Ready(FDC3ReadyHandler);
    {{/if}}
    dispatchCustomEvent('store-connected');
    dispatchCustomEvent('store-ready', true);

    return () => {
      dispatchCustomEvent('store-disconnected');
      rootElement.removeEventListener('store-connected', storeService.onConnected);
    };
  }, []);

  return (
    <AuthProvider>
      <RoutesProvider>
        <HistoryRouter history={history}>
          <Routes>
            <Route path="*" element={<DynamicLayout />} />
          </Routes>
        </HistoryRouter>
      </RoutesProvider>
    </AuthProvider>
  );
};

export default App;