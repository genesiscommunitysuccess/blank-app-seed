import { configureDesignSystem } from '@genesislcap/foundation-ui';
import React, { ReactNode, useEffect, useRef } from 'react';
import * as designTokens from '../../styles/design-tokens.json';
import styles from './BlankLayout.module.css';

interface BlankLayoutProps {
  children: ReactNode;
}

const BlankLayout: React.FC<BlankLayoutProps> = ({ children }) => {
  const designSystemProviderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (designSystemProviderRef.current) {
      configureDesignSystem(designSystemProviderRef.current, designTokens);
    }
  }, []);

  return (
    <rapid-design-system-provider className={styles['blank-layout']}>
      <section className={styles.content}>{children}</section>
    </rapid-design-system-provider>
  );
};

export default BlankLayout;
