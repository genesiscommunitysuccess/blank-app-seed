import { customElement } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './wrapped-forms.styles';
import { template } from './wrapped-forms.template';

@customElement({
  name: 'wrapped-forms',
  template,
  styles,
})
export class WrappedForms extends FoundationElement {
  uiSchema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/COUNTERPARTY_ID' },
      { type: 'Control', scope: '#/properties/ENTERED_BY' },
      { type: 'Control', scope: '#/properties/INSTRUMENT_ID' },
      { type: 'Control', scope: '#/properties/PRICE' },
      { type: 'Control', scope: '#/properties/QUANTITY' },
      { type: 'Control', scope: '#/properties/SIDE' },
      { type: 'Control', scope: '#/properties/TRADE_DATETIME' },
      { type: 'Control', scope: '#/properties/TRADE_STATUS' },
    ],
  };
}
