import React, { ReactNode, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  baseLayerLuminance,
  StandardLuminance,
} from '@microsoft/fast-components';
import styles from './DefaultLayout.module.css';
import { mainMenu } from '../../config';
import AppFooter from '../../components/AppFooter/AppFooter';

interface DefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const designSystemProvider = useRef<HTMLElement>(null);
  const allRoutes = mainMenu;

  const onLuminanceToogle = (): void => {
    if (designSystemProvider.current) {
      baseLayerLuminance.setValueFor(
        designSystemProvider.current,
        baseLayerLuminance.getValueFor(designSystemProvider.current) ===
          StandardLuminance.DarkMode
          ? StandardLuminance.LightMode
          : StandardLuminance.DarkMode,
      );
    }
  };
  const className = `${styles['default-layout']}`;

  return (
    <rapid-design-system-provider ref={designSystemProvider} class={className}>
      <foundation-header
        on-luminance-icon-clicked={() => onLuminanceToogle()}
        show-luminance-toggle-button
        show-misc-toggle-button
        show-notification-button
      >
        <section className={styles['routes-wrapper']} slot="routes">
          {allRoutes.map((route, index) => (
            <rapid-button key={index} onClick={() => navigate(route.path)}>
              <rapid-icon name={route.icon}></rapid-icon>
              {route.title}
            </rapid-button>
          ))}
        </section>
        <div slot="menu-contents">
          <p>GROUP SLOT</p>
          <rapid-tree-view slot="nav-items-1">
            <rapid-tree-item>
              <rapid-icon name="location-arrow"></rapid-icon>
              Slot Tree Item
            </rapid-tree-item>
            <rapid-tree-item>
              <rapid-icon name="location-arrow"></rapid-icon>
              Slot Tree Item
            </rapid-tree-item>
            <rapid-tree-item>
              <rapid-icon name="location-arrow"></rapid-icon>
              Slot Tree Item
            </rapid-tree-item>
            <rapid-tree-item>
              <rapid-icon name="location-arrow"></rapid-icon>
              Slot Tree Item
            </rapid-tree-item>
          </rapid-tree-view>
          <p>GROUP SLOT 2</p>
          <rapid-tree-view slot="nav-items-2">
            <rapid-tree-item>
              <rapid-icon name="location-arrow"></rapid-icon>
              Slot Tree Item 2
            </rapid-tree-item>
            <rapid-tree-item>
              <rapid-icon name="location-arrow"></rapid-icon>
              Slot Tree Item 2
            </rapid-tree-item>
            <rapid-tree-item>
              <rapid-icon name="location-arrow"></rapid-icon>
              Slot Tree Item 2
            </rapid-tree-item>
            <rapid-tree-item>
              <rapid-icon name="location-arrow"></rapid-icon>
              Slot Tree Item 2
            </rapid-tree-item>
          </rapid-tree-view>
          <p>GROUP SLOT 3</p>
          <rapid-tree-view slot="nav-items-3">
            <rapid-tree-item>
              <rapid-icon name="location-arrow"></rapid-icon>
              User Slot
            </rapid-tree-item>
            <rapid-tree-item>
              <rapid-icon name="location-arrow"></rapid-icon>
              Reporting Slot
            </rapid-tree-item>
            <rapid-tree-item>
              <rapid-icon name="location-arrow"></rapid-icon>
              Settings Slot
            </rapid-tree-item>
          </rapid-tree-view>
        </div>
        <foundation-inbox-counter slot="notifications-icon-end"></foundation-inbox-counter>
      </foundation-header>
      <section className={styles['content']}>{children}</section>
      <AppFooter></AppFooter>
    </rapid-design-system-provider>
  );
};

export default DefaultLayout;
