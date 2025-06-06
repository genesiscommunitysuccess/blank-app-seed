import type { Router } from '@angular/router';
import { configure, defaultAuthConfig } from '@genesislcap/foundation-auth/config';
import type { Connect } from '@genesislcap/foundation-comms';
import { getUser } from '@genesislcap/foundation-user';
import { AUTH_PATH } from '../app.config';

/**
 * Configure the micro frontend
 */
export const configureFoundationAuth = ({ router, connectService,}: { router: Router; connectService: Connect; }) => {
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
    hostPath: basePath + AUTH_PATH,
    postLoginRedirect: async () => {
      const url = API_HOST;
      await connectService.connect(url);

      const lastPath = getUser().lastPath()?.replace(basePath, '');

      router.navigate([lastPath ?? '{{kebabCase routes.[0].name}}']);
    },
  });
};
