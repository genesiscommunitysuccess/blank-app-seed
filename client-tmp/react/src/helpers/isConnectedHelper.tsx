import { getConnect } from '@genesislcap/foundation-comms';

const isConnectedHelper = (): Promise<boolean> => {
  const connect = getConnect();
  const hostUrl = sessionStorage.getItem('hostUrl');

  if (connect.isConnected) {
    return new Promise((resolve) => resolve(true));
  }
  if (!hostUrl) {
    return new Promise((resolve) => resolve(false));
  }
  return connect.connect(hostUrl);
};

export default isConnectedHelper;