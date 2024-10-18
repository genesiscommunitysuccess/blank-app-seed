import { isDev } from '@genesislcap/foundation-utils';
import pkg from '../../package.json';

// returning null disables caching
// returning an id (as long as it's not null) enables caching
export const persistLayout = (id: string) => {
  if (isDev() && (pkg as any)?.config.PERSIST_LAYOUT_IN_DEV !== true) {
    return null;
  }
  return id;
};
