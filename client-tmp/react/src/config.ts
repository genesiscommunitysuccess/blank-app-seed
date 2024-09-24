import { RouteLayouts } from './types/RouteLayouts';

export const routeLayouts: RouteLayouts = {
  '/auth': 'blank',
  '/': 'blank',
};

export const AUTH_PATH = 'auth';
export const NOT_PERMITTED_PATH = 'not-permitted';

export const API_DATA = {
  //@todo handle vite / webpack
  URL: process.env.VITE_API_HOST,
  AUTH: {
    username: '', // provide login to a user in given environment
    password: '', // provide password to a user in given environment
  },
};
