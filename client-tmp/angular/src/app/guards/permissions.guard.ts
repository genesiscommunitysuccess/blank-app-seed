import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NOT_PERMITTED_PATH } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class PermissionsGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const isPermitted = await this.authService.hasUserPermission(route.data['permissionCode']);

    if (!isPermitted) {
      await this.router.navigate([`/${NOT_PERMITTED_PATH}`]);
      return false;
    }
    return true;
  }
}
