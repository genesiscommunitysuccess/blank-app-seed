import { createComponentRegistry } from '@genesislcap/foundation-react-utils/router';
{{#if routes.[0]}}
/* eslint-disable import-es/order -- generated route pages follow route-table order, not alphabetical */
{{#each routes}}
import {{pascalCase this.name}} from '../../pages/{{pascalCase this.name}}/{{pascalCase this.name}}';
{{/each}}
/* eslint-enable import-es/order */
{{/if}}

/**
 * Registry of components that can be rendered standalone via the
 * `?component=<name>` URL parameter. Generated from the app's routes; add or
 * remove entries here to control what is exposed. Lookup is case- and
 * separator-insensitive (see `createComponentRegistry`).
 */
export const registry = createComponentRegistry({
{{#each routes}}
  {{pascalCase this.name}},
{{/each}}
});
