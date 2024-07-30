import { Injectable } from '@angular/core';
import { AUTH_PATH } from '../app.config';
import { PermissionsGuard } from './permissions.guard';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends PermissionsGuard {
  override async canActivate(): Promise<boolean> {
    if (!this.user.isAuthenticated) {
      this.user.trackPath();
      this.router.navigate([`/${AUTH_PATH}`]);
      return false;
    }
    return true;
  }
}
