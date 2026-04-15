import React, { DOMAttributes } from 'react';

type CustomElement<T = React.HTMLAttributes<HTMLElement>> = Partial<T & DOMAttributes<T> & { [key: string]: any }>;

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      'rapid-design-system-provider': CustomElement;
      'client-app-login': CustomElement;
      'rapid-modal': CustomElement;
      'rapid-layout': CustomElement;
      'rapid-layout-region': CustomElement;
      'rapid-layout-item': CustomElement;
      'foundation-header': CustomElement;
    }
  }
}
