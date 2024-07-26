declare module "*.svg" {
  const content: any;
  export default content;
}

/**
 * Temp to unblock testing until we update the types pointer in all PBC packages
 */
declare module '@genesislcap/pbc-auth-ui';
declare module '@genesislcap/pbc-documents-ui';
declare module '@genesislcap/pbc-reconciliation-ui';
