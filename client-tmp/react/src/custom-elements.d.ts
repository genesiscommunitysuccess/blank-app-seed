import React, { useState, DOMAttributes }  from 'react';

type CustomElement<T = React.HTMLAttributes<HTMLElement>> = Partial<T & DOMAttributes<T> & { [key: string]: any }>;

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      'rapid-design-system-provider': CustomElement;
      'entity-management': CustomElement;
      'foundation-form': CustomElement;
      'rapid-grid-pro': CustomElement;
      'grid-pro-genesis-datasource': CustomElement;
      'grid-pro-column': CustomElement;
      'rapid-g2plot-chart': CustomElement;
      'chart-datasource': CustomElement;
      'client-app-login': CustomElement;
      'rapid-layout': CustomElement;
      'rapid-layout-region': CustomElement;
      'rapid-layout-item': CustomElement;
      'foundation-header': CustomElement;
    }
  }
}
