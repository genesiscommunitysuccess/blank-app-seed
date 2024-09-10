import React, { useEffect, useRef, useState } from 'react';
import { AppElementPredicate, AppTargetId } from '@genesislcap/foundation-shell/app';
import { createLogger } from '@genesislcap/foundation-logger';
import type { ViewTemplate } from '@genesislcap/web-core';
import { customEventFactory, getTargetElements } from './utils';

interface PBCElementsRendererProps {
  target: AppTargetId;
  predicate?: AppElementPredicate;
}

const PBCElementsRenderer: React.FC<PBCElementsRendererProps> = ({ target, predicate = () => true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [templates, setTemplates] = useState<ViewTemplate[]>([]);
  const logger = createLogger('pbc-elements-renderer');

  useEffect(() => {
    setTemplates(getTargetElements(target, predicate));
    renderTemplates();
  }, [target, predicate]);

  //@todo emit should be a part of containerRef.current (?)
  const $emit = (type: string, detail?: any) => {
    containerRef.current?.dispatchEvent(customEventFactory(type, detail));
  };

  const renderTemplates = () => {
    if (containerRef.current) {
      containerRef.current.replaceChildren();
      templates.forEach((template) => template.render(this, containerRef.current));
    }
  };

  return <div ref={containerRef} className="container"></div>;
};

export default PBCElementsRenderer;