import { useState, useEffect, ReactNode } from 'react';
import { RouteObject } from 'react-router';
import isConnectedHelper from '@/helpers/isConnectedHelper';
import isAuthenticatedHelper from '@/helpers/isAuthenticatedHelper';
import hasPermissionHelper from '@/helpers/hasPermissionHelper';
import { useRoutesContext } from '@/store/RoutesContext';
import { NOT_PERMITTED_PATH, AUTH_PATH } from '@/config';

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

  useEffect(() => {
    isConnectedHelper().then((connectedState: boolean): void => {
      setIsConnected(connectedState);
    });
  }, []);
  
  useEffect((): void  => {
    if (isConnected === null) {
      return;
    }

    const isAuthenticated = isAuthenticatedHelper();


    let permissionState;

    if (!isConnected || !isAuthenticated) {
      permissionState = PermissionState.UNKNOWN;
    } else if (hasPermission === false) {
      permissionState = PermissionState.DENIED;
    } 
    
    if (permissionState) {
      window.location.href = `/${redirectUrlByPermissionState[permissionState]}`;
    }
  }, [routes, isConnected, isAuthenticated, hasPermission]);

  return children;
};

export default ProtectedGuard;