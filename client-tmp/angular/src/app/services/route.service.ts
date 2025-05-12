import { Injectable } from '@angular/core';
import { Route, Routes } from '@angular/router';
import { getApp } from '@genesislcap/foundation-shell/app';
import { FoundationRoute, FoundationRouteNavItem, getNavItems } from '@genesislcap/foundation-ui';
import { PBCContainer } from '../../pbc/container';
import { AUTH_PATH, NOT_PERMITTED_PATH } from '../app.config';
import { ChainedGuard } from '../guards/chained.guard';
import { AuthLoginComponent } from '../pages/auth-login/auth-login.component';
import { NotPermittedComponent } from '../pages/not-permitted/not-permitted.component';
{{#each routes}}
import { {{pascalCase this.name}}Component } from '../pages/{{kebabCase this.name}}/{{kebabCase this.name}}.component';
{{/each}}

@Injectable({
    providedIn: 'root'
})
export class RouteService {
    static routes: Routes = [
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
            component: NotPermittedComponent,
        },
        {{#each routes}}
        {
            path: '{{kebabCase this.name}}',
            canActivate: [ChainedGuard],
            component: {{pascalCase this.name}}Component,
            data: {
                permissionCode: '{{this.permissions.viewRight}}',
                navItems: [
                    {
                        navId: 'header',
                        title: '{{#if this.title}}{{sentenceCase this.title}}{{else}}{{sentenceCase this.name}}{{/if}}',
                        icon: {
                            name: '{{this.icon}}',
                            variant: 'solid',
                        },
                    },
                ],
            },
        },
        {{/each}}
    ];

    /**
     * @privateRemarks
     * The shell has access to context, so it's possible for it to return a pre-mapped framework variant of routes. 
     * In this iteration we're doing it inline, given the angular version may move and here we know the shape we need.
     */
    pbcRoutes(): Routes {
        return getApp().routes.map((route) => {
            return <Route>{
                title: route.title,
                path: route.path,
                /**
                 * Ask about permissions.viewRight in PBC context, as we may need to apply a data.permissionCode here.
                 * Not sure if they are added to the filesystem prior to handlebars template processing across the files.
                 */
                canActivate: [ChainedGuard],
                component: PBCContainer,
                data: {
                    ...route.settings,
                    pbcElement: route.element,
                    // @ts-ignore
                    pbcElementTag: route.elementTag,
                    navItems: route.navItems
                },
            };
        })
    }

    allRoutes(): Routes {
        return [
            ...RouteService.routes,
            ...this.pbcRoutes(),
        ];
    }

    getNavItems(): FoundationRouteNavItem[] {
        const allNavItems = this.allRoutes().flatMap(route => (<FoundationRoute>{
            path: route.path as string,
            navItems: route.data?.['navItems'],
        }));
        return getNavItems(allNavItems);
    }
}
