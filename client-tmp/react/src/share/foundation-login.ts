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
  // The base href is '' outside a container deployment, and a bare '' + 'login' is a
  // RELATIVE host path — the auth flow's navigations then compound onto whatever path the
  // app is on (e.g. '/login/not-found'), and a reload booted at that URL falls through to
  // the router's not-found page. Join with a normalised leading slash so the host path is
  // absolute with and without a base.
  const hostPath = `${basePath}/${AUTH_PATH}`.replace(/\/{2,}/g, '/');

  configure({
    name: 'client-app-login',
    omitRoutes: ['request-account', 'forgot-password'],
    fields: {
      ...defaultAuthConfig.fields,
      username: {
        ...defaultAuthConfig.fields.username,
      },
    },
    hostPath,
    postLoginRedirect: async () => {
      await connect.connect();
      // Preserve the full original location (query string + hash) so deep-link
      // params such as `?component=<name>` survive the login bounce.
      const target = buildPostLoginRedirect(location);
      navigate(target, { replace: true });
      // foundation-auth's own router can still be connected for a beat after this navigation
      // (its teardown races the React unmount of the auth page), and its hardwired fallback
      // rewrites any URL outside its routes to `<hostPath>/not-found` for an authenticated
      // user. When it wins the race, the app renders the right page under a poisoned URL —
      // until the next full reload boots the router there and strands the user on Not Found.
      // Until the fallback learns to stand down outside its hostPath, watch the brief
      // teardown window and re-assert the real destination.
      const notFoundPath = `${hostPath}/not-found`.replace(/\/{2,}/g, '/');
      let tries = 0;
      const reassert = () => {
        if (window.location.pathname === notFoundPath) {
          navigate(target, { replace: true });
        }
        // Keep watching either way — the router can strike again until its teardown lands.
        if (tries++ < 10) {
          window.setTimeout(reassert, 50);
        }
      };
      window.setTimeout(reassert, 0);
    },
  });
};
