import {configure, define} from '@genesislcap/foundation-login';
import type { Router } from '@angular/router';
import { AUTH_PATH } from '../app.config';
import { css } from '@microsoft/fast-element';
import { DI } from '@microsoft/fast-foundation';
import logo from '../../assets/logo.svg';

// eslint-disable-next-line
declare var GENX_ENABLE_SSO: boolean;

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
    hostPath: AUTH_PATH,
    redirectHandler: () => {
      router.navigate(['{{kebabCase routes.[0].name}}'])
    },
    ...ssoSettings,
    logo: css `
      content: url("${logo}");
    `,
  });

  return define({
    name: `client-app-login`,
  });
}
