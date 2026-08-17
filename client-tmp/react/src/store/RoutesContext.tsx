import {
  mergePbcRoutes,
  type AppRouteConfig,
  type PbcRouteInput,
} from '@genesislcap/foundation-react-utils/router';
import { getApp } from '@genesislcap/foundation-shell/app';
import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { AUTH_PATH, NOT_PERMITTED_PATH } from '../config';
{{#if routes.[0]}}
/* eslint-disable import-es/order -- generated route pages follow route-table order, not alphabetical */
import AuthPage from '../pages/AuthPage/AuthPage';
import NotPermittedPage from '../pages/NotPermittedPage/NotPermittedPage';
{{#each routes}}
import {{pascalCase this.name}} from '../pages/{{pascalCase this.name}}/{{pascalCase this.name}}';
{{/each}}
import PBCContainer from '../pbc/container';
/* eslint-enable import-es/order */
{{else}}
import AuthPage from '../pages/AuthPage/AuthPage';
import NotPermittedPage from '../pages/NotPermittedPage/NotPermittedPage';
import PBCContainer from '../pbc/container';
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
  const pbcRoutes = getApp().routes as unknown as PbcRouteInput[];

  /**
   * Memoized so the context value keeps a stable identity across re-renders. Without this,
   * every re-render of this provider hands consumers a brand new array and re-runs the
   * effects keyed on it — `PBCContainer` would tear down and re-create the mounted custom
   * element, and the document title would be re-applied on each pass.
   */
  const routes = useMemo(
    () =>
      mergePbcRoutes(staticRoutes, pbcRoutes, {
        renderPbc: () => <PBCContainer />,
      }),
    [pbcRoutes],
  );

  return <RoutesContext.Provider value={routes}>{children}</RoutesContext.Provider>;
};

export const useRoutesContext = () => {
  return useContext(RoutesContext);
};
