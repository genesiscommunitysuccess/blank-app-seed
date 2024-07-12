import React, { ReactNode } from 'react';
import BlankLayout from './blank/BlankLayout';
import DefaultLayout from './default/DefaultLayout';
import SimpleLayout from './simple/SimpleLayout';

interface LayoutWrapperProps {
  layout: 'blank' | 'default' | 'simple';
  children: ReactNode;
}

const layoutMap = {
  blank: BlankLayout,
  default: DefaultLayout,
  simple: SimpleLayout,
};

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ layout, children }) => {
  const Layout = layoutMap[layout] || DefaultLayout;
  return <Layout>{children}</Layout>;
};

export default LayoutWrapper;
