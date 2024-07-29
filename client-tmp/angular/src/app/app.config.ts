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
