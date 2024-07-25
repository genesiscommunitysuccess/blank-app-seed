import { Injectable } from '@angular/core';
import { Auth } from '@genesislcap/foundation-comms';
import { DI } from "@genesislcap/web-core";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth: Auth;

  constructor() {
    this.auth = DI.getOrCreateDOMContainer().get(Auth);
  }

  isUserAuthenticated(): boolean {
    return this.auth.isLoggedIn;
  }

  hasUserPermission(permissionCode: string): boolean {
    return this.auth.currentUser.hasPermission(permissionCode);
  }
}
