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
    // The base href is '' outside a container deployment, and a bare '' + 'login' is a
    // RELATIVE host path — the auth flow's navigations then compound onto whatever path the
    // app is on (e.g. '/login/not-found'), and a reload booted at that URL falls through to
    // the router's not-found page. Join with a normalised leading slash so the host path is
    // absolute with and without a base.
    hostPath: `${basePath}/${AUTH_PATH}`.replace(/\/{2,}/g, '/'),
    postLoginRedirect: async () => {
      await connect.connect();
      // Preserve the full original location (query string + hash) so deep-link
      // params such as `?component=<name>` survive the login bounce.
      navigate(buildPostLoginRedirect(location), { replace: true });
    },
  });
};
