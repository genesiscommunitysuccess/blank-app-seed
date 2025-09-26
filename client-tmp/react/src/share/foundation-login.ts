import { configure, defaultAuthConfig } from '@genesislcap/foundation-auth/config';
import { AUTH_PATH } from '../config';
import { environment } from '../environments/environment.ts';
import { Connect } from '@genesislcap/foundation-comms';
import { DI } from '@genesislcap/web-core';
import type { NavigateFunction, Location as RouterLocation } from 'react-router-dom';

interface LocationState {
  from?: {
    pathname: string;
  };
}

/**
 * Configure the micro frontend
 */
export const configureFoundationLogin = ({navigate, location}: { navigate: NavigateFunction, location: RouterLocation<LocationState>}) => {
  const baseElement = document.querySelector('base');
  const basePath = baseElement?.getAttribute('href') || '';
  const connect = DI.getOrCreateDOMContainer().get(Connect);


  configure({
    name: 'client-app-login',
    omitRoutes: ['request-account', 'forgot-password'],
    fields: {
      ...defaultAuthConfig.fields,
      username: {
        ...defaultAuthConfig.fields.username,
      },
    },
    hostPath: basePath + AUTH_PATH,
    postLoginRedirect: async () => {
      const url = environment.API_HOST;
      await connect.connect(url);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    },
  })
}

