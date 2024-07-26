import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { getUser } from '@genesislcap/foundation-user';
import { NOT_PERMITTED_PATH } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class PermissionsGuard implements CanActivate {
  protected user = getUser();

  constructor(protected router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const { permissionCode } = route.data;
    if (permissionCode && !this.user.hasPermission(permissionCode)) {
      await this.router.navigate([`/${NOT_PERMITTED_PATH}`]);
      return false;
    }
    return true;
  }
}
