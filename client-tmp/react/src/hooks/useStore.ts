import { useState, useEffect } from 'react';
import { storeService } from '@/services/store.service';

export const useStore = () => {
  const [state, setState] = useState(storeService.getStore());

  const handleStoreChange = () => {
    const newStore = { ...storeService.getStore() };
    setState(newStore);
  };

  useEffect(() => {
    const mainStore = storeService.getStore();

    if (!mainStore) {
      console.error('Main store not found');
      return;
    }

    // @todo - that doesn't work - check how to subscribe to store changes
    // temporary solution with interval in App.tsx
    const mainStoreSubscription = mainStore.bindingAsRx().subscribe(handleStoreChange);

    return () => {
      mainStoreSubscription.unsubscribe();
     
    };
  }, []);

  return {
    state,
    setState,
  };
};