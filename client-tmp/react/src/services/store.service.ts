
import { CustomEventMap } from '@genesislcap/foundation-events';
import { getApp } from '@genesislcap/foundation-shell/app';
import {
  AbstractStoreRoot,
  registerStore,
  StoreRoot,
  StoreRootEventDetailMap,
} from '@genesislcap/foundation-store';
import { DI } from '@genesislcap/web-core';

interface Store extends StoreRoot {}
type StoreEventDetailMap = StoreRootEventDetailMap & Record<string, never>;

declare global {
  interface HTMLElementEventMap extends CustomEventMap<StoreEventDetailMap> {}
}

class DefaultStore extends AbstractStoreRoot<Store, StoreEventDetailMap> implements Store {
  constructor() {
    super();

    /**
     * Register the store root
     */
    getApp().registerStoreRoot(this);
  }
}

const Store = registerStore(DefaultStore, 'Store');

class StoreService {
  private store: any;

  constructor() {
    this.store = DI.getOrCreateDOMContainer().get(Store) as Store;
  }

  getStore() {
    return this.store;
  }

  onConnected(event?: CustomEvent) {
    this.store.onConnected(event);
  }
}

export const storeService = new StoreService();
