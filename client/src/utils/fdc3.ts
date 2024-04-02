import { getOrCreateChannel, raiseIntent, addIntentListener } from '@finos/fdc3';

export const isFdc3 = (): boolean => !!(window as any).fdc3;

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
