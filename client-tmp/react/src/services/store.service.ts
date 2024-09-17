
import { getStore as fetchStore } from '@/utils';

class StoreService {
  private store: any;

  constructor() {
    this.store = fetchStore();
  }

  getStore() {
    return this.store;
  }

  onConnected(event?: CustomEvent) {
    this.store.onConnected(event);
  }
}

export const storeService = new StoreService();