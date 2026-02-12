import React, { useEffect, useRef } from 'react';
import { RouteObject, useNavigate, Outlet } from 'react-router-dom';
import { configureDesignSystem, getNavItems } from '@genesislcap/foundation-ui';
import {
  baseLayerLuminance,
  StandardLuminance,
} from '@microsoft/fast-components';
import styles from './DefaultLayout.module.css';
import PBCElementsRenderer from '../../pbc/elementsRenderer';
import { registerStylesTarget } from '../../pbc/utils';
import * as designTokens from '../../styles/design-tokens.json';
import { useRoutesContext } from '../../store/RoutesContext';
import { useDocumentTitle } from '../../utils/useDocumentTitle';
import { AUTH_PATH } from '../../config';
import { LOGOUT_URL } from '@genesislcap/foundation-utils';

interface DefaultLayoutProps {}

type ExtendedRouteObject = RouteObject & {
  data?: {
    navItems?: any;
  };
  path: string;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = () => {
  const navigate = useNavigate();
  const designSystemProviderRef = useRef<HTMLElement>(null);
  const routes = useRoutesContext() as ExtendedRouteObject[];
  const navItems = getNavItems(routes.flatMap((route) => ({
    path: route.path || '',
    navItems: route.data?.navItems,
  })));

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

  useEffect(() => {
    if (designSystemProviderRef.current) {
      configureDesignSystem(designSystemProviderRef.current, designTokens);
      registerStylesTarget(document.body, 'layout');
      registerStylesTarget(document.body, 'header');
      registerStylesTarget(document.body, 'content');
    }

    return () => {
    };
  }, []);

  const className = `${styles['default-layout']}`;

  return (
    <rapid-design-system-provider ref={designSystemProviderRef} class={className}>
      <PBCElementsRenderer target={['layout-start']} />
      <foundation-header
{{#if headerLogoSrc}}
        logo-src="{{headerLogoSrc}}"
{{/if}}
        onluminance-icon-clicked={onLuminanceToggle}
        logout={async () => {
          await fetch(LOGOUT_URL);
          window.location.reload()
        }}
        show-luminance-toggle-button
        show-misc-toggle-button
        routeNavItems={navItems}
        navigateTo={(path: string) => navigate(path)}
      >
        <PBCElementsRenderer target={['header', 'nav-start', 'nav-end']} />
      </foundation-header>
      <section className={styles['content']}>
        <PBCElementsRenderer target={['content-start']} />
        <Outlet />
        <PBCElementsRenderer target={['content', 'content-end']} />
      </section>
      <PBCElementsRenderer target={['layout', 'layout-end']} />
    </rapid-design-system-provider>
  );
};

export default DefaultLayout;
