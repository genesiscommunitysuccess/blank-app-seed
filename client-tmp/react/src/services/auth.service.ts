import { Auth } from '@genesislcap/foundation-comms';
import { DI } from '@microsoft/fast-foundation';

class AuthService {
  isAuthenticated = false;

  async isUserAuthenticated(): Promise<boolean> {
    const auth: Auth = DI.getOrCreateDOMContainer().get(Auth);
    return auth.isLoggedIn;
  }
}

export const authService = new AuthService();
