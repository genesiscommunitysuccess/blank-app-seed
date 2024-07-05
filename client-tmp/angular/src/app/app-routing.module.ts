import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { AuthLoginComponent } from './pages/auth-login/auth-login.component';
import { NotPermittedRouteComponent } from './pages/not-permitted-route/not-permitted-route.component';
{{#each routes}}
import { {{pascalCase this.name}}Component } from './pages/{{kebabCase this.name}}/{{kebabCase this.name}}.component';
{{/each}}
import { AUTH_PATH, NOT_PERMITTED_PATH } from './app.config';

export const routes: Routes = [
  {
    path: '',
    redirectTo: `${AUTH_PATH}`,
    pathMatch: 'full',
  },
  {
    path: `${AUTH_PATH}`,
    component: AuthLoginComponent,
  },
  {
    path: `${NOT_PERMITTED_PATH}`,
    component: NotPermittedRouteComponent,
  },
  {{#each routes}}
  {
    path: '{{kebabCase this.name}}',
    canActivate: [AuthGuard{{#if this.permissions.viewRight}}, PermissionsGuard{{/if}}],
    component: {{pascalCase this.name}}Component,
    data: { permissionCode: '{{this.permissions.viewRight}}' },
  },
  {{/each}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
