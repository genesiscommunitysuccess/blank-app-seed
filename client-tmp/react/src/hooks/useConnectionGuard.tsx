import { useState, useEffect } from 'react';
import { getConnect } from '@genesislcap/foundation-comms';

const useConnectionGuard = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const connect = getConnect();

  useEffect(() => {
    const checkConnection = async () => {
      if (connect.isConnected) {
        setIsConnected(true);
        return;
      }
      const hostUrl = sessionStorage.getItem('hostUrl');
      if (!hostUrl) {
        setIsConnected(false);
        return;
      }
      const result = await connect.connect(hostUrl);
      setIsConnected(result);
    };

    checkConnection();
  }, [connect]);

  return isConnected;
};

export default useConnectionGuard;