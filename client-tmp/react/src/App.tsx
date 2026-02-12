import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  setApiHost,
  {{#if FDC3.channels.length~}}
  listenToChannel,
  onFDC3Ready,
  {{/if}}
} from './utils';
import { customEventFactory, registerStylesTarget } from './pbc/utils';
import { RoutesProvider } from './store/RoutesContext';
import { registerComponents as genesisRegisterComponents } from './share/genesis-components';
import { storeService } from './services/store.service';
import AppRoutes from './components/routes/AppRoutes';
import { reduxStore } from './store/store';
import { Provider } from 'react-redux';

interface AppProps {
  rootElement: HTMLElement;
}

const App: React.FC<AppProps> = ({ rootElement }) => {
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
  const [componentsReady, setComponentsReady] = useState(false);
  const dispatchCustomEvent = useCallback((type: string, detail?: unknown) => {
    rootElement.dispatchEvent(customEventFactory(type, detail));
  }, [rootElement]);

  const handleStoreConnected = useCallback((event: CustomEvent) => {
    storeService.onConnected(event);
  }, []);
  useEffect(() => {
    let mounted = true;
    setApiHost();
    (async () => {
      await genesisRegisterComponents();
      if (mounted) {
        setComponentsReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    registerStylesTarget(document.body, 'main');
    rootElement.addEventListener('store-connected', handleStoreConnected as EventListener);
    dispatchCustomEvent('store-connected', rootElement);
    dispatchCustomEvent('store-ready', true);

    return () => {
      rootElement.removeEventListener(
        'store-connected',
        handleStoreConnected as EventListener,
      );
    };
    {{#if FDC3.channels.length~}}
    onFDC3Ready(FDC3ReadyHandler);
    {{/if}}

  }, [rootElement, handleStoreConnected, dispatchCustomEvent]);

  const baseElement = document.querySelector('base');
  const basePath = baseElement?.getAttribute('href') || '';

  if (!componentsReady) {
    return null;
  }

  return (
    <Provider store={reduxStore}>
      <RoutesProvider>
          <Router basename={basePath}>
            <AppRoutes />
          </Router>
      </RoutesProvider>
    </Provider>
  );
};

export default App;
