import { DI } from '@microsoft/fast-foundation';
import { Connect } from '@genesislcap/foundation-comms';
import { API_DATA } from '../config';

class ConnectService {
  private container = DI.getOrCreateDOMContainer();
  private connect: Connect = this.container.get(Connect);

  getContainer() {
    return this.container;
  }

  getConnect() {
    return this.connect;
  }

  isConnected() {
    return this.connect.isConnected;
  }

  init() {
    return this.connect.connect(API_DATA.URL);
  }
}

export const connectService = new ConnectService();
