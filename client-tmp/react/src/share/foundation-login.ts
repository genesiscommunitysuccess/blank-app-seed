import {configure, define} from '@genesislcap/foundation-login';
import { DI } from '@genesislcap/web-core';
import { AUTH_PATH } from '@/config';

/**
 * Configure the micro frontend
 */
export const configureFoundationLogin = ({ navigate }:{ navigate: any }) => {
  configure(DI.getOrCreateDOMContainer(), {
    autoConnect: true,
    autoAuth: true, // < Allow users to skip login
    showConnectionIndicator: true,
    hostPath: AUTH_PATH,
    redirectHandler: () => {
      const lastPath = '/{{kebabCase routes.[0].name}}';
      navigate(lastPath);
    },
  });

  return define({
    name: `client-app-login`,
  });
}
