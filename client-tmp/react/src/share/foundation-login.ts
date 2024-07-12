import {configure, define} from '@genesislcap/foundation-login';
import { navigateTo } from '../utils/navigation';
import { AUTH_PATH } from '../config';
import { DI } from '@microsoft/fast-foundation';


/**
 * Configure the micro frontend
 */
export const configureFoundationLogin = () => {
  configure(DI.getOrCreateDOMContainer(), {
    showConnectionIndicator: true,
    hostPath: AUTH_PATH,
    redirectHandler: () => navigateTo('/{{kebabCase routes.[0].name}}'),
  });

  return define({
    name: `client-app-login`,
  });
}
