import { useCallback, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './components/routes/AppRoutes';
import { customEventFactory, registerStylesTarget } from './pbc/utils';
import { storeService } from './services/store.service';
import { registerComponents as genesisRegisterComponents } from './share/genesis-components';
import { RoutesProvider } from './store/RoutesContext';
import { reduxStore } from './store/store';
{{#if FDC3.channels.length~}}
import { listenToChannel, onFDC3Ready } from './utils';
{{/if}}

interface AppProps {
  rootElement: HTMLElement;
}

const App: React.FC<AppProps> = ({ rootElement }) => {
  {{#if FDC3.channels.length}}
  // Memoized so the handler keeps a stable identity and the effect below registers the
  // channel listeners once instead of on every render.
  const FDC3ReadyHandler = useCallback(() => {
    {{#each FDC3.channels}}
    listenToChannel('{{this.name}}', '{{this.type}}', (result) => {
      console.log('Received FDC3 message on {{this.name}} ({{this.type}})', result);
      // TODO: Add your listener logic here
      // E.g. open a modal or route to specific page: Route.path.push(`[Route name]`);
    });
    {{/each}}
  }, []);
  {{/if}}
  const [componentsReady, setComponentsReady] = useState(false);
  const dispatchCustomEvent = useCallback(
    (type: string, detail?: unknown) => {
      rootElement.dispatchEvent(customEventFactory(type, detail));
    },
    [rootElement],
  );

  const handleStoreConnected = useCallback((event: CustomEvent) => {
    storeService.onConnected(event);
  }, []);
  useEffect(() => {
    let mounted = true;
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
    {{#if FDC3.channels.length}}
    onFDC3Ready(FDC3ReadyHandler);
    {{/if}}

    return () => {
      rootElement.removeEventListener('store-connected', handleStoreConnected as EventListener);
    };
  }, [rootElement, handleStoreConnected, dispatchCustomEvent{{#if FDC3.channels.length}}, FDC3ReadyHandler{{/if}}]);

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
