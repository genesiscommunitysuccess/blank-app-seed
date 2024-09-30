import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import { registerPBCs } from '@/pbc/utils';
import { createLogger } from '@genesislcap/foundation-logger';

import './styles/styles.css'

const logger = createLogger('main');

function bootstrapApp() {
  const rootEelement = document.getElementById('root');
  if (rootEelement) {
    ReactDOM.createRoot(rootEelement!).render(
      <React.StrictMode>
        <App rootElement={rootEelement} />
      </React.StrictMode>,
    )
  }
}

registerPBCs()
.then(hasAssets => logger.debug(hasAssets ? 'PBCs registered' : 'No PBCs detected'))
.catch((err) => logger.error(err))
.finally(bootstrapApp)