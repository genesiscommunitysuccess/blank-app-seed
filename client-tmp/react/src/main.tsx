import { createLogger } from '@genesislcap/foundation-logger';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AppErrorBoundary } from './components/error-boundary/ErrorBoundary';

import { registerPBCs } from './pbc/utils';

import './styles/styles.css';
// oxlint-disable-next-line import-es/first -- flexlayout theme must come after our base styles for correct CSS cascade
import 'flexlayout-react/style/dark.css';
import './styles/flexlayout-theme.css';

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
    );
  }
}

registerPBCs()
  .then((hasAssets) => logger.debug(hasAssets ? 'PBCs registered' : 'No PBCs detected'))
  .catch((err) => logger.error(err))
  .finally(bootstrapApp);
