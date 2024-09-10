import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { deriveElementTag } from './utils';

interface RouteParams {
  pbcElement?: any;
  pbcElementTag?: string;
}

const PBCContainer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { pbcElement, pbcElementTag } = useParams<RouteParams>();

  useEffect(() => {
    const loadElement = async () => {
      if (!pbcElement) {
        return;
      }
      const element = pbcElement.define ? pbcElement : await pbcElement();
      const tagName = pbcElementTag || deriveElementTag(element.name);
      const customElement = document.createElement(tagName);
      containerRef.current?.appendChild(customElement);
    };

    loadElement();
  }, [pbcElement, pbcElementTag]);

  return <div ref={containerRef} className="container" style=\{{ width: '100%', height: '100%' }}></div>;
};

export default PBCContainer;