import { Auth } from '@genesislcap/foundation-comms';
import { DI } from '@genesislcap/web-core';

class AuthService {
  isAuthenticated = false;

  async isUserAuthenticated(): Promise<boolean> {
    const auth: Auth = DI.getOrCreateDOMContainer().get(Auth);
    return auth.isLoggedIn;
  }
}

export const authService = new AuthService();
