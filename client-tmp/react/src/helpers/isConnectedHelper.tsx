import { getConnect } from '@genesislcap/foundation-comms';

const isConnectedHelper = (): Promise<boolean> => {
  const connect = getConnect();
  const hostUrl = sessionStorage.getItem('hostUrl');

  if (connect.isConnected) {
    return Promise.resolve(true);
  }
  if (!hostUrl) {
    return Promise.resolve(false);
  }
  return connect.connect(hostUrl);
};

export default isConnectedHelper;
