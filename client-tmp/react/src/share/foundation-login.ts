import {configure, define} from '@genesislcap/foundation-login';
import { getUser } from '@genesislcap/foundation-user';
import { DI } from '@genesislcap/web-core';
import { AUTH_PATH } from '@/config';
import type { Router } from '@/utils/history';

/**
 * Configure the micro frontend
 */
export const configureFoundationLogin = ({ router }:{ router: Router }) => {
  configure(DI.getOrCreateDOMContainer(), {
    // autoConnect: true, // < Workaround - Guard should ensure connection
    autoAuth: true, // < Allow users to skip login
    showConnectionIndicator: true,
    hostPath: AUTH_PATH,
    redirectHandler: () => {
      // workaround for redirect from foundation-login
      setTimeout(() => {
        const lastPath = getUser().lastPath() ?? '/home';
        router.push(lastPath);
      }, 0);
    },
  });

  return define({
    name: `client-app-login`,
  });
}
