import { Injectable } from '@angular/core';
import { Auth } from '@genesislcap/foundation-comms';
import {DI} from "@microsoft/fast-foundation";

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  async isUserAuthenticated(): Promise<boolean> {
    const auth: Auth = DI.getOrCreateDOMContainer().get(Auth);
    return auth.isLoggedIn
  }
}
