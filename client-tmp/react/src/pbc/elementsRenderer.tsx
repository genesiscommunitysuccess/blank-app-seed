import { useEffect, useRef } from 'react';
import { AppElementPredicate, AppTargetId } from '@genesislcap/foundation-shell/app';
import { customEventFactory, getTargetElements } from './utils';
import { useStore } from '@/hooks/useStore'; // Import the custom hook

interface PBCElementsRendererProps {
  target: AppTargetId;
  predicate?: AppElementPredicate;
}

interface PBCContainerElement extends HTMLDivElement {
  $emit: (type: string, detail: any) => void;
}

const updateAttributes = (container: HTMLElement | null, store: any, target) => {
  if (!container) return;
  const notifyStore = store?.storeFragments?.find(({ name }) => name === 'NotifyStore');

  Array.from(container.children).forEach(child => {
    if (child.getAttribute('data-pbc-asset-id') === 'inbox-flyout') {
      if (notifyStore.inboxDisplayState) {
        child.removeAttribute('closed')
      } else {
        child.setAttribute('closed', 'true')
      }
    }
    target.appendChild(child);
  });
};

const PBCElementsRenderer = ({ target = [], predicate = () => true }: PBCElementsRendererProps) => {
  const containerRef = useRef<PBCContainerElement>(null);
  const { state: store } = useStore();

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.$emit = (type, detail) => {
        containerRef.current.dispatchEvent(customEventFactory(type, detail));
      }
    }
  }, []);

  useEffect(() => {
    const templates = getTargetElements(target, predicate);
    const temporaryContainer = document.createElement('div');
    templates.forEach((currentTemplate) => {
      if (containerRef.current) {
        currentTemplate.render(containerRef.current, temporaryContainer);
      }
    });

    // @todo - We could fix boolean props for react by changing pbc template ('elements')
    // at the moment we are just overwriting the attributes
    updateAttributes(temporaryContainer, store, containerRef.current);

    return () => {
      if (containerRef.current) {
        containerRef.current.replaceChildren();
      }
      if (temporaryContainer) {
        temporaryContainer.remove();
      }
    }
  }, [target]);

  return (<div ref={containerRef} className="container"></div>);
};

export default PBCElementsRenderer;