import { useEffect, ReactNode, useState } from 'react';
import {RouteObject, useNavigate} from 'react-router';
import hasPermissionHelper from '@/helpers/hasPermissionHelper';
import { useRoutesContext } from '@/store/RoutesContext';
import { NOT_PERMITTED_PATH, AUTH_PATH } from '@/config';
import { getUser } from '@genesislcap/foundation-user';

enum PermissionState {
  ALLOWED = 'allowed',
  DENIED = 'denied',
  UNKNOWN = 'unknown',
}

const redirectUrlByPermissionState: { [key in Partial<PermissionState>]?: string } = {
  [PermissionState.DENIED]: NOT_PERMITTED_PATH,
  [PermissionState.UNKNOWN]: AUTH_PATH,
};

type ExtendedRouteObject = RouteObject & {
  data?: {
    permissionCode?: string;
  };
  path: string;
}

const ProtectedGuard: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const routes = useRoutesContext() as ExtendedRouteObject[];
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const isAuthenticated: boolean | null = null;
  const route = routes.find(({ path }) => path === location.pathname);
  const hasPermission = route?.data?.permissionCode ? hasPermissionHelper(route.data?.permissionCode) : true;
  const navigate = useNavigate();

  useEffect(() => {
    if (!getUser().isAuthenticated){
        getUser().trackPath();
        navigate('/login')
    }
  }, []);

  useEffect((): void  => {

    const isAuthenticated = getUser().isAuthenticated;
    let permissionState;

    if (!isAuthenticated) {
      permissionState = PermissionState.UNKNOWN;
    } else if (hasPermission === false) {
      permissionState = PermissionState.DENIED;
    }

    if (permissionState) {
      const redirect = `${redirectUrlByPermissionState[permissionState]}`;
      navigate(`${redirect}`);
    }
  }, [routes, isAuthenticated, hasPermission]);

  return children;
};

export default ProtectedGuard;
