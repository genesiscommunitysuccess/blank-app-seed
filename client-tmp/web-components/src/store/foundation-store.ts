import { CustomEventMap } from '@genesislcap/foundation-events';
import { getApp } from '@genesislcap/foundation-shell/app';
import {
  AbstractStoreRoot,
  registerStore,
  StoreRoot,
  StoreRootEventDetailMap,
} from '@genesislcap/foundation-store';

export interface Store extends StoreRoot {}

export type StoreEventDetailMap = StoreRootEventDetailMap & {};

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

export const Store = registerStore(DefaultStore, 'Store');
