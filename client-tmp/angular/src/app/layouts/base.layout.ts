import { Router } from '@angular/router';

export default class BaseLayout {
  constructor(protected router: Router) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
