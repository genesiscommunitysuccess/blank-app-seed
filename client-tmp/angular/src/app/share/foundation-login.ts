import {configure, define} from '@genesislcap/foundation-login';
import type { Router } from '@angular/router';
import { getUser } from '@genesislcap/foundation-user';
import { css, DI } from '@genesislcap/web-core';
import { AUTH_PATH } from '../app.config';
import logo from '../../assets/logo.svg';

// eslint-disable-next-line
declare var ENABLE_SSO: boolean;

const ssoSettings =
  typeof ENABLE_SSO !== 'undefined' && ENABLE_SSO === true
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
    autoConnect: true,
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
