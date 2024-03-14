import { html } from '@microsoft/fast-element';
import { WrappedForms } from './wrapped-forms';

export const template = html<WrappedForms>`
  <foundation-form
    :uischema="${(x) => x.uiSchema}"
    resourceName="EVENT_TRADE_INSERT"
  ></foundation-form>
`;
