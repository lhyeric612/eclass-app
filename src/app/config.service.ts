import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

    private basicUrl = 'http://localhost:3000/';
    private loginUrl = this.basicUrl + 'users/login';

    constructor() { }

    getLoginUrl() {
        return this.loginUrl;
    }
}
