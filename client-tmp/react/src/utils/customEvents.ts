import { getConnect } from '@genesislcap/foundation-comms';
import { showNotificationDialog } from '@genesislcap/foundation-notifications';

interface ConfirmSubmit {
  state: 'enabled' | 'disabled';
  message: string;
}

export interface CustomEvent {
  baseEvent: string;
  name: string;
  hasForm: boolean;
  confirmSubmit?: ConfirmSubmit;
  defaultValues?: Record<string, any>;
}

export interface CustomEventState {
  name: string;
  event: string;
  rowData: any;
}

interface RecordTypeValue {
  type: 'record';
  mapping?: string;
}

type DefaultValue = string | number | boolean | null | RecordTypeValue;

interface DefaultValues {
  [key: string]: DefaultValue;
}

export const mapDefaultValues = (
  defaultValues: DefaultValues,
  rowData: any
): Record<string, any> =>
  Object.entries(defaultValues).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]:
        typeof value === 'object' &&
        value !== null &&
        'type' in value &&
        value.type === 'record'
          ? rowData[(value as RecordTypeValue).mapping || key]
          : value,
    }),
    {}
  );

export const executeCustomEvent = async (
  customEvent: CustomEvent,
  rowData: any
): Promise<void> => {
  const payload = customEvent.defaultValues
    ? mapDefaultValues(customEvent.defaultValues, rowData)
    : {};

  await getConnect().commitEvent(`EVENT_${customEvent.baseEvent}`, {
    DETAILS: payload,
  });
};

export const showCustomEventConfirmation = (
  customEvent: CustomEvent,
  onConfirm: () => Promise<void>
): void => {
  showNotificationDialog(
    {
      title: customEvent.name,
      body: customEvent.confirmSubmit!.message,
      dialog: {
        confirmingActions: [
          {
            label: 'Confirm',
            action: onConfirm,
          },
        ],
        dismissingAction: {
          label: 'Cancel',
          action: () => {},
        },
      },
    },
    'rapid',
  );
};

export const useCustomEvent =
  (
    customEvent: CustomEvent,
    rowData: any,
    setFormData: (data: Record<string, any>) => void,
    setActiveEvent: (event: CustomEventState | null) => void
  ) =>
  async () => {
    if (customEvent.hasForm) {
      const defaultValues = customEvent.defaultValues || {};
      const formData = mapDefaultValues(defaultValues, rowData);
      setFormData(formData);
      setActiveEvent({
        name: customEvent.name,
        event: customEvent.baseEvent,
        rowData,
      });
    } else {
      if (customEvent.confirmSubmit?.state === 'enabled') {
        showCustomEventConfirmation(customEvent, () =>
          executeCustomEvent(customEvent, rowData)
        );
      } else {
        await executeCustomEvent(customEvent, rowData);
      }
    }
  };
