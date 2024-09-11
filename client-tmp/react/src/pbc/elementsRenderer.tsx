import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  // const [templates, setTemplates] = useState<ViewTemplate[]>([]);
  // const logger = createLogger('pbc-elements-renderer');

  // // Memoize getTargetElements to avoid recalculating on each render
  // const fetchTemplates = useCallback(() => {
  //   return getTargetElements(target, predicate);
  // }, [target, predicate]);

  // // Effect to update templates when target or predicate changes
  // useEffect(() => {
  //   const fetchedTemplates = fetchTemplates();
  //   setTemplates(fetchedTemplates);
  // }, [fetchTemplates]);

  // // Render templates when templates state changes
  // useEffect(() => {
  //   if (containerRef.current && templates.length > 0) {
  //     containerRef.current.replaceChildren();
  //     templates.forEach((template) => template.render(null, containerRef.current!));
  //   }
  // }, [templates]);

  // // Custom event emitter
  // const $emit = (type: string, detail?: any) => {
  //   containerRef.current?.dispatchEvent(customEventFactory(type, detail));
  // };

  return <div ref={containerRef} className="container"></div>;
};

export default PBCElementsRenderer;