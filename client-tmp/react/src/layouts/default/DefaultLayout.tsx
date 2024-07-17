import React, { ReactNode, useEffect, useRef } from 'react';
import { configureDesignSystem } from '@genesislcap/foundation-ui';
import { useNavigate } from 'react-router-dom';
import {
  baseLayerLuminance,
  StandardLuminance,
} from '@microsoft/fast-components';
import styles from './DefaultLayout.module.css';
import { mainMenu } from '../../config';
import * as designTokens from '../../styles/design-tokens.json';

interface DefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const designSystemProviderRef = useRef<HTMLElement>(null);
  const foundationHeaderRef = useRef<HTMLElement>(null);
  const allRoutes = mainMenu;

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
      <foundation-header
        ref={foundationHeaderRef}
        show-luminance-toggle-button
        show-misc-toggle-button
        navigateTo={(path) => navigate(path)}
      >
        <section className={styles['routes-wrapper']} slot="routes">
          {allRoutes.map((route, index) => (
            <rapid-button key={index} onClick={() => navigate(route.path)}>
              <rapid-icon name={route.icon}></rapid-icon>
              {route.title}
            </rapid-button>
          ))}
        </section>
      </foundation-header>
      <section className={styles['content']}>{children}</section>
    </rapid-design-system-provider>
  );
};

export default DefaultLayout;
