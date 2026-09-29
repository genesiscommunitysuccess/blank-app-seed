import { Connect } from '@genesislcap/foundation-comms';
import { AppElementPredicate, AppTargetId } from '@genesislcap/foundation-shell/app';
import { DI } from '@genesislcap/web-core';
import { useEffect, useRef, useState } from 'react';
import { customEventFactory, getTargetElements } from './utils';

const ALWAYS_TRUE_PREDICATE: AppElementPredicate = () => true;

interface PBCElementsRendererProps {
  target: AppTargetId;
  predicate?: AppElementPredicate;
}

interface PBCContainerElement extends HTMLDivElement {
  $emit: (type: string, detail: any) => void;
}

const PBCElementsRenderer = ({
  target = [],
  predicate = ALWAYS_TRUE_PREDICATE,
}: PBCElementsRendererProps) => {
  const containerRef = useRef<PBCContainerElement>(null);
  // Read during render rather than set synchronously in the effect below; the
  // subscription still delivers every later change.
  const [isConnected, setIsConnected] = useState(
    () => DI.getOrCreateDOMContainer().get(Connect).isConnected,
  );

  useEffect(() => {
    const connect = DI.getOrCreateDOMContainer().get(Connect);
    const isConnected$ = (
      connect as {
        isConnected$?: { subscribe: (cb: (v: boolean) => void) => { unsubscribe: () => void } };
      }
    )?.isConnected$;
    const sub = isConnected$?.subscribe((connected: boolean) => setIsConnected(connected));
    return () => sub?.unsubscribe?.();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.$emit = (type, detail) => {
        containerRef.current?.dispatchEvent(customEventFactory(type, detail));
      };
    }
  }, []);

  useEffect(() => {
    if (!isConnected) return;
    if (containerRef.current) {
      containerRef.current.replaceChildren();
    }
    const templates = getTargetElements(target, predicate);
    templates.forEach((currentTemplate: any) => {
      if (containerRef.current && currentTemplate) {
        currentTemplate.render(containerRef.current, containerRef.current);
      }
    });
  }, [target, predicate, isConnected]);

  return <div ref={containerRef} className="container"></div>;
};

export default PBCElementsRenderer;
