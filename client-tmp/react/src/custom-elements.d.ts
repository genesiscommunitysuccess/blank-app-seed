declare namespace JSX {
  interface IntrinsicElements {
    // Wildcard for all webcomponents:
    [elemName: string]: unknown;
  }
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
