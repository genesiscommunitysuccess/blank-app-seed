import { Router } from '@angular/router';

export default class BaseLayout {
  router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
