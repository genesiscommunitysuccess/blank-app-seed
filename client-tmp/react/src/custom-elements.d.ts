
import * as React from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'rapid-grid-pro': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'grid-pro-genesis-datasource': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
declare module 'react/jsx-runtime' {
  export * from 'react/jsx-runtime';
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
