{{#if FDC3.includeDependencies}}
import { DefaultFDC3 } from '@genesislcap/foundation-fdc3';
{{/if}}
export const isFDC3 = (): boolean => !!((window as unknown as { fdc3?: boolean }).fdc3);
{{#if FDC3.includeDependencies}}

export const onFDC3Ready = async (FDC3ReadyCb: () => any): Promise<void> => {
  isFDC3()
    ? await FDC3ReadyCb()
    : window.addEventListener('fdc3Ready', async () => {
      await FDC3ReadyCb();
    });
};

export const listenToChannel = async (
  channelName: string,
  type: string,
  callback: (result: any) => void,
): Promise<void> => {
  const fdc3Service = new DefaultFDC3();
  fdc3Service.addChannelListener(channelName, type, callback);
};

export const sendEventOnChannel = (channelName: string, type: string) => {
  return async (e: any) => {
    const fdc3Service = new DefaultFDC3();
    // check for ag-grid-specific events, fall back to standard events
    const payload = e.data || e.detail;
    await fdc3Service.broadcastOnChannel(channelName, type, payload);
  };
};
{{/if}}