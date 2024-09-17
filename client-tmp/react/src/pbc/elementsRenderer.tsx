import { useEffect, useRef } from 'react';
import { AppElementPredicate, AppTargetId } from '@genesislcap/foundation-shell/app';
import { getTargetElements } from './utils';
import { useStore } from '@/hooks/useStore'; // Import the custom hook

interface PBCElementsRendererProps {
  target: AppTargetId;
  predicate?: AppElementPredicate;
}

interface PBCContainerElement extends HTMLDivElement {
  $emit: (type: string, detail: any) => void;
}

const PBCElementsRenderer = ({ target = [], predicate = () => true }: PBCElementsRendererProps) => {
  const containerRef = useRef<PBCContainerElement>(null);
  const store = useStore();

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.replaceChildren();
    }

    const templates = getTargetElements(target, predicate);
    templates.forEach((currentTemplate) => {
      if (containerRef.current) {
        currentTemplate.render(containerRef.current, containerRef.current);
      }
    });
  }, [containerRef, store, predicate, target]);

  return (<div ref={containerRef} className="container"></div>);
};

export default PBCElementsRenderer;