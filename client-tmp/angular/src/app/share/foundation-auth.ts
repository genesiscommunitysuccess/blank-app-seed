// import { configure } from '@genesislcap/foundation-auth/config';
import type { Router } from '@angular/router';

/**
 * Configure the micro frontend
 */
export const configureFoundationAuth = ({
  router,
  connectService,
}: {
  router: Router;
  connectService: any;
}) => null
  // configure({
  //   omitRoutes: ['request-account'],
  //   postLoginRedirect: async () => {
  //     await connectService.init();
  //     router.navigate([`/${INTERNAL_URLS.homepage}`]);
  //   },
  // });
