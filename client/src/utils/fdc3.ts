{{#if FDC3.includeDependencies}}
import { getOrCreateChannel, raiseIntent, addIntentListener } from '@finos/fdc3';
{{/if}}

export const isFDC3 = (): boolean => !!(window as any).fdc3;

{{#if FDC3.includeDependencies}}
export const onFDC3Ready = async (FDC3ReadyCb: () => any): Promise<void> => {
  isFDC3()
    ? await FDC3ReadyCb()
    : window.addEventListener('fdc3Ready', async () => {
        await FDC3ReadyCb();
      });
};

export const sendMessageOnChannel = async (
  channelName: string,
  type: string,
  payload: any,
): Promise<void> => {
  const channel = await getOrCreateChannel(channelName);

  const m: any = {
    type,
    id: payload,
  };

  await channel.broadcast(m);
};

export const listenToChannel = async (
  channelName: string,
  type: string,
  callback: (result: any) => void,
): Promise<void> => {
  const channel = await getOrCreateChannel(channelName);
  channel.addContextListener(type, (result) => callback(result));
};

export const doRaiseIntent = async (intent: string, type: string, context: any): Promise<void> => {
  const message = {
    type,
    id: context,
  };

  const result = await raiseIntent(intent, message);
};

export const listenForIntent = async (
  intent: string,
  callback: (result: any) => void,
): Promise<void> => {
  addIntentListener(intent, (result) => callback(result));
};

export const sendEventOnChannel = (channelName: string, type: string) => {
  return async (e: any) => {
    // check for ag-grid-specific events, fall back to standard events
    const payload = e.data?.payload || e.detail;
    sendMessageOnChannel(channelName, type, payload);
  };
};
{{/if}}
