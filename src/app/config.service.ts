import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

    private basicUrl = 'http://localhost:3000/';

    constructor() { }

    // Users API
    getUserUrl() {
        return this.basicUrl + 'users';
    }

    getLoginUrl() {
        return this.basicUrl + 'users/login';
    }

    getUserMeUrl() {
        return this.basicUrl + 'users/me';
    }

    getUserRoleUrl(userId) {
        return this.basicUrl + 'users/' + userId + '/role';
    }

    getUserByIdUrl(userId) {
        return this.basicUrl + 'users/' + userId;
    }

    // Roles API
    getRoleUrl() {
        return this.basicUrl + 'roles';
    }

}
