import { Connect } from '@genesislcap/foundation-comms';
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
  rowData: any,
): Record<string, any> =>
  Object.entries(defaultValues).reduce((acc, [key, value]) => ({
    ...acc,
    [key]:
      (typeof value === 'object' && value !== null && 'type' in value && value.type === 'record')
        ? rowData[(value as RecordTypeValue).mapping || key]
        : value,
  }), {});


export const executeCustomEvent = async (
  connect: Connect,
  customEvent: CustomEvent,
  rowData: any,
): Promise<void> => {
  const payload = customEvent.defaultValues
    ? mapDefaultValues(customEvent.defaultValues, rowData)
    : {};

  await connect.commitEvent(`EVENT_${customEvent.baseEvent}`, {
    DETAILS: payload,
  });
};

export const showCustomEventConfirmation = (
  customEvent: CustomEvent,
  onConfirm: () => Promise<void>,
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

export const handleFormCustomEvent = (
  customEvent: CustomEvent,
  rowData: any,
  setFormData: (data: Record<string, any>) => void,
  setActiveEvent: (event: CustomEventState) => void,
  showModal: () => void,
): void => {
  const defaultValues = customEvent.defaultValues || {};
  const formData = mapDefaultValues(defaultValues, rowData);

  setFormData(formData);
  setActiveEvent({ name: customEvent.name, event: customEvent.baseEvent, rowData });
  showModal();
};

export const handleNonFormCustomEvent = async (
  connect: Connect,
  customEvent: CustomEvent,
  rowData: any,
  showConfirmation: (onConfirm: () => Promise<void>) => void,
): Promise<void> => {
  if (customEvent.confirmSubmit?.state === 'enabled') {
    showConfirmation(() => executeCustomEvent(connect, customEvent, rowData));
  } else {
    await executeCustomEvent(connect, customEvent, rowData);
  }
};
