import { RouteLayouts } from './types/RouteLayouts';
import { environment } from '@environment';

export const routeLayouts: RouteLayouts = {
  '/auth': 'blank',
  '/': 'blank',
};

export const AUTH_PATH = 'auth';
export const NOT_PERMITTED_PATH = 'not-permitted';

export const API_DATA = {
  URL: environment.API_HOST,
  AUTH: {
    username: '', // provide login to a user in given environment
    password: '', // provide password to a user in given environment
  },
};
