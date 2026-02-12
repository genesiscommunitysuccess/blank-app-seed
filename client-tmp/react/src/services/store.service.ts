import { CustomEventMap } from '@genesislcap/foundation-events';
import { getApp } from '@genesislcap/foundation-shell/app';
import {
  AbstractStoreRoot,
  registerStore,
  StoreRoot,
  StoreRootEventDetailMap,
} from '@genesislcap/foundation-store';
import { DI } from '@genesislcap/web-core';

interface Store extends StoreRoot {
  connected: boolean;
}

type StoreEventDetailMap = StoreRootEventDetailMap & {
  'connected-changed': { connected: boolean };
};

declare global {
  interface HTMLElementEventMap extends CustomEventMap<StoreEventDetailMap> {}
}

class DefaultStore extends AbstractStoreRoot<Store, StoreEventDetailMap> implements Store {
  connected: boolean = false;

  constructor() {
    super();
    getApp().registerStoreRoot(this);
  }

  setConnected(connected: boolean) {
    this.connected = connected;
    document.dispatchEvent(new CustomEvent('connected-changed', {
      detail: { connected }
    }));
  }
}

const Store = registerStore(DefaultStore, 'Store');

class StoreService {
  private store: Store;

  constructor() {
    this.store = DI.getOrCreateDOMContainer().get(Store) as Store;
  }

  getStore() {
    return this.store;
  }

  onConnected(event?: CustomEvent) {
    if (event) {
      this.store.onConnected(event as any);
    }
  }
}

export const storeService = new StoreService();
