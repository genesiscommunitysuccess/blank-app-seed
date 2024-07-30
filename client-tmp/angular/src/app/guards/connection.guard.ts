import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { getConnect } from '@genesislcap/foundation-comms';

@Injectable({
    providedIn: 'root'
})
export class ConnectionGuard implements CanActivate {
    protected connect = getConnect();

    async canActivate(): Promise<boolean> {
        if (this.connect.isConnected) {
            return true;
        }
        const hostUrl = sessionStorage.getItem('hostUrl');
        if (!hostUrl) {
            return false;
        }
        return this.connect.connect(hostUrl);
    }
}
