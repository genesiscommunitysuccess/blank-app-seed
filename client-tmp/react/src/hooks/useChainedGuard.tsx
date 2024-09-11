import { useState, useEffect } from 'react';
import useConnectionGuard from './useConnectionGuard';
import useAuthGuard from './useAuthGuard';
import usePermissionsGuard from './usePermissionsGuard';

const useChainedGuard = (route: any) => {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
  const isConnected = useConnectionGuard();
  const isAuthenticated = useAuthGuard();
  const hasPermission = usePermissionsGuard(route);

  useEffect(() => {
    if (isConnected === null || isAuthenticated === null || hasPermission === null) {
      return;
    }

    if (!isConnected || !isAuthenticated || !hasPermission) {
      setIsAllowed(false);
    } else {
      setIsAllowed(true);
    }
  }, [isConnected, isAuthenticated, hasPermission]);

  return isAllowed;
};

export default useChainedGuard;