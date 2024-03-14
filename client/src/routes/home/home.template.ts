import { html } from '@microsoft/fast-element';
import { WrappedForms } from '../components/wrapped-forms/wrapped-forms';
import type { Home } from './home';

WrappedForms;

export const HomeTemplate = html<Home>`
  <zero-layout>
    <zero-layout-region>
      <zero-layout-item title="Entity manager tile">
        <entity-management
          resourceName="ALL_COUNTERPARTYS"
          title="Counterparty Management"
          updateEvent="EVENT_COUNTERPARTY_MODIFY"
          deleteEvent="EVENT_COUNTERPARTY_DELETE"
          createEvent="EVENT_COUNTERPARTY_CREATE"
        ></entity-management>
      </zero-layout-item>
      <zero-layout-item title="two">
        <wrapped-forms></wrapped-forms>
      </zero-layout-item>
    </zero-layout-region>
  </zero-layout>
`;
