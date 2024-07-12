import React, { ReactNode } from 'react';
import styles from './SimpleLayout.module.css';
import AppFooter from '../../components/AppFooter/AppFooter';

interface SimpleLayoutProps {
  children: ReactNode;
}

const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children }) => (
  <rapid-design-system-provider className={styles['simple-layout']}>
    <section className={styles['content']}>{children}</section>
    <AppFooter></AppFooter>
  </rapid-design-system-provider>
);

export default SimpleLayout;
