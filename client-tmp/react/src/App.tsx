import { useEffect, useState } from 'react';
import {Routes, Route, useLocation, BrowserRouter} from 'react-router';
import {
  setApiHost,
  getLayoutNameByRoute,
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

    return () => {
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

interface AppProps {
  rootElement: HTMLElement;
}

const App: React.FC<AppProps> = ({ rootElement }) => {
  const [isStoreConnected, setIsStoreConnected] = useState(false);
  const dispatchCustomEvent = (type: string, detail?: any) => {
    rootElement.dispatchEvent(customEventFactory(type, detail));
  };
  const handleStoreConnected = (event: CustomEvent) => {
    storeService.onConnected(event);
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
  genesisRegisterComponents();

  useEffect(() => {
    registerStylesTarget(document.body, 'main');
    {{#if FDC3.channels.length~}}
    onFDC3Ready(FDC3ReadyHandler);
    {{/if}}
    if (!isStoreConnected) {
      rootElement.addEventListener('store-connected', handleStoreConnected);
      dispatchCustomEvent('store-connected', rootElement);
      dispatchCustomEvent('store-ready', true);
      setIsStoreConnected(true);
    }

    return () => {
      if (isStoreConnected) {
        rootElement.removeEventListener('store-connected', handleStoreConnected);
        dispatchCustomEvent('store-disconnected');
      }
    };
  }, [isStoreConnected]);

  const baseElement = document.querySelector('base');
  const basePath = baseElement?.getAttribute('href') || '';

  return (
    <AuthProvider>
      <RoutesProvider>
        <BrowserRouter basename={basePath}>
          <Routes>
            <Route path="*" element={<DynamicLayout />} />
          </Routes>
        </BrowserRouter>
      </RoutesProvider>
    </AuthProvider>
  );
};

export default App;
