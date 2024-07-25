import type { MainMenu } from './types/menu'
import type { LayoutComponentName } from './types/layout';

export const AUTH_PATH = 'login'
export const NOT_PERMITTED_PATH = 'not-permitted'

export const layoutComponentName = {
  default: 'DefaultLayoutComponent',
  blank: 'BlankLayoutComponent',
};

export const layoutComponentImportsByName = {
  [layoutComponentName.default]: () =>
    import('./layouts/default/default.layout').then((m) => m.DefaultLayoutComponent),
  [layoutComponentName.blank]: () =>
    import('./layouts/blank/blank.layout').then((m) => m.BlankLayoutComponent),
};

export const layoutNameByRouteMap: Map<string, LayoutComponentName> = new Map([
  [`/${AUTH_PATH}`, layoutComponentName.blank],
]);

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
