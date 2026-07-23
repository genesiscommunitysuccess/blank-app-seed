import { createComponentRegistry } from '@genesislcap/foundation-react-utils/router';
{{#each routes}}
import {{pascalCase this.name}} from '../../pages/{{pascalCase this.name}}/{{pascalCase this.name}}';
{{/each}}

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
