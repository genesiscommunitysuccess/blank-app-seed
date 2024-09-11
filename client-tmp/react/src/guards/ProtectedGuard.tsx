import { useState, useEffect, ReactNode } from 'react';
import useConnectionGuard from '@/hooks/useConnectionGuard';
import useAuthGuard from '@/hooks/useAuthGuard';
import usePermissionsGuard from '@/hooks/usePermissionsGuard';
import { useRoutesContext } from '@/store/RoutesContext';
import { NOT_PERMITTED_PATH, AUTH_PATH } from '@/config';

enum PermissionState {
  ALLOWED = 'allowed',
  DENIED = 'denied',
  UNKNOWN = 'unknown',
};

const redirectUrlByPermissionState: { [key in PermissionState]: string } = {
  [PermissionState.ALLOWED]: '',
  [PermissionState.DENIED]: NOT_PERMITTED_PATH,
  [PermissionState.UNKNOWN]: AUTH_PATH,
};

const ProtectedGuard: React.FC<{ children: ReactNode }> = ({ children }) => {
  const routes = useRoutesContext();
  const [permissionState, setPermissionState] = useState<PermissionState>(PermissionState.UNKNOWN);
  const isConnected = useConnectionGuard();
  const isAuthenticated = useAuthGuard();
  const route = routes.find((r) => r.path === location.pathname);
  console.log({ routes, path: location.pathname, route });
  const hasPermission = usePermissionsGuard(route.data?.permissionCode || '');

  useEffect((): void  => {
    if (isConnected === null || isAuthenticated === null || hasPermission === null) {
      return;
    }

    if (!isConnected || !isAuthenticated) {
      setPermissionState(PermissionState.UNKNOWN);
    } else if (hasPermission === false) {
      setPermissionState(PermissionState.DENIED);
    } else {
      setPermissionState(PermissionState.ALLOWED);
    }
  }, [routes, isConnected, isAuthenticated, hasPermission]);

  useEffect((): void => {
    if (redirectUrlByPermissionState[permissionState]) {
      alert('You are not allowed to access this page.');
      window.location.href = `/${redirectUrlByPermissionState[permissionState]}`;
      return;
    }
  }, [permissionState]);

  return children;
};

export default ProtectedGuard;