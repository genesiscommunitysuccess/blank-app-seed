import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AuthLoginComponent } from './pages/auth-login/auth-login.component';
import { HomeComponent } from './pages/home/home.component';

export const INTERNAL_URLS = {
  auth: 'auth',
  homepage: 'home',
};

export const AUTH_PATH = INTERNAL_URLS.auth;

export const routes: Routes = [
  {
    path: '',
    redirectTo: `/${INTERNAL_URLS.homepage}`,
    pathMatch: 'full',
  },
  {
    path: INTERNAL_URLS.homepage,
    canActivate: [AuthGuard],
    component: HomeComponent,
  },
  {
    path: INTERNAL_URLS.auth,
    component: AuthLoginComponent,
  },
];
