import {
  mergePbcRoutes,
  type AppRouteConfig,
  type PbcRouteInput,
} from '@genesislcap/foundation-react-utils/router';
import React, { createContext, useContext, ReactNode } from 'react';
import { getApp } from '@genesislcap/foundation-shell/app';
import AuthPage from '../pages/AuthPage/AuthPage';
import NotPermittedPage from '../pages/NotPermittedPage/NotPermittedPage';
{{#each routes}}
import {{pascalCase this.name}} from '../pages/{{pascalCase this.name}}/{{pascalCase this.name}}';
{{/each}}
import PBCContainer from '../pbc/container';
import { AUTH_PATH, NOT_PERMITTED_PATH } from '../config';

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
