import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AuthLoginComponent } from './pages/auth-login/auth-login.component';
{{#each routes}}
import { {{pascalCase this.name}}Component } from './pages/{{kebabCase this.name}}/{{kebabCase this.name}}.component';
{{/each}}
import { AUTH_PATH } from './app.config';

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
  {{#each routes}}
  {
    path: '{{kebabCase this.name}}',
    canActivate: [AuthGuard],
    component: {{pascalCase this.name}}Component ,
  },
  {{/each}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
