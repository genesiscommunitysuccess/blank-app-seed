import { getOrCreateChannel, raiseIntent, addIntentListener } from '@finos/fdc3';

export const isFdc3 = (): boolean => !!(window as any).fdc3;

export const onFdc3Ready = async (fdc3ReadyCb: () => any): Promise<void> => {
  isFdc3() ? await fdc3ReadyCb() : window.addEventListener('fdc3Ready', async () => await fdc3ReadyCb());
}

export const sendMessageOnChannel = async (channelName: string, type: string, payload: any): Promise<void> => {
  const channel = await getOrCreateChannel(channelName);

  const m: any = {
    type,
    id: payload
  };

  await channel.broadcast(m);
}

export const listenToChannel = async(channelName: string, type: string, callback: (result: any) => void): Promise<void> => {
  const channel = await getOrCreateChannel(channelName);
  channel.addContextListener(type, result => callback(result));
}

export const doRaiseIntent = async (intent: string, type: string, context: any): Promise<void> => {
  const message = {
    type,
    id: context
  };

  const result = await raiseIntent(intent, message);
}

export const listenForIntent = async (intent: string, callback: (result: any) => void): Promise<void> => {
  addIntentListener(intent, result => callback(result))
}

export const sendEventOnChannel = (channelName: string, type: string) => {
  return async (e: any) => {
    // check for ag-grid-specific events, fall back to standard events
    const payload = e.data?.payload || e.detail;
    sendMessageOnChannel(channelName, type, payload);
  }
}
