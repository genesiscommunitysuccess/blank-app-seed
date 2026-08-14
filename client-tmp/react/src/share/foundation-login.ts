import { configure, defaultAuthConfig } from '@genesislcap/foundation-auth/config';
import { Connect } from '@genesislcap/foundation-comms';
import {
  buildPostLoginRedirect,
  type RedirectableLocationState,
} from '@genesislcap/foundation-react-utils/router';
import { DI } from '@genesislcap/web-core';
import type { NavigateFunction, Location as RouterLocation } from 'react-router-dom';
import { AUTH_PATH } from '../config';

/**
 * Configure the micro frontend
 */
export const configureFoundationLogin = ({
  navigate,
  location,
}: {
  navigate: NavigateFunction;
  location: RouterLocation<RedirectableLocationState>;
}) => {
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
      await connect.connect();
      // Preserve the full original location (query string + hash) so deep-link
      // params such as `?component=<name>` survive the login bounce.
      navigate(buildPostLoginRedirect(location), { replace: true });
    },
  });
};
