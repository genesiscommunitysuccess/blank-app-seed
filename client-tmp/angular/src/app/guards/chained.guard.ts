import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { getUser } from '@genesislcap/foundation-user';
import { AuthGuard } from './auth.guard';
import { ConnectionGuard } from './connection.guard';
import { PermissionsGuard } from './permissions.guard';

@Injectable({
    providedIn: 'root',
})
export class ChainedGuard implements CanActivate {
    protected user = getUser();

    constructor(
        protected router: Router,
        protected connectionGuard: ConnectionGuard,
        protected authGuard: AuthGuard,
        protected permissionsGuard: PermissionsGuard
    ) {}

    async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        let result = await this.connectionGuard.canActivate();
        if (!result) {
            return false;
        }
        result = await this.authGuard.canActivate();
        if (!result) {
            return false;
        }
        result = await this.permissionsGuard.canActivate(route);
        return result;
    }
}
