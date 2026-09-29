import { Connect } from '@genesislcap/foundation-comms';
import type { AppTargetId } from '@genesislcap/foundation-shell/app';
import { getNavItems } from '@genesislcap/foundation-ui';
import { LOGOUT_URL } from '@genesislcap/foundation-utils';
import {
  applyMode,
  injectThemeStyles,
  nextMode,
  resolveInitialMode,
} from '@genesislcap/rapid-design-system';
import { DI } from '@genesislcap/web-core';
import React, { useEffect, useRef, useSyncExternalStore } from 'react';
import { RouteObject, useNavigate, Outlet } from 'react-router-dom';
import PBCElementsRenderer from '../../pbc/elementsRenderer';
import { registerStylesTarget } from '../../pbc/utils';
import { useRoutesContext } from '../../store/RoutesContext';
import { activeTheme, modeToggleEnabled } from '../../styles/active-theme';
import { useDocumentTitle } from '../../utils/useDocumentTitle';
import styles from './DefaultLayout.module.css';

// Stable target arrays so PBCElementsRenderer effect doesn't re-run on every parent re-render
const TARGET_LAYOUT_START: AppTargetId = ['layout-start'];
const TARGET_HEADER_NAV: AppTargetId = ['header', 'nav-start', 'nav-end'];
const TARGET_CONTENT_START: AppTargetId = ['content-start'];
const TARGET_CONTENT: AppTargetId = ['content', 'content-end'];
const TARGET_LAYOUT_END: AppTargetId = ['layout', 'layout-end'];

interface DefaultLayoutProps {}

type ExtendedRouteObject = RouteObject & {
  data?: {
    navItems?: any;
  };
  path: string;
};

const connect = DI.getOrCreateDOMContainer().get(Connect);

const subscribe = (onChange: () => void) => {
  const sub = connect.isConnected$?.subscribe(() => onChange());
  return () => sub?.unsubscribe();
};

const getSnapshot = () => connect.isConnected;

const DefaultLayout: React.FC<DefaultLayoutProps> = () => {
  const navigate = useNavigate();
  const designSystemProviderRef = useRef<HTMLElement>(null);
  const themeModeRef = useRef<string>(resolveInitialMode(activeTheme));
  const routes = useRoutesContext() as ExtendedRouteObject[];
  const navItems = getNavItems(
    routes.flatMap((route) => ({
      path: route.path || '',
      navItems: route.data?.navItems,
    })),
  );

  useDocumentTitle();

  const onLuminanceToggle = (): void => {
    if (designSystemProviderRef.current) {
      themeModeRef.current = nextMode(activeTheme, themeModeRef.current);
      applyMode(designSystemProviderRef.current, activeTheme, themeModeRef.current);
    }
  };

  const connected = useSyncExternalStore(subscribe, getSnapshot);

  useEffect(() => {
    if (designSystemProviderRef.current) {
      injectThemeStyles(designSystemProviderRef.current, activeTheme);
      themeModeRef.current = resolveInitialMode(activeTheme);
      applyMode(designSystemProviderRef.current, activeTheme, themeModeRef.current);
      registerStylesTarget(document.body, 'layout');
      registerStylesTarget(document.body, 'header');
      registerStylesTarget(document.body, 'content');
    }
  }, []);

  const className = `${styles['default-layout']}`;

  return (
    <rapid-design-system-provider ref={designSystemProviderRef} class={className}>
      {connected && (
        <>
          <PBCElementsRenderer target={TARGET_LAYOUT_START} />
          <foundation-header
{{#if headerLogoSrc}}
            logo-src="{{headerLogoSrc}}"
{{/if}}
            onluminance-icon-clicked={onLuminanceToggle}
            logout={async () => {
              await fetch(LOGOUT_URL);
              window.location.reload();
            }}
            show-luminance-toggle-button={modeToggleEnabled}
            show-misc-toggle-button
            routeNavItems={navItems}
            navigateTo={(path: string) => navigate(path)}
          >
            <PBCElementsRenderer target={TARGET_HEADER_NAV} />
          </foundation-header>
        </>
      )}
      <section className={styles['content']}>
        {connected && <PBCElementsRenderer target={TARGET_CONTENT_START} />}
        <Outlet />
        {connected && <PBCElementsRenderer target={TARGET_CONTENT} />}
      </section>
      {connected && <PBCElementsRenderer target={TARGET_LAYOUT_END} />}
    </rapid-design-system-provider>
  );
};

export default DefaultLayout;
