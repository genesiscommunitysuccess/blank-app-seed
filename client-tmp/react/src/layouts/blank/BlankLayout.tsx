import React, { ReactNode } from 'react';
import styles from './BlankLayout.module.css';

interface BlankLayoutProps {
  children: ReactNode;
}

const BlankLayout: React.FC<BlankLayoutProps> = ({ children }) => (
  <zero-design-system-provider className={styles['blank-layout']}>
    <section className={styles.content}>{children}</section>
  </zero-design-system-provider>
);

export default BlankLayout;
