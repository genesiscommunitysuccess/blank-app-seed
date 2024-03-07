import { LAYOUT_POPOUT_CONTAINER_CLASS } from '@genesislcap/foundation-layout';
import { html, ref } from '@microsoft/fast-element';
import type { ViewTemplate } from '@microsoft/fast-element';
import type { MainApplication } from './main';

export const DynamicTemplate: ViewTemplate<MainApplication> = html`
  <template>
    <zero-design-system-provider ${ref('provider')} class="${LAYOUT_POPOUT_CONTAINER_CLASS}">
      <div class="dynamic-template">${(x) => x.selectTemplate()}</div>
    </zero-design-system-provider>
  </template>
`;

export const LoadingTemplate: ViewTemplate<MainApplication> = html`
  <zero-progress-ring></zero-progress-ring>
`;

export const MainTemplate: ViewTemplate<MainApplication> = html`
  <foundation-router
    @luminance-icon-clicked=${(x) => x.onDarkModeToggle()}
    :config=${(x) => x.config}
    :store=${(x) => x.store}
  ></foundation-router>
`;
