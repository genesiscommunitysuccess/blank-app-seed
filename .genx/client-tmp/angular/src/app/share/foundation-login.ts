import {configure, define} from '@genesislcap/foundation-login';
import type { Router } from '@angular/router';
import { INTERNAL_URLS } from '../app.routes';
import { DI } from '@microsoft/fast-foundation';

const ssoSettings =
  typeof GENX_ENABLE_SSO !== 'undefined' && GENX_ENABLE_SSO === true
    ? {
        autoAuth: true,
        sso: {
          toggled: true,
          identityProvidersPath: 'sso/list',
        },
      }
    : {};

/**
 * Configure the micro frontend
 */
export const configureFoundationLogin = ({
  router,
}: {
  router: Router;
}) => {
  configure(DI.getOrCreateDOMContainer(), {
    showConnectionIndicator: true,
    hostPath: INTERNAL_URLS.auth,
    redirectHandler: () => {
      router.navigate([INTERNAL_URLS.homepage])
    },
    ...ssoSettings,

  });

  return define({
    name: `client-app-login`,
  });
}
