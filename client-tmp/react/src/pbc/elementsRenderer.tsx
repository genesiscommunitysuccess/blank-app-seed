import { useEffect, useRef } from 'react';
import { AppElementPredicate, AppTargetId } from '@genesislcap/foundation-shell/app';
import { customEventFactory, getTargetElements } from './utils';

interface PBCElementsRendererProps {
  target: AppTargetId;
  predicate?: AppElementPredicate;
}

interface PBCContainerElement extends HTMLDivElement {
  $emit: (type: string, detail: any) => void;
}

const PBCElementsRenderer = ({ target = [], predicate = () => true }: PBCElementsRendererProps) => {
  const containerRef = useRef<PBCContainerElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.$emit = (type, detail) => {
        containerRef.current.dispatchEvent(customEventFactory(type, detail));
      }
    }
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.replaceChildren();
    }
    const templates = getTargetElements(target, predicate);
    templates.forEach((currentTemplate: any) => {
      if (containerRef.current) {
        currentTemplate.render(containerRef.current, containerRef.current);
      }
    });
  }, [target, predicate]);

  return (<div ref={containerRef} className="container"></div>);
};

export default PBCElementsRenderer;