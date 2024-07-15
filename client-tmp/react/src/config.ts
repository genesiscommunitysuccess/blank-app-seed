import { RouteLayouts } from './types/RouteLayouts';

export const routeLayouts: RouteLayouts = {
  '/auth-mock': 'blank',
  '/auth': 'blank',
  '/': 'blank',
};

import type { MainMenu } from './types/menu';

export const AUTH_PATH = 'auth';

export const API_DATA = {
  URL: '',
  AUTH: {
    username: '', // provide login to a user in given environment
    password: '', // provide password to a user in given environment
  },
};

export const mainMenu: MainMenu = [
  {{#each routes}}
  {
    index: {{@index}},
    path: '{{kebabCase this.name}}',
    title: '{{#if this.title}}{{this.title}}{{else}}{{this.name}}{{/if}}',
    icon: '{{this.icon}}',
    variant: 'solid'
  }{{#unless @last}},{{/unless}}
  {{/each}}
];
