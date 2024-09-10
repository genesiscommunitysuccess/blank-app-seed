import { FoundationRouteNavItem, getNavItems } from '@genesislcap/foundation-ui';
import { useRoutesContext } from '@/store/RoutesContext';

export const useNavItems = (): FoundationRouteNavItem[] => {
  const routes = useRoutesContext();

  const allNavItems = routes.flatMap((route) => ({
    path: route.path,
    navItems: route.data?.navItems,
  }));

  return getNavItems(allNavItems);
};