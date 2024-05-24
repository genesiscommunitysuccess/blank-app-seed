import {configure, defaultLoginConfig, define} from '@genesislcap/foundation-login';
import type { Router } from '@angular/router';
import { INTERNAL_URLS } from '../app.routes';
import {DI} from "@microsoft/fast-foundation";

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
    redirectHandler: url => {
      router.navigate([INTERNAL_URLS.homepage])
    }
  });

  return define({
    name: `client-app-login`,
  });
}
