import { RouteLayouts } from './types/RouteLayouts';

export const routeLayouts: RouteLayouts = {
  '/login': 'blank',
  '/': 'blank',
};

export const AUTH_PATH = 'login';
export const NOT_PERMITTED_PATH = 'not-permitted';

export const API_DATA = {
  AUTH: {
    username: '', // provide login to a user in given environment
    password: '', // provide password to a user in given environment
  },
};
