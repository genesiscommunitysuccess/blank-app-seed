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

export const sendMessageOnChannel = async (
  channelName: string,
  type: string,
  payload: any,
): Promise<void> => {
  fdc3Service.broadcastOnChannel(channelName, type, payload);
};

export const stripOutBigInt = (object: any): any => {

  object = { ...object };

  Object.keys(object).forEach(key => {
    if (typeof object[key] === 'bigint') {
      delete object[key]
    } else if (typeof object[key] === 'object') {
      object[key] = stripOutBigInt(object[key]);
    }
  })

  return object;
}
{{/if}}
