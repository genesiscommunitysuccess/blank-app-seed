import React, { createContext, useContext, ReactNode } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { getApp } from '@genesislcap/foundation-shell/app';
import AuthPage from '../pages/AuthPage/AuthPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import NotPermittedPage from '../pages/NotPermittedPage/NotPermittedPage';
{{#each routes}}
import {{pascalCase this.name}} from '../pages/{{pascalCase this.name}}/{{pascalCase this.name}}';
{{/each}}
import PBCContainer from '../pbc/container';
import { AUTH_PATH, NOT_PERMITTED_PATH } from '../config';
import * as changeCase from 'change-case';

const routes = [
  {
    path: '',
    element: <Navigate to={AUTH_PATH} replace />,
  },
  {
    path: '/not-found',
    element: <NotFoundPage />,
  },
  {
    path: `/${AUTH_PATH}`,
    element: <AuthPage />,
  },
  {
    path: `/${NOT_PERMITTED_PATH}`,
    element: <NotPermittedPage />,
  },
  {{#each routes}}
  {
    path: '/{{kebabCase this.name}}',
    element: <{{pascalCase this.name}} />,
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

const RoutesContext = createContext<RouteObject[]>([]);

export const RoutesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const pbcRoutes = getApp().routes.map((route) => ({
    title: changeCase.capitalCase(route.path),
    path: `/${route.path}`,
    element: <PBCContainer />,
    data: {
      ...route.settings,
      pbcElement: route.element,
      // @ts-expect-error - getApp() is not typed to return the elementTag
      pbcElementTag: route.elementTag,
      navItems: route.navItems,
    },
  }));

  const allRoutes = [...routes, ...pbcRoutes];

  return <RoutesContext.Provider value={allRoutes}>{children}</RoutesContext.Provider>;
};

export const useRoutesContext = () => {
  return useContext(RoutesContext);
};
