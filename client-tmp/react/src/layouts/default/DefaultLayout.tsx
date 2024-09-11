import React, { ReactNode, useEffect, useRef } from 'react';
import { configureDesignSystem } from '@genesislcap/foundation-ui';
import { useNavigate } from 'react-router-dom';
import {
  baseLayerLuminance,
  StandardLuminance,
} from '@microsoft/fast-components';
import styles from './DefaultLayout.module.css';
import PBCElementsRenderer from '@/pbc/elementsRenderer';
import * as designTokens from '@/styles/design-tokens.json';
import { useNavItems } from '@/hooks/useNavItems';
import { useRoutesContext } from '@/store/RoutesContext';

interface DefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const designSystemProviderRef = useRef<HTMLElement>(null);
  const foundationHeaderRef = useRef<HTMLElement>(null);
  const routes = useRoutesContext();
  console.log({ routes })
  const navItems = useNavItems();

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
        navigateTo={(path) => navigate(path)}
      >
        <section className={styles['routes-wrapper']} slot="routes">
          {routes.map((route, index) => (
            <rapid-button key={index} onClick={() => navigate(route.path)}>
              <rapid-icon name={route.icon}></rapid-icon>
              {route.title}
            </rapid-button>
          ))}
        </section>
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
