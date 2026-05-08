import type { AppRoute as FoundationAppRoute } from '@genesislcap/foundation-shell/app';
import type { ReactNode } from 'react';

export interface AppRoute {
  path?: string;
  element?: ReactNode;
  children?: AppRoute[];
  data?: {
    permissionCode?: string;
    navItems?: unknown[];
    pbcElement?: FoundationAppRoute['element'];
    pbcElementTag?: unknown;
    [key: string]: unknown;
  };
}
