import {configure, define} from '@genesislcap/foundation-login';
import { AUTH_PATH } from '@/config';
import { DI } from '@microsoft/fast-foundation';
import { history } from '@/utils/history';

/**
 * Configure the micro frontend
 */
export const configureFoundationLogin = () => {
  configure(DI.getOrCreateDOMContainer(), {
    showConnectionIndicator: true,
    hostPath: AUTH_PATH,
    redirectHandler: () => {
      history.push('/{{kebabCase routes.[0].name}}'); 
    },
  });

  return define({
    name: `client-app-login`,
  });
};
