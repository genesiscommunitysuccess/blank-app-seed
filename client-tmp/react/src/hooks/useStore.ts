import { useState, useEffect } from 'react';
import { storeService } from '@/services/store.service';

export const useStore = (): any => {
  const [state, setState] = useState(storeService.getStore());

  useEffect(() => {
    // @todo Subscribe to the store updates instead of using interval
    const intervalId = setInterval(() => {
      const store = storeService.getStore();
      console.log('STORE UPDATED', store);
      setState({ ...store });
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return state;
};