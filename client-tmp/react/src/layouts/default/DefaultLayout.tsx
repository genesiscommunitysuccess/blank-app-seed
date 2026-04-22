import React, { useEffect, useRef, useState } from 'react';
import { RouteObject, useNavigate, Outlet } from 'react-router-dom';
import { configureDesignSystem, getNavItems } from '@genesislcap/foundation-ui';
import { baseLayerLuminance, StandardLuminance } from '@microsoft/fast-components';
import styles from './DefaultLayout.module.css';
import PBCElementsRenderer from '../../pbc/elementsRenderer';
import { registerStylesTarget } from '../../pbc/utils';
import * as designTokens from '../../styles/design-tokens.json';
import { useRoutesContext } from '../../store/RoutesContext';
import { useDocumentTitle } from '../../utils/useDocumentTitle';
import { LOGOUT_URL } from '@genesislcap/foundation-utils';
import { DI } from '@genesislcap/web-core';
import { Connect } from '@genesislcap/foundation-comms';
import type { AppTargetId } from '@genesislcap/foundation-shell/app';

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

const DefaultLayout: React.FC<DefaultLayoutProps> = () => {
  const navigate = useNavigate();
  const designSystemProviderRef = useRef<HTMLElement>(null);
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
      baseLayerLuminance.setValueFor(
        designSystemProviderRef.current,
        baseLayerLuminance.getValueFor(designSystemProviderRef.current) ===
          StandardLuminance.DarkMode
          ? StandardLuminance.LightMode
          : StandardLuminance.DarkMode,
      );
    }
  };

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (designSystemProviderRef.current) {
      configureDesignSystem(designSystemProviderRef.current, designTokens);
      registerStylesTarget(document.body, 'layout');
      registerStylesTarget(document.body, 'header');
      registerStylesTarget(document.body, 'content');
    }

    const connect = DI.getOrCreateDOMContainer().get(Connect);
    setConnected(connect.isConnected);
    const subscription = connect.isConnected$?.subscribe((isConnected: boolean) => {
      setConnected(isConnected);
    });

    return () => {
      subscription?.unsubscribe();
    };
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
            show-luminance-toggle-button
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
