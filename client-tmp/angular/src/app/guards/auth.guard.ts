import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AUTH_PATH } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async canActivate(): Promise<boolean> {
    const isUserAuthenticated = await this.authService.isUserAuthenticated();

    if (!isUserAuthenticated) {
      await this.router.navigate([`/${AUTH_PATH}`]);
      return false;
    }
    return true;
  }
}
