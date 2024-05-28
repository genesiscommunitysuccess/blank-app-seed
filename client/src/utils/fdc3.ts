{{#if FDC3.includeDependencies}}
import { DefaultFDC3 } from '@genesislcap/foundation-fdc3';
{{/if}}
export const isFDC3 = (): boolean => !!(window as any).fdc3;
{{#if FDC3.includeDependencies}}
const fdc3Service = new DefaultFDC3();
export const onFDC3Ready = async (FDC3ReadyCb: () => any): Promise<void> => {
  isFDC3()
    ? await FDC3ReadyCb()
    : window.addEventListener('fdc3Ready', async () => {
        await FDC3ReadyCb();
      });
};

export const sendEventOnChannel = (channelName: string, type: string) => {
  return async (e: any) => {
    // check for ag-grid-specific events, fall back to standard events
    const payload = e.data || e.detail;
    fdc3Service.broadcastOnChannel(channelName, type, payload);
  };
};
{{/if}}
