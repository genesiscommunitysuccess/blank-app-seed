import { useEffect, useState } from 'react';
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
import AppRoutes from './components/routes/AppRoutes';
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage.tsx";
import { reduxStore } from './store/store';
import { Provider } from 'react-redux';

interface AppProps {
  rootElement: HTMLElement;
}

const App: React.FC<AppProps> = ({}) => {
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

  }, []);

  const baseElement = document.querySelector('base');
  const basePath = baseElement?.getAttribute('href') || '';

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
