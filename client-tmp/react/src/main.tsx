import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AppErrorBoundary } from './components/error-boundary/ErrorBoundary'

import { registerPBCs } from './pbc/utils';
import { createLogger } from '@genesislcap/foundation-logger';
import { installRapidFlexLayoutReactStyles } from '@genesislcap/rapid-design-system';

import './styles/styles.css'

// Single source of truth for the flexlayout-react theme lives in the platform (@genesislcap/rapid-design-system).
installRapidFlexLayoutReactStyles();

const logger = createLogger('main');

function bootstrapApp() {
  const rootEelement = document.getElementById('root');
  if (rootEelement) {
    ReactDOM.createRoot(rootEelement!).render(
      <React.StrictMode>
        <AppErrorBoundary>
          <App rootElement={rootEelement} />
        </AppErrorBoundary>
      </React.StrictMode>,
    )
  }
}

registerPBCs()
.then(hasAssets => logger.debug(hasAssets ? 'PBCs registered' : 'No PBCs detected'))
.catch((err) => logger.error(err))
.finally(bootstrapApp)