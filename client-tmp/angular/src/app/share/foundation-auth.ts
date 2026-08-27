import type { Router } from '@angular/router';
import { configure, defaultAuthConfig } from '@genesislcap/foundation-auth/config';
import type { Connect } from '@genesislcap/foundation-comms';
import { getUser } from '@genesislcap/foundation-user';
import { AUTH_PATH } from '../app.config';

/**
 * Configure the micro frontend
 */
export const configureFoundationAuth = ({
  router,
  connectService,
}: {
  router: Router;
  connectService: Connect;
}) => {
  const baseElement = document.querySelector('base');
  const basePath = baseElement?.getAttribute('href') || '';

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
      const url = API_HOST;
      await connectService.connect(url);

      const lastPath = getUser().lastPath()?.replace(basePath, '');

      router.navigate([lastPath ?? '{{kebabCase routes.[0].name}}']);
    },
  });
};
