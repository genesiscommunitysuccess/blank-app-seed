import { Connect } from '@genesislcap/foundation-comms';
import { showNotification, showNotificationDialog } from '@genesislcap/foundation-notifications';

interface ConfirmSubmit {
  state: 'enabled' | 'disabled';
  message: string;
}

interface CustomEventError {
  errors: {
    message?: string;
    CODE: string;
    TEXT: string;
  }[];
}

export interface CustomEventHandler {
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

export const mapDefaultValues = (defaultValues: DefaultValues, rowData: any): Record<string, any> =>
  Object.entries(defaultValues).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]:
        typeof value === 'object' && value !== null && 'type' in value && value.type === 'record'
          ? rowData[(value as RecordTypeValue).mapping || key]
          : value,
    }),
    {},
  );

export const executeCustomEvent = async (
  connect: Connect,
  customEvent: CustomEventHandler,
  rowData: any,
): Promise<void> => {
  const payload = customEvent.defaultValues
    ? mapDefaultValues(customEvent.defaultValues, rowData)
    : {};

  const res = await connect.commitEvent(`EVENT_${customEvent.baseEvent}`, {
    DETAILS: payload,
  });

  if (res.MESSAGE_TYPE === 'EVENT_NACK') {
    const err: CustomEventError = {
      errors:
        res?.ERROR?.map((e) => ({
          TEXT: e.TEXT,
          CODE: e.STATUS_CODE ?? '0 Unknown Error',
          message:
            'PATH' in e && typeof e.PATH === 'string' && 'FIELD' in e && typeof e.FIELD === 'string'
              ? e.TEXT.replace(e.PATH, e.FIELD)
              : undefined,
        })) ?? [],
    };
    submitFailureNotification(new CustomEvent('Error', { detail: err }));
  }
};

export const showCustomEventConfirmation = (
  customEvent: CustomEventHandler,
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

export const submitFailureNotification = (e: CustomEvent<CustomEventError>) => {
  e.detail.errors.forEach((submitFailureError) => {
    if (submitFailureError.CODE === 'OPTIMISTIC_CONCURRENCY_ERROR') {
      showNotification(
        {
          title: 'Warning',
          body: "You're editing an old revision. Please close the form and try editing again",
          config: {
            snackbar: {
              type: 'error',
            },
          },
        },
        'rapid',
      );
    } else {
      showNotification(
        {
          title: 'Error submitting form',
          body:
            submitFailureError.message ??
            (submitFailureError.CODE + ': ' + submitFailureError.TEXT).toString(),
          config: {
            snackbar: {
              type: 'error',
            },
          },
        },
        'rapid',
      );
    }
  });
};

export const handleFormCustomEvent = (
  customEvent: CustomEventHandler,
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
  customEvent: CustomEventHandler,
  rowData: any,
  showConfirmation: (onConfirm: () => Promise<void>) => void,
): Promise<void> => {
  if (customEvent.confirmSubmit?.state === 'enabled') {
    showConfirmation(() => executeCustomEvent(connect, customEvent, rowData));
  } else {
    await executeCustomEvent(connect, customEvent, rowData);
  }
};
