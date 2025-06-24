import { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  setApiHost,
  {{#if FDC3.channels.length~}}
  listenToChannel,
  onFDC3Ready,
  {{/if}}
} from './utils';
import { customEventFactory, registerStylesTarget } from '@/pbc/utils';
import { RoutesProvider } from './store/RoutesContext';
import { registerComponents as genesisRegisterComponents } from './share/genesis-components';
import { storeService } from '@/services/store.service';
import AppRoutes from './components/routes/AppRoutes';
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage.tsx";


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
    <RoutesProvider>
        <Router basename={basePath}>
          <AppRoutes />
        </Router>
    </RoutesProvider>
  );
};

export default App;
