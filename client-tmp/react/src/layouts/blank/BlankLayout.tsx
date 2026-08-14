import React, { ReactNode, useEffect, useRef } from 'react';
import {
  applyMode,
  injectThemeStyles,
  resolveInitialMode,
} from '@genesislcap/rapid-design-system';
import styles from './BlankLayout.module.css';
import { activeTheme } from '../../styles/active-theme';

interface BlankLayoutProps {
  children: ReactNode;
}

const BlankLayout: React.FC<BlankLayoutProps> = ({ children }) =>{
  const designSystemProviderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (designSystemProviderRef.current) {
      injectThemeStyles(designSystemProviderRef.current, activeTheme);
      applyMode(designSystemProviderRef.current, activeTheme, resolveInitialMode(activeTheme));
    }
  }, []);

  return (
  <rapid-design-system-provider ref={designSystemProviderRef} className={styles['blank-layout']}>
    <section className={styles.content}>{children}</section>
  </rapid-design-system-provider>
);
};

export default BlankLayout;
