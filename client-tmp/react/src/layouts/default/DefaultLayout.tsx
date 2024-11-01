import React, { ReactNode, useEffect, useRef } from 'react';
import { RouteObject } from 'react-router';
import { configureDesignSystem, getNavItems } from '@genesislcap/foundation-ui';
import { useNavigate } from 'react-router-dom';
import {
  baseLayerLuminance,
  StandardLuminance,
} from '@microsoft/fast-components';
import styles from './DefaultLayout.module.css';
import PBCElementsRenderer from '@/pbc/elementsRenderer';
import * as designTokens from '@/styles/design-tokens.json';
import { useRoutesContext } from '@/store/RoutesContext';

interface DefaultLayoutProps {
  children: ReactNode;
}

type ExtendedRouteObject = RouteObject & {
  data?: {
    navItems?: any;
  };
  path: string;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const designSystemProviderRef = useRef<HTMLElement>(null);
  const foundationHeaderRef = useRef<HTMLElement>(null);
  const routes = useRoutesContext() as ExtendedRouteObject[];
  const navItems = getNavItems(routes.flatMap((route) => ({
    path: route.path || '',
    navItems: route.data?.navItems,
  })));

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
    }

    const handleLuminanceIconClicked = () => {
      onLuminanceToggle();
    };

    const foundationHeader = foundationHeaderRef.current;
    if (foundationHeader) {
      foundationHeader.addEventListener('luminance-icon-clicked', handleLuminanceIconClicked);
    }

    return () => {
      if (foundationHeader) {
        foundationHeader.removeEventListener('luminance-icon-clicked', handleLuminanceIconClicked);
      }
    };
  }, []);

  const className = `${styles['default-layout']}`;

  return (
    <rapid-design-system-provider ref={designSystemProviderRef} class={className}>
      <PBCElementsRenderer target={['layout-start']} />
      <foundation-header
        ref={foundationHeaderRef}
        show-luminance-toggle-button
        show-misc-toggle-button
        routeNavItems={navItems}
        navigateTo={(path: string) => navigate(path)}
      >
      </foundation-header>
      <section className={styles['content']}>
        <PBCElementsRenderer target={['content-start']} />
        {children}
        <PBCElementsRenderer target={['content', 'content-end']} />
      </section>
      <PBCElementsRenderer target={['layout', 'layout-end']} />
    </rapid-design-system-provider>
  );
};

export default DefaultLayout;
