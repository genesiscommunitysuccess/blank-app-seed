import React, { useEffect, useRef, RouteObject } from 'react';
import { deriveElementTag } from './utils';
import { useRoutesContext } from '@/store/RoutesContext';
import { useLocation } from 'react-router-dom';

type ExtendedRouteObject = RouteObject & {
  data?: {
    pbcElementTag?: string;
    pbcElement?: any;
  };
  path: string;
}

const PBCContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const routes = useRoutesContext() as ExtendedRouteObject[];
  const location = useLocation();

  useEffect(() => {
    const loadElement = async () => {
      const route = routes.find(({ path }) => path === location.pathname);
      const { data } = route || {};
      const { pbcElement, pbcElementTag } = data || {};

      if (!pbcElement) {
        return;
      }
      const element = pbcElement.define ? pbcElement : await pbcElement();
      const tagName = pbcElementTag || deriveElementTag(element.name);
      const customElement = document.createElement(tagName);

      if (containerRef.current) {
        containerRef.current.replaceChildren();
        containerRef.current.appendChild(customElement);
      }
    };

    loadElement();
  }, [location.pathname, routes]);

  return <div ref={containerRef} className="container" style={{ width: '100%', height: '100%' }}></div>;
};

export default PBCContainer;