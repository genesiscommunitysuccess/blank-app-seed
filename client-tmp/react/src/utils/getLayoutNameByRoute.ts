import { routeLayouts } from '@/config';

export const getLayoutNameByRoute = (route: string) => {
  return routeLayouts[route] || 'default';
}
