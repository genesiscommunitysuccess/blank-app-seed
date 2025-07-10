import { getConnect } from '@genesislcap/foundation-comms';
import { UiSchema } from '@genesislcap/foundation-forms';
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
  customEventHandler: CustomEventHandler,
  rowData: any
): Promise<void> => {
  const payload = customEventHandler.defaultValues
    ? mapDefaultValues(customEventHandler.defaultValues, rowData)
    : {};

  const res = await getConnect().commitEvent(
    `EVENT_${customEventHandler.baseEvent}`,
    { DETAILS: payload }
  );

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

export const useCustomEvent =
  (
    customEvent: CustomEventHandler,
    rowData: any,
    setFormData: (data: Record<string, any>) => void,
    setActiveEvent: (event: CustomEventState | null) => void,
    setResourceName?: (name: string) => void,
    setUiSchema?: (schema: UiSchema) => void,
    customEventFormSchemas?: Record<string, UiSchema>
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
      
      if (setResourceName) {
        setResourceName(`EVENT_${customEvent.baseEvent}`);
      }
      
      if (setUiSchema && customEventFormSchemas) {
        const uiSchema = customEventFormSchemas[customEvent.name];
        setUiSchema(uiSchema || null);
      }
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
