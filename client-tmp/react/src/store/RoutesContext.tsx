import {
  mergePbcRoutes,
  type AppRouteConfig,
  type PbcRouteInput,
} from '@genesislcap/foundation-react-utils/router';
import { getApp } from '@genesislcap/foundation-shell/app';
import React, { createContext, useContext, ReactNode } from 'react';
import { AUTH_PATH, NOT_PERMITTED_PATH } from '../config';
import AuthPage from '../pages/AuthPage/AuthPage';
import NotPermittedPage from '../pages/NotPermittedPage/NotPermittedPage';
import PBCContainer from '../pbc/container';
{{#if routes.[0]}}
/* eslint-disable import-es/order -- generated route pages follow route-table order, not alphabetical */
{{#each routes}}
import {{pascalCase this.name}} from '../pages/{{pascalCase this.name}}/{{pascalCase this.name}}';
{{/each}}
/* eslint-enable import-es/order */
{{/if}}

/**
 * Static application routes as a declarative table consumed by `renderAppRoutes`
 * (routing), `DefaultLayout` (nav items), and `PBCContainer` (pbc lookup).
 * `public` routes render outside the layout without the auth guard;
 * `permissionCode` gates a route via the shared guard.
 */
const staticRoutes: AppRouteConfig[] = [
  { path: `/${AUTH_PATH}`, element: <AuthPage />, public: true },
  { path: `/${NOT_PERMITTED_PATH}`, element: <NotPermittedPage />, public: true },
  {{#each routes}}
  {
    path: '/{{kebabCase this.name}}',
    element: <{{pascalCase this.name}} />,
    permissionCode: '{{this.permissions.viewRight}}',
    data: {
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

const RoutesContext = createContext<AppRouteConfig[]>([]);

export const RoutesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const routes = mergePbcRoutes(staticRoutes, getApp().routes as unknown as PbcRouteInput[], {
    renderPbc: () => <PBCContainer />,
  });

  return <RoutesContext.Provider value={routes}>{children}</RoutesContext.Provider>;
};

export const useRoutesContext = () => {
  return useContext(RoutesContext);
};
