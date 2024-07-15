import React, { ReactNode } from 'react';
import BlankLayout from './blank/BlankLayout';
import DefaultLayout from './default/DefaultLayout';

interface LayoutWrapperProps {
  layout: 'blank' | 'default';
  children: ReactNode;
}

const layoutMap = {
  blank: BlankLayout,
  default: DefaultLayout,
};

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ layout, children }) => {
  const Layout = layoutMap[layout] || DefaultLayout;
  return <Layout>{children}</Layout>;
};

export default LayoutWrapper;
